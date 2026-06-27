import React, { useRef } from 'react';
import { Trash2, Info, Image as ImageIcon, Upload, Hash, Tag, Boxes, AlignLeft, Percent, Plus, X, Layers, RefreshCw } from 'lucide-react';
import JodEditor from '../editor/JodEditor';

const ProductContentEdit = ({ formData, setFormData, images, setImages, errors = {}, onRegenerateSKU }) => {
  const fileInputRef = useRef(null);
  const activeIndex = useRef(null);

  // Dynamic Base64 / Local Object state extraction for image preview matching
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newImages = [...images];
      newImages[activeIndex.current] = {
        file,
        preview: reader.result,
        url: '',
        fileId: null,
        size: file.size
      };
      setImages(newImages);
    };
    reader.readAsDataURL(file);
    e.target.value = null; // Flush stream buffer
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

  const toggleVariants = () => {
    setFormData(prev => {
      const turning = !prev.hasVariants;
      return {
        ...prev,
        hasVariants: turning,
        variants: turning ? [{ label: '', price: '', discountPrice: '', stock: 0, sku: '' }] : [],
        basePrice: turning ? '' : prev.basePrice,
        discountPrice: turning ? '' : prev.discountPrice,
        stock: turning ? 0 : prev.stock,
      };
    });
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), { label: '', price: '', discountPrice: '', stock: 0, sku: '' }],
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.variants || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const removeVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* General Details */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg border-b border-slate-50 pb-4">
          <Info size={20} className="text-indigo-600"/> General Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Title *</label>
            <input
              className={`w-full border p-3 rounded-xl text-sm outline-none transition-all ${errors.title ? 'border-red-400 bg-red-50/30' : 'border-slate-200 focus:border-indigo-500'}`}
              value={formData.title}
              onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU ID *</label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none uppercase bg-white text-slate-700 font-bold focus:border-indigo-500"
                  value={formData.sku}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    setFormData(prev => ({...prev, sku: val}));
                  }}
                  placeholder="SKU-"
                />
              </div>
              <button type="button" onClick={onRegenerateSKU} title="Regenerate SKU" className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Brand</label>
            <div className="relative">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none focus:border-indigo-500" value={formData.brand} onChange={(e) => setFormData(prev => ({...prev, brand: e.target.value}))} />
            </div>
          </div>

          {!formData.hasVariants && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock</label>
              <div className="relative">
                <Boxes size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none focus:border-indigo-500" value={formData.stock} onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))} />
              </div>
            </div>
          )}
        </div>

        {/* VAT Options */}
        <div className="space-y-1.5 max-w-[200px]">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST TYPE</label>
          <div className="relative">
            <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select className="w-full border border-slate-200 pl-9 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white font-bold" value={formData.vatPercentage} onChange={(e) => setFormData(prev => ({...prev, vatPercentage: e.target.value}))}>
              <option value={0}>0% (No Tax)</option>
              <option value={5}>5% (Reduced)</option>
              <option value={20}>20% (Standard)</option>
            </select>
          </div>
        </div>

        {!formData.hasVariants && (
          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (Ex. GST)</label>
              <input type="number" className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold" value={formData.basePrice} onChange={(e) => setFormData(prev => ({...prev, basePrice: e.target.value}))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sale Price</label>
              <input type="number" className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none focus:border-indigo-500 font-bold" value={formData.discountPrice} onChange={(e) => setFormData(prev => ({...prev, discountPrice: e.target.value}))} />
            </div>
            <div className="h-[46px] mt-auto bg-emerald-50 text-emerald-600 font-black flex items-center justify-center rounded-xl border border-emerald-100 text-[11px]">
              {formData.discountPercentage || "0% OFF"}
            </div>
          </div>
        )}
      </div>

      {/* Variants Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
            <Layers size={20} className="text-violet-500"/> Product Variants
          </h2>
          <button
            type="button"
            onClick={toggleVariants}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.hasVariants ? 'bg-violet-600' : 'bg-slate-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.hasVariants ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        {!formData.hasVariants ? (
          <p className="text-xs text-slate-400 font-medium">Enable variants to add size, color, weight or any custom options with individual pricing and stock.</p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 px-1">
              <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Label *</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price *</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Price</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</span>
              <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</span>
              <span className="col-span-1" />
            </div>

            {(formData.variants || []).map((variant, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                <input
                  className="col-span-3 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-violet-500 bg-white"
                  placeholder="e.g. XL, Red"
                  value={variant.label}
                  onChange={(e) => updateVariant(i, 'label', e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-violet-500 bg-white font-bold"
                  placeholder="0.00"
                  value={variant.price}
                  onChange={(e) => updateVariant(i, 'price', e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-violet-500 bg-white"
                  placeholder="0.00"
                  value={variant.discountPrice}
                  onChange={(e) => updateVariant(i, 'discountPrice', e.target.value)}
                />
                <input
                  type="number"
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-violet-500 bg-white"
                  placeholder="0"
                  value={variant.stock}
                  onChange={(e) => updateVariant(i, 'stock', e.target.value)}
                />
                <input
                  className="col-span-2 border border-slate-200 p-2.5 rounded-lg text-sm outline-none focus:border-violet-500 bg-white uppercase"
                  placeholder="Optional"
                  value={variant.sku || ''}
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

            <button type="button" onClick={addVariant} className="flex items-center gap-2 text-violet-600 text-sm font-bold hover:text-violet-800 transition-colors mt-1">
              <Plus size={16} /> Add Variant
            </button>
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
          <AlignLeft size={20} className="text-amber-500"/> Product Excerpt
        </h2>
        <textarea
          className="w-full border border-slate-200 p-4 rounded-xl text-sm outline-none focus:border-indigo-500 min-h-[100px] resize-none"
          placeholder="Short summary for previews..."
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
        />
      </div>

      {/* Media Gallery */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 mb-6 text-lg"><ImageIcon size={20} className="text-pink-500"/> Media Gallery</h2>
        <div className="grid grid-cols-5 gap-4">
          {images.map((img, i) => (
            <div key={i} onClick={() => !img && triggerUpload(i)} className={`relative aspect-square border-2 border-dashed rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden ${img ? 'border-slate-100' : 'border-slate-200 hover:bg-slate-50'}`}>
              {img ? (
                <>
                  <img src={img.preview || img.url} className="w-full h-full object-cover" alt="product" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button type="button" onClick={(e) => removeImage(i, e)} className="bg-white p-2 rounded-lg text-red-500 shadow-lg"><Trash2 size={16} /></button>
                  </div>
                  {img.url && !img.preview && <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Live</span>}
                </>
              ) : <Upload size={18} className="text-slate-300" />}
            </div>
          ))}
        </div>
        <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Detailed Overview */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="font-bold text-slate-800 mb-4 text-lg">Detailed Overview</h2>
        <JodEditor value={formData.productOverview} onChange={(val) => setFormData(prev => ({...prev, productOverview: val}))} />
      </div>
    </div>
  );
};

export default ProductContentEdit;