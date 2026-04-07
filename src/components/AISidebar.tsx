'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '@/store/useRoomStore';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

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
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="w-80 h-full border-l border-white/10 bg-[#050505]/40 backdrop-blur-xl flex flex-col pt-4 overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 pb-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00f2fe]" />
              Confera Intelligence
            </h2>
          </div>

          {/* Transcript Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
            {transcripts.length === 0 ? (
              <p className="text-white/40 text-sm italic mt-10 text-center">Speech recognition is active. Start speaking...</p>
            ) : (
              transcripts.map((msg, i) => (
                <motion.div
                  key={msg.id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/5 p-3 rounded-lg backdrop-blur-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f2fe] to-[#7000ff]" />
                  <p className="text-xs text-[#00f2fe] font-medium mb-1">{msg.speaker}</p>
                  <p className="text-sm text-gray-200 leading-snug">{msg.text}</p>
                </motion.div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Action Area */}
          <div className="p-5 border-t border-white/5 bg-gradient-to-t from-[#050505] to-transparent">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCatchMeUp}
              disabled={isSummarizing || transcripts.length < 2}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-300
                ${isSummarizing || transcripts.length < 2 
                  ? 'bg-white/5 text-white/30 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#00f2fe]/20 to-[#7000ff]/20 text-white border border-[#00f2fe]/30 hover:border-[#7000ff]/50 hover:shadow-[0_0_15px_rgba(112,0,255,0.3)]'
                }
              `}
            >
              {isSummarizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#00f2fe]" />}
              Catch Me Up
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
