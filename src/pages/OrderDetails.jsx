import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  Package,
  User,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Store,
  Home,
  AlertCircle,
  Truck,
  Clock,
  CheckCircle2,
  QrCode,
  ExternalLink,
  Calendar,
  Hash,
  Printer,
  Download,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Box,
  Layers,
  XCircle,
} from "lucide-react";
import {
  getOrderById,
  cancelOrderAdmin,
  getShippingLabelAdmin,
  trackShipmentAdmin,
  cancelShipmentAdmin,
} from "../lib/orders";
import ShipmentModal from "../components/orders/ShipmentModal";
import ShippingLabelModal from "../components/orders/ShippingLabelModal";
import PrintReceiptModal from "../components/orders/PrintReceiptModal";

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out For Delivery",
  delivered: "Delivered",
  ready_for_pickup: "Ready For Pickup",
  picked_up: "Picked Up",
  cancelled: "Cancelled",
};

const getStatusStyles = (status) => {
  const map = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-sky-100 text-sky-700",
    shipped: "bg-indigo-100 text-indigo-700",
    out_for_delivery: "bg-purple-100 text-purple-700",
    delivered: "bg-emerald-100 text-emerald-700",
    ready_for_pickup: "bg-fuchsia-100 text-fuchsia-700",
    picked_up: "bg-teal-100 text-teal-700",
    cancelled: "bg-rose-100 text-rose-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};

const DELIVERY_STEPS = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
const PICKUP_STEPS = ["pending", "confirmed", "processing", "ready_for_pickup", "picked_up"];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Async action states
  const [labelData, setLabelData] = useState(null);
  const [labelLoading, setLabelLoading] = useState(false);
  const [trackLoading, setTrackLoading] = useState(false);
  const [cancelShipmentLoading, setCancelShipmentLoading] = useState(false);
  const [copiedAWB, setCopiedAWB] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || id.length < 24) {
        toast.error("Invalid Order ID");
        setLoading(false);
        return;
      }
      try {
        const res = await getOrderById(id);
        if (res.success) setOrder(res.data);
        else toast.error(res.message || "Order not found");
      } catch {
        toast.error("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const CANCELLABLE = new Set(["pending", "confirmed", "processing", "ready_for_pickup"]);

  const handleAdminCancel = async () => {
    setCancelLoading(true);
    try {
      const res = await cancelOrderAdmin(order._id, cancelReason);
      if (res.success) {
        toast.success(res.message || "Order cancelled & refund initiated");
        setShowCancelModal(false);
        setOrder((prev) => ({
          ...prev,
          orderStatus: "cancelled",
          paymentStatus: res.data?.paymentStatus || "refunded",
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleCopyAWB = (awb) => {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    setCopiedAWB(true);
    toast.success("AWB Number copied to clipboard!");
    setTimeout(() => setCopiedAWB(false), 2000);
  };

  const handleOpenShippingLabel = async () => {
    setLabelLoading(true);
    try {
      const res = await getShippingLabelAdmin(order._id);
      if (res.success) {
        setLabelData(res.data);
        setShowLabelModal(true);
      } else {
        toast.error(res.message || "Failed to retrieve shipping label");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not fetch label data");
    } finally {
      setLabelLoading(false);
    }
  };

  const handleDownloadLabelPdf = async () => {
    setLabelLoading(true);
    try {
      const res = await getShippingLabelAdmin(order._id);
      if (res.success && res.data?.labelUrl) {
        window.open(res.data.labelUrl, "_blank");
      } else {
        // If direct PDF link is not returned by courier, open the label preview modal for printing
        setLabelData(res.data || {});
        setShowLabelModal(true);
        toast("Opening printable label preview", { icon: "🖨️" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download label");
    } finally {
      setLabelLoading(false);
    }
  };

  const handleTrackLive = async () => {
    setTrackLoading(true);
    try {
      const res = await trackShipmentAdmin(order._id);
      if (res.success) {
        toast.success(`Live Status: ${res.data?.status || 'In Transit'} ${res.data?.location ? `(${res.data.location})` : ''}`);
        // Update local tracking details
        setOrder((prev) => ({
          ...prev,
          orderStatus: res.data?.orderStatus || prev.orderStatus,
          trackingDetails: {
            ...prev.trackingDetails,
            ...res.data?.trackingDetails,
            shipmentStatus: res.data?.status || prev.trackingDetails?.shipmentStatus,
          },
        }));
      } else {
        toast.error(res.message || "Could not sync live tracking");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to track shipment with courier");
    } finally {
      setTrackLoading(false);
    }
  };

  const handleCancelShipment = async () => {
    if (!window.confirm("Are you sure you want to cancel this courier shipment?")) return;

    setCancelShipmentLoading(true);
    try {
      const res = await cancelShipmentAdmin(order._id, "Cancelled from Admin Panel");
      if (res.success) {
        toast.success("Shipment cancelled successfully with courier.");
        setOrder((prev) => ({
          ...prev,
          trackingDetails: {
            ...prev.trackingDetails,
            shipmentStatus: "Cancelled",
          },
        }));
      } else {
        toast.error(res.message || "Failed to cancel shipment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel shipment");
    } finally {
      setCancelShipmentLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle size={48} className="text-gray-300" />
        <div className="text-center font-bold text-gray-500 text-xl">Order Not Found</div>
        <button onClick={() => navigate("/")} className="text-primary font-bold hover:underline">
          Go back to shop
        </button>
      </div>
    );

  const isGuest = order.isGuest;
  const isPickup = order.shippingMethod === "store_pickup";
  const customerEmail = isGuest ? order.guestEmail : order.userId?.email;
  const customerName = isGuest ? order.shippingAddress?.fullName : order.userId?.name;
  const customerPhone = isGuest ? order.shippingAddress?.phone : order.userId?.phone;

  const steps = isPickup ? PICKUP_STEPS : DELIVERY_STEPS;
  const isCancelled = order.orderStatus === "cancelled";
  const currentIdx = isCancelled ? -1 : steps.indexOf(order.orderStatus);

  const td = order.trackingDetails || {};
  const pd = order.pickupDetails;
  const hasShipment = !isPickup && !!(td.trackingNumber || td.courierName);

  return (
    <div className="bg-gray-50/30 min-h-screen pb-12">
      {/* Top Nav & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-black font-semibold transition-all w-fit cursor-pointer"
        >
          <ArrowLeft size={18} /> Back to Orders
        </button>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-gray-600 bg-white px-3.5 py-1.5 rounded-full border border-gray-200">
            Order #{order.orderNumber}
          </span>

          <div
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyles(
              order.orderStatus
            )}`}
          >
            {STATUS_LABELS[order.orderStatus] || order.orderStatus}
          </div>

          {isPickup ? (
            <span className="text-xs font-black bg-purple-100 text-purple-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Store size={13} /> Store Pickup
            </span>
          ) : (
            <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <Truck size={13} /> Home Delivery
            </span>
          )}

          {/* Quick Invoice Receipt Button */}
          <button
            onClick={() => setShowReceiptModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-full text-xs font-bold hover:bg-slate-50 transition-all shadow-sm cursor-pointer"
          >
            <FileText size={13} className="text-indigo-600" /> Invoice Receipt
          </button>

          {/* Create Shipment button if no shipment yet */}
          {!isPickup && !hasShipment && !isCancelled && (
            <button
              onClick={() => setShowShipmentModal(true)}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer"
            >
              <Truck size={13} /> Create Shipment
            </button>
          )}

          {/* Print Label Quick Button if shipment exists */}
          {hasShipment && (
            <button
              onClick={handleOpenShippingLabel}
              disabled={labelLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-black hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 cursor-pointer disabled:opacity-50"
            >
              {labelLoading ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
              Print Label
            </button>
          )}

          {/* Admin Cancel Button */}
          {CANCELLABLE.has(order.orderStatus) && (
            <button
              onClick={() => {
                setCancelReason("");
                setShowCancelModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-black hover:bg-rose-100 transition-all cursor-pointer"
            >
              <AlertCircle size={12} /> Cancel & Refund
            </button>
          )}
        </div>
      </div>

      {/* ─── STATUS TIMELINE ─── */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 mb-6 overflow-x-auto">
        <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Clock size={15} /> Order Progress
        </h3>
        {isCancelled ? (
          <div className="flex items-center gap-3 text-rose-600 bg-rose-50 rounded-2xl p-4 border border-rose-100">
            <AlertCircle size={20} /> <span className="font-bold">This order has been cancelled.</span>
          </div>
        ) : (
          <div className="relative flex justify-between items-start px-4 min-w-[500px]">
            {/* Progress line */}
            <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-700 rounded-full"
                style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step, i) => {
              const done = i <= currentIdx;
              const active = step === order.orderStatus;
              const history = order.statusHistory?.find((h) => h.status === step);
              return (
                <div key={step} className="flex flex-col items-center gap-2 z-10 relative">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-500 ${
                      done ? "bg-primary border-white text-white" : "bg-white border-gray-100 text-gray-300"
                    } ${active ? "ring-8 ring-primary/10 scale-110" : ""}`}
                  >
                    {done ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Clock size={16} />}
                  </div>
                  <p className={`text-[11px] font-bold text-center leading-tight ${done ? "text-primary" : "text-gray-400"}`}>
                    {STATUS_LABELS[step]}
                  </p>
                  {history && (
                    <p className="text-[9px] text-gray-400 font-semibold text-center">
                      {new Date(history.changedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Items & Shipment */}
        <div className="lg:col-span-8 space-y-6">
          {/* 🚚 SHIPMENT & LOGISTICS MANAGEMENT CARD */}
          {!isPickup && (
            <div className="bg-white border border-indigo-100/80 rounded-3xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                    <Truck className="text-indigo-400" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black tracking-tight">Shipment & Courier Management</h2>
                      {hasShipment && (
                        <span className="text-[10px] font-black uppercase bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30">
                          {td.courierName || "Delhivery"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-indigo-200 mt-0.5">
                      {hasShipment
                        ? "Shipment is registered with courier partner"
                        : "No shipment manifest created yet"}
                    </p>
                  </div>
                </div>

                {!hasShipment && !isCancelled && (
                  <button
                    onClick={() => setShowShipmentModal(true)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-950 transition-all cursor-pointer w-fit"
                  >
                    <Truck size={15} /> Create Shipment
                  </button>
                )}
              </div>

              {/* Shipment Details Body */}
              <div className="p-6 space-y-6">
                {hasShipment ? (
                  <>
                    {/* AWB & Status Top Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* AWB Box */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <Hash size={12} className="text-indigo-600" /> Waybill / AWB Number
                        </span>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-black font-mono text-slate-900 tracking-wider">
                            {td.trackingNumber}
                          </span>
                          <button
                            onClick={() => handleCopyAWB(td.trackingNumber)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                            title="Copy AWB"
                          >
                            {copiedAWB ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      {/* Shipment Status */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <Clock size={12} className="text-indigo-600" /> Courier Status
                        </span>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-black text-indigo-900 capitalize">
                            {td.shipmentStatus || "Manifested"}
                          </span>
                          <button
                            onClick={handleTrackLive}
                            disabled={trackLoading}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                            title="Sync live status with courier"
                          >
                            <RefreshCw size={15} className={trackLoading ? "animate-spin" : ""} />
                          </button>
                        </div>
                      </div>

                      {/* Mode & Location */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                          <Box size={12} className="text-indigo-600" /> Specs & Dispatch
                        </span>
                        <div className="mt-2">
                          <p className="text-xs font-bold text-slate-800">
                            {td.weight || 0.5} kg • {td.shippingMode || "Surface"}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            Warehouse: {td.pickupLocation || "CRAFTWORLD SURFACE"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Milestones / Timestamps */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/60 text-xs">
                      <div>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase block">Shipped Date</span>
                        <span className="font-bold text-slate-800">
                          {td.shippedAt ? new Date(td.shippedAt).toLocaleDateString() : "Pending"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase block">Out for Delivery</span>
                        <span className="font-bold text-slate-800">
                          {td.outForDeliveryAt ? new Date(td.outForDeliveryAt).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase block">Delivered Date</span>
                        <span className="font-bold text-emerald-700">
                          {td.deliveredAt ? new Date(td.deliveredAt).toLocaleDateString() : "In Transit"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-indigo-500 font-bold uppercase block">Est. Delivery</span>
                        <span className="font-bold text-indigo-900">
                          {td.estimatedDeliveryDate
                            ? new Date(td.estimatedDeliveryDate).toLocaleDateString()
                            : "—"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-slate-100">
                      <button
                        onClick={handleOpenShippingLabel}
                        disabled={labelLoading}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {labelLoading ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                        Print Shipping Label
                      </button>

                      <button
                        onClick={handleDownloadLabelPdf}
                        disabled={labelLoading}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Download size={14} className="text-indigo-600" />
                        Download Label PDF
                      </button>

                      <button
                        onClick={() => setShowReceiptModal(true)}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <FileText size={14} className="text-slate-600" />
                        Print Packing Slip
                      </button>

                      <button
                        onClick={handleTrackLive}
                        disabled={trackLoading}
                        className="px-4 py-2.5 bg-white border border-slate-200 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw size={14} className={trackLoading ? "animate-spin" : ""} />
                        Sync Live Status
                      </button>

                      {td.trackingUrl && (
                        <a
                          href={td.trackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                        >
                          <ExternalLink size={13} /> Courier Tracking Page
                        </a>
                      )}

                      {td.shipmentStatus !== "Cancelled" && (
                        <button
                          onClick={handleCancelShipment}
                          disabled={cancelShipmentLoading}
                          className="px-3.5 py-2.5 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all ml-auto cursor-pointer"
                        >
                          <XCircle size={14} />
                          Cancel Shipment
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  /* No Shipment State */
                  <div className="py-6 text-center space-y-3">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                      <Truck size={28} />
                    </div>
                    <h4 className="text-base font-bold text-slate-800">Ready to Dispatch this Order?</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Assign Delhivery or custom courier, generate the AWB tracking code, and print standard 4x6" shipping labels directly from this panel.
                    </p>
                    <button
                      onClick={() => setShowShipmentModal(true)}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-sm shadow-xl shadow-indigo-100 inline-flex items-center gap-2 transition-all cursor-pointer mt-2"
                    >
                      <Truck size={16} /> Create Delhivery Shipment
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pickup Details — Store Pickup only */}
          {isPickup && pd && (
            <div className="bg-white border border-fuchsia-100 rounded-3xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-fuchsia-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <QrCode size={16} /> Pickup Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pd.pickupCode && (
                  <div className="bg-fuchsia-50 rounded-2xl p-4">
                    <p className="text-[10px] text-fuchsia-500 font-black uppercase tracking-wider mb-1">
                      Pickup Code
                    </p>
                    <p className="font-black text-fuchsia-800 text-2xl tracking-widest">{pd.pickupCode}</p>
                  </div>
                )}
                {pd.pickedUpAt && (
                  <div className="bg-teal-50 rounded-2xl p-4">
                    <p className="text-[10px] text-teal-600 font-black uppercase tracking-wider mb-1">
                      Picked Up At
                    </p>
                    <p className="font-bold text-teal-800">{new Date(pd.pickedUpAt).toLocaleString()}</p>
                    {pd.pickedUpBy && <p className="text-sm text-teal-600 mt-1">By: {pd.pickedUpBy}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ordered Products Item List */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Package size={22} />
                </div>
                <h2 className="text-xl font-bold">Items Ordered</h2>
              </div>
              <span className="text-sm font-medium text-gray-400">{order.orderItems?.length || 0} Products</span>
            </div>
            <div className="divide-y divide-gray-50">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-gray-50/50 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain mix-blend-multiply bg-gray-100 rounded-2xl p-2"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{item.sku}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                      <span className="text-sm text-gray-500">
                        Qty: <span className="font-bold text-black">{item.quantity}</span>
                      </span>
                      <span className="text-sm text-gray-500">
                        Price: <span className="font-bold text-black">₹{item.priceAtPurchase?.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                  <p className="text-lg font-black text-primary">
                    ₹{(item.priceAtPurchase * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock size={14} /> Status History
              </h3>
              <div className="space-y-3">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                        h.status === "cancelled" ? "bg-rose-500" : "bg-primary"
                      }`}
                    />
                    <div className="flex-1">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getStatusStyles(
                          h.status
                        )}`}
                      >
                        {STATUS_LABELS[h.status] || h.status}
                      </span>
                      {h.note && <p className="text-gray-500 text-xs mt-0.5">{h.note}</p>}
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {new Date(h.changedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Price Summary, Shipping & Customer */}
        <div className="lg:col-span-4 space-y-5">
          {/* Price Summary Card */}
          <div className="bg-primary text-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-white/60 uppercase text-[11px] font-black tracking-widest mb-1">
                Total Amount
              </h3>
              <div className="text-4xl font-black mb-6">₹{order.totalPrice?.toFixed(2)}</div>
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Subtotal</span>
                  <span className="font-bold">₹{order.itemsPrice?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Shipping</span>
                  <span className="font-bold">
                    {order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice?.toFixed(2)}`}
                  </span>
                </div>
                {order.coupon?.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-200">
                    <span>Coupon ({order.coupon.code})</span>
                    <span className="font-bold">-₹{order.coupon.discountAmount?.toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (!isPickup || order.shippingAddress.address) && (
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <div
                  className={`p-2 rounded-lg ${
                    isPickup ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {isPickup ? <Store size={20} /> : <Home size={20} />}
                </div>
                <h3 className="font-bold text-lg">
                  {isPickup ? "Pickup Contact Address" : "Shipping Address"}
                </h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                {order.shippingAddress.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {order.shippingAddress.address},<br />
                      {order.shippingAddress.city}
                      {order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ""}
                      <br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                )}
                {isPickup && !order.shippingAddress.address && (
                  <p className="text-xs text-gray-400 italic">No address provided for this pickup order.</p>
                )}
              </div>
            </div>
          )}

          {/* Customer Info */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Customer Contact</h3>
                {isGuest && (
                  <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded w-fit mt-0.5 block">
                    Guest Order
                  </span>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail size={15} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm font-bold break-all">{customerEmail || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={15} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="text-sm font-bold">{customerPhone || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                {isPickup ? (
                  <Store size={15} className="text-primary mt-0.5" />
                ) : (
                  <Package size={15} className="text-gray-400 mt-0.5" />
                )}
                <div>
                  <p className="text-xs text-gray-400">Delivery Method</p>
                  <p className="text-sm font-bold capitalize">
                    {order.shippingMethod?.replace("_", " ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-black">Payment Method</p>
                <p className="text-sm font-bold">{order.paymentMethod}</p>
              </div>
            </div>
            <div
              className={`font-black text-xs uppercase px-3 py-1 rounded-lg border ${
                order.paymentStatus === "paid"
                  ? "bg-green-50 text-green-600 border-green-100"
                  : order.paymentStatus === "refunded"
                  ? "bg-rose-50 text-rose-600 border-rose-100"
                  : "bg-amber-50 text-amber-600 border-amber-100"
              }`}
            >
              {order.paymentStatus}
            </div>
          </div>

          {/* Refund notification if refunded */}
          {order.paymentStatus === "refunded" && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
              <p className="text-rose-700 font-bold text-sm">
                💸 Refund of ₹{order.totalPrice?.toFixed(2)} initiated
              </p>
              <p className="text-rose-500 text-xs mt-1">Payment gateway refund processed</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Modals ─── */}
      {/* 1. Shipment Modal */}
      <ShipmentModal
        isOpen={showShipmentModal}
        onClose={() => setShowShipmentModal(false)}
        order={order}
        onSuccess={(updatedData) => {
          setOrder((prev) => ({
            ...prev,
            orderStatus: updatedData.orderStatus || prev.orderStatus,
            trackingDetails: updatedData.trackingDetails || prev.trackingDetails,
          }));
        }}
      />

      {/* 2. Shipping Label Modal */}
      <ShippingLabelModal
        isOpen={showLabelModal}
        onClose={() => setShowLabelModal(false)}
        order={order}
        labelData={labelData}
      />

      {/* 3. Tax Invoice / Packing Receipt Modal */}
      <PrintReceiptModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        order={order}
      />

      {/* 4. Admin Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCancelModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <button
              onClick={() => setShowCancelModal(false)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <AlertCircle size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600">
                <AlertCircle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Cancel & Refund Order</h3>
                <p className="text-xs text-gray-400">{order.orderNumber}</p>
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-5 space-y-1">
              <p className="text-sm text-rose-700 font-semibold">
                This will cancel the order and initiate a refund of{" "}
                <span className="font-black">₹{order.totalPrice?.toFixed(2)}</span>.
              </p>
              <p className="text-xs text-rose-500">This action cannot be undone.</p>
            </div>
            <div className="mb-5">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2 block">
                Cancellation Reason <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Internal reason for cancellation..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-400 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-slate-50 text-sm cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleAdminCancel}
                disabled={cancelLoading}
                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {cancelLoading ? <>Processing...</> : "Cancel & Refund"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
