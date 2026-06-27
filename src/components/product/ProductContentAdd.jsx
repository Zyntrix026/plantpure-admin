import React, { useRef } from 'react';
import { Trash2, Info, Image as ImageIcon, Upload, Hash, Tag, Boxes, AlignLeft, Percent, Plus, X, Layers, RefreshCw } from 'lucide-react';
import JodEditor from '../editor/JodEditor';

const ProductContentAdd = ({ formData, setFormData, images, setImages, onImageUpload, errors = {}, onRegenerateSKU }) => {
  const fileInputRef = useRef(null);
  const activeIndex = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) await onImageUpload(file, activeIndex.current);
    e.target.value = null;
  };

  const triggerUpload = (index) => {
    activeIndex.current = index;
    fileInputRef.current.click();
  };

  const removeImage = (index, e) => {
    e.stopPropagation();
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };

  // --- Variant Handlers ---
  const toggleVariants = () => {
    const turning = !formData.hasVariants;
    setFormData({
      ...formData,
      hasVariants: turning,
      variants: turning ? [{ label: '', price: '', discountPrice: '', stock: 0, sku: '' }] : [],
      // Non-variant fields reset when switching to variants
      basePrice: turning ? '' : formData.basePrice,
      discountPrice: turning ? '' : formData.discountPrice,
      stock: turning ? 0 : formData.stock,
    });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...(formData.variants || []), { label: '', price: '', discountPrice: '', stock: 0, sku: '' }],
    });
  };

  const updateVariant = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, variants: updated });
  };

  const removeVariant = (index) => {
    const updated = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updated });
  };

  return (
    <div className="space-y-6">
      {/* General Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-50 pb-4">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <Info size={20} style={{ color: "var(--color-primary)" }}/> General Details
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title *</label>
            <input
              className={`w-full border p-3 rounded-xl text-sm outline-none transition-all ${errors.title ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-[var(--color-primary)]'}`}
              placeholder="e.g. HomePack Ready To Use Postcrete"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU ID *</label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none uppercase bg-white text-slate-700 font-bold focus:border-[var(--color-primary)]"
                  value={formData.sku}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    if (!val.startsWith('SID-')) return;
                    setFormData({...formData, sku: val});
                  }}
                  placeholder="SKU-"
                />
              </div>
              <button 
                type="button" 
                onClick={onRegenerateSKU} 
                title="Regenerate SKU" 
                className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors group"
              >
                <RefreshCw size={14} className="group-hover:text-[var(--color-primary)]" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
            <div className="relative">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none focus:border-[var(--color-primary)]" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
            </div>
          </div>

          {/* Stock — only show when no variants */}
          {!formData.hasVariants && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
              <div className="relative">
                <Boxes size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none focus:border-[var(--color-primary)]" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
              </div>
            </div>
          )}
        </div>

        {/* VAT — always visible */}
        <div className="space-y-1.5 max-w-[200px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Gst Type</label>
          <div className="relative">
            <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none focus:border-[var(--color-primary)] bg-white font-bold"
              value={formData.vatPercentage}
              onChange={(e) => setFormData({...formData, vatPercentage: e.target.value})}
            >
              <option value={0}>0% (No Tax)</option>
              <option value={5}>5% (Reduced)</option>
              <option value={20}>20% (Standard)</option>
            </select>
          </div>
        </div>

        {/* Non-variant pricing */}
        {!formData.hasVariants && (
          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (Ex. GST)</label>
              <input type="number" className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-[var(--color-primary)] font-bold" value={formData.basePrice} onChange={(e) => setFormData({...formData, basePrice: e.target.value})} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sale Price</label>
              <input type="number" className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-[var(--color-primary)] font-bold" value={formData.discountPrice} onChange={(e) => setFormData({...formData, discountPrice: e.target.value})} />
            </div>
            <div 
              style={{ backgroundColor: "rgba(84, 180, 53, 0.08)", borderColor: "rgba(84, 180, 53, 0.15)", color: "var(--color-primary)" }} 
              className="h-[46px] mt-auto font-black flex items-center justify-center rounded-xl border text-[11px]"
            >
              {formData.discountPercentage || "0% OFF"}
            </div>
          </div>
        )}
      </div>

      {/* Variants Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <Layers size={20} style={{ color: "var(--color-secondary)" }}/> Product Variants
          </h2>
          {/* Toggle Button */}
          <button
            type="button"
            onClick={toggleVariants}
            style={{ backgroundColor: formData.hasVariants ? "var(--color-secondary)" : "#E2E8F0" }}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.hasVariants ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {!formData.hasVariants ? (
          <p className="text-xs text-slate-400 font-medium">Enable variants to add size, color, weight or any custom options with individual pricing and stock.</p>
        ) : (
          <div className="space-y-3">
            {/* Header row */}
            <div className="grid grid-cols-12 gap-2 px-1">
              <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Label *</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (Ex. Vat) *</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Price</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</span>
              <span className="col-span-1" />
            </div>

            {formData.variants.map((variant, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <input
                  className="col-span-3 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-[var(--color-secondary)] bg-white"
                  placeholder="e.g. XL, Red, 1kg"
                  value={variant.label}
                  onChange={(e) => updateVariant(i, 'label', e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-[var(--color-secondary)] bg-white font-bold"
                  placeholder="0.00"
                  value={variant.price}
                  onChange={(e) => updateVariant(i, 'price', e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-[var(--color-secondary)] bg-white"
                  placeholder="0.00"
                  value={variant.discountPrice}
                  onChange={(e) => updateVariant(i, 'discountPrice', e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-[var(--color-secondary)] bg-white"
                  placeholder="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                />
                <input
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-[var(--color-secondary)] bg-white uppercase"
                  placeholder="Optional"
                  value={variant.sku}
                  onChange={(e) => updateVariant(i, 'sku', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  disabled={formData.variants.length === 1}
                  className="col-span-1 flex items-center justify-center text-red-400 hover:text-red-600 disabled:opacity-20 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              style={{ color: "var(--color-secondary)" }}
              className="flex items-center gap-2 text-sm font-bold opacity-100 hover:opacity-80 transition-opacity mt-1"
            >
              <Plus size={16} /> Add Variant
            </button>
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <AlignLeft size={20} style={{ color: "var(--color-primary)" }}/> Product Excerpt
        </h2>
        <textarea
          className="w-full border border-slate-200 p-4 rounded-xl text-sm outline-none focus:border-[var(--color-primary)] min-h-[100px] resize-none"
          placeholder="Short summary for previews..."
          value={formData.excerpt}
          onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
        />
      </div>

      {/* Media Gallery */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6 text-lg">
          <ImageIcon size={20} style={{ color: "var(--color-primary)" }}/> Media Gallery
        </h2>
        <div className="grid grid-cols-5 gap-4">
          {images.map((img, i) => (
            <div key={i} onClick={() => !img && triggerUpload(i)} className={`relative aspect-square border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden ${img ? 'border-slate-100' : 'border-slate-200 hover:bg-slate-50'}`}>
              {img ? (
                <>
                  <img src={img.preview || img.url} className="w-full h-full object-cover" alt="product" />
                  <button onClick={(e) => removeImage(i, e)} className="absolute bg-white/90 p-1.5 rounded-lg shadow-md text-red-500 top-2 right-2"><Trash2 size={14} /></button>
                </>
              ) : (
                <Upload size={18} className="text-slate-300" />
              )}
            </div>
          ))}
        </div>
        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Detailed Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-4 text-lg">Detailed Overview</h2>
        <JodEditor value={formData.productOverview} onChange={(val) => setFormData({...formData, productOverview: val})} />
      </div>
    </div>
  );
};

export default ProductContentAdd;