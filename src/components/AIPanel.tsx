'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Brain, ListChecks, MessageSquare, Loader2 } from 'lucide-react';

const AIPanel = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRecap, setShowRecap] = useState(false);

  const handleGenerateRecap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowRecap(true);
    }, 2000);
  };

  return (
    <div className="w-[380px] flex-shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-600">
             <Brain className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">Neural Assistant</h2>
        </div>
        <div className="flex h-2 w-2 rounded-full bg-emerald-500" />
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {/* ChatGPT Style Messages */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-white/5 p-3 rounded-2xl text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Hi, I'm analyzing the meeting in real-time. I can generate summaries, identify action items, or answer questions about the discussion.
          </div>

          <AnimatePresence>
            {showRecap && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-premium p-4 rounded-2xl border border-indigo-500/30 space-y-3"
              >
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                   <Sparkles className="w-4 h-4" />
                   <span className="text-xs font-black uppercase tracking-widest">5-Min Neural Recap</span>
                </div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  The team discussed the Q3 product roadmap and final architecture for the AI integration module.
                </p>
                <div className="space-y-2">
                   <div className="flex items-start gap-2 text-[11px] text-slate-500 italic">
                      <ListChecks className="w-3.5 h-3.5 mt-0.5" />
                      <div>
                        <strong>Action:</strong> Guntass to finalize API specs. <br/>
                        <strong>Action:</strong> Sarah to review UI mocks.
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer / Input */}
      <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-4">
        <button 
          onClick={handleGenerateRecap}
          disabled={isGenerating}
          className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate 5-min Recap
        </button>

        <div className="relative">
           <input 
             type="text" 
             placeholder="Ask anything..." 
             className="w-full h-11 pl-4 pr-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
           />
           <button className="absolute right-2 top-1.5 h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 transition-colors">
              <Send className="w-4 h-4" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
