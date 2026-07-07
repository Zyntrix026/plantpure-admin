import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Phone, Video, Send, Paperclip, Mail, BookOpen, MoreHorizontal, RefreshCw, Loader2 } from "lucide-react";

// API Base Configuration
const API_URL = "/api/v1/facebook";

export default function FacebookInbox() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  
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
        // Default select first interaction room if none active
        if (fetchedConvs.length > 0 && !selectedUser) {
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
      // Step A: Trigger full cloud sync on back-end
      await axios.post(`${API_URL}/sync/conversations`);
      // Step B: Re-render state boundaries from stored document cache
      await fetchConversations();
      
      // Step C: If a channel is open, sync that specific target row simultaneously
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

    // Isolate customer ID from the Meta runtime metadata structure safely
    const targetRecipientId = selectedUser.participants?.find(
      (p) => p.id !== PAGE_ID
    )?.id || selectedUser.fbConversationId;

    const payload = {
      recipientId: targetRecipientId,
      conversationId: selectedUser.fbConversationId,
      messageText: inputValue.trim()
    };

    setIsSending(true);
    try {
      const response = await axios.post(`${API_URL}/messages/send`, payload);
      if (response.data.success) {
        // Append response object immediately to feed without requiring async layout redraw
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
    /* Main wrapper with fixed bounds to match responsive panel grids */
    <div className="h-[calc(100vh-90px)] w-full bg-slate-50 flex overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
      
      {/* 1. LEFT USER LIST */}
      <div className="w-[360px] bg-white border-r flex flex-col h-full shrink-0">
        <div className="p-5 border-b shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Facebook Chats</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSyncPipeline}
                disabled={isSyncingConvs}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors disabled:opacity-50"
                title="Sync with Meta Servers"
              >
                <RefreshCw size={16} className={isSyncingConvs ? "animate-spin text-emerald-600" : ""} />
              </button>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {conversations.length} Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.map((user) => {
            const customer = user.participants?.find(p => p.id !== PAGE_ID) || { name: "Meta User" };
            const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name)}&background=e6f4ea&color=059669`;

            return (
              <div 
                key={user._id || user.fbConversationId} 
                onClick={() => setSelectedUser(user)}
                className={`cursor-pointer px-4 py-3.5 flex items-center gap-3 transition-all ${
                  selectedUser?.fbConversationId === user.fbConversationId ? "bg-emerald-50/60 border-r-4 border-emerald-600" : "hover:bg-slate-50"
                }`}
              >
                <img src={defaultAvatar} className="w-11 h-11 rounded-full object-cover shadow-sm" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{customer.name}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {user.lastMessageAt ? new Date(user.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">Click to view thread logs</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MAIN CHAT CONTAINER */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full min-w-0">
        {/* Chat Header */}
        {selectedUser ? (
          <>
            <div className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm shrink-0">
              <div className="flex items-center gap-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User")}&background=e6f4ea&color=059669`} 
                  className="w-10 h-10 rounded-full object-cover" 
                  alt="" 
                />
                <div>
                  <h3 className="font-semibold text-sm text-slate-800">
                    {selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User"}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-bold">Messenger Live Sync</p>
                </div>
              </div>
              <div className="flex gap-5 text-slate-500">
                {/* <Phone size={18} className="cursor-pointer hover:text-slate-800" />
                <Video size={18} className="cursor-pointer hover:text-slate-800" /> */}
                <MoreHorizontal size={18} className="cursor-pointer hover:text-slate-800" />
              </div>
            </div>

            {/* Chat Messages Section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-emerald-50/10">
              {isMessagesLoading ? (
                <div className="h-full w-full flex items-center justify-center text-slate-400 gap-2">
                  <Loader2 className="animate-spin text-emerald-600" size={20} />
                  <span className="text-sm font-medium">Syncing history thread...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                  No messaging documents mapped inside this thread block.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender?.id === PAGE_ID || msg.sender?.name === 'Page Agent';
                  return (
                    <div key={msg._id || msg.fbMessageId} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[65%] px-4 py-2.5 rounded-2xl shadow-xs text-sm leading-relaxed ${
                        isMe ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-none"
                      }`}>
                        {msg.messageText}
                        
                        {/* Rendering dynamic media payloads if present inside state */}
                        {msg.attachments && msg.attachments.map((att, index) => (
                          <div key={index} className="mt-2">
                            {att.type === 'image' ? (
                              <img src={att.payloadUrl} alt="FB Attachment" className="max-w-full rounded-lg max-h-48 object-cover" />
                            ) : (
                              <a href={att.payloadUrl} target="_blank" rel="noreferrer" className="underline text-xs block">
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
            <div className="bg-white p-4 flex items-center gap-3 border-t shrink-0">
              <Paperclip size={20} className="text-slate-400 cursor-pointer hover:text-slate-600" />
              <input 
                value={inputValue} 
                disabled={isSending}
                onChange={(e) => setInputValue(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 outline-none text-sm border border-slate-200 focus:border-emerald-600 transition-colors disabled:opacity-70" 
                placeholder="Type a message on Messenger..." 
              />
              <button 
                onClick={handleSend} 
                disabled={isSending || !inputValue.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 p-2.5 rounded-xl text-white shadow-sm transition-colors shrink-0 disabled:opacity-50 flex items-center justify-center"
              >
                {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a pipeline contact room from the panel ledger to monitor live conversation states.
          </div>
        )}
      </div>

      {/* 3. RIGHT LEAD PANEL */}
      {selectedUser && (
        <div className="w-[300px] bg-white border-l p-6 hidden xl:flex flex-col h-full shrink-0 overflow-y-auto">
          <div className="flex flex-col items-center text-center border-b pb-6 shrink-0">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User")}&background=e6f4ea&color=059669`} 
              className="w-20 h-20 rounded-full mb-3 ring-4 ring-emerald-50 object-cover shadow-md" 
              alt="" 
            />
            <h2 className="font-bold text-slate-800 text-base">
              {selectedUser.participants?.find(p => p.id !== PAGE_ID)?.name || "Meta User"}
            </h2>
            <span className="mt-1 px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] tracking-wider uppercase border border-emerald-100">
              Meta Lead Profiles
            </span>
          </div>
          
          <div className="mt-6 space-y-5">
            {[
              { label: "Contact Reference", value: selectedUser.participants?.find(p => p.id !== PAGE_ID)?.id || "N/A", icon: <Phone size={14}/> },
              { label: "Profile Email", value: selectedUser.participants?.find(p => p.id !== PAGE_ID)?.email || "No email mapped", icon: <Mail size={14}/> },
              { label: "Channel Origin", value: "Facebook Messenger Room", icon: <BookOpen size={14}/> },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 items-start">
                <div className="text-emerald-600 p-1.5 bg-emerald-50 rounded-lg mt-0.5">{item.icon}</div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5 break-all">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}