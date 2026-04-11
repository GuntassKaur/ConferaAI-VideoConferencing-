'use client';

import React, { useState } from 'react';
import { Sparkles, CheckCircle2, MessageSquare, Target, Brain, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '@/store/useRoomStore';

export default function AIPanel() {
  const { transcripts } = useRoomStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [recap, setRecap] = useState<null | { summary: string, points: string[], actions: string[] }>(null);

  const generateRecap = async () => {
    setIsGenerating(true);
    
    // Simulate real neural processing delay
    const fullTranscript = transcripts.length > 0 
      ? transcripts.map(t => `${t.speaker}: ${t.text}`).join('\n')
      : "The meeting has just started. No significant dialogue detected yet.";

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: fullTranscript })
      });
      const data = await res.json();
      
      if (res.ok) {
        setRecap({
          summary: data.minutes || "Neural synthesis complete. Meeting is in early stages.",
          points: [data.sentiment?.label || "Balanced Productivity"],
          actions: data.actionItems?.map((a: any) => `${a.assignee}: ${a.task}`) || ["Monitoring session..."]
        });
      }
    } catch (error) {
      console.error('Synthesis failed', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050b18]">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Brain size={16} className="text-indigo-400" />
           </div>
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence Matrix</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {!recap && !isGenerating && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-dashed border-white/5 bg-slate-900/10">
             <div className="w-16 h-16 rounded-3xl bg-indigo-500/5 flex items-center justify-center mb-6 border border-indigo-500/10">
                <Sparkles className="w-8 h-8 text-indigo-400" />
             </div>
             <p className="text-xs font-bold uppercase tracking-widest text-slate-500 leading-relaxed max-w-[180px]">
               Neural synthesis is ready. Click below to analyze this session.
             </p>
          </div>
        )}

        {isGenerating && (
           <div className="space-y-8 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4 opacity-40">
                   <div className="h-2 bg-indigo-500/20 rounded-full w-1/3 animate-pulse" />
                   <div className="space-y-2">
                      <div className="h-3 bg-white/5 rounded-lg w-full animate-pulse" />
                      <div className="h-3 bg-white/5 rounded-lg w-4/5 animate-pulse" />
                   </div>
                </div>
              ))}
           </div>
        )}

        <AnimatePresence>
          {recap && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-10"
            >
              <section>
                <div className="flex items-center gap-3 mb-4 text-indigo-400">
                   <MessageSquare size={16} className="opacity-70" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Summary</h3>
                </div>
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/5 shadow-xl">
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {recap.summary}
                  </p>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4 text-indigo-400">
                   <Target size={16} className="opacity-70" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">High-Level Intel</h3>
                </div>
                <div className="space-y-3">
                  {recap.points.map((p, i) => (
                    <motion.div 
                      key={i} 
                      className="text-xs text-slate-300 flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5"
                    >
                       <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                       <span className="font-bold tracking-tight">{p}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4 text-indigo-400">
                   <CheckCircle2 size={16} className="opacity-70" />
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Actionable Items</h3>
                </div>
                <div className="space-y-3">
                   {recap.actions.map((a, i) => (
                      <div key={i} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                         <div className="w-4 h-4 rounded-md border-2 border-primary/40 flex-shrink-0" />
                         <span className="text-xs text-slate-400 font-bold tracking-tight">{a}</span>
                      </div>
                   ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-black/40 border-t border-white/5">
         <button 
           onClick={generateRecap}
           disabled={isGenerating}
           className="btn-primary w-full h-14 text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(99,102,241,0.2)]"
         >
            {isGenerating ? (
              <span className="flex items-center gap-3">
                <Loader2 size={18} className="animate-spin" /> Processing Matrix...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles size={18} /> Generate Insights
              </span>
            )}
         </button>
      </div>
    </div>
  );
}
