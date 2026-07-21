import { useEffect, useRef, useState } from "react";
import React from "react";
import { useSocket } from "../lib/useSocket";
import {
  ChevronLeft,
  Image,
  Instagram,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Send,
  UserRound,
} from "lucide-react";
import { api } from "../lib/api";

const STORAGE_KEY = "instagram-inbox-contacts";

const getContactId = (contact) => String(contact?.id || contact?._id || contact?.contactId || "");
const getContactName = (contact) => contact?.name || contact?.fullName || contact?.firstName || `Contact ${getContactId(contact)}`;

const getMessageText = (message) => {
  return message?.message?.text || message?.text || "";
};

const getMessageId = (message, index) => message?.messageId || message?.id || `${index}`;

const isOutgoing = (message) => {
  return message?.traffic === "outgoing";
};

export default function InstagramInbox() {
  const [contacts, setContacts] = useState(() => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [channelId, setChannelId] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const messagesEndRef = useRef(null);
  const selectedContactRef = useRef(null);

  // Always keep ref in sync with latest selectedContact
  useEffect(() => {
    selectedContactRef.current = selectedContact;
  }, [selectedContact]);

  // REAL-TIME: Socket listener — fires instantly when respond.io webhook hits backend
  useSocket({
    ig_new_message: ({ contactId, message }) => {
      const active = selectedContactRef.current;

      // 1. If this contact's chat is open, append message instantly
      if (active && String(getContactId(active)) === String(contactId)) {
        setMessages((prev) => {
          // Deduplicate by messageId
          const alreadyExists = prev.some(
            (m) => getMessageId(m, -1) === getMessageId(message, -1)
          );
          if (alreadyExists) return prev;
          // Update channelId if present
          if (message.channelId) setChannelId(message.channelId);
          return [...prev, message];
        });
      }

      // 2. Refresh contacts list so sidebar shows latest contact on top
      fetchContacts();
    },
  });

  const fetchContacts = async () => {
    try {
      const { data } = await api.get("/instagram/contacts");
      const fetchedContacts = data.items || data || [];
      setContacts(fetchedContacts);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedContacts));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (contactId) => {
    if (!contactId) return;
    setIsMessagesLoading(true);
    try {
      const { data } = await api.get(`/instagram/messages/${contactId}`);
      const responseMessages = data.items || [];
      if (responseMessages.length > 0) setChannelId(responseMessages[0].channelId);
      setMessages([...responseMessages].reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchContacts();
  }, []);

  // Scroll to bottom automatically
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Manual Sync Function
  const handleSync = async () => {
    setIsSyncing(true);
    await fetchContacts();
    if (selectedContact) {
      await fetchMessages(getContactId(selectedContact));
    }
    setIsSyncing(false);
  };

  const selectContact = async (contact) => {
    setSelectedContact(contact);
    setMessages([]); // Clear previous chat instantly to avoid UI flashing
    await fetchMessages(getContactId(contact));
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    const activeContactId = getContactId(selectedContact);
    if (!text || !selectedContact) return;

    // 1. Create a temporary message layout to match your DB schema
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      traffic: "outgoing",
      channelId: channelId,
      text: text, // Fallback for getMessageText helper
      message: {
        text: text
      }
    };

    try {
      setInputValue(""); // Clear input field instantly for crisp UI
      
      // 2. Add it to screen instantly before API completes
      setMessages((prev) => [...prev, optimisticMessage]);

      // 3. Send Message to backend
      await api.post("/instagram/reply", {
        contactId: activeContactId,
        channelId,
        text,
      });

      // 4. Wait for IG Webhooks to register then fetch clean data from server
      setTimeout(async () => {
        try {
          const { data } = await api.get(`/instagram/messages/${activeContactId}`);
          const responseMessages = data.items || [];
          setMessages([...responseMessages].reverse());
        } catch (fetchErr) {
          console.error("Background refresh failed:", fetchErr);
        }
      }, 800);

    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);
      
      // Remove the optimistic message if it failed and restore input text
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setInputValue(text);
    }
  };

  return (
    <div className="h-[calc(100vh-90px)] w-full flex bg-white rounded-2xl border shadow-sm overflow-hidden font-sans">

      {/* Sidebar */}
      <aside className="w-[350px] border-r bg-white flex flex-col">
        {/* Sidebar Header */}
        <div className="p-5 border-b font-bold text-lg text-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Instagram className="text-blue-600" />
            Instagram Inbox
          </div>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className={`p-2 rounded-full hover:bg-slate-100 text-slate-500 transition ${isSyncing ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((c) => (
            <button
              key={getContactId(c)}
              onClick={() => selectContact(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b transition text-left ${getContactId(selectedContact) === getContactId(c)
                  ? "bg-blue-50 border-l-4 border-l-blue-600"
                  : "hover:bg-slate-50 border-l-4 border-l-transparent"
                }`}
            >
              <img
                src={c.profilePic || `https://ui-avatars.com/api/?name=${getContactName(c)}&background=random`}
                alt={getContactName(c)}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-slate-800 truncate">
                  {getContactName(c)}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {c.lifecycle || "Instagram User"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white relative">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <header className="px-6 py-4 border-b bg-white flex items-center gap-3 z-10 shadow-sm">
              <img
                src={selectedContact.profilePic || `https://ui-avatars.com/api/?name=${getContactName(selectedContact)}&background=random`}
                alt={getContactName(selectedContact)}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-bold text-slate-800 text-[16px]">{getContactName(selectedContact)}</h2>
                <p className="text-xs text-slate-500">Active now</p>
              </div>
            </header>

            {/* Chat Messages Panel */}
            <section className="flex-1 overflow-y-auto p-6 bg-white flex flex-col">
              {isMessagesLoading && messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {messages.map((m, i) => {
                    const outgoing = isOutgoing(m);
                    const showAvatar = !outgoing && (i === messages.length - 1 || isOutgoing(messages[i + 1]));

                    return (
                      <div key={getMessageId(m, i)} className={`flex w-full ${outgoing ? "justify-end" : "justify-start"}`}>
                        
                        {/* Left Side Avatar */}
                        {!outgoing && (
                          <div className="w-8 flex-shrink-0 flex flex-col justify-end mr-2">
                            {showAvatar ? (
                              <img
                                src={selectedContact.profilePic || `https://ui-avatars.com/api/?name=${getContactName(selectedContact)}&background=random`}
                                alt=""
                                className="w-7 h-7 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-7 h-7" />
                            )}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`px-5 py-2.5 text-[15px] max-w-[70%] break-words ${outgoing
                              ? "bg-blue-600 text-white rounded-[24px]"
                              : "bg-gray-100 text-gray-900 rounded-[24px]"
                            }`}
                        >
                          {getMessageText(m)}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} className="h-4" />
                </div>
              )}
            </section>

            {/* Chat Footer Input */}
            <footer className="p-4 bg-white border-t flex items-center gap-3">
              <input
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="Channel ID"
                title="Channel ID"
                className="border border-slate-200 p-2.5 rounded-full w-28 text-sm outline-none text-slate-600 focus:border-blue-400 transition-colors hidden md:block"
              />

              <div className="flex-1 flex items-center bg-gray-100 border border-transparent focus-within:border-gray-200 focus-within:bg-white rounded-full px-4 py-1.5 transition-all">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1 bg-transparent p-2 outline-none text-slate-800 placeholder-slate-500"
                  placeholder="Message..."
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors flex items-center justify-center ml-2 shadow-sm"
                >
                  <Send size={18} className="-ml-0.5" />
                </button>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-4">
            <div className="w-24 h-24 rounded-full border-2 border-blue-500 flex items-center justify-center bg-blue-50 text-blue-500">
              <Instagram size={48} />
            </div>
            <p className="text-lg font-medium text-slate-700">Your Messages</p>
            <p className="text-sm">Select a contact to start chatting.</p>
          </div>
        )}
      </main>
    </div>
  );
}