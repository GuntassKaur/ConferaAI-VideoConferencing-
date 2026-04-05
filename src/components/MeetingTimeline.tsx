'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Clock, Search, Zap, Play, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const MeetingTimeline = () => {
    const highlights = [
        { time: '10:15', title: 'Context Setting', desc: 'Kickoff by John Doe. Goals defined.', type: 'start' },
        { time: '10:28', title: 'Frontend Strategy', desc: 'Agreed on Next.js 15 Tailwind stack.', type: 'decision' },
        { time: '10:45', title: 'Backend Arch', desc: 'Discussion on WebRTC scalability.', type: 'topic' },
        { time: '10:55', title: 'AI Integration', desc: 'Decided on OpenAI-powered recaps.', type: 'decision' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Meeting Timeline</h3>
                <div className="flex gap-1.5">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-sm"><Search className="w-4 h-4 text-zinc-500" /></div>
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shadow-sm"><Zap className="w-4 h-4 text-primary" /></div>
                </div>
            </div>

            <div className="relative pl-6 space-y-8 mt-4">
                <div className="absolute left-1.5 top-2 bottom-4 w-px bg-white/10" />
                {highlights.map((h, i) => (
                    <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative group"
                    >
                        <div className={`absolute -left-[22px] top-1 w-3.5 h-3.5 rounded-full border-2 border-[#020617] ${h.type === 'decision' ? 'bg-emerald-500 shadow-emerald-500/50 shadow-[0_0_10px_0px]' : 'bg-primary'} z-10`} />
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">{h.time}</span>
                                <h4 className="font-bold text-xs">{h.title}</h4>
                            </div>
                            <p className="text-[11px] text-secondary leading-relaxed pl-1">{h.desc}</p>
                            <div className="flex items-center gap-3 pt-2 pl-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="flex items-center gap-1 text-[9px] font-bold text-primary px-2 py-1 rounded-lg bg-primary/10 border border-primary/20"><Play className="w-3 h-3" /> Play Snippet</span>
                                <span className="flex items-center gap-1 text-[9px] font-bold text-secondary cursor-pointer hover:text-foreground"><FileText className="w-3 h-3" /> Note</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <GlassCard className="bg-primary/10 border-primary/20 p-5 mt-8 shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                 <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" /> Smart Topic Index
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {['Context', 'Frontend', 'Backend', 'AI', 'Timeline', 'Security', 'Enterprise'].map(tag => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-1 rounded-md bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all cursor-pointer">
                        {tag}
                      </span>
                    ))}
                 </div>
            </GlassCard>
        </div>
    );
};
