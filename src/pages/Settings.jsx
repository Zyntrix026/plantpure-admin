import React, { useState } from 'react';
import { 
  User, Bell, Lock, ShieldCheck, Globe, Mail, Camera, Save, 
  ChevronRight, CreditCard, Truck, Settings as ToolIcon,
  CloudLightning, Landmark, CheckCircle2, Server, Trash2
} from 'lucide-react';


const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const menuItems = [
    { id: 'profile', label: 'Public Profile', icon: <User size={18} /> },
    { id: 'general', label: 'General Settings', icon: <Globe size={18} /> },
    { id: 'email', label: 'Email (SMTP)', icon: <Server size={18} /> },
    { id: 'payment', label: 'Payment Gateways', icon: <CreditCard size={18} /> },
    { id: 'shipping', label: 'Shipping & Tax', icon: <Truck size={18} /> },
    { id: 'security', label: 'Security', icon: <ShieldCheck size={18} /> },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings Updated Successfully! 🚀");
    }, 1000);
  };

  return ( 
      <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen font-sans text-[#1a1a1a]">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-[32px] font-black tracking-tight text-slate-900">Settings</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Configure your global website parameters and API keys.</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-3 bg-
          primary text-white rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            {isSaving ? "Saving..." : <><Save size={18} /> Save All Changes</>}
          </button>
      </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="w-full lg:w-72 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[14px] font-bold transition-all border-2 ${
                  activeTab === item.id 
                  ? 'bg-white border-blue-600 text-blue-600 shadow-xl shadow-blue-50 scale-[1.02]' 
                  : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200/50'
                }`}
              >
                <span className={`${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}>{item.icon}</span>
                {item.label}
                {activeTab !== item.id && <ChevronRight size={14} className="ml-auto opacity-30" />}
              </button>
            ))}
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
            <div className="p-8 md:p-12">

              {/* 1. GENERAL SETTINGS */}
              {activeTab === 'general' && (
                <div className="animate-in fade-in duration-500">
                  <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><Globe className="text-blue-600"/> General Website Config</h2>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Website Name</label>
                        <input type="text" defaultValue="Gemini Store Pro" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Support Email</label>
                        <input type="email" defaultValue="support@geministore.com" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Website Logo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm"><ToolIcon className="text-slate-200"/></div>
                          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-slate-100 transition-all">Upload New</button>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Favicon (32x32)</label>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm"><Globe className="text-slate-200" size={18}/></div>
                          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-tight hover:bg-slate-100 transition-all">Change Icon</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. EMAIL (SMTP) SETTINGS */}
              {activeTab === 'email' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black flex items-center gap-3"><Server className="text-indigo-600"/> SMTP Configuration</h2>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg uppercase">Status: Connected</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">SMTP Host</label>
                      <input type="text" defaultValue="smtp.sendgrid.net" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Port</label>
                      <input type="text" defaultValue="587" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Username</label>
                      <input type="text" defaultValue="apikey" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                      <input type="password" defaultValue="••••••••••••" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none" />
                    </div>
                  </div>
                  <button className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Test Connection</button>
                </div>
              )}

              {/* 3. PAYMENT SETTINGS */}
              {activeTab === 'payment' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><CreditCard className="text-emerald-600"/> Payment Gateways</h2>
                  
                  <div className="space-y-6">
                    {/* Stripe Card */}
                    <div className="p-8 bg-gradient-to-br from-indigo-50 to-white rounded-[2rem] border border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-100">S</div>
                        <div>
                          <h4 className="font-black text-slate-800 tracking-tight text-lg">Stripe Payments</h4>
                          <p className="text-xs text-slate-500 font-medium">Accept Credit Cards & Apple Pay globally.</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <input type="password" value="sk_test_51Mz..." readOnly className="px-4 py-2 bg-white border border-indigo-100 rounded-xl text-xs font-mono w-40" />
                        <button className="px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Configure</button>
                      </div>
                    </div>

                    {/* Razorpay Card */}
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-[2rem] border border-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-blue-500 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-100">R</div>
                        <div>
                          <h4 className="font-black text-slate-800 tracking-tight text-lg">Razorpay (India)</h4>
                          <p className="text-xs text-slate-500 font-medium">UPI, NetBanking, and Local Wallets.</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Enable Now</button>
                    </div>

                    {/* PayPal Card */}
                    <div className="p-8 bg-gradient-to-br from-slate-50 to-white rounded-[2rem] border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-5 opacity-60">
                        <div className="w-14 h-14 bg-slate-400 text-white rounded-2xl flex items-center justify-center font-black text-xl">P</div>
                        <div>
                          <h4 className="font-black text-slate-800 tracking-tight text-lg">PayPal Pro</h4>
                          <p className="text-xs text-slate-500 font-medium">Classic PayPal express checkout.</p>
                        </div>
                      </div>
                      <button className="px-6 py-2 bg-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed">Disabled</button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. SHIPPING SETTINGS */}
              {activeTab === 'shipping' && (
                <div className="animate-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-2xl font-black mb-8 flex items-center gap-3"><Truck className="text-orange-600"/> Shipping Rates</h2>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <CheckCircle2 className="text-emerald-500" size={20}/>
                          <div>
                            <p className="text-sm font-black text-slate-800">Standard Delivery</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Estimated 3-5 Business Days</p>
                          </div>
                        </div>
                        <input type="text" defaultValue="$5.00" className="w-24 px-3 py-2 bg-slate-50 border rounded-xl text-sm font-black text-right outline-none focus:border-orange-400" />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <CloudLightning className="text-indigo-500" size={20}/>
                          <div>
                            <p className="text-sm font-black text-slate-800">Express Shipping</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Next Day Delivery</p>
                          </div>
                        </div>
                        <input type="text" defaultValue="$15.00" className="w-24 px-3 py-2 bg-slate-50 border rounded-xl text-sm font-black text-right outline-none focus:border-orange-400" />
                      </div>
                    </div>
                    <button className="mt-8 w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">+ Add New Shipping Zone</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    
  );
};

export default Settings;