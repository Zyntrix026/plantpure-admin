import React, { useState, useMemo } from 'react';
import { 
  Mail, Send, Trash2, Search, Filter, 
  User, Clock, ChevronRight, Inbox, 
  Archive, AlertCircle, CheckCircle2, 
  Reply, MoreVertical, X, Paperclip
} from 'lucide-react';


const ContactMessages = () => {
  const [activeTab, setActiveTab] = useState("Unread");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState("");

  // --- 1. MOCK DATA (High Fidelity) ---
  const [messages, setMessages] = useState([
    { 
      id: 1, name: "Arjun Sharma", email: "arjun.s@outlook.com", 
      subject: "Bulk Order Inquiry", status: "Unread", date: "2026-03-06", time: "10:30 AM",
      message: "Hi, I'm looking to order 50 units of the Mechanical Keyboard for my office. Do you offer corporate discounts? Looking forward to your response.",
      replied: false
    },
    { 
      id: 2, name: "Jessica Lee", email: "jess.lee@gmail.com", 
      subject: "Shipping Delay - #ORD-9921", status: "Read", date: "2026-03-05", time: "02:15 PM",
      message: "My order was supposed to arrive yesterday. The tracking says it's still in the warehouse. Can you please check?",
      replied: true,
      lastReply: "Our team is looking into this. You will get an update in 2 hours."
    },
    { 
      id: 3, name: "Rahul Verma", email: "rahul.v@tech.in", 
      subject: "Partnership Proposal", status: "Unread", date: "2026-03-04", time: "09:00 AM",
      message: "We are interested in featuring your products on our tech blog. Who should we contact for marketing collaborations?",
      replied: false
    }
  ]);

  // --- 2. LOGIC ---
  const filteredMessages = useMemo(() => {
    return messages.filter(m => {
      const matchesTab = activeTab === "All" || (activeTab === "Unread" ? m.status === "Unread" : m.replied);
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, messages]);

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    setMessages(messages.map(m => 
      m.id === selectedMsg.id ? { ...m, replied: true, status: "Read", lastReply: replyText } : m
    ));
    setReplyText("");
    alert(`Reply sent to ${selectedMsg.email}! 🚀`);
  };

  const deleteMessage = (id) => {
    if(window.confirm("Delete this conversation permanently?")) {
      setMessages(messages.filter(m => m.id !== id));
      if(selectedMsg?.id === id) setSelectedMsg(null);
    }
  };

  return (

      <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden m-4 md:m-8 font-sans">
        
        {/* TOP TOOLBAR */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
              <Inbox className="text-blue-600" size={24}/> Support Inbox
            </h1>
            <div className="flex bg-white p-1 rounded-xl border border-slate-200">
              {["Unread", "Replied", "All"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500" size={18} />
            <input 
              type="text" 
              placeholder="Search sender or subject..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          
          {/* LEFT LIST PANEL */}
          <div className="w-full md:w-[400px] border-r border-slate-100 overflow-y-auto bg-white custom-scrollbar">
            {filteredMessages.length > 0 ? filteredMessages.map((m) => (
              <div 
                key={m.id}
                onClick={() => {
                  setSelectedMsg(m);
                  if(m.status === "Unread") setMessages(messages.map(msg => msg.id === m.id ? {...msg, status: "Read"} : msg));
                }}
                className={`p-6 border-b border-slate-50 cursor-pointer transition-all hover:bg-slate-50 relative group ${
                  selectedMsg?.id === m.id ? "bg-blue-50/50 border-r-4 border-r-blue-600" : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${m.status === 'Unread' ? 'text-blue-600' : 'text-slate-400'}`}>
                    {m.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{m.date}</span>
                </div>
                <h3 className={`text-sm tracking-tight mb-1 truncate ${m.status === 'Unread' ? 'font-black text-slate-900' : 'font-bold text-slate-600'}`}>
                  {m.subject}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate">{m.name} • {m.email}</p>
                {m.replied && <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase tracking-widest"><CheckCircle2 size={10}/> Replied</div>}
              </div>
            )) : (
              <div className="p-20 text-center text-slate-300">
                <Archive size={48} className="mx-auto mb-4 opacity-20"/>
                <p className="text-sm font-black uppercase tracking-widest">Inbox Empty</p>
              </div>
            )}
          </div>

          {/* RIGHT DETAIL PANEL */}
          <div className="hidden md:flex flex-1 flex-col bg-slate-50/30">
            {selectedMsg ? (
              <div className="flex flex-col h-full animate-in fade-in duration-300">
                
                {/* Header Info */}
                <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-blue-100">
                      {selectedMsg.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">{selectedMsg.subject}</h2>
                      <p className="text-sm font-bold text-slate-500 mt-1">From: {selectedMsg.name} <span className="text-blue-500">&lt;{selectedMsg.email}&gt;</span></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteMessage(selectedMsg.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={20}/>
                  </button>
                </div>

                {/* Message Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm max-w-3xl">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <Clock size={12}/> Received at {selectedMsg.time}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed font-medium">
                      {selectedMsg.message}
                    </p>
                  </div>

                  {selectedMsg.replied && (
                    <div className="flex justify-end animate-in slide-in-from-right duration-300">
                      <div className="bg-slate-900 text-slate-100 p-6 rounded-[2rem] rounded-tr-none shadow-xl max-w-xl">
                        <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                          <Reply size={12}/> Your Response
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic opacity-90">
                          "{selectedMsg.lastReply}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reply Editor */}
                <div className="p-8 bg-white border-t border-slate-100">
                  <form onSubmit={handleReply} className="relative">
                    <textarea 
                      placeholder={`Reply to ${selectedMsg.name}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full h-32 p-6 bg-slate-50 border-none rounded-[2rem] text-sm font-medium outline-none focus:ring-4 focus:ring-blue-500/5 transition-all resize-none shadow-inner"
                    />
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button type="button" className="p-3 text-slate-400 hover:bg-white rounded-xl transition-all shadow-sm"><Paperclip size={18}/></button>
                      <button 
                        type="submit"
                        className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1"
                      >
                        Send Reply <Send size={14}/>
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-20 text-center animate-pulse">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                  <Mail size={48}/>
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">Select a Conversation</h3>
                <p className="text-slate-400 font-medium max-w-xs mt-2">Choose a message from the left panel to read and respond to customer inquiries.</p>
              </div>
            )}
          </div>

        </div>
      </div>
  
  );
};

export default ContactMessages;