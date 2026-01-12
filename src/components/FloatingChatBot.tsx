"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, MessageSquare } from "lucide-react";
import Link from "next/link";

export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Ayubowan! 🙏 I am your Rasas AI guide. How can I help you explore Sri Lankan arts & culture today?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: "I'm currently in beta mode. Soon I'll be able to help you find specific events and book tickets directly! For now, try browsing the 'Music' category." 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Rasas Assistant</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] text-violet-100 font-medium tracking-wide opacity-80">ONLINE</span>
                </div>
              </div>
            </div>
            <button 
              onClick={toggleOpen}
              className="p-1.5 rounded-lg active:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-zinc-950/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed
                    ${msg.type === 'user' 
                      ? 'bg-violet-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 rounded-tl-none shadow-sm'
                    }
                  `}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 shrink-0">
             {messages.length === 1 && (
               <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                 {["Find Events", "Trending Artists", "Buy Tickets"].map(suggestion => (
                   <button
                     key={suggestion}
                     onClick={() => {
                        setInputValue(suggestion);
                        // Optional: auto-send
                     }}
                     className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-xs font-medium text-slate-600 dark:text-zinc-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-300 transition-colors border border-transparent hover:border-violet-200 dark:hover:border-violet-800"
                   >
                     {suggestion}
                   </button>
                 ))}
               </div>
             )}
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about events, artists..."
                className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-900 dark:text-white rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:bg-white dark:focus:bg-zinc-900 transition-all border border-transparent focus:border-violet-200 dark:focus:border-violet-800"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim()}
                className="absolute right-1.5 p-1.5 rounded-full bg-violet-600 text-white disabled:bg-slate-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed hover:bg-violet-700 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleOpen}
        className={`
          group relative flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 active:scale-95
          ${isOpen 
            ? 'bg-slate-800 dark:bg-zinc-800 text-white rotate-90' 
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-violet-500/25'
          }
        `}
      >
        {isOpen ? (
          <X className="w-6 h-6 -rotate-90 transition-transform" />
        ) : (
          <>
            <Bot className="w-7 h-7" />
            
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold items-center justify-center border border-white dark:border-zinc-900">1</span>
            </span>
            
            {/* Tooltip on hover */}
            <div className="absolute right-full mr-4 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none translate-x-2 group-hover:translate-x-0 transition-transform">
              Chat with AI
              {/* Arrow */}
              <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white dark:bg-zinc-800 rotate-45"></div>
            </div>
          </>
        )}
      </button>
    </div>
  );
}
