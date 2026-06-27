import React, { useState, useEffect } from "react";
import { X, ChevronDown, Layers } from "lucide-react";

const CategoryModal = ({ config, categories, onClose, onSave }) => {
  const { isEdit, data } = config;
  const [formData, setFormData] = useState({ name: "", status: "Active", parentId: "" });

  useEffect(() => {
    if (data) {
      setFormData({ 
        name: data.name || "", 
        status: data.status || "Active", 
        parentId: data.parentId || "" 
      });
    }
  }, [data]);

  const flattenCategories = (items, level = 0) => {
    const list = [];
    items.forEach(cat => {
      if (isEdit && cat._id === data?._id) return;
      
      list.push({
        _id: cat._id,
        name: `${"— ".repeat(level)}${cat.name}`,
      });
      
      if (cat.children && cat.children.length > 0) {
        list.push(...flattenCategories(cat.children, level + 1));
      }
    });
    return list;
  };

  const flatList = flattenCategories(categories);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalPayload = {
      ...formData,
      parentId: formData.parentId === "" ? null : formData.parentId
    };
    onSave(finalPayload);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white w-full max-w-md rounded-xl p-6 relative shadow-2xl border border-slate-100"
      >
        {/* Close Button */}
        <button 
          type="button" 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg transition-all"
        >
          <X size={18}/>
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div 
            style={{ backgroundColor: "rgba(10, 71, 46, 0.08)", color: "var(--color-secondary)" }} 
            className="p-2 rounded-lg"
          >
            <Layers size={20} />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
        </div>
        
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Category Name
            </label>
            <input 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full border border-slate-200 px-4 py-2.5 rounded-lg text-sm outline-none transition-all focus:border-[var(--color-secondary)] focus:ring-4 focus:ring-slate-900/5" 
              placeholder="e.g. Building Material"
              required 
            />
          </div>

          {/* Parent Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Parent Category (Optional)
            </label>
            <div className="relative">
              <select 
                value={formData.parentId} 
                onChange={(e) => setFormData({...formData, parentId: e.target.value})} 
                className="w-full border border-slate-200 px-4 py-2.5 rounded-lg text-sm outline-none appearance-none bg-white cursor-pointer focus:border-[var(--color-secondary)]"
              >
                <option value="">None (Set as Main Parent)</option>
                {flatList.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* Status Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Visibility Status
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 rounded-lg border border-slate-100">
              {["Active", "Inactive"].map((s) => {
                const isActiveOption = formData.status === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({...formData, status: s})}
                    style={isActiveOption ? { color: "var(--color-secondary)" } : {}}
                    className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                      isActiveOption 
                        ? "bg-white shadow-sm border border-slate-200" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={{ backgroundColor: "var(--color-secondary)" }}
            className="flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-bold shadow-lg shadow-slate-100 hover:opacity-95 active:scale-95 transition-all"
          >
            {isEdit ? "Update Changes" : "Save Category"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryModal;