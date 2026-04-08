'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '@/store/useRoomStore';
import { Bot, Sparkles, Loader2, Zap, History, RefreshCcw } from 'lucide-react';

export default function AISidebar() {
  const { isSidebarOpen, transcripts, isSummarizing, setIsSummarizing } = useRoomStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest transcript
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  const handleRecall = async () => {
    if (transcripts.length < 2) return;
    setIsSummarizing(true);
    try {
      // Prompt asks for a 'Recall' button to summarize the last 5 minutes.
      // We simulate "last 5 minutes" by taking the last 50 transcript items.
      const recentContext = transcripts.slice(-50).map(t => `${t.speaker}: ${t.text}`).join('\n');
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          context: recentContext,
          isRecall: true 
        })
      });
      const data = await response.json();
      
      // Instead of an alert, we could inject this into the transcript or a special "Insights" section
      // For now, let's keep the alert but make it look like a system notification in thoughts.
      console.log(`🤖 AI Recall: ${data.summary}`);
      alert(`🤖 Recall Summary (Last 5 mins):\n\n${data.summary}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="w-[380px] h-full cyber-glass border-l border-white/5 flex flex-col pt-6 overflow-hidden z-30"
        >
          {/* Header */}
          <div className="px-6 pb-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00f2fe]/10 text-[#00f2fe]">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <span className="neon-text uppercase tracking-tighter">AI Focus Hub</span>
            </h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Engine</span>
            </div>
          </div>

          {/* Transcript Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10">
            {transcripts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-20 text-center space-y-4">
                <Bot className="w-16 h-16 text-[#00f2fe]" />
                <p className="text-sm font-medium">Neural engine ready.<br/>Detecting speech patterns...</p>
              </div>
            ) : (
              transcripts.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative group"
                >
                  <div className="absolute -left-4 top-0 w-0.5 h-full bg-white/5 group-hover:bg-[#00f2fe]/30 transition-colors rounded-full" />
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black text-[#00f2fe] uppercase tracking-[0.2em] opacity-80">{msg.speaker}</span>
                    <span className="text-[10px] font-medium text-white/20">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-[14px] text-white/80 leading-relaxed font-medium transition-colors group-hover:text-white">{msg.text}</p>
                </motion.div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Action Area (Modern & Minimalist) */}
          <div className="p-6 space-y-4 border-t border-white/5 bg-gradient-to-t from-[#050505] to-transparent">
            <div className="grid grid-cols-2 gap-3">
               <button 
                  onClick={handleRecall}
                  disabled={isSummarizing || transcripts.length < 2}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-[#00f2fe]/20 hover:border-[#00f2fe]/50 hover:text-[#00f2fe] transition-all disabled:opacity-30 disabled:pointer-events-none"
               >
                  <History className="w-4 h-4" />
                  Recall
               </button>
               <button 
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-[#7000ff]/20 hover:border-[#7000ff]/50 hover:text-[#7000ff] transition-all disabled:opacity-30 disabled:pointer-events-none"
               >
                  <RefreshCcw className="w-4 h-4" />
                  Context
               </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(0,242,254,0.4)' }}
              whileTap={{ scale: 0.99 }}
              onClick={handleRecall} // Or another summary function
              disabled={isSummarizing || transcripts.length < 2}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500
                ${isSummarizing || transcripts.length < 2 
                  ? 'bg-white/5 text-white/10 cursor-not-allowed border border-white/5' 
                  : 'bg-gradient-to-r from-[#00f2fe] to-[#7000ff] text-black shadow-2xl relative overflow-hidden group'
                }
              `}
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isSummarizing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Summarize Live
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
