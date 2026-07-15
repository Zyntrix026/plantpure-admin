import React, { useState } from 'react';
import { 
  Facebook, 
  Search, 
  Download, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowUpRight, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  MoreVertical,
  ShoppingBag
} from 'lucide-react';

export default function FacebookLeads() {
  // plantpure.in Products aligned with real Lead inquiries
  const [leads, setLeads] = useState([
    {
      id: "FB-801",
      name: "Amit Sharma",
      email: "amit.sharma@example.com",
      phone: "+91 98765 43210",
      productInquired: "Moringa Oil",
      sku: "PLANTPURE-MORING-1470",
      date: "2026-07-15",
      status: "New", // New, Contacted, Converted, Spam
      price: "₹350"
    },
    {
      id: "FB-802",
      name: "Sneha Patel",
      email: "sneha.patel@example.com",
      phone: "+91 87654 32109",
      productInquired: "Hibiscus Flower Oil",
      sku: "PLANTPURE-HIBISC-3181",
      date: "2026-07-14",
      status: "Contacted",
      price: "₹680"
    },
    {
      id: "FB-803",
      name: "Vikram Malhotra",
      email: "vikram.m@example.com",
      phone: "+91 76543 21098",
      productInquired: "Organic Cold-Pressed Jojoba Seed Oil",
      sku: "PLANTPURE-ORGANI-5108",
      date: "2026-07-14",
      status: "Converted",
      price: "₹375"
    },
    {
      id: "FB-804",
      name: "Priyanka Sen",
      email: "priyanka.sen@example.com",
      phone: "+91 99887 76655",
      productInquired: "Color Secure Hair Cleanser",
      sku: "PLANTPURE-COLOR-9170",
      date: "2026-07-12",
      status: "Spam",
      price: "₹339"
    },
    {
      id: "FB-805",
      name: "Rajesh Kumar",
      email: "rajesh.k@example.com",
      phone: "+91 94432 12345",
      productInquired: "Natural Hair Coloring Kit",
      sku: "PLANTPURE-NATURA-7866",
      date: "2026-07-10",
      status: "Converted",
      price: "₹680"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Handler to change lead status directly from the table row
  const handleStatusChange = (leadId, newStatus) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
  };

  // Filter Search & Dropdown logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.productInquired.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm);
    
    const matchesStatus = selectedStatus === "All" || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Clean Status dropdown styling (Compact and balanced)
  const getStatusSelectClass = (status) => {
    const styles = {
      New: "bg-blue-50/70 text-blue-700 border-blue-200 focus:ring-blue-500/10",
      Contacted: "bg-amber-50/70 text-amber-700 border-amber-200 focus:ring-amber-500/10",
      Converted: "bg-emerald-50/70 text-emerald-700 border-emerald-200 focus:ring-emerald-500/10",
      Spam: "bg-rose-50/70 text-rose-700 border-rose-200 focus:ring-rose-500/10",
    };
    return `px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all focus:outline-none focus:ring-2 cursor-pointer ${styles[status]}`;
  };

  return (
    <div className="space-y-6 p-1 animate-in fade-in duration-300">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-blue-600 font-bold text-sm mb-1">
            <Facebook size={16} className="fill-blue-600" />
            <span>plantpure.in Lead Manager</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Facebook Campaign Leads</h2>
          <p className="text-sm text-slate-500 mt-0.5">Track and manage leads interested in PlantPure Organic Oils and Natural Hair Kits.</p>
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
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{leads.length}</h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
            <Facebook size={20} className="fill-blue-50" />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New Inquiries</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.filter(l => l.status === "New").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center border border-sky-100">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Converted Sales</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.filter(l => l.status === "Converted").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center border border-emerald-100">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Conversion Ratio</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.length > 0 ? `${Math.round((leads.filter(l => l.status === "Converted").length / leads.length) * 100)}%` : '0%'}
            </h3>
          </div>
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center border border-indigo-100">
            <ArrowUpRight size={20} />
          </div>
        </div>

      </div>

      {/* 3. Real-Time Filters */}
      <div className="bg-white border border-slate-100 p-3.5 rounded-xl flex flex-col md:flex-row gap-3 items-center justify-between">
        
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

        <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
          <Filter size={14} className="text-slate-400" />
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold bg-slate-50/50 cursor-pointer focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Spam">Spam</option>
          </select>
        </div>

      </div>

      {/* 4. Leads Dynamic Table */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 pl-5 text-[10px] font-black text-slate-400 uppercase tracking-wider">Lead Contact Details</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Product Interested</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date Received</th>
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Update</th>
                <th className="p-4 pr-5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">
                    
                    {/* User and contact credentials (VERTICALLY STACKED & Decreased font size) */}
                    <td className="p-4 pl-5">
                      <div className="flex items-start gap-3">
                        <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 border border-slate-200/50 mt-0.5">
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{lead.name}</h4>
                          {/* Vertically Stacked Contact info with size text-[11px] */}
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

                    {/* PlantPure Product Focus (Decreased text-xs size) */}
                    <td className="p-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 bg-slate-50 rounded-md border border-slate-100 text-slate-400 mt-0.5 shrink-0">
                          <ShoppingBag size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{lead.productInquired}</p>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                            {lead.sku} • <span className="text-slate-600 font-extrabold">{lead.price}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Receipt Date */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        {new Date(lead.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>

                    {/* In-line Status Form (Balanced Dropdown) */}
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
                          <option value="Spam">Spam</option>
                        </select>
                      </form>
                    </td>

                    {/* CRM Quick Actions */}
                    <td className="p-4 pr-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp CTA */}
                        <a 
                          href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name)},%20thanks%20for%20inquiring%20about%20our%20${encodeURIComponent(lead.productInquired)}%20on%20PlantPure.in!%20How%20can%20we%20help%20you%20today?`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                          title="Contact via WhatsApp"
                        >
                          <MessageCircle size={17} />
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
                  <td colSpan="5" className="p-12 text-center text-slate-400 text-xs font-semibold">
                    No matching Facebook leads found for PlantPure.in.
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