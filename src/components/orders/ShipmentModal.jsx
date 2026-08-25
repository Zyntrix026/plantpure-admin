import React, { useState } from "react";
import {
  X,
  Truck,
  Package,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Box,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { createShipmentAdmin } from "../../lib/orders";

const ShipmentModal = ({ isOpen, onClose, order, onSuccess }) => {
  if (!isOpen || !order) return null;

  const isCOD = order.paymentMethod === "COD";
  const shipping = order.shippingAddress || {};

  const [courier, setCourier] = useState("Delhivery");
  const [shippingMode, setShippingMode] = useState("Surface");
  const [pickupLocation, setPickupLocation] = useState("CRAFTWORLD SURFACE");
  const [weight, setWeight] = useState("0.5");
  const [length, setLength] = useState("10");
  const [width, setWidth] = useState("10");
  const [height, setHeight] = useState("10");
  const [customWaybill, setCustomWaybill] = useState("");
  const [customTrackingUrl, setCustomTrackingUrl] = useState("");
  const [updateStatusToShipped, setUpdateStatusToShipped] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (courier !== "Delhivery" && !customWaybill.trim()) {
      return toast.error("AWB / Tracking number is required for custom couriers");
    }

    if (!weight || parseFloat(weight) <= 0) {
      return toast.error("Please enter a valid package weight");
    }

    setLoading(true);
    try {
      const payload = {
        courier,
        shippingMode,
        pickupLocation,
        weight: parseFloat(weight),
        length: parseFloat(length) || 10,
        width: parseFloat(width) || 10,
        height: parseFloat(height) || 10,
        customWaybill: customWaybill.trim() || undefined,
        trackingUrl: customTrackingUrl.trim() || undefined,
        updateStatusToShipped,
      };

      const res = await createShipmentAdmin(order._id, payload);
      if (res.success) {
        toast.success(res.message || "Shipment created successfully!");
        onSuccess(res.data);
        onClose();
      } else {
        toast.error(res.message || "Failed to create shipment");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Shipment creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <Truck className="text-indigo-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Create & Dispatch Shipment</h3>
                <p className="text-xs text-indigo-200 mt-0.5">
                  Order #{order.orderNumber} • {order.orderItems?.length || 0} items
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Destination & Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                <MapPin size={14} className="text-indigo-600" /> Delivery Address
              </div>
              <p className="text-sm font-bold text-slate-900">{shipping.fullName || "Customer"}</p>
              <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                {shipping.address}, {shipping.city} - {shipping.postalCode}, {shipping.state}
              </p>
              <p className="text-xs font-mono text-slate-500 mt-1">📞 {shipping.phone}</p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Mode</span>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      isCOD
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-emerald-100 text-emerald-800 border-emerald-300"
                    }`}
                  >
                    {isCOD ? "Cash on Delivery" : "Prepaid"}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-xs text-slate-500">Collectable Amount:</span>
                  <p className="text-xl font-black text-slate-900">
                    {isCOD ? `₹${order.totalPrice?.toFixed(2)}` : "₹0.00 (Paid Online)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Courier Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Select Courier Partner
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setCourier("Delhivery")}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  courier === "Delhivery"
                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">Delhivery</span>
                  {courier === "Delhivery" && (
                    <CheckCircle2 size={16} className="text-indigo-600 fill-indigo-100" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100/60 px-2 py-0.5 rounded w-fit mt-2">
                  Auto AWB + Manifest
                </span>
              </button>

              <button
                type="button"
                onClick={() => setCourier("BlueDart")}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  courier === "BlueDart"
                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">Blue Dart</span>
                  {courier === "BlueDart" && (
                    <CheckCircle2 size={16} className="text-indigo-600 fill-indigo-100" />
                  )}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-2">Manual Dispatch</span>
              </button>

              <button
                type="button"
                onClick={() => setCourier("Custom Courier")}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                  courier === "Custom Courier"
                    ? "border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/20"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">Other / Self</span>
                  {courier === "Custom Courier" && (
                    <CheckCircle2 size={16} className="text-indigo-600 fill-indigo-100" />
                  )}
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-2">Manual AWB</span>
              </button>
            </div>
          </div>

          {/* Manual AWB if custom courier */}
          {courier !== "Delhivery" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl">
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  AWB / Tracking Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customWaybill}
                  onChange={(e) => setCustomWaybill(e.target.value)}
                  placeholder="e.g. 1234567890"
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  Tracking URL <span className="text-xs text-amber-700 font-normal">(optional)</span>
                </label>
                <input
                  type="url"
                  value={customTrackingUrl}
                  onChange={(e) => setCustomTrackingUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>
          )}

          {/* Package Dimensions & Specifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Box size={14} className="text-indigo-600" /> Package Specifications
              </span>
              <span className="text-xs text-slate-400">Delhivery Express Format</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.05"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Length (cm)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Width (cm)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
                />
              </div>
            </div>
          </div>

          {/* Pickup Warehouse & Shipping Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Pickup Warehouse / Location
              </label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. CRAFTWORLD SURFACE"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Shipping Mode
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShippingMode("Surface")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    shippingMode === "Surface"
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Surface (Standard)
                </button>
                <button
                  type="button"
                  onClick={() => setShippingMode("Express")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    shippingMode === "Express"
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  Express (Air)
                </button>
              </div>
            </div>
          </div>

          {/* Status Update Checkbox */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="updateStatus"
              checked={updateStatusToShipped}
              onChange={(e) => setUpdateStatusToShipped(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <label htmlFor="updateStatus" className="text-xs text-slate-700 font-semibold cursor-pointer">
              Automatically update order status to <span className="font-bold text-indigo-700">"Shipped"</span> and log in status history.
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 py-3.5 border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 disabled:opacity-50 text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Connecting to {courier}...</span>
                </>
              ) : (
                <>
                  <span>Generate AWB & Dispatch</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentModal;

