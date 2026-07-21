import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Download, 
  Filter, 
  Mail, 
  Phone, 
  Sparkles, 
  MessageCircle, 
  Tag,
  AlertCircle,
  MoreVertical,
  Loader2,
  Trash2,
  X 
} from 'lucide-react';
import { getAllInquiries, updateInquiryStatus, deleteInquiry } from "../lib/inqury"; 

export default function WebsiteLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  
  const [openMenuId, setOpenMenuId] = useState(null); 
  
  // Custom Confirmation Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);

  useEffect(() => {
    fetchInquiries();
    
    const handleOutsideClick = () => setOpenMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllInquiries();
      const fetchedData = response.data || response; 
      setLeads(Array.isArray(fetchedData) ? fetchedData : []);
    } catch (err) {
      setError(err.message || "Failed to load organic website inquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId, newStatus) => {
    const previousLeads = [...leads];
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        (lead._id === leadId || lead.id === leadId) ? { ...lead, status: newStatus } : lead
      )
    );

    try {
      await updateInquiryStatus(leadId, newStatus);
    } catch (err) {
      alert(`Error updating status: ${err.message}`);
      setLeads(previousLeads);
    }
  };

  const openDeleteConfirmation = (leadId) => {
    setLeadToDelete(leadId);
    setIsModalOpen(true);
    setOpenMenuId(null); 
  };

  const confirmDeleteLead = async () => {
    if (!leadToDelete) return;

    const leadId = leadToDelete;
    const previousLeads = [...leads];
    
    // Optimistic UI update
    setLeads(prevLeads => prevLeads.filter(lead => lead._id !== leadId && lead.id !== leadId));
    setIsModalOpen(false);
    setLeadToDelete(null);

    try {
      await deleteInquiry(leadId);
    } catch (err) {
      alert(`Error deleting record: ${err.message}`);
      setLeads(previousLeads);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const name = lead.name || "";
    const email = lead.email || "";
    const phone = lead.mobile || lead.phone || ""; 
    const product = lead.productType || lead.preferredProduct || "";
    const source = lead.source || "Contact Form"; 
    const status = lead.status || "New";

    const matchesSearch = 
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm);
    
    const matchesSource = selectedSource === "All" || source === selectedSource;
    const matchesStatus = selectedStatus === "All" || status === selectedStatus;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const getSourceBadge = (source) => {
    const badges = {
      "Contact Form": "bg-purple-50 text-purple-700 border-purple-100",
      "Pop-up Discount": "bg-blue-50 text-blue-700 border-blue-100",
      "Stock Alert": "bg-amber-50 text-amber-700 border-amber-100"
    };
    return `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badges[source] || "bg-slate-50 text-slate-700"}`;
  };

  const getStatusSelectClass = (status) => {
    const styles = {
      New: "bg-blue-50/70 text-blue-700 border-blue-200 focus:ring-blue-500/10",
      Contacted: "bg-amber-50/70 text-amber-700 border-amber-200 focus:ring-amber-500/10",
      Converted: "bg-emerald-50/70 text-emerald-700 border-emerald-200 focus:ring-emerald-500/10",
      Ignored: "bg-slate-50 text-slate-500 border-slate-200 focus:ring-slate-500/5",
    };
    return `px-2 py-1 rounded-lg text-xs font-bold border transition-all focus:outline-none focus:ring-2 cursor-pointer ${styles[status] || styles.New}`;
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    const headers = ["ID", "Name", "Email", "Phone", "Source", "Preferred Product", "Message", "Date", "Status\n"];
    const rows = filteredLeads.map((lead, index) => [
      lead._id || lead.id || `WB-${index}`,
      `"${lead.name || ''}"`,
      lead.email || '',
      lead.mobile || lead.phone || '',
      lead.source || 'Contact Form',
      `"${lead.productType || lead.preferredProduct || ''}"`,
      `"${(lead.message || '').replace(/"/g, '""')}"`,
      lead.createdAt ? new Date(lead.createdAt).toISOString().split('T')[0] : lead.date || '',
      lead.status || 'New\n'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PlantPure_Leads_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6  animate-in fade-in duration-300 relative">
      
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

        {/* <button 
          onClick={exportToCSV}
          disabled={filteredLeads.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold shadow-xs transition-all active:scale-95"
        >
          <Download size={14} />
          <span>Export CSV</span>
        </button> */}
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
              {leads.filter(l => (l.source || "Contact Form") === "Contact Form").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center border border-purple-100">
            <AlertCircle size={20} />
          </div>
        </div>

        {/* <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Discount pop-up</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.filter(l => l.source === "Pop-up Discount").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
            <Tag size={20} />
          </div>
        </div> */}

        {/* <div className="bg-white border border-slate-100 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stock Alerts</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">
              {leads.filter(l => l.source === "Stock Alert").length}
            </h3>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center border border-amber-100">
            <Sparkles size={20} />
          </div>
        </div> */}
      </div>

      {/* 3. Filters Box */}
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

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            {/* <Filter size={14} className="text-slate-400" /> */}
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

          {/* <div className="flex items-center gap-1.5">
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
          </div> */}
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
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-400 text-xs font-semibold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 size={24} className="animate-spin text-emerald-600" />
                      <span>Fetching database inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-red-500 text-xs font-semibold">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <AlertCircle size={22} />
                      <span>{error}</span>
                      <button 
                        onClick={fetchInquiries} 
                        className="mt-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-[11px]"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead, idx) => {
                  const currentId = lead._id || lead.id || `lead-${idx}`;
                  const currentName = lead.name || "Unknown Customer";
                  const currentEmail = lead.email || "No Email Provided";
                  const currentPhone = lead.mobile || lead.phone || "";
                  const currentSource = lead.source || "Contact Form";
                  const currentProduct = lead.productType || lead.preferredProduct || "General Inquiry";
                  const currentMessage = lead.message || "";
                  const currentDate = lead.createdAt || lead.date || new Date();
                  const currentStatus = lead.status || "New";

                  return (
                    <tr key={currentId} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4 pl-5">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0 border border-slate-200/50 mt-0.5">
                            {currentName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">{currentName}</h4>
                            <div className="flex flex-col gap-1 mt-1 text-[11px] text-slate-500 font-semibold">
                              <span className="flex items-center gap-1">
                                <Mail size={12} className="text-slate-400 shrink-0" />
                                {currentEmail}
                              </span>
                              {currentPhone && (
                                <span className="flex items-center gap-1">
                                  <Phone size={12} className="text-slate-400 shrink-0" />
                                  {currentPhone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className={getSourceBadge(currentSource)}>
                          {currentSource}
                        </span>
                      </td>

                      <td className="p-4 max-w-xs">
                        <div>
                          <span className="inline-block text-[9px] font-black text-emerald-600 uppercase tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded-md mb-1">
                            {currentProduct}
                          </span>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-normal italic" title={currentMessage}>
                            {currentMessage ? `"${currentMessage}"` : "No descriptive message provided."}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-500">
                          {new Date(currentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>

                      <td className="p-4">
                        <form onSubmit={(e) => e.preventDefault()} className="inline-block">
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStatusChange(currentId, e.target.value)}
                            className={getStatusSelectClass(currentStatus)}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Converted">Converted</option>
                            <option value="Ignored">Ignored</option>
                          </select>
                        </form>
                      </td>

                      {/* Immediate Connect & Options Actions */}
                      <td className="p-4 pr-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {currentPhone ? (
                            <a 
                              href={`https://wa.me/${currentPhone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(currentName)},%20thanks%20for%20contacting%20us%20on%20PlantPure.in%20regarding%20${encodeURIComponent(currentProduct)}!%20How%20can%20we%20help%20you?`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </a>
                          ) : (
                            <div className="p-1.5 text-slate-300 cursor-not-allowed" title="No phone provided">
                              <MessageCircle size={16} />
                            </div>
                          )}

                          <a 
                            href={`mailto:${currentEmail}?subject=PlantPure.in%20Inquiry%20-%20${encodeURIComponent(currentProduct)}&body=Hi%20${encodeURIComponent(currentName)},%20thank%20you%20for%20visiting%20PlantPure!`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                            title="Send Email"
                          >
                            <Mail size={16} />
                          </a>
                          
                          {/* Three-Dot Menu Button and Dropdown Container */}
                          <div className="relative inline-block text-left">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents triggering the window outside-click handler
                                setOpenMenuId(openMenuId === currentId ? null : currentId);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-all focus:outline-none"
                            >
                              <MoreVertical size={14} />
                            </button>

                            {/* Active Action Menu Dropdown */}
                            {openMenuId === currentId && (
                              <div className="absolute right-0 mt-1 w-28 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                  onClick={() => openDeleteConfirmation(currentId)}
                                  className="w-full text-left px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                  <Trash2 size={13} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  );
                })
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

      {/* 5. Custom Confirmation Alert Box (Modal Overlay) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                <AlertCircle size={16} />
                <span>Confirm Action</span>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Modal Content Body */}
            <div className="p-5">
              <h3 className="text-sm font-bold text-slate-900 leading-snug">Are you absolutely sure you want to delete this lead?</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">This record will be permanently wiped out from the database. This action cannot be undone.</p>
            </div>
            
            {/* Modal Footer Buttons */}
            <div className="flex items-center justify-end gap-2 p-3 bg-slate-50/70 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteLead}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Trash2 size={13} />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}