import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Loader2, ArrowLeft, Package, User, CreditCard, MapPin, Phone, Mail,
  Store, Home, AlertCircle, Truck, Clock, CheckCircle2, QrCode, ExternalLink,
  Calendar, Hash,
} from "lucide-react";
import { getOrderById, cancelOrderAdmin } from "../lib/orders";

const STATUS_LABELS = {
  pending: "Pending", confirmed: "Confirmed", processing: "Processing",
  shipped: "Shipped", out_for_delivery: "Out For Delivery", delivered: "Delivered",
  ready_for_pickup: "Ready For Pickup", picked_up: "Picked Up", cancelled: "Cancelled",
};

const getStatusStyles = (status) => {
  const map = {
    pending: "bg-amber-100 text-amber-700", confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-sky-100 text-sky-700", shipped: "bg-indigo-100 text-indigo-700",
    out_for_delivery: "bg-purple-100 text-purple-700", delivered: "bg-emerald-100 text-emerald-700",
    ready_for_pickup: "bg-fuchsia-100 text-fuchsia-700", picked_up: "bg-teal-100 text-teal-700",
    cancelled: "bg-rose-100 text-rose-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};

const DELIVERY_STEPS  = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];
const PICKUP_STEPS    = ["pending", "confirmed", "processing", "ready_for_pickup", "picked_up"];

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id || id.length < 24) { toast.error("Invalid Order ID"); setLoading(false); return; }
      try {
        const res = await getOrderById(id);
        if (res.success) setOrder(res.data);
        else toast.error(res.message || "Order not found");
      } catch { toast.error("Failed to fetch order"); }
      finally { setLoading(false); }
    };
    fetchOrder();
  }, [id]);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason]       = useState("");
  const [cancelLoading, setCancelLoading]     = useState(false);

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

  if (loading)
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary" size={40} /></div>;

  if (!order)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle size={48} className="text-gray-300" />
        <div className="text-center font-bold text-gray-500 text-xl">Order Not Found</div>
        <button onClick={() => navigate("/")} className="text-primary font-bold hover:underline">Go back to shop</button>
      </div>
    );

  const isGuest       = order.isGuest;
  const isPickup      = order.shippingMethod === "store_pickup";
  const customerEmail = isGuest ? order.guestEmail : order.userId?.email;
  const customerName  = isGuest ? order.shippingAddress?.fullName : order.userId?.name;
  const customerPhone = isGuest ? order.shippingAddress?.phone : order.userId?.phone;

  const steps         = isPickup ? PICKUP_STEPS : DELIVERY_STEPS;
  const isCancelled   = order.orderStatus === "cancelled";
  const currentIdx    = isCancelled ? -1 : steps.indexOf(order.orderStatus);

  const td = order.trackingDetails;
  const pd = order.pickupDetails;

  return (
    <div className="bg-gray-50/30 min-h-screen">
      {/* Top Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-black font-semibold transition-all w-fit">
          <ArrowLeft size={18} /> Back to Orders
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-gray-500">Order: {order.orderNumber}</span>
          <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyles(order.orderStatus)}`}>
            {STATUS_LABELS[order.orderStatus] || order.orderStatus}
          </div>
          {isPickup
            ? <span className="text-xs font-black bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Store size={12}/> Store Pickup</span>
            : <span className="text-xs font-black bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full flex items-center gap-1.5"><Truck size={12}/> Home Delivery</span>
          }
          {/* Admin Cancel Button */}
          {CANCELLABLE.has(order.orderStatus) && (
            <button
              onClick={() => { setCancelReason(""); setShowCancelModal(true); }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-black hover:bg-rose-100 transition-all"
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
              <div className="h-full bg-primary transition-all duration-700 rounded-full" style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }} />
            </div>
            {steps.map((step, i) => {
              const done    = i <= currentIdx;
              const active  = step === order.orderStatus;
              const history = order.statusHistory?.find(h => h.status === step);
              return (
                <div key={step} className="flex flex-col items-center gap-2 z-10 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-500 ${done ? "bg-primary border-white text-white" : "bg-white border-gray-100 text-gray-300"} ${active ? "ring-8 ring-primary/10 scale-110" : ""}`}>
                    {done ? <CheckCircle2 size={20} strokeWidth={2.5} /> : <Clock size={16} />}
                  </div>
                  <p className={`text-[11px] font-bold text-center leading-tight ${done ? "text-primary" : "text-gray-400"}`}>{STATUS_LABELS[step]}</p>
                  {history && <p className="text-[9px] text-gray-400 font-semibold text-center">{new Date(history.changedAt).toLocaleDateString()}</p>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary"><Package size={22} /></div>
                <h2 className="text-xl font-bold">Items Ordered</h2>
              </div>
              <span className="text-sm font-medium text-gray-400">{order.orderItems?.length || 0} Products</span>
            </div>
            <div className="divide-y divide-gray-50">
              {order.orderItems.map((item) => (
                <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-center hover:bg-gray-50/50 transition-colors">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-contain mix-blend-multiply bg-gray-100 rounded-2xl p-2" />
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{item.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-mono">{item.sku}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                      <span className="text-sm text-gray-500">Qty: <span className="font-bold text-black">{item.quantity}</span></span>
                      <span className="text-sm text-gray-500">Price: <span className="font-bold text-black">₹{item.priceAtPurchase?.toFixed(2)}</span></span>
                    </div>
                  </div>
                  <p className="text-lg font-black text-primary">₹{(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Details — Delivery only */}
          {!isPickup && td && (td.trackingNumber || td.courierName) && (
            <div className="bg-white border border-indigo-100 rounded-3xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-indigo-800 flex items-center gap-2 text-sm uppercase tracking-wider"><Truck size={16}/> Shipping & Tracking</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {td.trackingNumber && (
                  <div className="bg-indigo-50 rounded-2xl p-4">
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-wider flex items-center gap-1 mb-1"><Hash size={10}/> Tracking Number</p>
                    <p className="font-black text-indigo-800 text-lg font-mono">{td.trackingNumber}</p>
                  </div>
                )}
                {td.courierName && (
                  <div className="bg-indigo-50 rounded-2xl p-4">
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-wider mb-1">Courier</p>
                    <p className="font-bold text-indigo-800">{td.courierName}</p>
                  </div>
                )}
                {td.estimatedDeliveryDate && (
                  <div className="bg-indigo-50 rounded-2xl p-4">
                    <p className="text-[10px] text-indigo-500 font-black uppercase tracking-wider flex items-center gap-1 mb-1"><Calendar size={10}/> Est. Delivery</p>
                    <p className="font-bold text-indigo-800">{new Date(td.estimatedDeliveryDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                )}
                {td.deliveredAt && (
                  <div className="bg-emerald-50 rounded-2xl p-4">
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider mb-1">Delivered At</p>
                    <p className="font-bold text-emerald-800">{new Date(td.deliveredAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
              {td.trackingUrl && (
                <a href={td.trackingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:underline">
                  <ExternalLink size={14}/> Track on courier website
                </a>
              )}
            </div>
          )}

          {/* Pickup Details — Store Pickup only */}
          {isPickup && pd && (
            <div className="bg-white border border-fuchsia-100 rounded-3xl shadow-sm p-6 space-y-4">
              <h3 className="font-bold text-fuchsia-800 flex items-center gap-2 text-sm uppercase tracking-wider"><QrCode size={16}/> Pickup Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pd.pickupCode && (
                  <div className="bg-fuchsia-50 rounded-2xl p-4">
                    <p className="text-[10px] text-fuchsia-500 font-black uppercase tracking-wider mb-1">Pickup Code</p>
                    <p className="font-black text-fuchsia-800 text-2xl tracking-widest">{pd.pickupCode}</p>
                  </div>
                )}
                {pd.pickedUpAt && (
                  <div className="bg-teal-50 rounded-2xl p-4">
                    <p className="text-[10px] text-teal-600 font-black uppercase tracking-wider mb-1">Picked Up At</p>
                    <p className="font-bold text-teal-800">{new Date(pd.pickedUpAt).toLocaleString()}</p>
                    {pd.pickedUpBy && <p className="text-sm text-teal-600 mt-1">By: {pd.pickedUpBy}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Status History */}
          {order.statusHistory?.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
              <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4 flex items-center gap-2"><Clock size={14}/> Status History</h3>
              <div className="space-y-3">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 mt-2 ${h.status === "cancelled" ? "bg-rose-500" : "bg-primary"}`} />
                    <div className="flex-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getStatusStyles(h.status)}`}>{STATUS_LABELS[h.status] || h.status}</span>
                      {h.note && <p className="text-gray-500 text-xs mt-0.5">{h.note}</p>}
                    </div>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{new Date(h.changedAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Summary & Details */}
        <div className="lg:col-span-4 space-y-5">
          {/* Price Summary */}
          <div className="bg-primary text-white rounded-3xl shadow-xl p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-white/60 uppercase text-[11px] font-black tracking-widest mb-1">Total Amount</h3>
              <div className="text-4xl font-black mb-6">₹{order.totalPrice?.toFixed(2)}</div>
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm"><span className="opacity-70">Subtotal</span><span className="font-bold">₹{order.itemsPrice?.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="opacity-70">Shipping</span><span className="font-bold">{order.shippingPrice === 0 ? "FREE" : `₹${order.shippingPrice?.toFixed(2)}`}</span></div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>

          {/* Shipping Address — delivery always shown, pickup shown if address data exists */}
          {order.shippingAddress && (!isPickup || order.shippingAddress.address) && (
            <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <div className={`p-2 rounded-lg ${isPickup ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                  {isPickup ? <Store size={20} /> : <Home size={20} />}
                </div>
                <h3 className="font-bold text-lg">{isPickup ? 'Pickup Contact Address' : 'Shipping Address'}</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                {order.shippingAddress.address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {order.shippingAddress.address},<br/>
                      {order.shippingAddress.city}{order.shippingAddress.postalCode ? `, ${order.shippingAddress.postalCode}` : ''}<br/>
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

          {/* Customer */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3 border-b pb-4">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><User size={20} /></div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Customer Contact</h3>
                {isGuest && <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-0.5 rounded w-fit mt-0.5 block">Guest Order</span>}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3"><Mail size={15} className="text-gray-400 mt-0.5"/><div><p className="text-xs text-gray-400">Email</p><p className="text-sm font-bold break-all">{customerEmail || "N/A"}</p></div></div>
              <div className="flex items-start gap-3"><Phone size={15} className="text-gray-400 mt-0.5"/><div><p className="text-xs text-gray-400">Phone</p><p className="text-sm font-bold">{customerPhone || "N/A"}</p></div></div>
              <div className="flex items-start gap-3">
                {isPickup ? <Store size={15} className="text-primary mt-0.5"/> : <Package size={15} className="text-gray-400 mt-0.5"/>}
                <div><p className="text-xs text-gray-400">Delivery Method</p><p className="text-sm font-bold capitalize">{order.shippingMethod?.replace("_", " ")}</p></div>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600"><CreditCard size={20}/></div>
              <div><p className="text-[10px] text-gray-400 uppercase font-black">Paid via</p><p className="text-sm font-bold">{order.paymentMethod}</p></div>
            </div>
            <div className={`font-black text-xs uppercase px-3 py-1 rounded-lg border ${order.paymentStatus === "paid" ? "bg-green-50 text-green-600 border-green-100" : order.paymentStatus === "refunded" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
              {order.paymentStatus}
            </div>
          </div>

          {/* Refund info */}
          {order.paymentStatus === "refunded" && (
            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-center">
              <p className="text-rose-700 font-bold text-sm">💸 Refund of ₹{order.totalPrice?.toFixed(2)} initiated</p>
              <p className="text-rose-500 text-xs mt-1">Stripe refund processed on cancellation</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Admin Cancel Modal ─── */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCancelModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
            <button onClick={() => setShowCancelModal(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <AlertCircle size={18} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600"><AlertCircle size={22} /></div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Cancel & Refund Order</h3>
                <p className="text-xs text-gray-400">{order.orderNumber}</p>
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-5 space-y-1">
              <p className="text-sm text-rose-700 font-semibold">
                This will cancel the order and initiate a full Stripe refund of <span className="font-black">₹{order.totalPrice?.toFixed(2)}</span>.
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
              <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-sm">Go Back</button>
              <button
                onClick={handleAdminCancel}
                disabled={cancelLoading}
                className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
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
