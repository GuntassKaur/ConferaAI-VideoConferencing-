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
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 font-inter">
      <div className="p-6 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Brain size={20} className="text-blue-500" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white leading-none mb-1">AI Meeting Assistant</h3>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Real-time Analysis</p>
             </div>
          </div>
          <div className="flex items-center gap-1.5">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {!recap && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center px-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 border border-slate-700">
                <FileText className="w-7 h-7 text-slate-500" />
              </div>
              <h4 className="text-base font-bold text-slate-200 mb-2 font-inter tracking-tight">Ready for analysis</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[220px] mx-auto opacity-80">
                Start speaking to capture insights. Click below to generate a comprehensive session summary.
              </p>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-10 py-10"
            >
               <div className="flex flex-col items-center justify-center">
                  <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 animate-pulse">Processing Transcript...</p>
               </div>
               
               <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="space-y-3 opacity-20">
                       <div className="h-2 bg-slate-700 rounded-full w-1/3" />
                       <div className="space-y-2">
                          <div className="h-3 bg-slate-800 rounded-lg w-full" />
                          <div className="h-3 bg-slate-800 rounded-lg w-4/5" />
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {recap && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                   <Info size={14} className="text-blue-500" />
                   <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Meeting Abstract</h5>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 text-sm text-slate-300 leading-relaxed font-medium">
                  {recap.summary}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-3">
                   <Activity size={14} className="text-emerald-500" />
                   <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Key Highlights</h5>
                </div>
                <div className="space-y-3">
                  {recap.keyPoints.map((p, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-800/20 border border-slate-800 text-xs text-slate-300 font-medium hover:border-slate-700 transition-colors">
                       <ChevronRight size={14} className="text-blue-500 shrink-0" />
                       <span>{p}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 pb-12">
                <div className="flex items-center gap-3">
                   <CheckCircle2 size={14} className="text-blue-500" />
                   <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Assigned Action Items</h5>
                </div>
                <div className="space-y-3">
                  {recap.actionItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/40 border border-slate-800 group hover:bg-slate-800/60 transition-all">
                       <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.priority === 'high' ? 'bg-red-500' : item.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-500'}`} />
                          <span className="text-xs text-slate-300 font-semibold truncate tracking-tight">{item.task}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-slate-950 border-t border-slate-800 mt-auto">
        {!recap && !isGenerating && (
          <button 
            onClick={generateNeuralRecap}
            className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/10 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
          >
            <span>Generate Meeting Recap</span>
          </button>
        )}
        {recap && (
           <button 
             onClick={() => setRecap(null)}
             className="w-full h-12 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all border border-slate-700 uppercase tracking-widest text-[10px]"
           >
             Dismiss Insights
           </button>
        )}
      </div>
    </div>
  );
}
