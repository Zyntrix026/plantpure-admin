import React, { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { uploadImage } from "../../lib/product"; // Path update karein
import { createHeroBanner, updateHeroBanner } from "../../lib/HeroBanner";
import { getCategoriesFormatted } from "../../lib/categories";

const HeroBannerForm = ({ isOpen, onClose, fetchBanners, editData = null }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    bannerImage: "",
    category: "",
    priority: 0,
    status: "Active",
  });

  // Edit data ko populate karna
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        subtitle: editData.subtitle || "",
        bannerImage: editData.bannerImage || "",
        category: editData.category?._id || "",
        priority: editData.priority || 0,
        status: editData.status || "Active",
      });
    } else {
      setFormData({ title: "", subtitle: "", bannerImage: "", category: "", priority: 0, status: "Active" });
    }
    fetchCategories();
  }, [editData, isOpen]);

  const fetchCategories = async () => {
    try {
      const data = await getCategoriesFormatted();
      if (data.success) setCategories(data.categoryList);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  // Image Upload Handler
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await uploadImage(file, "hero-banner/images");
      setFormData((prev) => ({ ...prev, bannerImage: res.url }));
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Nested Category Dropdown Logic (Recursion)
  const renderOptions = (items, level = 0) => {
    return items.map((cat) => (
      <React.Fragment key={cat._id}>
        <option value={cat._id}>
          {"—".repeat(level)} {cat.name}
        </option>
        {cat.children && renderOptions(cat.children, level + 1)}
      </React.Fragment>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bannerImage || !formData.category) {
      return toast.error("Image and Category are required!");
    }

    try {
      setLoading(true);
      if (editData) {
        await updateHeroBanner(editData._id, formData);
      } else {
        await createHeroBanner(formData);
      }
      fetchBanners();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-primary text-white">
          <h2 className="text-xl font-bold">{editData ? "Update Banner" : "Add New Banner"}</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-all">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
          {/* Image Upload Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Banner Image *</label>
            <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center hover:border-primary transition-colors bg-slate-50">
              {formData.bannerImage ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-inner">
                  <img src={formData.bannerImage} className="w-full h-full object-cover" alt="preview" />
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, bannerImage: ""})}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center">
                  {uploading ? <Loader2 className="animate-spin text-primary" size={32} /> : <Upload className="text-slate-400" size={32} />}
                  <span className="mt-2 text-xs font-medium text-slate-500">{uploading ? "Uploading..." : "Click to upload banner"}</span>
                  <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
              )}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Title</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                placeholder="e.g. Summer Sale"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Subtitle</label>
              <textarea
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm h-20"
                placeholder="Brief description..."
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Category *</label>
            <select
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white text-sm"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {renderOptions(categories)}
            </select>
          </div>

          {/* Priority & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Priority</label>
              <input
                type="number"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Status</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-primary"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              disabled={loading || uploading}
              type="submit"
              className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:opacity-90 transition-all text-sm disabled:opacity-50"
            >
              {loading ? "Processing..." : editData ? "Update Banner" : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HeroBannerForm;