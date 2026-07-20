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
  User,
  Info
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
  
  // Right profile panel toggle state (defaults to true on larger screens like Messenger)
  const [showProfile, setShowProfile] = useState(window.innerWidth >= 1024);
  
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

    const currentText = inputValue.trim();

    // Optimistic Update: Add message immediately to the UI array for instantaneous feedback
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      fbMessageId: `temp-${Date.now()}`,
      messageText: currentText,
      sender: {
        id: PAGE_ID,
        name: 'Page Agent'
      },
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      const payload = {
        recipientId: targetRecipientId,
        conversationId: selectedUser.fbConversationId,
        messageText: currentText,
        tag: "HUMAN_AGENT"
      };

      const response = await axios.post(`${API_URL}/messages/send`, payload);
      if (response.data.success) {
        // Swap optimistic message out for the official DB record containing server statuses
        setMessages((prev) => prev.map(msg => msg.fbMessageId === optimisticMessage.fbMessageId ? response.data.data : msg));
      }
    } catch (error) {
      console.error("Outbound pipeline failed execution:", error);
      // Remove failed message from local stack and restore value for recovery
      setMessages((prev) => prev.filter(msg => msg.fbMessageId !== optimisticMessage.fbMessageId));
      setInputValue(currentText);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-90px)] w-full bg-white flex overflow-hidden rounded-2xl border border-slate-200 shadow-sm relative font-sans antialiased">
      
      {/* 1. LEFT USER LIST (MESSENGER COMPACT CHAT SIDEBAR) */}
      <div className={`w-full md:w-[320px] lg:w-[360px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0 ${
        selectedUser ? "hidden md:flex" : "flex"
      }`}>
        <div className="p-4 shrink-0 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-black tracking-tight text-black">Chats</h2>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleSyncPipeline}
                disabled={isSyncingConvs}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors disabled:opacity-50"
                title="Sync conversations"
              >
                <RefreshCw size={18} className={isSyncingConvs ? "animate-spin text-[#0084FF]" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Conversation Cards list */}
        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {conversations.map((user) => {
            const customer = user.participants?.find(p => p.id !== PAGE_ID) || { name: "Meta User" };
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=f0f2f5&color=050505&bold=true`;
            const isSelected = selectedUser?.fbConversationId === user.fbConversationId;

            return (
              <div 
                key={user._id || user.fbConversationId} 
                onClick={() => {
                  setSelectedUser(user);
                }}
                className={`cursor-pointer mx-1 px-3 py-2.5 flex items-center gap-3 rounded-xl transition-all ${
                  isSelected ? "bg-slate-100" : "hover:bg-slate-50"
                }`}
              >
                <img src={defaultAvatar} className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-[15px] text-slate-900 truncate">{customer.name}</h4>
                    <span className="text-[11px] text-slate-500 shrink-0 ml-1">
                      {user.lastMessageAt ? new Date(user.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-500 truncate mt-0.5 font-normal">
                    Click to read active thread
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN FACEBOOK MESSENGER CHAT CANVAS */}
      <div className={`flex-1 flex flex-col bg-white h-full min-w-0 ${
        !selectedUser ? "hidden md:flex" : "flex"
      }`}>
        {selectedUser ? (
          <>
            {/* Messenger Chat Header */}
            <div className="h-[64px] bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 z-10 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <button 
                  onClick={() => setSelectedUser(null)} 
                  className="p-1 hover:bg-slate-100 rounded-full text-[#0084FF] md:hidden"
                >
                  <ChevronLeft size={24} />
                </button>
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User")}&background=f0f2f5&color=050505&bold=true`} 
                  className="w-10 h-10 rounded-full object-cover" 
                  alt="" 
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-[15px] text-slate-950 truncate leading-tight">
                    {selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User"}
                  </h3>
                  <p className="text-[12px] text-slate-500 font-normal">Active on Messenger</p>
                </div>
              </div>
              
              {/* Header CTA Toggles */}
              <div className="flex items-center gap-1.5 text-[#0084FF] shrink-0">
                {/* <button className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <Phone size={20} />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-all">
                  <Video size={20} />
                </button> */}
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className={`p-2 rounded-full transition-all ${
                    showProfile ? "bg-blue-50 text-[#0084FF]" : "hover:bg-slate-100"
                  }`}
                  title="Conversation Information"
                >
                  <Info size={20} />
                </button>
              </div>
            </div>

            {/* Messenger Chat Bubble Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-white flex flex-col">
              {isMessagesLoading ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="animate-spin text-[#0084FF]" size={28} />
                  <span className="text-xs font-normal text-slate-500">Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm font-normal">
                  No messages in this conversation room.
                </div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.sender?.id === PAGE_ID || msg.sender?.name === 'Page Agent';
                  
                  // Messenger logic to cluster avatars correctly next to clusters of left-side incoming messages
                  const nextMessageSameSender = messages[i + 1] && (messages[i + 1].sender?.id === msg.sender?.id || (messages[i + 1].sender?.name === 'Page Agent' && isMe));
                  const showAvatar = !isMe && !nextMessageSameSender;

                  return (
                    <div key={msg._id || msg.fbMessageId} className={`flex w-full items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                      
                      {/* Left Avatar Slot */}
                      {!isMe && (
                        <div className="w-7 h-7 flex-shrink-0 mb-0.5">
                          {showAvatar ? (
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User")}&background=f0f2f5&color=050505&bold=true`} 
                              className="w-7 h-7 rounded-full object-cover" 
                              alt="" 
                            />
                          ) : null}
                        </div>
                      )}

                      {/* Messenger Clean Style Chat Bubbles */}
                      <div className={`max-w-[75%] md:max-w-[60%] px-3.5 py-2 text-[15px] font-normal leading-snug break-words ${
                        isMe 
                          ? "bg-[#0084FF] text-white rounded-[18px] rounded-br-[4px]" 
                          : "bg-[#E4E6EB] text-black rounded-[18px] rounded-bl-[4px]"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.messageText}</div>
                        
                        {/* Rendering dynamic media payloads */}
                        {msg.attachments && msg.attachments.map((att, index) => (
                          <div key={index} className="mt-2 rounded-xl overflow-hidden border border-black/5">
                            {att.type === 'image' ? (
                              <img src={att.payloadUrl} alt="Messenger attachment" className="max-w-full rounded-md max-h-56 object-cover" />
                            ) : (
                              <a href={att.payloadUrl} target="_blank" rel="noreferrer" className="underline text-xs block p-2 font-medium">
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

            {/* Messenger Styled Input Action Bar */}
            <div className="bg-white p-3 flex items-center gap-2 border-t border-slate-200 shrink-0">
              <button className="p-2 text-[#0084FF] hover:bg-slate-100 rounded-full transition-colors">
                <Paperclip size={20} />
              </button>
              
              <div className="flex-1 flex items-center bg-[#F0F2F5] rounded-full px-4 py-1.5 border border-transparent focus-within:bg-white focus-within:border-slate-200 transition-all">
                <input 
                  value={inputValue} 
                  disabled={isSending}
                  onChange={(e) => setInputValue(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                  className="flex-1 bg-transparent outline-none text-[15px] text-slate-900 placeholder-slate-500 py-1" 
                  placeholder="Aa" 
                />
              </div>

              <button 
                onClick={handleSend} 
                disabled={isSending || !inputValue.trim()}
                className="text-[#0084FF] hover:bg-slate-100 p-2 rounded-full transition-colors shrink-0 disabled:opacity-40 flex items-center justify-center"
              >
                {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm font-normal p-6 text-center">
            Select a conversation to start reading messages.
          </div>
        )}
      </div>

      {/* 3. RIGHT PROFILE INFORMATION SIDEBAR (MESSENGER SIDE CONFIG PANEL) */}
      {selectedUser && showProfile && (
        <div className="w-full md:w-[280px] lg:w-[320px] bg-white border-l border-slate-200 p-6 flex flex-col h-full shrink-0 overflow-y-auto absolute md:relative right-0 top-0 z-20 shadow-xl md:shadow-none animate-in slide-in-from-right duration-150">
          
          <div className="flex items-center justify-between md:hidden border-b border-slate-100 pb-3 mb-4 shrink-0">
            <h3 className="font-semibold text-sm text-slate-950">Details</h3>
            <button onClick={() => setShowProfile(false)} className="text-sm text-[#0084FF] font-semibold hover:underline">
              Done
            </button>
          </div>

          <div className="flex flex-col items-center text-center border-b border-slate-100 pb-6 shrink-0 mt-4">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User")}&background=f0f2f5&color=050505&bold=true`} 
              className="w-20 h-20 rounded-full mb-3 object-cover border border-slate-200 shadow-2xs" 
              alt="" 
            />
            <h2 className="font-bold text-slate-950 text-lg tracking-tight leading-tight">
              {selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User"}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Facebook Messenger profile</p>
          </div>
          
          <div className="mt-6 space-y-5">
            {[
              { label: "Profile Scope ID", value: selectedUser.participants?.find(p => p.id !== PAGE_ID)?.id || "N/A", icon: <User size={16}/> },
              { label: "Profile Email", value: selectedUser.participants?.find(p => p.id !== PAGE_ID)?.email || "No email mapped", icon: <Mail size={16}/> },
              { label: "Source Room", value: "Facebook Messenger Thread", icon: <BookOpen size={16}/> },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start">
                <div className="text-slate-600 p-2 bg-[#F0F2F5] rounded-full mt-0.5 shrink-0">{item.icon}</div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">{item.label}</p>
                  <p className="text-[14px] font-medium text-slate-800 mt-0.5 break-all leading-snug">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}