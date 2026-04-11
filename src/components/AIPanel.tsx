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
    <aside className="w-full bg-card flex flex-col h-full overflow-hidden border-border">
      <div className="p-4 border-b border-border flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
           <Brain className="w-4 h-4 text-primary" />
           <span className="text-xs font-bold uppercase tracking-wider text-muted">AI Assistant</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!recap && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-border border-dashed">
             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
             </div>
             <p className="text-sm font-medium text-muted">
               Click below to generate a professional summary and action items for this meeting.
             </p>
          </div>
        )}

        {isGenerating && (
           <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-1/4" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-full" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded animate-pulse w-5/6" />
                </div>
              ))}
           </div>
        )}

        <AnimatePresence>
          {recap && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <section>
                <div className="flex items-center gap-2 mb-3 text-primary">
                   <MessageSquare size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-widest">Meeting Summary</h3>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-border shadow-sm">
                  <p className="text-sm text-foreground leading-relaxed">
                    {recap.summary}
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-primary">
                   <Target size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-widest">Key Takeaways</h3>
                </div>
                <ul className="space-y-3">
                  {recap.points.map((p, i) => (
                    <li key={i} className="text-sm text-muted flex gap-3 items-start drop-shadow-sm">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                       <span className="text-foreground/90">{p}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-3 text-primary">
                   <CheckCircle2 size={16} />
                   <h3 className="text-xs font-bold uppercase tracking-widest">Next Steps</h3>
                </div>
                <ul className="space-y-3">
                   {recap.actions.map((a, i) => (
                      <li key={i} className="flex gap-3 items-start p-3 bg-primary/5 rounded-lg border border-primary/10">
                         <div className="mt-1 w-2 h-2 rounded-sm bg-primary shrink-0" />
                         <span className="text-sm text-foreground/90 font-medium">{a}</span>
                      </li>
                   ))}
                </ul>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-border">
         <button 
           onClick={generateRecap}
           disabled={isGenerating}
           className="btn-primary w-full h-12 shadow-md hover:shadow-lg transition-all duration-200"
         >
            {isGenerating ? 'Processing Insights...' : 'Generate AI Recap'}
         </button>
      </div>
    </aside>
  );
}
