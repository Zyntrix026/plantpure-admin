import React, { useState } from "react";
import { Phone, Video, Send, Paperclip, Mail, BookOpen, MoreHorizontal } from "lucide-react";

const whatsappUsers = [
  { id: 1, name: "Laiba Siddique", platform: "WhatsApp", message: "Hello Sir", time: "2m", unread: 2, avatar: "https://i.pravatar.cc/150?img=1", phone: "+91 98765 43210", email: "laiba@example.com", course: "MBA" },
  { id: 4, name: "Anushka", platform: "WhatsApp", message: "Please share details", time: "3h", unread: 0, avatar: "https://i.pravatar.cc/150?img=4", phone: "+91 98765 11111", email: "anushka@mail.com", course: "BCA" },
  { id: 7, name: "Sneha", platform: "WhatsApp", message: "Batch start date?", time: "2h", unread: 0, avatar: "https://i.pravatar.cc/150?img=10", phone: "+91 98765 44444", email: "sneha@mail.com", course: "BBA" },
  { id: 10, name: "Rohit", platform: "WhatsApp", message: "Can I join?", time: "8h", unread: 0, avatar: "https://i.pravatar.cc/150?img=13", phone: "+91 98765 77777", email: "rohit@mail.com", course: "BBA" },
];

export default function WhatsAppInbox() {
  const [selectedUser, setSelectedUser] = useState(whatsappUsers[0]);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: "user", text: "Hello Sir" },
    { id: 2, sender: "me", text: "Hello 👋" },
  ]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "me", text: inputValue }]);
    setInputValue("");
  };

  return (
    /* Changed h-screen to h-[calc(100vh-90px)] & added wrapper styling for uniformity */
    <div className="h-[calc(100vh-90px)] w-full bg-slate-50 flex overflow-hidden rounded-2xl border border-slate-100 shadow-sm"> 
      
      {/* 1. LEFT USER LIST */}
      <div className="w-[360px] bg-white border-r flex flex-col h-full shrink-0">
        <div className="p-5 border-b shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">WhatsApp Leads</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {whatsappUsers.length} Active
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {whatsappUsers.map((user) => (
            <div 
              key={user.id} 
              onClick={() => setSelectedUser(user)}
              className={`cursor-pointer px-4 py-3.5 flex items-center gap-3 transition-all ${
                selectedUser.id === user.id ? "bg-emerald-50/70 border-r-4 border-emerald-500" : "hover:bg-slate-50"
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
      <div className="flex-1 flex flex-col bg-[#e5ddd5] h-full min-w-0">
        {/* Chat Header */}
        <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <img src={selectedUser.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div>
              <h3 className="font-semibold text-sm text-slate-800">{selectedUser.name}</h3>
              <p className="text-[10px] text-emerald-600 font-bold">WhatsApp Chat Link</p>
            </div>
          </div>
          <div className="flex gap-5 text-slate-500">
            {/* <Phone size={18} className="cursor-pointer hover:text-slate-800" />
            <Video size={18} className="cursor-pointer hover:text-slate-800" /> */}
            <MoreHorizontal size={18} className="cursor-pointer hover:text-slate-800" />
          </div>
        </div>

        {/* Chat Messages Screen */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[65%] px-4 py-2 rounded-xl shadow-sm text-sm leading-relaxed ${
                msg.sender === "me" ? "bg-[#d9fdd3] text-slate-800 rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Messaging Inputs footer */}
        <div className="bg-slate-100 p-3.5 flex items-center gap-3 border-t shrink-0">
          <Paperclip size={20} className="text-slate-500 cursor-pointer hover:text-slate-700" />
          <input 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
            className="flex-1 bg-white rounded-xl px-4 py-2.5 outline-none text-sm border border-slate-200 focus:border-emerald-500 transition-colors" 
            placeholder="Type a WhatsApp message..." 
          />
          <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-xl text-white shadow-md transition-colors shrink-0">
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* 3. RIGHT LEAD PANEL */}
      <div className="w-[300px] bg-white border-l p-6 hidden xl:flex flex-col h-full shrink-0 overflow-y-auto">
        <div className="flex flex-col items-center text-center border-b pb-6 shrink-0">
          <img src={selectedUser.avatar} className="w-20 h-20 rounded-full mb-3 ring-4 ring-emerald-50 object-cover shadow-md" alt="" />
          <h2 className="font-bold text-slate-800 text-base">{selectedUser.name}</h2>
          <span className="mt-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] tracking-wider uppercase">
            WhatsApp Channel
          </span>
        </div>
        
        <div className="mt-6 space-y-5">
          {[
            { label: "Phone Connection", value: selectedUser.phone, icon: <Phone size={14}/> },
            { label: "Email Address", value: selectedUser.email, icon: <Mail size={14}/> },
            { label: "Course Interested", value: selectedUser.course, icon: <BookOpen size={14}/> },
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