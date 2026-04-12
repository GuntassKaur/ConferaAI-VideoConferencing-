'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Loader2, ListTodo, FileText, Target, Zap, ChevronRight } from 'lucide-react';

interface RecapData {
  summary: string;
  keyPoints: string[];
  actionItems: { task: string; priority: 'high' | 'medium' | 'low' }[];
}

export default function AIPanel() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [recap, setRecap] = useState<RecapData | null>(null);

  const generateNeuralRecap = async () => {
    setIsGenerating(true);
    setRecap(null);
    
    try {
      // Simulate real neural processing
      await new Promise(r => setTimeout(r, 2500));
      
      // Real data structure
      setRecap({
        summary: "The architectural review focused on the synchronization of neural adapters across distributed clusters. Consensus was reached on moving to an async-await pattern for the core transmission layer to reduce main-thread latency.",
        keyPoints: [
          "Identified 200ms bottleneck in global state propagation",
          "Approved migration to Redis Streams for persistence",
          "Verified end-to-end encryption protocols for 2026 standards"
        ],
        actionItems: [
          { task: "Refactor transmission hook for async handling", priority: 'high' },
          { task: "Audit cluster health via Prometheus", priority: 'medium' },
          { task: "Update neural documentation for the team", priority: 'low' }
        ]
      });
    } catch (err) {
      console.error("Neural fail", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050b18]/60 backdrop-blur-3xl overflow-hidden font-outfit">
      <div className="p-8 border-b border-white/10 bg-slate-900/40 backdrop-blur-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <motion.div 
               animate={{ rotate: [0, 10, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.2)]"
             >
                <Brain size={24} className="text-indigo-400" />
             </motion.div>
             <div>
                <h3 className="text-lg font-black tracking-tight text-white leading-none mb-1.5">Neural Intelligence</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] text-indigo-400/70 font-black">Quantum Processor v2.0</p>
             </div>
          </div>
          <div className="flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        <AnimatePresence mode="wait">
          {!recap && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="h-full flex flex-col items-center justify-center text-center px-6"
            >
              <div className="w-24 h-24 rounded-[3rem] bg-indigo-500/5 flex items-center justify-center mb-8 border border-white/5 shadow-inner relative group">
                <Sparkles className="w-10 h-10 text-indigo-500/40 group-hover:scale-125 transition-transform duration-500" />
                <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-3">System Standby</p>
              <h4 className="text-3xl font-black text-white leading-tight mb-6 tracking-tighter">Awaiting Signal<br />Processing.</h4>
              <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto opacity-70">
                Synchronize your audio streams to initiate autonomous recap synthesis.
              </p>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-12"
            >
               <div className="flex flex-col items-center justify-center py-20 relative">
                  <div className="relative z-10">
                    <Loader2 size={64} className="text-indigo-500 animate-spin mb-8" />
                    <motion.div 
                      animate={{ scale: [1, 2, 1], opacity: [0.1, 0.3, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute inset-0 bg-indigo-500 blur-[80px] -z-10"
                    />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-[0.6em] text-indigo-400 animate-pulse">De-multiplexing Transmissions...</p>
               </div>
               
               <div className="space-y-8 px-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-4 opacity-20">
                       <div className="h-2.5 bg-indigo-500/30 rounded-full w-1/3" />
                       <div className="space-y-3">
                          <div className="h-4 bg-white/5 rounded-xl w-full" />
                          <div className="h-4 bg-white/5 rounded-xl w-4/5" />
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {recap && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <section className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <FileText size={16} className="text-indigo-400" />
                   </div>
                   <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Transmission Abstract</h5>
                </div>
                <div className="p-6 rounded-[2rem] bg-indigo-600/5 border border-white/5 text-[15px] text-slate-300 leading-relaxed font-medium shadow-inner ring-1 ring-white/5">
                  {recap.summary}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Target size={16} className="text-blue-400" />
                   </div>
                   <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Neutral Keyframes</h5>
                </div>
                <div className="space-y-4">
                  {recap.keyPoints.map((p, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ x: 10 }}
                      className="flex gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-sm text-slate-200 font-bold group hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all cursor-default shadow-sm ring-1 ring-white/5"
                    >
                       <Zap size={18} className="text-indigo-500 shrink-0 group-hover:scale-125 transition-transform" />
                       <span className="leading-snug">{p}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="space-y-6 pb-20">
                <div className="flex items-center gap-4">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <ListTodo size={16} className="text-emerald-400" />
                   </div>
                   <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Matrix Protocols</h5>
                </div>
                <div className="space-y-4">
                  {recap.actionItems.map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-emerald-500/30 transition-all shadow-sm ring-1 ring-white/5"
                    >
                       <div className="flex items-center gap-4 overflow-hidden">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.priority === 'high' ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' : item.priority === 'medium' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-slate-500'}`} />
                          <span className="text-sm text-slate-300 font-bold truncate tracking-tight group-hover:text-white transition-colors">{item.task}</span>
                       </div>
                       <ChevronRight size={16} className="text-slate-700 group-hover:text-emerald-500 transition-colors shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 bg-slate-900/60 border-t border-white/10 backdrop-blur-3xl mt-auto">
        {!recap && !isGenerating && (
          <button 
            onClick={generateNeuralRecap}
            className="w-full h-18 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-[0_15px_30px_rgba(79,70,229,0.3)] active:scale-[0.98] flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-xs py-4"
          >
            <Sparkles size={20} className="animate-pulse" />
            <span>Synthesize Intel</span>
          </button>
        )}
        {recap && (
           <button 
             onClick={() => setRecap(null)}
             className="w-full h-18 bg-white/5 hover:bg-white/10 text-slate-400 font-black rounded-2xl transition-all border border-white/5 active:scale-[0.98] uppercase tracking-[0.2em] text-[10px]"
           >
             Purge Insights
           </button>
        )}
      </div>
    </div>
  );
}
