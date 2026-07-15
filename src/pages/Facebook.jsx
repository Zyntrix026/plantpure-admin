import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  Phone, 
  Video, 
  Send, 
  Paperclip, 
  Mail, 
  BookOpen, 
  MoreHorizontal, 
  RefreshCw, 
  Loader2,
  ChevronLeft,
  User
} from "lucide-react";

// Determine the correct API Base URL depending on where the app is running
const getApiUrl = () => {
  const isLocalhost = 
    window.location.hostname === "localhost" || 
    window.location.hostname === "127.0.0.1";
    
  // If local, keep relative path (uses Vite proxy). If production, point directly to the domain.
  const apiBase = isLocalhost ? "" : "https://api.plantpure.in";
  return `${apiBase}/api/v1/facebook`;
};

const API_URL = getApiUrl();

export default function FacebookInbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
  // Right profile panel toggle state
  const [showProfile, setShowProfile] = useState(false);
  
  // Loading & Action states
  const [isSyncingConvs, setIsSyncingConvs] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Safely extract Page ID from Vite Environment or fallback to empty string
  const PAGE_ID = import.meta.env.VITE_FB_PAGE_ID || "";

  // Auto-scroll inside chat windows
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // INITIAL LOAD: Get local synced conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // CONVERSATION WATCHER: Fetch thread messages on selection change
  useEffect(() => {
    if (selectedUser?.fbConversationId) {
      fetchThreadMessages(selectedUser.fbConversationId);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  /**
   * 1. GET LOCAL CONVERSATIONS FROM DATABASE
   */
  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_URL}/conversations?page=1&limit=50`);
      if (response.data.success) {
        const fetchedConvs = response.data.data;
        setConversations(fetchedConvs);
        // Default select first interaction room on desktop if none active
        if (window.innerWidth >= 768 && fetchedConvs.length > 0 && !selectedUser) {
          setSelectedUser(fetchedConvs[0]);
        }
      }
    } catch (error) {
      console.error("Error retrieving database threads:", error);
    }
  };

  /**
   * 2. SYNC REFRESH ENGINE: Pull active endpoints from Meta directly
   */
  const handleSyncPipeline = async () => {
    setIsSyncingConvs(true);
    try {
      await axios.post(`${API_URL}/sync/conversations`);
      await fetchConversations();
      
      if (selectedUser?.fbConversationId) {
        await axios.post(`${API_URL}/sync/conversations/${selectedUser.fbConversationId}/messages`);
        await fetchThreadMessages(selectedUser.fbConversationId);
      }
    } catch (error) {
      console.error("Synchronization loop failure:", error);
    } finally {
      setIsSyncingConvs(false);
    }
  };

  /**
   * 3. FETCH THREAD MESSAGES FROM LOCAL DATABASE
   */
  const fetchThreadMessages = async (conversationId) => {
    setIsMessagesLoading(true);
    try {
      const response = await axios.get(`${API_URL}/conversations/${conversationId}/messages?page=1&limit=50`);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Failed to read chat history documents:", error);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  /**
   * 4. WRITE HANDLER: Dispatches payload out to Meta Endpoints via Server Route
   */
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedUser || isSending) return;

    const targetRecipientId = selectedUser.participants?.find(
      (p) => p.id !== PAGE_ID
    )?.id || selectedUser.fbConversationId;

    const payload = {
      recipientId: targetRecipientId,
      conversationId: selectedUser.fbConversationId,
      messageText: inputValue.trim(),
      tag: "HUMAN_AGENT"
    };

    setIsSending(true);
    try {
      const response = await axios.post(`${API_URL}/messages/send`, payload);
      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.data]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Outbound pipeline failed execution:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-90px)] w-full bg-slate-50 flex overflow-hidden rounded-2xl border border-slate-100 shadow-xs relative">
      
      {/* 1. LEFT USER LIST (HIDDEN ON MOBILE WHEN CHAT IS ACTIVE) */}
      <div className={`w-full md:w-[320px] lg:w-[360px] bg-white border-r flex flex-col h-full shrink-0 ${
        selectedUser ? "hidden md:flex" : "flex"
      }`}>
        <div className="p-4 border-b shrink-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-slate-900">Facebook Chats</h2>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={handleSyncPipeline}
                disabled={isSyncingConvs}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors disabled:opacity-50"
                title="Sync with Meta Servers"
              >
                <RefreshCw size={15} className={isSyncingConvs ? "animate-spin text-emerald-600" : ""} />
              </button>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                {conversations.length} Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 bg-white">
          {conversations.map((user) => {
            const customer = user.participants?.find(p => p.id !== PAGE_ID) || { name: "Meta User" };
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=e6f4ea&color=059669`;

            return (
              <div 
                key={user._id || user.fbConversationId} 
                onClick={() => {
                  setSelectedUser(user);
                  setShowProfile(false); // Reset profile view on user switch
                }}
                className={`cursor-pointer px-4 py-3 flex items-center gap-3 transition-all ${
                  selectedUser?.fbConversationId === user.fbConversationId ? "bg-slate-50 border-r-4 border-emerald-600" : "hover:bg-slate-50/50"
                }`}
              >
                <img src={defaultAvatar} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-800 text-xs truncate">{customer.name}</h4>
                    <span className="text-[9px] text-slate-400 font-semibold shrink-0">
                      {user.lastMessageAt ? new Date(user.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">Click to view chat history</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN CHAT CONTAINER */}
      <div className={`flex-1 flex flex-col bg-slate-50 h-full min-w-0 ${
        !selectedUser ? "hidden md:flex" : "flex"
      }`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="h-14 bg-white border-b px-4 md:px-6 flex items-center justify-between shadow-xs shrink-0 z-10">
              <div className="flex items-center gap-3 min-w-0">
                {/* Back button for mobile view */}
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 md:hidden"
                >
                  <ChevronLeft size={20} />
                </button>
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User")}&background=e6f4ea&color=059669`} 
                  className="w-9 h-9 rounded-full object-cover border border-slate-100" 
                  alt="" 
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-800 truncate">
                    {selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User"}
                  </h3>
                  <p className="text-[9px] text-emerald-600 font-bold tracking-wider uppercase">Messenger Live Sync</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-500 shrink-0">
                {/* Toggle Profile Panel button */}
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className={`p-1.5 rounded-lg transition-all ${
                    showProfile ? "bg-emerald-50 text-emerald-600" : "hover:bg-slate-100 hover:text-slate-800"
                  }`}
                  title="Toggle Profile Info"
                >
                  <User size={18} />
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-slate-800 transition-all">
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages Section */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5 bg-slate-50">
              {isMessagesLoading ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="animate-spin text-emerald-600" size={24} />
                  <span className="text-xs font-semibold">Syncing history thread...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                  No messaging documents mapped inside this thread block.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender?.id === PAGE_ID || msg.sender?.name === 'Page Agent';
                  return (
                    <div key={msg._id || msg.fbMessageId} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] md:max-w-[65%] px-3.5 py-2 rounded-xl text-xs leading-relaxed font-semibold shadow-2xs ${
                        isMe ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-200/50 rounded-tl-none"
                      }`}>
                        <div className="whitespace-pre-wrap break-words">{msg.messageText}</div>
                        
                        {/* Rendering dynamic media payloads */}
                        {msg.attachments && msg.attachments.map((att, index) => (
                          <div key={index} className="mt-2 rounded-lg overflow-hidden border border-black/5">
                            {att.type === 'image' ? (
                              <img src={att.payloadUrl} alt="FB Attachment" className="max-w-full rounded-md max-h-48 object-cover" />
                            ) : (
                              <a href={att.payloadUrl} target="_blank" rel="noreferrer" className="underline text-[10px] block p-1 font-bold">
                                View Attachment ({att.type})
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Footer */}
            <div className="bg-white p-3.5 flex items-center gap-3 border-t shrink-0">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                <Paperclip size={18} />
              </button>
              <input 
                value={inputValue} 
                disabled={isSending}
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                className="flex-1 bg-slate-50 rounded-xl px-4 py-2 outline-none text-xs border border-slate-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 transition-all disabled:opacity-70" 
                placeholder="Type a message on Messenger..." 
              />
              <button 
                onClick={handleSend} 
                disabled={isSending || !inputValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 p-2 rounded-xl text-white shadow-xs transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center min-w-[32px] h-[32px]"
              >
                {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-semibold p-6 text-center">
            Select a pipeline contact room from the panel ledger to monitor live conversation states.
          </div>
        )}
      </div>

      {/* 3. RIGHT LEAD PANEL (SLIDES IN / OPENED ONLY BY CLIKING USER INFO ICON) */}
      {selectedUser && showProfile && (
        <div className="w-full md:w-[280px] lg:w-[300px] bg-white border-l p-5 flex flex-col h-full shrink-0 overflow-y-auto absolute md:relative right-0 top-0 z-20 shadow-lg md:shadow-none animate-in slide-in-from-right duration-200">
          
          <div className="flex items-center justify-between md:hidden border-b pb-3 mb-4 shrink-0">
            <h3 className="font-bold text-xs text-slate-800">User Profile</h3>
            <button onClick={() => setShowProfile(false)} className="text-xs text-slate-500 font-bold hover:text-slate-800">
              Close
            </button>
          </div>

          <div className="flex flex-col items-center text-center border-b pb-5 shrink-0">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User")}&background=e6f4ea&color=059669`} 
              className="w-16 h-16 rounded-full mb-2.5 ring-4 ring-emerald-50 object-cover shadow-xs border border-slate-100" 
              alt="" 
            />
            <h2 className="font-bold text-slate-800 text-sm">
              {selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User"}
            </h2>
            <span className="mt-1.5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-md text-[9px] tracking-wider uppercase border border-emerald-100">
              Meta Lead Profiles
            </span>
          </div>
          
          <div className="mt-5 space-y-4">
            {[
              { label: "Contact Reference", value: selectedUser.participants?.find(p => p.id !== PAGE_ID)?.id || "N/A", icon: <Phone size={13}/> },
              { label: "Profile Email", value: selectedUser.participants?.find(p => p.id !== PAGE_ID)?.email || "No email mapped", icon: <Mail size={13}/> },
              { label: "Channel Origin", value: "Facebook Messenger Room", icon: <BookOpen size={13}/> },
            ].map((item) => (
              <div key={item.label} className="flex gap-2.5 items-start">
                <div className="text-emerald-600 p-1.5 bg-emerald-50 rounded-lg mt-0.5 shrink-0">{item.icon}</div>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">{item.label}</p>
                  <p className="text-xs font-bold text-slate-700 mt-0.5 break-all leading-normal">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}