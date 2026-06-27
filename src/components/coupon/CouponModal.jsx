import React, { useState, useEffect } from "react";
import { createCoupon, updateCoupon } from "../../lib/coupon";
import { X } from "lucide-react";

const CouponModal = ({ isOpen, onClose, couponData, refreshData }) => {
  const isEditMode = !!couponData;

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: 0,
    maxDiscount: "",
    minOrderAmount: 0,
    expiryDate: "",
    usageLimit: "",
    perUserLimit: 1,
  });

  useEffect(() => {
    if (couponData) {
      setFormData({
        code: couponData.code || "",
        description: couponData.description || "",
        type: couponData.type || "percentage",
        value: couponData.value || 0,
        maxDiscount: couponData.maxDiscount || "",
        minOrderAmount: couponData.minOrderAmount || 0,
        expiryDate: couponData.expiryDate ? new Date(couponData.expiryDate).toISOString().split("T")[0] : "",
        usageLimit: couponData.usageLimit || "",
        perUserLimit: couponData.perUserLimit || 1,
      });
    }
  }, [couponData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateCoupon(couponData._id, formData);
      } else {
        await createCoupon(formData);
      }
      refreshData();
      onClose();
    } catch (error) {
      console.error("Form Submission Failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? `Edit Coupon: ${couponData.code}` : "Create New Coupon"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                disabled={isEditMode}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm uppercase disabled:bg-gray-50 outline-none focus:border-[var(--color-secondary)]"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Coupon Type *</label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none bg-white focus:border-[var(--color-secondary)]"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Discount (₹)</option>
                <option value="free_shipping">Free Shipping</option>
                <option value="product_specific">Product Specific</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
            <textarea
              rows="2"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[var(--color-secondary)]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Discount Value</label>
              <input
                type="number"
                disabled={formData.type === "free_shipping"}
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm disabled:bg-gray-50 outline-none focus:border-[var(--color-secondary)]"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Max Discount Cap (₹)</label>
              <input
                type="number"
                placeholder="Null"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[var(--color-secondary)]"
                value={formData.maxDiscount}
                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[var(--color-secondary)]"
                value={formData.minOrderAmount}
                onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Expiry Date *</label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[var(--color-secondary)]"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Total Usage Limit</label>
              <input
                type="number"
                placeholder="Unlimited"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[var(--color-secondary)]"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Per User Limit</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:border-[var(--color-secondary)]"
                value={formData.perUserLimit}
                onChange={(e) => setFormData({ ...formData, perUserLimit: Number(e.target.value) })}
              />
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ backgroundColor: "var(--color-secondary)" }}
              className="px-5 py-2 text-white font-medium rounded-lg text-sm shadow transition-all hover:opacity-95 active:scale-95"
            >
              {isEditMode ? "Save Changes" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponModal;