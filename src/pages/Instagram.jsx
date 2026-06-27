import React, { useState } from "react";
import { Phone, Video, Send, Paperclip, Mail, BookOpen, MoreHorizontal } from "lucide-react";

const instagramUsers = [
  { id: 2, name: "Silent Killer", platform: "Instagram", message: "Sent an attachment", time: "5m", unread: 0, avatar: "https://i.pravatar.cc/150?img=2", phone: "+91 99887 76655", email: "killer@demo.com", course: "B.Tech" },
  { id: 5, name: "Rahul Verma", platform: "Instagram", message: "Is it affordable?", time: "5m", unread: 0, avatar: "https://i.pravatar.cc/150?img=5", phone: "+91 98765 22222", email: "rahul@mail.com", course: "MBA" },
  { id: 8, name: "Vikas", platform: "Instagram", message: "Demo class?", time: "4h", unread: 0, avatar: "https://i.pravatar.cc/150?img=11", phone: "+91 98765 55555", email: "vikas@mail.com", course: "MCA" },
];

export default function InstagramInbox() {
  const [selectedUser, setSelectedUser] = useState(instagramUsers[0]);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Is there any batch starting soon on Instagram?" },
    { id: 2, sender: "me", text: "Yes! New batch is starting from next Monday. Please share details." },
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "me", text: inputValue }]);
    setInputValue("");
  };

  return (
    /* Changed h-screen to h-[calc(100vh-80px)] to prevent overall layout breaking/scrolling */
    <div className="h-[calc(100vh-90px)] w-full bg-slate-50 flex overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      
      {/* 1. LEFT USER LIST */}
      <div className="w-[360px] bg-white border-r flex flex-col h-full shrink-0">
        <div className="p-5 border-b shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Instagram DM</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {instagramUsers.length} Direct
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {instagramUsers.map((user) => (
            <div 
              key={user.id} 
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer px-4 py-3.5 flex items-center gap-3 transition-all ${
                selectedUser.id === user.id ? "bg-emerald-50/60 border-r-4 border-emerald-600" : "hover:bg-slate-50"
              }`}
            >
              <img src={user.avatar} className="w-11 h-11 rounded-full object-cover shadow-sm" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h4 className="font-semibold text-slate-800 text-sm truncate">{user.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{user.time}</span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN CHAT CONTAINER */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full min-w-0">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <img src={selectedUser.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">{selectedUser.name}</h3>
              <p className="text-[10px] text-emerald-600 font-bold">Instagram Handle Sync</p>
            </div>
          </div>
          <div className="flex gap-5 text-slate-500">
            {/* <Phone size={18} className="cursor-pointer hover:text-slate-800" />
            <Video size={18} className="cursor-pointer hover:text-slate-800" /> */}
            <MoreHorizontal size={18} className="cursor-pointer hover:text-slate-800" />
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-emerald-50/10">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl shadow-xs text-sm leading-relaxed ${
                msg.sender === "me" 
                  ? "bg-emerald-600 text-white rounded-tr-sm" 
                  : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="bg-white p-4 flex items-center gap-3 border-t shrink-0">
          <Paperclip size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
          <input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            className="flex-1 bg-slate-50 rounded-full px-5 py-2.5 outline-none text-sm border border-slate-200 focus:border-emerald-600 transition-colors" 
            placeholder="Send a direct message..." 
          />
          <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700 p-2.5 rounded-full text-white shadow-sm transition-colors shrink-0">
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* 3. RIGHT LEAD PANEL */}
      <div className="w-[300px] bg-white border-l p-6 hidden xl:flex flex-col h-full shrink-0 overflow-y-auto">
        <div className="flex flex-col items-center text-center border-b pb-6 shrink-0">
          <img src={selectedUser.avatar} className="w-20 h-20 rounded-full mb-3 ring-4 ring-emerald-50 object-cover shadow-md" alt="" />
          <h2 className="font-bold text-slate-800 text-base">{selectedUser.name}</h2>
          <span className="mt-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] tracking-wider uppercase border border-emerald-100">
            Instagram Profiling
          </span>
        </div>
        
        <div className="mt-6 space-y-5">
          {[
            { label: "Phone Registry", value: selectedUser.phone, icon: <Phone size={14}/> },
            { label: "Email System", value: selectedUser.email, icon: <Mail size={14}/> },
            { label: "Academics Track", value: selectedUser.course, icon: <BookOpen size={14}/> },
          ].map((item) => (
            <div key={item.label} className="flex gap-3 items-start">
              <div className="text-emerald-600 p-1.5 bg-emerald-50 rounded-lg mt-0.5">{item.icon}</div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}