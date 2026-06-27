import React, { useState, useEffect } from 'react';
import { 
  Star, TrendingUp, Award, Plus, Trash2, 
  GripVertical, Search, Save, RefreshCw, 
  Eye, EyeOff, Smartphone, Monitor, 
  ChevronRight, ArrowUpRight, LayoutGrid, Check
} from 'lucide-react';


const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState("Top Selling");
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [previewMode, setPreviewMode] = useState("mobile");

  // --- 1. CORE DATA STATE ---
  const [tabsData, setTabsData] = useState({
    "Top Selling": [
      { id: 101, name: "iPhone 15 Pro", price: 999, stock: 45, visible: true, img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200" },
      { id: 102, name: "AirPods Max", price: 549, stock: 12, visible: true, img: "https://images.unsplash.com/photo-1546435770-a3e4265029b6?w=200" },
      { id: 103, name: "Apple Watch Ultra", price: 799, stock: 8, visible: false, img: "https://images.unsplash.com/photo-1434493907317-a46b53b81882?w=200" },
    ],
    "Trending": [
      { id: 201, name: "Mechanical Keyboard", price: 129, stock: 88, visible: true, img: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200" },
    ],
    "Top Rated": []
  });

  // --- 2. ACTIONS ---
  const toggleVisibility = (id) => {
    const updated = tabsData[activeTab].map(p => p.id === id ? {...p, visible: !p.visible} : p);
    setTabsData({...tabsData, [activeTab]: updated});
  };

  const removeProduct = (id) => {
    setTabsData({...tabsData, [activeTab]: tabsData[activeTab].filter(p => p.id !== id)});
  };

  const handlePublish = () => {
    setIsUpdating(true);
    setTimeout(() => { setIsUpdating(false); alert("Storefront Updated! 🚀"); }, 2000);
  };

  return (

      <div className="bg-[#F1F5F9] min-h-screen p-4 md:p-8 font-sans">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">
              <Star size={14} fill="currentColor" /> Homepage Curation
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Featured Collections</h1>
            <p className="text-slate-500 text-sm font-medium">Control which products appear in your homepage tabs.</p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Discard</button>
            <button 
              onClick={handlePublish}
              className="flex-2 lg:px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all"
            >
              {isUpdating ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
              Publish Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT: MANAGEMENT PANEL */}
          <div className="col-span-12 xl:col-span-8 space-y-6">
            
            {/* TABS SELECTOR */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex gap-2">
              {Object.keys(tabsData).map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* PRODUCT LIST CARD */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600"><LayoutGrid size={18}/></div>
                  <span className="font-black text-slate-800 text-sm uppercase tracking-tight">{activeTab} Products</span>
                </div>
                <button className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg hover:bg-indigo-100 uppercase tracking-widest flex items-center gap-2">
                  <Plus size={14} /> Add Product
                </button>
              </div>

              <div className="divide-y divide-slate-50">
                {tabsData[activeTab].length > 0 ? tabsData[activeTab].map((product, idx) => (
                  <div key={product.id} className={`p-4 flex items-center justify-between group transition-all ${!product.visible ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-indigo-400 p-1"><GripVertical size={20} /></div>
                      <div className="relative">
                        <img src={product.img} className="w-16 h-16 rounded-2xl object-cover border border-slate-100" />
                        <span className="absolute -top-2 -left-2 bg-slate-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">{idx + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">${product.price}</span>
                          <span className={`text-[10px] font-bold uppercase ${product.stock < 10 ? 'text-rose-500' : 'text-emerald-500'}`}>Stock: {product.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleVisibility(product.id)}
                        className={`p-2.5 rounded-xl transition-all ${product.visible ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}
                      >
                        {product.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button 
                        onClick={() => removeProduct(product.id)}
                        className="p-2.5 bg-rose-50 text-rose-400 hover:text-rose-600 hover:bg-rose-100 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-20 text-center text-slate-400 italic font-medium">No products assigned. Click "Add Product" to start.</div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: LIVE PREVIEW SYSTEM */}
          <div className="col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-8 border-slate-800 relative">
              <div className="flex justify-center gap-4 mb-4">
                <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg ${previewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/40'}`}><Smartphone size={18}/></button>
                <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg ${previewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-white/40'}`}><Monitor size={18}/></button>
              </div>

              {/* MOCK SHOP INTERFACE */}
              <div className="bg-white rounded-[1.5rem] overflow-hidden min-h-[500px] flex flex-col">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <div className="w-20 h-3 bg-slate-100 rounded-full"></div>
                  <div className="w-6 h-6 bg-slate-100 rounded-full"></div>
                </div>
                
                <div className="p-4 flex-1">
                  <h5 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-4">Featured {activeTab}</h5>
                  <div className={`grid ${previewMode === 'mobile' ? 'grid-cols-2' : 'grid-cols-2'} gap-3`}>
                    {tabsData[activeTab].filter(p => p.visible).slice(0, 4).map(p => (
                      <div key={p.id} className="animate-in fade-in duration-500">
                        <div className="aspect-square bg-slate-50 rounded-xl overflow-hidden mb-2">
                          <img src={p.img} className="w-full h-full object-cover" />
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full mb-1"></div>
                        <div className="w-2/3 h-2 bg-slate-50 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-indigo-600 text-white text-[10px] font-black uppercase text-center tracking-widest">
                  Preview Only
                </div>
              </div>

              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-slate-700 rounded-l-md"></div>
            </div>

            {/* CURATION ANALYTICS */}
            <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
              <ArrowUpRight className="absolute -right-4 -top-4 text-white/10 group-hover:scale-150 transition-transform duration-700" size={120} />
              <h3 className="text-lg font-black mb-1 flex items-center gap-2">Smart Insights</h3>
              <p className="text-indigo-100 text-[11px] font-medium leading-relaxed mb-6">Trending products have a 45% higher click rate when placed in the top 2 slots.</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">CTR Rate</p>
                  <p className="text-xl font-black">12.4%</p>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-indigo-200 uppercase mb-1">Conversion</p>
                  <p className="text-xl font-black">3.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default FeaturedProducts;