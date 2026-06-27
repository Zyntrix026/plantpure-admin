import React, { useState } from 'react';
import { X, Plus, ChevronRight, ChevronDown, Globe, Layout, Check } from 'lucide-react';

const CategoryTreeItem = ({ cat, selectedIds = [], onToggle, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const isSelected = selectedIds.some(id => String(id) === String(cat._id));
  const paddingLeft = depth * 16;

  return (
    <>
      <div 
        className={`group flex items-center justify-between px-4 py-3 border-b border-slate-50 cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/80 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50'}`}
        onClick={(e) => { e.stopPropagation(); onToggle(cat._id); if (hasChildren && !isSelected) setIsExpanded(true); }}
      >
        <div className="flex items-center gap-3" style={{ paddingLeft: `${paddingLeft}px` }}>
          <div className="w-5 flex items-center justify-center" onClick={(e) => { if(hasChildren) { e.stopPropagation(); setIsExpanded(!isExpanded); }}}>
            {hasChildren ? (isExpanded ? <ChevronDown size={14} className="text-indigo-600"/> : <ChevronRight size={14}/>) : <div className="w-1 h-1 rounded-full bg-slate-300 ml-1" />}
          </div>
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300'}`}>
            {isSelected && <Check size={10} strokeWidth={4} />}
          </div>
          <span className={`text-sm ${isSelected ? 'font-bold text-indigo-700' : 'text-slate-600'}`}>{cat.name}</span>
        </div>
      </div>
      {hasChildren && isExpanded && cat.children.map(child => <CategoryTreeItem key={child._id} cat={child} selectedIds={selectedIds} onToggle={onToggle} depth={depth + 1} />)}
    </>
  );
};

const ProductSidebarEdit = ({ formData, setFormData, categories = [], errors = {} }) => {
  const [keywordInput, setKeywordInput] = useState('');

  const findCategoryName = (list, targetId) => {
    if (!list || !Array.isArray(list)) return null;
    
    for (const cat of list) {
      if (String(cat._id) === String(targetId)) return cat.name;
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryName(cat.children, targetId);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleCategory = (id) => {
    setFormData(prev => {
      const current = prev.category || [];
      const isAlreadySelected = current.some(catId => String(catId) === String(id));
      const next = isAlreadySelected 
        ? current.filter(x => String(x) !== String(id)) 
        : [...current, id];
      return { ...prev, category: next };
    });
  };

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      keywords: [...(prev.keywords || []), keywordInput.trim()]
    }));
    setKeywordInput('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Layout size={18} className="text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Classification</h3>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Visibility Status</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData(prev => ({...prev, status: e.target.value}))} 
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50 outline-none"
            >
              <option value="Active">Published</option>
              <option value="Draft">Draft Mode</option>
            </select>
          </div>
{/* 
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Shipping Category *</label>
            <select
              value={formData.shipping_category ?? "SP"}
              onChange={(e) => setFormData(prev => ({ ...prev, shipping_category: e.target.value }))}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm font-semibold bg-slate-50 outline-none focus:border-indigo-500"
            >
              <option value="SP">SP — Small Parcel</option>
              <option value="BB">BB — Big &amp; Bulky</option>
            </select>
          </div> */}

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest mb-3">Selected Categories *</label>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
              {formData.category?.length > 0 ? (
                formData.category.map(id => (
                  <div key={id} className="flex items-center gap-1.5 bg-indigo-600 text-white rounded-lg px-2.5 py-1.5 text-[10px] font-bold shadow-sm">
                    <span>{findCategoryName(categories, id) || "Loading Name..."}</span>
                    <button type="button" onClick={() => toggleCategory(id)} className="hover:text-indigo-200 transition-colors">
                      <X size={12}/>
                    </button>
                  </div>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No category selected</span>
              )}
            </div>

            <div className="border border-slate-100 rounded-xl max-h-60 overflow-y-auto bg-slate-50/30 shadow-inner">
              {categories?.length > 0 ? (
                categories.map(cat => (
                  <CategoryTreeItem 
                    key={cat._id} 
                    cat={cat} 
                    selectedIds={formData.category || []} 
                    onToggle={toggleCategory} 
                  />
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">No categories found</div>
              )}
            </div>
            {errors.category && <p className="text-[10px] text-red-500 font-bold mt-1 ml-1">{errors.category}</p>}
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
          <Globe size={18} className="text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">SEO Engine</h3>
        </div>
        <div className="p-5 space-y-5">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
            <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">Live URL Slug</p>
            <p className="text-xs font-bold text-indigo-700 truncate">/{formData.slug || 'no-slug'}</p>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest mb-1">SEO Title</label>
            <input value={formData.metaTitle} onChange={(e) => setFormData(prev => ({...prev, metaTitle: e.target.value}))} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-indigo-500 outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest mb-1">SEO Description</label>
            <textarea value={formData.metaDescription} onChange={(e) => setFormData(prev => ({...prev, metaDescription: e.target.value}))} className="w-full border border-slate-200 p-3 rounded-xl text-sm focus:border-indigo-500 outline-none h-24 resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase block tracking-widest">Keywords</label>
            <div className="flex gap-2">
              <input 
                value={keywordInput} 
                onChange={(e) => setKeywordInput(e.target.value)} 
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }} 
                className="flex-1 border border-slate-200 p-2.5 rounded-xl text-sm outline-none focus:border-indigo-500" 
              />
              <button 
                type="button"
                onClick={handleAddKeyword} 
                className="bg-slate-900 text-white p-2.5 rounded-xl hover:bg-indigo-600 transition-colors"
              >
                <Plus size={18}/>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords?.map((w, i) => (
                <span key={i} className="flex items-center gap-1.5 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-bold border border-slate-200">
                  {w} 
                  <button type="button" onClick={() => setFormData(prev => ({...prev, keywords: prev.keywords.filter((_, idx) => idx !== i)}))}>
                    <X size={12}/>
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

export default ProductSidebarEdit;