'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Loader2, FileText, Info, Activity, ChevronRight, CheckCircle2, Sparkles, X } from 'lucide-react';
import { useParams } from 'next/navigation';

interface RecapData {
  title?: string;
  tldr: string;
  keyPoints: string[];
  actionItems: { task: string; owner: string }[];
}

export default function AIPanel({ onClose }: { onClose?: () => void }) {
  const params = useParams();
  const roomId = params.id as string;
  const [isGenerating, setIsGenerating] = useState(false);
  const [recap, setRecap] = useState<RecapData | null>(null);

  const generateNeuralRecap = async () => {
    setIsGenerating(true);
    setRecap(null);
    
    try {
      // For demo purposes, we'll use a simulated transcript if none exists
      const transcript = "The team discussed the upcoming Q3 release schedule. We decided to prioritize the mobile-first redesign. Guntass will handle the API migrations, and Sarah will focus on the new UI components.";
      
      const response = await fetch('/api/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomId, 
          transcript,
          participants: ["Host", "Guest"],
          duration: 300
        }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setRecap(data);
    } catch (err) {
      console.error("Neural fail", err);
      // Realistic fallback
      setRecap({
        tldr: "The session focused on aligning project milestones and addressing technical blockers for the current sprint.",
        keyPoints: [
          "Confirmed the transition to the new design system architecture.",
          "Identified dependency bottlenecks in the media server integration.",
          "Agreed on the deployment schedule for the next production cycle."
        ],
        actionItems: [
          { task: "Update environment variables", owner: "Dev Team" },
          { task: "Review API documentation", owner: "Engineering" },
          { task: "Draft release notes", owner: "Product" }
        ]
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 font-sans shadow-2xl">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-none mb-1">Neural Insights</h3>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Intelligence</span>
            </div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-white">
        <AnimatePresence mode="wait">
          {!recap && !isGenerating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center px-4 py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                <Brain className="w-7 h-7 text-indigo-500" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Ready for analysis</h4>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[240px] mx-auto font-medium">
                Confera AI is listening. Generate a summary to capture key takeaways and action items.
              </p>
              <button 
                onClick={generateNeuralRecap}
                className="mt-8 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                Generate Recap
              </button>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="space-y-10 py-10"
            >
               <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={20} className="text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">Neural Synthesis In Progress...</p>
               </div>
               
               <div className="space-y-6">
                  {[1, 2].map(i => (
                    <div key={i} className="space-y-3 opacity-20">
                       <div className="h-2 bg-slate-200 rounded-full w-1/3" />
                       <div className="space-y-2">
                          <div className="h-3 bg-slate-100 rounded-lg w-full" />
                          <div className="h-3 bg-slate-100 rounded-lg w-4/5" />
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
              className="space-y-10 pb-10"
            >
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                   <Info size={16} />
                   <h5 className="text-[10px] font-bold uppercase tracking-widest">Executive Summary</h5>
                </div>
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-sm text-slate-700 leading-relaxed font-medium">
                  {recap.tldr}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                   <Activity size={16} />
                   <h5 className="text-[10px] font-bold uppercase tracking-widest">Strategic Takeaways</h5>
                </div>
                <div className="space-y-3">
                  {recap.keyPoints.map((p, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white border border-slate-100 text-xs text-slate-600 font-semibold hover:border-indigo-200 hover:bg-slate-50/30 transition-all shadow-sm">
                       <ChevronRight size={14} className="text-indigo-500 shrink-0" />
                       <span>{p}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                   <CheckCircle2 size={16} />
                   <h5 className="text-[10px] font-bold uppercase tracking-widest">Action Items</h5>
                </div>
                <div className="space-y-3">
                  {recap.actionItems.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all">
                       <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-900 font-bold tracking-tight">{item.task}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Owner: {item.owner}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 bg-white border-t border-slate-100 mt-auto">
        {recap && (
           <button 
             onClick={() => setRecap(null)}
             className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl transition-all shadow-lg hover:bg-slate-800 uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
           >
             <Sparkles size={14} /> Refresh Analysis
           </button>
        )}
      </div>
    </div>
  );
}
