import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Download, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  Sparkles, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Tag,
  AlertCircle,
  MoreVertical
} from 'lucide-react';

export default function WebsiteLeads() {
  // plantpure.in Website Leads
  const [leads, setLeads] = useState([
    {
      id: "WB-901",
      name: "Rohan Verma",
      email: "rohan.verma@gmail.com",
      phone: "+91 91234 56789",
      source: "Contact Form", 
      message: "Is Moringa Oil safe for dry scalp? How long does shipping take to Mumbai?",
      date: "2026-07-15",
      status: "New", 
      preferredProduct: "Moringa Oil"
    },
    {
      id: "WB-902",
      name: "Anjali Gupta",
      email: "anjali.g@yahoo.com",
      phone: "+91 98123 45670",
      source: "Pop-up Discount", 
      message: "Claimed 10% OFF coupon code: PLANTPURE10",
      date: "2026-07-15",
      status: "Converted",
      preferredProduct: "Natural Hair Coloring Kit"
    },
    {
      id: "WB-903",
      name: "Meera Nair",
      email: "meera.nair@outlook.com",
      phone: "+91 88990 11223",
      source: "Stock Alert", 
      message: "Subscribed to restock alert for Hibiscus Flower Oil",
      date: "2026-07-14",
      status: "Contacted",
      preferredProduct: "Hibiscus Flower Oil"
    },
    {
      id: "WB-904",
      name: "Devendra Singh",
      email: "dev.singh@gmail.com",
      phone: "+91 70123 98765",
      source: "Contact Form",
      message: "Looking to buy Organic Jojoba Seed Oil in bulk (10+ units) for my salon.",
      date: "2026-07-12",
      status: "New",
      preferredProduct: "Organic Cold-Pressed Jojoba Seed Oil"
    },
    {
      id: "WB-905",
      name: "Karan Malhotra",
      email: "karan.m@gmail.com",
      phone: "+91 95554 32100",
      source: "Pop-up Discount",
      message: "Claimed 10% OFF coupon code: PLANTPURE10",
      date: "2026-07-10",
      status: "Ignored",
      preferredProduct: "Color Secure Hair Cleanser"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Handler to update status dynamically
  const handleStatusChange = (leadId, newStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  // Filter Logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.preferredProduct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesSource = selectedSource === "All" || lead.source === selectedSource;
    const matchesStatus = selectedStatus === "All" || lead.status === selectedStatus;

    return matchesSearch && matchesSource && matchesStatus;
  });

  // Source Badge Styling
  const getSourceBadge = (source) => {
    const badges = {
      "Contact Form": "bg-purple-50 text-purple-700 border-purple-100",
      "Pop-up Discount": "bg-blue-50 text-blue-700 border-blue-100",
      "Stock Alert": "bg-amber-50 text-amber-700 border-amber-100"
    };
    return `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badges[source] || "bg-slate-50 text-slate-700"}`;
  };

  // Clean Status dropdown styling
  const getStatusSelectClass = (status) => {
    const styles = {
      New: "bg-blue-50/70 text-blue-700 border-blue-200 focus:ring-blue-500/10",
      Contacted: "bg-amber-50/70 text-amber-700 border-amber-200 focus:ring-amber-500/10",
      Converted: "bg-emerald-50/70 text-emerald-700 border-emerald-200 focus:ring-emerald-500/10",
      Ignored: "bg-slate-50 text-slate-500 border-slate-200 focus:ring-slate-500/5",
    };
    return `px-2 py-1 rounded-lg text-xs font-bold border transition-all focus:outline-none focus:ring-2 cursor-pointer ${styles[status]}`;
  };

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-300">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm mb-1">
            <Globe size={16} />
            <span>plantpure.in Website Traffic</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Website Organic Leads</h2>
          <p className="text-sm text-slate-500 mt-0.5">Manage inquiries coming directly from contact forms, discounts, and stock notifications.</p>
        </div>

        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95">
          <Download size={14} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 2. Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Web Leads</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{leads.length}</h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
            <Globe size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact Form</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.filter(l => l.source === "Contact Form").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discount pop-up</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.filter(l => l.source === "Pop-up Discount").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
            <Tag size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stock Alerts</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.filter(l => l.source === "Stock Alert").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-100">
            <Sparkles size={20} />
          </div>
        </div>

      </div>

      {/* 3. Filters Box */}
      <div className="bg-white border border-slate-100 p-3.5 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            type="text" 
            placeholder="Search details..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-slate-50/50"
          />
        </div>

        {/* Dynamic Select Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-slate-400" />
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-slate-50/50 cursor-pointer focus:outline-none"
            >
              <option value="All">All Sources</option>
              <option value="Contact Form">Contact Form</option>
              <option value="Pop-up Discount">Pop-up Discount</option>
              <option value="Stock Alert">Stock Alert</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-slate-50/50 cursor-pointer focus:outline-none"
            >
              <option value="All">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Converted">Converted</option>
              <option value="Ignored">Ignored</option>
            </select>
          </div>

        </div>

      </div>

      {/* 4. Leads Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 pl-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Customer Details</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Lead Source</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Inquiry details</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Update</th>
                <th className="p-4 pr-5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Connect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* Customer Personal Details (VERTICALLY STACKED Mail & Phone & Decreased font size) */}
                    <td className="p-4 pl-5">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 border border-slate-200/50 mt-0.5">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{lead.name}</h4>
                          {/* Vertical Column for Contact Credentials with Decreased Size (text-[11px]) */}
                          <div className="flex flex-col gap-1 mt-1 text-[11px] text-slate-500 font-semibold">
                            <span className="flex items-center gap-1">
                              <Mail size={12} className="text-slate-400 shrink-0" />
                              {lead.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-slate-400 shrink-0" />
                              {lead.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Lead Source Type */}
                    <td className="p-4 whitespace-nowrap">
                      <span className={getSourceBadge(lead.source)}>
                        {lead.source}
                      </span>
                    </td>

                    {/* Customer Custom Message/Log (Decreased text-xs size) */}
                    <td className="p-4 max-w-xs">
                      <div>
                        <span className="inline-block text-[9px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded-md mb-1">
                          {lead.preferredProduct}
                        </span>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-normal italic" title={lead.message}>
                          "{lead.message}"
                        </p>
                      </div>
                    </td>

                    {/* Received Date */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-500">
                        {new Date(lead.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    {/* Select Form Status */}
                    <td className="p-4">
                      <form onSubmit={(e) => e.preventDefault()} className="inline-block">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={getStatusSelectClass(lead.status)}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Ignored">Ignored</option>
                        </select>
                      </form>
                    </td>

                    {/* Immediate Connect Actions */}
                    <td className="p-4 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* WhatsApp Connection */}
                        <a 
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thanks%20for%20contacting%20us%20on%20PlantPure.in%20regarding%20${encodeURIComponent(lead.preferredProduct)}!%20How%20can%20we%20help%20you?`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                          title="Chat on WhatsApp"
                        >
                          <MessageCircle size={16} />
                        </a>

                        {/* Email Connection */}
                        <a 
                          href={`mailto:${lead.email}?subject=PlantPure.in%20Inquiry%20-%20${encodeURIComponent(lead.preferredProduct)}&body=Hi%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20visiting%20PlantPure!`}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                          title="Send Email"
                        >
                          <Mail size={16} />
                        </a>
                        
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-all">
                          <MoreVertical size={14} />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 text-xs font-semibold">
                    No matching website organic leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}