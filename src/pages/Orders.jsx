import React, { useState, useEffect, useCallback } from "react";
import {
  Search, Eye, Trash2, ChevronLeft, ChevronRight,
  Truck, Store, Filter, X, Edit3, CheckCircle2,
  Package2, MapPin, AlertCircle, Check, XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAllOrdersAdmin, deleteOrder, updateOrderStatusAdmin, getCancellationRequests, approveCancellation, rejectCancellation } from "../lib/orders";
import DeleteModal from "../components/Category/DeleteModal";

// Delivery flow statuses only
const DELIVERY_STATUSES = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];
// Pickup flow statuses only
const PICKUP_STATUSES   = ["pending", "confirmed", "processing", "ready_for_pickup", "picked_up", "cancelled"];

const STATUS_LABELS = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  processing:       "Processing",
  shipped:          "Shipped",
  out_for_delivery: "Out For Delivery",
  delivered:        "Delivered",
  ready_for_pickup: "Ready For Pickup",
  picked_up:        "Picked Up",
  cancelled:        "Cancelled",
};

const STATUS_TABS = ["all", "pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "ready_for_pickup", "picked_up", "cancelled"];

const PAGE_TABS = ["orders", "cancel_requests"];

const getStatusStyles = (status) => {
  const s = status?.toLowerCase();
  const map = {
    pending:          "bg-amber-50 text-amber-700 border-amber-200",
    confirmed:        "bg-emerald-50 text-emerald-700 border-emerald-200",
    processing:       "bg-sky-50 text-sky-700 border-sky-200",
    shipped:          "bg-indigo-50 text-indigo-700 border-indigo-200",
    out_for_delivery: "bg-purple-50 text-purple-700 border-purple-200",
    delivered:        "bg-emerald-100 text-emerald-800 border-emerald-300",
    ready_for_pickup: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    picked_up:        "bg-teal-50 text-teal-700 border-teal-200",
    cancelled:        "bg-rose-50 text-rose-700 border-rose-200",
  };
  return map[s] || "bg-slate-50 text-slate-600 border-slate-200";
};

const Orders = () => {
  const [pageTab, setPageTab] = useState("orders");

  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeStatus, setActiveStatus]       = useState("all");
  const [shippingMethod, setShippingMethod]   = useState("all");
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalOrders: 0 });

  // Cancel Requests state
  const [cancelRequests, setCancelRequests]   = useState([]);
  const [crLoading, setCrLoading]             = useState(false);
  const [crPagination, setCrPagination]       = useState({ currentPage: 1, totalPages: 1, total: 0 });
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTarget, setRejectTarget]       = useState(null);
  const [rejectReason, setRejectReason]       = useState("");
  const [actionLoading, setActionLoading]     = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId]     = useState(null);
  const [deleteLoading, setDeleteLoading]         = useState(false);

  // Status drawer
  const [isDrawerOpen, setIsDrawerOpen]   = useState(false);
  const [drawerOrder, setDrawerOrder]     = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [adminNote, setAdminNote]           = useState("");
  const [updateLoading, setUpdateLoading]   = useState(false);
  // Extra fields for tracking
  const [trackingNumber, setTrackingNumber]           = useState("");
  const [courierName, setCourierName]                 = useState("");
  const [trackingUrl, setTrackingUrl]                 = useState("");
  const [estimatedDelivery, setEstimatedDelivery]     = useState("");
  const [pickedUpBy, setPickedUpBy]                   = useState("");

  const fetchCancelRequests = useCallback(async () => {
    setCrLoading(true);
    try {
      const res = await getCancellationRequests({ page: crPagination.currentPage, limit: 10 });
      if (res?.success) {
        setCancelRequests(res.orders);
        setCrPagination(p => ({ ...p, totalPages: res.totalPages, total: res.totalOrders }));
      }
    } catch { toast.error("Error fetching cancellation requests"); }
    finally { setCrLoading(false); }
  }, [crPagination.currentPage]);

  useEffect(() => { if (pageTab === "cancel_requests") fetchCancelRequests(); }, [fetchCancelRequests, pageTab]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const res = await approveCancellation(id);
      if (res.success) { toast.success(res.message); fetchCancelRequests(); }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to approve"); }
    finally { setActionLoading(false); }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return toast.error("Rejection reason is required");
    setActionLoading(rejectTarget);
    try {
      const res = await rejectCancellation(rejectTarget, rejectReason);
      if (res.success) { toast.success("Request rejected"); setRejectModalOpen(false); setRejectReason(""); fetchCancelRequests(); }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to reject"); }
    finally { setActionLoading(false); }
  };

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination(p => ({ ...p, currentPage: 1 }));
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllOrdersAdmin({
        page: pagination.currentPage,
        limit: 10,
        search: debouncedSearch,
        orderStatus: activeStatus,
        shippingMethod,
      });
      if (res?.success) {
        setOrders(res.orders);
        setPagination({ currentPage: res.currentPage, totalPages: res.totalPages, totalOrders: res.totalOrders });
      }
    } catch {
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, debouncedSearch, activeStatus, shippingMethod]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleConfirmDelete = async () => {
    if (!selectedOrderId) return;
    setDeleteLoading(true);
    try {
      const res = await deleteOrder(selectedOrderId);
      if (res.success) { toast.success("Order deleted"); fetchOrders(); }
    } catch { toast.error("Delete failed"); }
    finally { setDeleteLoading(false); setIsDeleteModalOpen(false); }
  };

  const handleOpenStatusDrawer = (order) => {
    setDrawerOrder(order);
    setSelectedStatus(order.orderStatus?.toLowerCase() || "pending");
    setAdminNote(""); setTrackingNumber(""); setCourierName("");
    setTrackingUrl(""); setEstimatedDelivery(""); setPickedUpBy("");
    setIsDrawerOpen(true);
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStatus) return toast.error("Please select a status");
    setUpdateLoading(true);
    try {
      const res = await updateOrderStatusAdmin(drawerOrder._id, selectedStatus, adminNote, {
        trackingNumber, courierName, trackingUrl,
        estimatedDeliveryDate: estimatedDelivery,
        pickedUpBy,
      });
      if (res.success) {
        toast.success(res.message || `Status updated to "${STATUS_LABELS[selectedStatus]}"`);
        setIsDrawerOpen(false);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally { setUpdateLoading(false); }
  };

  const getStatusOptions = (method) => {
    if (method === "store_pickup") return PICKUP_STATUSES;
    if (method === "delivery")     return DELIVERY_STATUSES;
    return [...new Set([...DELIVERY_STATUSES, ...PICKUP_STATUSES])];
  };

  const isShipped        = selectedStatus === "shipped";
  const isPickedUp       = selectedStatus === "picked_up";

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans relative overflow-x-hidden text-[#253D4E]">
      <DeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} loading={deleteLoading} />

      {/* ─── REJECT REASON MODAL ─── */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-[#253D4E] mb-1">Reject Cancellation</h3>
            <p className="text-sm text-slate-500 mb-4">Provide a reason that will be shown to the customer.</p>
            <textarea rows={3} placeholder="Rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-rose-400 text-sm resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectModalOpen(false); setRejectReason(""); }} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleRejectSubmit} disabled={!!actionLoading} className="flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 disabled:opacity-50">
                {actionLoading ? "Rejecting..." : "Reject Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── STATUS UPDATE DRAWER ─── */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isDrawerOpen ? "visible" : "invisible"}`}>
        <div className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <h2 className="text-xl font-bold text-[#253D4E]">Update Order Status</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{drawerOrder?.orderNumber}</span>
                {drawerOrder?.shippingMethod === "store_pickup"
                  ? <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Store size={10}/> Store Pickup</span>
                  : <span className="text-[10px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Truck size={10}/> Delivery</span>
                }
              </div>
            </div>
            <button type="button" onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 rounded-xl transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleUpdateStatusSubmit} className="flex-1 overflow-y-auto flex flex-col p-6 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 font-medium text-slate-800 capitalize"
              >
                {getStatusOptions(drawerOrder?.shippingMethod).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {isShipped && drawerOrder?.shippingMethod !== "store_pickup" && (
              <div className="bg-emerald-50/40 rounded-2xl p-4 space-y-3 border border-emerald-100">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-wider flex items-center gap-1.5"><Truck size={12}/> Courier & Tracking Info</p>
                <input type="text" placeholder="Tracking Number" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-emerald-100 rounded-xl text-sm outline-none focus:border-emerald-500" />
                <input type="text" placeholder="Courier Name (e.g. BlueDart, Delhivery)" value={courierName} onChange={e => setCourierName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-emerald-100 rounded-xl text-sm outline-none focus:border-emerald-500" />
                <input type="url" placeholder="Tracking URL (optional)" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-emerald-100 rounded-xl text-sm outline-none focus:border-emerald-500" />
                <div>
                  <label className="text-[10px] text-emerald-600 font-bold uppercase">Estimated Delivery Date</label>
                  <input type="date" value={estimatedDelivery} onChange={e => setEstimatedDelivery(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-emerald-100 rounded-xl text-sm outline-none focus:border-emerald-500 mt-1" />
                </div>
              </div>
            )}

            {isPickedUp && (
              <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                <p className="text-xs font-black text-teal-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><MapPin size={12}/> Pickup Info</p>
                <input type="text" placeholder="Picked Up By (name, optional)" value={pickedUpBy} onChange={e => setPickedUpBy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-teal-100 rounded-xl text-sm outline-none focus:border-teal-400" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Admin Note</label>
                <span className="text-[10px] text-slate-400 font-semibold uppercase bg-slate-100 px-2 py-0.5 rounded-md">Optional</span>
              </div>
              <textarea placeholder="Internal note..." rows={3} value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-primary text-sm text-slate-800 resize-none" />
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex gap-3">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all">Cancel</button>
              <button type="submit" disabled={updateLoading} className="flex-1 py-3 bg-primary text-white font-bold text-sm rounded-2xl shadow-md hover:bg-primary disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                {updateLoading ? "Saving..." : <><CheckCircle2 size={16} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#253D4E]">Orders Management</h1>
          <p className="text-slate-500">Manage your store's logistics and fulfillment</p>
        </div>
      </div>

      {/* PAGE TABS */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 w-fit mb-6 gap-1">
        <button onClick={() => setPageTab("orders")} className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${ pageTab === "orders" ? "bg-[#253D4E] text-white" : "text-slate-500 hover:bg-slate-50" }`}>
          All Orders
        </button>
        <button onClick={() => setPageTab("cancel_requests")} className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${ pageTab === "cancel_requests" ? "bg-rose-600 text-white" : "text-slate-500 hover:bg-slate-50" }`}>
          <AlertCircle size={14} /> Cancel Requests
        </button>
      </div>

      {/* ─── CANCEL REQUESTS TAB ─── */}
      {pageTab === "cancel_requests" && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Reason</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Requested At</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {crLoading ? (
                  <tr><td colSpan="6" className="py-20 text-center animate-pulse text-slate-400">Loading...</td></tr>
                ) : cancelRequests.length > 0 ? cancelRequests.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-emerald-600">{order.orderNumber}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">₹{order.totalPrice?.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{order.userId?.name || "Guest"}</p>
                      <p className="text-xs text-slate-400">{order.userId?.email || order.guestEmail || "—"}</p>
                    </td>
                    <td className="px-6 py-4 max-w-[200px]">
                      <p className="text-sm text-slate-600 ">{order.cancellationReason || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-slate-500">{order.cancellationRequestedAt ? new Date(order.cancellationRequestedAt).toLocaleDateString() : "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(order.orderStatus)}`}>
                        {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleApprove(order._id)} disabled={!!actionLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 disabled:opacity-50 transition-colors">
                          <Check size={13} /> Approve
                        </button>
                        <button onClick={() => { setRejectTarget(order._id); setRejectModalOpen(true); }} disabled={!!actionLoading}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-100 disabled:opacity-50 transition-colors">
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="py-20 text-center text-slate-400">No pending cancellation requests.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total: <span className="text-slate-900">{crPagination.total}</span></p>
            <div className="flex items-center gap-2">
              <button disabled={crPagination.currentPage === 1} onClick={() => setCrPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={18} /></button>
              <span className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-md">{crPagination.currentPage} / {crPagination.totalPages}</span>
              <button disabled={crPagination.currentPage === crPagination.totalPages} onClick={() => setCrPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>
      )}

      {pageTab === "orders" && <div className="space-y-3 mb-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Search */}
          <div className="xl:col-span-5 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search Order # or Customer..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600 transition-all" />
          </div>

          {/* Shipping Method Toggle */}
          <div className="xl:col-span-4 flex bg-white p-1 rounded-2xl border border-slate-200">
            {[
              { id: "all", label: "All Orders", icon: Filter },
              { id: "delivery", label: "Home Delivery", icon: Truck },
              { id: "store_pickup", label: "Store Pickup", icon: Store },
            ].map((m) => (
              <button key={m.id} onClick={() => { setShippingMethod(m.id); setActiveStatus("all"); setPagination(p => ({ ...p, currentPage: 1 })); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${shippingMethod === m.id ? "bg-[#253D4E] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                <m.icon size={13} /> {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-200 overflow-x-auto gap-1 scrollbar-none">
          {(shippingMethod === "store_pickup"
            ? ["all", ...PICKUP_STATUSES]
            : shippingMethod === "delivery"
              ? ["all", ...DELIVERY_STATUSES]
              : STATUS_TABS
          ).map((s) => (
            <button key={s} onClick={() => { setActiveStatus(s); setPagination(p => ({ ...p, currentPage: 1 })); }}
              className={`px-3 py-2 text-[11px] font-bold uppercase tracking-wide rounded-xl transition-all whitespace-nowrap ${activeStatus === s ? "bg-primary text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}>
              {s === "all" ? "All" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>}

      {/* TABLE */}
      {pageTab === "orders" && <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Total</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="py-20 text-center animate-pulse text-slate-400 font-medium">Loading orders...</td></tr>
              ) : orders.length > 0 ? orders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-emerald-600">{order.orderNumber}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{order.userId?.name || order.shippingAddress?.fullName || "Guest"}</p>
                    <p className="text-xs text-slate-400 lowercase">{order.userId?.email || order.guestEmail || "—"}</p>
                  </td>
                  <td className="px-6 py-4">
                    {order.shippingMethod === "delivery"
                      ? <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 w-fit"><Truck size={12} /> Delivery</span>
                      : <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100 w-fit"><Store size={12} /> Pickup</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${getStatusStyles(order.orderStatus)}`}>
                      {STATUS_LABELS[order.orderStatus] || order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-bold text-slate-900">₹{order.totalPrice?.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{order.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleOpenStatusDrawer(order)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100" title="Change Status">
                        <Edit3 size={18} />
                      </button>
                      <Link to={`/admin/orders/${order._id}`} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100">
                        <Eye size={18} />
                      </Link>
                      <button onClick={() => { setSelectedOrderId(order._id); setIsDeleteModalOpen(true); }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="py-20 text-center text-slate-400">No orders found matching the criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Total: <span className="text-slate-900">{pagination.totalOrders}</span>
          </p>
          <div className="flex items-center gap-2">
            <button disabled={pagination.currentPage === 1} onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30"><ChevronLeft size={18} /></button>
            <span className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-md">{pagination.currentPage} / {pagination.totalPages}</span>
            <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))} className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>}
    </div>
  );
};

export default Orders;