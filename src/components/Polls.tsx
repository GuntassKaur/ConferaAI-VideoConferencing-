'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { BarChart3, Plus, X, PieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Polls = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [activePolls, setActivePolls] = useState<any[]>([]);

  const startPoll = () => setIsCreating(true);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Meeting Polls</h3>
        {!isCreating && (
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-[10px] text-primary" onClick={startPoll}>
            <Plus className="w-3 h-3" /> Create Poll
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isCreating ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard className="bg-white border-primary/20 p-4 space-y-4 shadow-2xl">
              <div className="flex justify-between items-center">
                 <span className="font-bold text-xs">New Poll</span>
                 <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreating(false)}><X className="w-4 h-4" /></Button>
              </div>
              <input 
                placeholder="Ask a question..." 
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
              />
              <div className="space-y-2">
                 <input placeholder="Option 1" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs" />
                 <input placeholder="Option 2" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs" />
              </div>
              <Button className="w-full h-10 text-xs font-bold" onClick={() => {
                setActivePolls([{
                  question: "Finalize frontend design by Friday?",
                  options: [
                    { text: "Yes, definitely", votes: 8 },
                    { text: "No, need more time", votes: 3 }
                  ],
                  total: 11
                }]);
                setIsCreating(false);
              }}>Launch Poll</Button>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {activePolls.map((poll, idx) => (
              <GlassCard key={idx} className="p-4 bg-white border-slate-200 border shadow-xl">
                 <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                   <PieChart className="w-4 h-4 text-primary" /> {poll.question}
                 </h4>
                 <div className="space-y-3">
                    {poll.options.map((opt: any, i: number) => {
                      const perc = Math.round((opt.votes / poll.total) * 100);
                      return (
                        <div key={i} className="space-y-1.5">
                           <div className="flex justify-between text-[10px] font-bold">
                              <span>{opt.text}</span>
                              <span className="text-secondary">{perc}% ({opt.votes})</span>
                           </div>
                           <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${perc}%` }}
                                 className="h-full bg-primary shadow-sm shadow-primary/40"
                              />
                           </div>
                        </div>
                      );
                    })}
                 </div>
                 <Button variant="ghost" className="w-full h-8 mt-4 text-[10px] text-secondary">Vote</Button>
              </GlassCard>
            ))}
            {activePolls.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                 <BarChart3 className="w-8 h-8 text-zinc-700 mb-2" />
                 <p className="text-[10px] text-secondary font-medium tracking-wide">No active polls in this session</p>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
