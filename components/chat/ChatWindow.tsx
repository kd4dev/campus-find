"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow({ conversationId, currentUserId }: { conversationId: string, currentUserId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    fetchMessages();
    
    // Poll every 2.5 seconds when document is visible
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchMessages();
      }
    }, 2500);
    return () => clearInterval(interval);
  }, [conversationId, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = newMessage.trim();
    if (!content || sending) return;
    
    setNewMessage("");
    setSending(true);
    
    // Instant optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      content,
      senderId: { _id: currentUserId },
      createdAt: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content })
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      const savedMessage = await res.json();
      
      // Directly replace temp message with populated saved message
      setMessages(prev => prev.map(m => m._id === tempId ? savedMessage : m));
    } catch (error) {
      // Rollback optimistic message on error
      setMessages(prev => prev.filter(m => m._id !== tempId));
      setNewMessage(content); // restore input
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-2">
        <Loader2 className="w-7 h-7 animate-spin text-[#ff7d0c] dark:text-[#f79b4a]" />
        <span className="text-xs text-neutral-400 dark:text-neutral-500">Loading conversation...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50 dark:bg-[#0a0a0b]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500 text-sm space-y-2 p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-950/40 text-[#ff7d0c] dark:text-[#f79b4a] border border-orange-100 dark:border-orange-500/30 flex items-center justify-center font-bold">
              💬
            </div>
            <p className="font-medium text-neutral-700 dark:text-neutral-200">No messages yet</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 max-w-xs">
              Say hello and ask specific verification questions about the item to verify ownership safely.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => {
              const senderIdStr = (msg.senderId?._id || msg.senderId)?.toString();
              const isMe = senderIdStr === currentUserId?.toString();
              return (
                <motion.div
                  key={msg._id || i}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    isMe 
                      ? 'bg-[#FF7D0C] text-white rounded-br-none' 
                      : 'bg-white dark:bg-[#18181c] text-neutral-800 dark:text-neutral-100 border border-neutral-100 dark:border-white/10 rounded-bl-none'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-orange-100' : 'text-neutral-400 dark:text-neutral-500'}`}>
                      {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : 'Sending...'}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white dark:bg-[#141416] border-t border-neutral-200 dark:border-white/10">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input 
            type="text" 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a secure message..."
            className="flex-1 border border-neutral-200 dark:border-white/10 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff7d0c]/30 focus:border-[#ff7d0c] dark:focus:border-[#f79b4a] bg-neutral-50/50 dark:bg-[#18181c] text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            disabled={sending}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            type="submit" 
            disabled={!newMessage.trim() || sending}
            className="btn-asym bg-[#FF7D0C] text-white rounded-full p-2.5 w-10 h-10 flex items-center justify-center disabled:opacity-40 hover:bg-[#ea6c00] transition-colors shadow-sm cursor-pointer"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
          </motion.button>
        </form>
      </div>
    </>
  );
}
