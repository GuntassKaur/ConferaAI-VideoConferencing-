'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '@/store/useRoomStore';
import { Bot, Sparkles, Loader2, Zap } from 'lucide-react';

export default function AISidebar() {
  const { isSidebarOpen, transcripts, isSummarizing, setIsSummarizing } = useRoomStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest transcript
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcripts]);

  const handleCatchMeUp = async () => {
    setIsSummarizing(true);
    try {
      const recentContext = transcripts.slice(-20).map(t => `${t.speaker}: ${t.text}`).join('\n');
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: recentContext })
      });
      const data = await response.json();
      alert(`🤖 AI Summary: ${data.summary}`);
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
              <span className="neon-text uppercase tracking-tighter">Confera Intelligence</span>
            </h2>
          </div>

          {/* Transcript Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 scrollbar-thin scrollbar-thumb-white/10">
            {transcripts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-30 text-center">
                <Bot className="w-12 h-12 mb-4" />
                <p className="text-sm italic">Neural link established.<br/>Waiting for speech signals...</p>
              </div>
            ) : (
              transcripts.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative pl-4"
                >
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-[#00f2fe] to-transparent opacity-50 rounded-full" />
                  <p className="text-[10px] font-bold text-[#00f2fe] uppercase tracking-widest mb-1 opacity-70">{msg.speaker}</p>
                  <p className="text-sm text-gray-300 leading-relaxed font-medium">{msg.text}</p>
                </motion.div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Action Area */}
          <div className="p-6 bg-gradient-to-t from-[#050505] to-transparent">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,242,254,0.3)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCatchMeUp}
              disabled={isSummarizing || transcripts.length < 2}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest transition-all duration-300
                ${isSummarizing || transcripts.length < 2 
                  ? 'bg-white/5 text-white/20 cursor-not-allowed border-white/5' 
                  : 'bg-gradient-to-r from-[#00f2fe] to-[#7000ff] text-black border-none shadow-lg'
                }
              `}
            >
              {isSummarizing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Catch Me Up
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
