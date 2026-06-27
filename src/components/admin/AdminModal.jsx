import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { createAdmin, updateAdmin } from "../../lib/admin";

const AdminModal = ({ isOpen, onClose, adminData, refreshData }) => {
  const isEditMode = !!adminData;
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminData) {
      setFormData({ name: adminData.name || "", email: adminData.email || "", password: "" });
    } else {
      setFormData({ name: "", email: "", password: "" });
    }
    setShowPassword(false);
  }, [adminData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode) {
        const payload = { name: formData.name, email: formData.email };
        if (formData.password) payload.password = formData.password;
        await updateAdmin(adminData._id, payload);
      } else {
        await createAdmin(formData);
      }
      refreshData();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditMode ? `Edit Admin: ${adminData.name}` : "Create New Admin"}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Full Name *</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email Address *</label>
            <input
              type="email"
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
              {isEditMode ? "New Password (leave blank to keep current)" : "Password *"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={!isEditMode}
                minLength={6}
                placeholder={isEditMode ? "Leave blank to keep current" : "Min 6 characters"}
                className="w-full border border-gray-300 rounded-lg p-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm shadow transition-colors disabled:opacity-60"
            >
              {loading ? "Saving..." : isEditMode ? "Save Changes" : "Create Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
