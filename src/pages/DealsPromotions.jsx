import React, { useState, useRef } from 'react';
import { 
  Zap, TicketPercent, Image as ImageIcon, Plus, 
  Calendar, Trash2, Edit3, Link as LinkIcon, 
  ExternalLink, Clock, ChevronRight, LayoutPanelTop,
  MousePointer2, Save, RefreshCw, Sparkles
} from 'lucide-react';
 

const DealPromotions = () => {
  const [isSaving, setIsSaving] = useState(false);
  const bannerInputRef = useRef(null);
    
  // --- MOCK DATA FOR UI ---
  const [dealOfTheDay, setDealOfTheDay] = useState({
    product: "Sony WH-1000XM5 Headphones",
    discount: 30,
    start: "2026-03-06T12:00",
    end: "2026-03-07T12:00"
  });

  const [banners, setBanners] = useState([
    { id: 1, title: "Summer Collection Launch", link: "/collection/summer", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400" },
    { id: 2, title: "Tech Week - 50% Off", link: "/category/electronics", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400" }
  ]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Promotions Updated Successfully! 🚀");
    }, 2000);
  };

  return (

      <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-10 font-sans">
        
        {/* SYNC LOADER */}
        {isSaving && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
            <RefreshCw className="animate-spin text-blue-600 mb-4" size={48} />
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Syncing Storefront...</h2>
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-[0.25em]">
              <Sparkles size={14} /> Marketing Control Center
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Deals & Promotions</h1>
            <p className="text-slate-500 font-medium mt-1">Manage what your customers see on the homepage.</p>
          </div>
          <button 
            onClick={handleSave}
            className="w-full lg:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold shadow-2xl hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Update Storefront
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: FLASH DEALS & BANNERS */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* 1. DEALS OF THE DAY */}
            <PromotionCard title="Deals of the Day" icon={<Zap className="text-amber-500" size={18}/>} badge="Flash Sale">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <InputField label="Selected Product" value={dealOfTheDay.product} readOnly />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Discount (%)" type="number" value={dealOfTheDay.discount} />
                    <div className="flex items-end pb-1">
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-2 rounded-lg uppercase">Active Discount</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative">
                      <InputField label="Start Schedule" type="datetime-local" value={dealOfTheDay.start} />
                      <Calendar className="absolute right-4 bottom-4 text-slate-300" size={16} />
                    </div>
                    <div className="relative">
                      <InputField label="End Schedule" type="datetime-local" value={dealOfTheDay.end} />
                      <Clock className="absolute right-4 bottom-4 text-slate-300" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </PromotionCard>

            {/* 2. HOMEPAGE PROMOTIONAL BANNERS */}
            <PromotionCard title="Homepage Banners" icon={<LayoutPanelTop className="text-blue-500" size={18}/>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {banners.map((banner) => (
                  <div key={banner.id} className="group relative rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <div className="aspect-[21/9] overflow-hidden">
                      <img src={banner.img} alt="banner" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-5 bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-black text-slate-800">{banner.title}</h4>
                        <div className="flex gap-1">
                          <button className="p-2 text-slate-400 hover:text-blue-600 bg-slate-50 rounded-lg"><Edit3 size={14}/></button>
                          <button className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 rounded-lg"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 bg-blue-50 w-fit px-3 py-1 rounded-full uppercase">
                        <LinkIcon size={12}/> {banner.link}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* UPLOAD NEW BANNER SLOT */}
                <button 
                  onClick={() => bannerInputRef.current.click()}
                  className="aspect-[21/9] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-white hover:border-blue-400 hover:text-blue-600 transition-all group"
                >
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-all"><Plus /></div>
                  <span className="text-xs font-black uppercase tracking-widest">Add New Banner</span>
                </button>
              </div>
              <input type="file" hidden ref={bannerInputRef} />
            </PromotionCard>
          </div>

          {/* RIGHT COLUMN: SPECIAL OFFERS & ANALYTICS */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* SPECIAL OFFERS MANAGER */}
            <PromotionCard title="Special Offers" icon={<TicketPercent className="text-emerald-500" size={18}/>}>
              <div className="space-y-4">
                {['Buy 1 Get 1 Free', 'Holiday Special', 'New User Discount'].map((offer, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                        <MousePointer2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 tracking-tight">{offer}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Limited Time Only</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:text-blue-600 transition-all">
                  Create New Offer
                </button>
              </div>
            </PromotionCard>

            {/* CAMPAIGN INSIGHTS (Senior Addition) */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[32px] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
              <Sparkles className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-150 transition-transform duration-1000" size={120} />
              <h3 className="text-lg font-black mb-1">Campaign Insights</h3>
              <p className="text-blue-100 text-xs mb-6 leading-relaxed">Your "Tech Week" promotion has increased conversion by 24% this week.</p>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-blue-200">
                  <span>Reach Goal</span>
                  <span>84%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full w-[84%] shadow-[0_0_12px_rgba(255,255,255,0.6)]"></div>
                </div>
              </div>
              <button className="mt-8 w-full py-3 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-50 transition-all">
                View Full Report <ExternalLink size={14} />
              </button>
            </div>

          </div>
        </div>
      </div>
   
  );
};

// --- REUSABLE UI ATOMS ---

const PromotionCard = ({ title, icon, badge, children }) => (
  <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all">
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        {icon && <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>}
        <h2 className="text-xl font-black text-slate-800 tracking-tight">{title}</h2>
      </div>
      {badge && (
        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-orange-100">
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const InputField = ({ label, ...props }) => (
  <div className="w-full">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{label}</label>
    <input 
      {...props} 
      className="w-full p-4 bg-slate-50 border border-slate-50 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:bg-white focus:border-blue-200 transition-all text-sm font-bold text-slate-700 placeholder:font-medium" 
    />
  </div>
);

export default DealPromotions;