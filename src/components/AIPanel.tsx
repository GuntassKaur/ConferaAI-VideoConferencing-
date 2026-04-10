'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, MessageSquare, Target, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recap, setRecap] = useState<null | { summary: string, points: string[], actions: string[] }>(null);

  const generateRecap = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setRecap({
        summary: "The team discussed the upcoming Q3 project launch. Key focus was on performance optimization and the new design system adoption.",
        points: [
          "Design system is 80% complete.",
          "Performance issues identified in the dashboard grid.",
          "Marketing team needs the final assets by Friday."
        ],
        actions: [
          "Fix grid re-renders by EOD @Frontend",
          "Send brand kit to Marketing @Design",
          "Schedule follow-up on Thursday"
        ]
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <aside className="w-80 bg-slate-900 border-l border-white/5 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Brain className="w-4 h-4 text-indigo-400" />
           <span className="text-xs font-bold uppercase tracking-wider text-slate-300">AI Assistant</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!recap && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-800/20 rounded-2xl border border-white/5">
             <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-indigo-500" />
             </div>
             <p className="text-sm font-medium text-slate-400">
               Click below to generate a real-time recap of your meeting.
             </p>
          </div>
        )}

        {isGenerating && (
           <div className="p-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-slate-800 rounded animate-pulse w-1/4" />
                  <div className="h-4 bg-slate-800 rounded animate-pulse w-full" />
                </div>
              ))}
           </div>
        )}

        <AnimatePresence>
          {recap && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 p-2"
            >
              <section>
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                   <MessageSquare size={14} />
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Summary</h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {recap.summary}
                </p>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                   <Target size={14} />
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Key Points</h3>
                </div>
                <ul className="space-y-2">
                  {recap.points.map((p, i) => (
                    <li key={i} className="text-sm text-slate-400 flex gap-2">
                       <span className="text-indigo-500">•</span> {p}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                   <CheckCircle2 size={14} />
                   <h3 className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Action Items</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                   {recap.actions.map((a, i) => (
                      <li key={i} className="flex gap-2 items-start">
                         <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                         {a}
                      </li>
                   ))}
                </ul>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4 bg-slate-900 border-t border-white/5">
         <button 
           onClick={generateRecap}
           disabled={isGenerating}
           className="btn-primary w-full h-12 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all active:scale-95 disabled:opacity-50"
         >
            {isGenerating ? 'Analyzing...' : 'Generate 5-Min Recap'}
         </button>
      </div>
    </aside>
  );
}
