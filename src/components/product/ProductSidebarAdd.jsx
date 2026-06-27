import React, { useState } from 'react';
import { X, Plus, ChevronRight, ChevronDown, Globe, Layout, Check } from 'lucide-react';

const CategoryTreeItem = ({ cat, selectedIds = [], onToggle, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const isSelected = selectedIds.includes(cat._id);
  const paddingLeft = depth * 16; 

  return (
    <>
      <div 
        className={`group flex items-center justify-between px-4 py-2.5 border-b border-slate-50 cursor-pointer transition-all ${
          isSelected ? 'border-l-4' : 'hover:bg-slate-50'
        }`}
        style={{
          backgroundColor: isSelected ? "rgba(10, 71, 46, 0.05)" : "transparent",
          borderLeftColor: isSelected ? "var(--color-secondary)" : "transparent"
        }}
        onClick={(e) => { e.stopPropagation(); onToggle(cat._id); if (hasChildren && !isSelected) setIsExpanded(true); }}
      >
        <div className="flex items-center gap-2.5" style={{ paddingLeft: `${paddingLeft}px` }}>
          <div className="w-5 flex items-center justify-center" onClick={(e) => { if(hasChildren) { e.stopPropagation(); setIsExpanded(!isExpanded); } }}>
            {hasChildren ? (
              <span className="text-slate-400 group-hover:text-[var(--color-secondary)]">
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            ) : (
              <div className="w-1 h-1 rounded-full bg-slate-300 ml-1" />
            )}
          </div>
          <div 
            style={{ 
              backgroundColor: isSelected ? "var(--color-secondary)" : "#FFFFFF",
              borderColor: isSelected ? "var(--color-secondary)" : "#CBD5E1" 
            }}
            className="w-4 h-4 rounded border flex items-center justify-center text-white"
          >
            {isSelected && <Check size={10} strokeWidth={4} />}
          </div>
          <span 
            className="text-[13px]" 
            style={{ 
              fontWeight: isSelected ? "700" : "500", 
              color: isSelected ? "var(--color-secondary)" : "#475569" 
            }}
          >
            {cat.name}
          </span>
        </div>
      </div>
      {hasChildren && isExpanded && (
        <div>{cat.children.map((child) => <CategoryTreeItem key={child._id} cat={child} selectedIds={selectedIds} onToggle={onToggle} depth={depth + 1} />)}</div>
      )}
    </>
  );
};

const ProductSidebarAdd = ({ formData, setFormData, categories = [] }) => {
  const [keywordInput, setKeywordInput] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const findCatName = (list, id) => {
    for (let item of list) {
      if (item._id === id) return item.name;
      if (item.children?.length > 0) {
        const found = findCatName(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleCategory = (id) => {
    const current = formData.category || [];
    const updated = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    setFormData({ ...formData, category: updated });
  };

  const addKeyword = () => {
    const val = keywordInput.trim();
    if (!val) return;
    const currentKeywords = Array.isArray(formData.keywords) ? formData.keywords : [];
    if (!currentKeywords.includes(val)) {
      setFormData({ ...formData, keywords: [...currentKeywords, val] });
    }
    setKeywordInput('');
  };

  const removeKeyword = (wordToRemove) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(word => word !== wordToRemove)
    });
  };

  return (
    <div className="space-y-6">
      {/* Classification Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
          <Layout size={18} style={{ color: "var(--color-secondary)" }} />
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Classification</h3>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Visibility</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold bg-white outline-none focus:border-[var(--color-secondary)] cursor-pointer">
              <option value="Active">Published</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Shipping Category *</label>
            <select name="shipping_category" value={formData.shipping_category} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-xl text-sm font-bold bg-white outline-none focus:border-[var(--color-secondary)] cursor-pointer">
              <option value="SP">SP — Small Parcel</option>
              <option value="BB">BB — Big &amp; Bulky</option>
            </select>
          </div> */}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Select Category *</label>
            <div className="flex flex-wrap gap-1.5">
              {(formData.category || []).map((id) => (
                <div 
                  key={id} 
                  style={{ backgroundColor: "var(--color-secondary)" }} 
                  className="flex items-center gap-1.5 text-white rounded-lg px-2 py-1 text-[10px] font-bold"
                >
                  {findCatName(categories, id) || "Selected"}
                  <button type="button" onClick={() => toggleCategory(id)} className="hover:text-red-300 transition-colors">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto bg-slate-50/30">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <CategoryTreeItem key={cat._id} cat={cat} selectedIds={formData.category} onToggle={toggleCategory} />
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs italic">Loading categories...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Engine Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2">
          <Globe size={18} style={{ color: "var(--color-primary)" }} />
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">SEO Engine</h3>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest mb-1.5">Meta Title</label>
            <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-[var(--color-primary)]" placeholder="SEO Title" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Meta Description</label>
              <span className="text-[9px] font-bold text-slate-400">{formData.metaDescription?.length || 0}/160</span>
            </div>
            <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none min-h-[100px] resize-none focus:border-[var(--color-primary)]" placeholder="Search engine description..." />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Keywords</label>
            <div className="flex gap-2">
              <input 
                value={keywordInput} 
                onChange={(e) => setKeywordInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())} 
                className="flex-1 border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-[var(--color-primary)]" 
                placeholder="Type and press enter..." 
              />
              <button 
                type="button" 
                onClick={addKeyword} 
                className="bg-slate-100 px-3 rounded-xl hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.keywords || []).map((word, i) => (
                <span 
                  key={i} 
                  style={{ backgroundColor: "rgba(84, 180, 53, 0.08)", color: "var(--color-primary)", borderColor: "rgba(84, 180, 53, 0.15)" }} 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold border shadow-sm"
                >
                  {word}
                  <button type="button" onClick={() => removeKeyword(word)} className="hover:text-red-500 transition-colors">
                    <X size={12} strokeWidth={3} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSidebarAdd;