import React, { useState, useMemo } from 'react';
import { 
  Mail, Download, Search, Trash2, 
  Calendar, ArrowUpRight, Filter, 
  UserPlus, MousePointer2, CheckCircle, 
  RefreshCw, MoreVertical, X 
} from 'lucide-react';


const Subscribers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // --- 1. MOCK DATA (Industry Grade) ---
  const [subscribers, setSubscribers] = useState([
    { id: 1, email: "michael.jenkins@gmail.com", date: "2026-03-05", source: "Homepage Popup", status: "Active" },
    { id: 2, email: "sara.ahmed@yahoo.com", date: "2026-03-04", source: "Footer Form", status: "Active" },
    { id: 3, email: "zoya.malik@outlook.com", date: "2026-03-02", source: "Checkout Page", status: "Unsubscribed" },
    { id: 4, email: "ahmed.raza@tech.co", date: "2026-02-28", source: "Discount Wheel", status: "Active" },
    { id: 5, email: "vibor.igor@sni.it", date: "2026-02-25", source: "Homepage Popup", status: "Active" },
  ]);

  // --- 2. ACTIONS ---
  const handleExport = () => {
    setIsExporting(true);
    // Simulating CSV Export
    setTimeout(() => {
      setIsExporting(false);
      alert("Subscriber list exported as CSV! 📥");
    }, 1500);
  };

  const removeSubscriber = (id) => {
    if(window.confirm("Remove this email from mailing list?")) {
      setSubscribers(subscribers.filter(s => s.id !== id));
    }
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s => 
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, subscribers]);

  const stats = [
    { label: "Total Subscribers", value: "8,420", growth: "+12%", icon: <UserPlus size={20}/> },
    { label: "Conversion Rate", value: "3.2%", growth: "+0.5%", icon: <MousePointer2 size={20}/> },
    { label: "Active Subs", value: "7,810", growth: "+8%", icon: <CheckCircle size={20}/> },
  ];

  return (
    
      <div className="p-6 md:p-10 bg-[#FAFBFE] min-h-screen font-sans">
        
        {/* TOP ANALYTICS & HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-10 gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mailing List</h1>
            <p className="text-slate-500 font-medium mt-1">Manage your email community and export marketing data.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col min-w-[160px]">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-indigo-600 bg-indigo-50 p-2 rounded-xl">{s.icon}</div>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">{s.growth}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-xl font-black text-slate-900 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN UTILITY BAR */}
        <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={18} />
            <input 
              type="text" 
              placeholder="Search by email address..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 focus:bg-white transition-all outline-none"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:px-6 py-3.5 bg-slate-50 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100">
              <Filter size={16}/> Filter
            </button>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex-2 md:px-8 py-3.5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
            >
              {isExporting ? <RefreshCw className="animate-spin" size={16}/> : <Download size={16}/>}
              {isExporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        </div>

        {/* SUBSCRIBERS TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Subscriber Email</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Subscription Date</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Acquisition Source</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-slate-50/50 transition-all">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Mail size={18} />
                        </div>
                        <span className="text-sm font-black text-slate-800 tracking-tight">{sub.email}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-500 font-medium text-xs uppercase tracking-tight">
                        <Calendar size={14} className="text-slate-300"/> {sub.date}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-1.5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-widest border border-slate-200">
                          {sub.source}
                        </span>
                        <ArrowUpRight size={12} className="text-slate-300"/>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                        sub.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-400 border-rose-100'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2.5 text-slate-300 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm">
                          <MoreVertical size={18}/>
                        </button>
                        <button 
                          onClick={() => removeSubscriber(sub.id)}
                          className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* EMPTY STATE */}
          {filteredSubscribers.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex p-6 bg-slate-50 rounded-full text-slate-200 mb-4 animate-bounce"><Mail size={48}/></div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">No results found</h3>
              <p className="text-slate-400 font-medium">Try searching with a different email or check filters.</p>
            </div>
          )}
        </div>
      </div>

  );
};

export default Subscribers;