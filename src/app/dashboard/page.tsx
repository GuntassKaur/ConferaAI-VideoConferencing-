'use client';

import React, { useState } from 'react';
import { 
  Plus, Video, Calendar, Clock, Settings, User, 
  MoreVertical, LogOut, ChevronRight, BarChart3, TrendingUp, Sparkles, FileText, Zap, ShieldCheck, Activity, BrainCircuit, Users, Globe2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const upcomingMeetings = [
    { title: 'Executive Sync: Q4 Roadmap', time: '10:30 AM', duration: '45m', participants: 8, id: 'q4-sync', live: true },
    { title: 'Global Ops Briefing', time: '1:00 PM', duration: '60m', participants: 4, id: 'ops-brief', live: false },
    { title: 'Future Strategy: SpaceSync', time: '4:15 PM', duration: '90m', participants: 12, id: 'future-strat', live: false },
  ];

  const intelligenceCards = [
    { title: 'Core Marketing Review', date: 'Yesterday', insights: 14, confidence: 98, role: 'AI Scribe' },
    { title: 'Tech Architecture v2', date: 'Oct 12', insights: 22, confidence: 96, role: 'Solution AI' },
  ];

  return (
    <div className="flex h-screen bg-[#020205] overflow-hidden font-sans text-foreground selection:bg-primary/30 relative">
      {/* Intense Background Layers */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_-10%_110%,#1e1b4b_0%,transparent_50%)]" />
      <div className="fixed top-[-400px] right-[-400px] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[180px] pointer-events-none opacity-40 animate-pulse" />

      {/* LUX SIDEBAR: Deep Glass Morphism */}
      <aside className="w-[110px] border-r border-white/[0.05] flex flex-col items-center py-12 gap-12 glass-panel z-50 backdrop-blur-[45px] hover:w-[130px] transition-all duration-700 ease-out p-6">
        <div className="w-14 h-14 rounded-[22px] bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center neon-border p-3 group cursor-pointer transition-all hover:rotate-[15deg]">
          <Video className="w-full h-full text-white" />
        </div>
        
        <nav className="flex flex-col gap-6 w-full h-full pt-10 px-2 opacity-60 hover:opacity-100 transition-opacity">
          {[Calendar, Clock, User, BarChart3, BrainCircuit].map((Icon, i) => (
             <button key={i} className="w-full aspect-square rounded-[24px] hover:bg-white/5 text-white/40 hover:text-primary flex items-center justify-center transition-all p-4 hover:neon-border hover:shadow-primary/10">
               <Icon className="w-full h-full stroke-[2.5]" />
             </button>
          ))}
          <div className="w-full h-px bg-white/5 my-4" />
          <button className="w-full aspect-square rounded-[24px] hover:bg-white/5 text-white/40 hover:text-primary flex items-center justify-center transition-all p-4">
             <Settings className="w-full h-full stroke-[2.5]" />
          </button>
        </nav>

        <button className="mt-auto w-full aspect-square rounded-[24px] text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all p-4">
           <LogOut className="w-full h-full stroke-[2.5]" />
        </button>
      </aside>

      {/* PRIMARY DASHBOARD INTERFACE */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* TOP STATUS BAR */}
        <header className="px-20 py-16 flex justify-between items-end border-b border-white/[0.03]">
           <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                 <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                 <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Global Uplink Active</span>
              </div>
              <h1 className="text-6xl font-[900] font-outfit text-white tracking-tight leading-none text-glow">HELLO,<br/><span className="text-white/20">AGENT MILLER.</span></h1>
           </div>
           
           <div className="flex items-center gap-8">
              <div className="flex flex-col items-end mr-10 hidden xl:flex">
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-2">Network Strength</span>
                 <div className="flex gap-1.5 px-4 py-2 glass-panel rounded-xl">
                    {[1,1,1,1,1].map((_, i) => <div key={i} className={`w-1 h-3 rounded-full ${i < 4 ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 'bg-white/5'}`} />)}
                 </div>
              </div>
              <Link href={`/meeting/${Math.random().toString(36).substr(2, 9)}`}>
                  <button className="btn-premium h-[85px] px-14 !bg-primary !text-white !border-primary/40 font-black text-lg gap-4 shadow-2xl shadow-primary/30 uppercase tracking-[0.2em] relative group overflow-hidden">
                     <Plus className="w-6 h-6 stroke-[4]" /> Launch Sync
                     <div className="absolute inset-0 bg-gradient-to-r from-primary via-white/5 to-primary transition-transform duration-1000 -translate-x-[200%] group-hover:translate-x-[200%]" />
                  </button>
              </Link>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto px-20 pb-20 pt-16 custom-scrollbar scroll-smooth">
          <div className="max-w-[1500px] grid grid-cols-1 xl:grid-cols-5 gap-16">
            
            {/* LARGE GRID: Sessions & Real-time Activities */}
            <div className="xl:col-span-3 space-y-16">
                <section>
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 border-l-4 border-primary pl-6">Scheduled Synchronizations</h2>
                  </div>
                  <div className="grid gap-8">
                    {upcomingMeetings.map((mtg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="glass-panel p-10 rounded-[35px] flex flex-col lg:flex-row lg:items-center justify-between gap-12 hover:neon-border hover:bg-white/[0.04] transition-all duration-700 group relative overflow-hidden"
                      >
                        <div className="flex items-center gap-12">
                            <div className="flex flex-col items-center justify-center w-32 h-32 rounded-[32px] bg-white/[0.04] border border-white/5 shadow-2xl group-hover:bg-primary transition-all duration-700 p-4">
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/80">Sync At</span>
                              <span className="text-2xl font-black text-white mt-1 uppercase tracking-tighter">{mtg.time}</span>
                            </div>
                            <div className="flex flex-col gap-3">
                              <h3 className="font-extrabold text-3xl font-outfit text-white tracking-tighter text-glow">{mtg.title}</h3>
                              <div className="flex items-center gap-8 text-xs text-white/30 mt-2 font-black uppercase tracking-[0.15em]">
                                <span className="flex items-center gap-2 group-hover:text-primary transition-colors"><Clock className="w-5 h-5" /> {mtg.duration}</span>
                                <span className="flex items-center gap-2 group-hover:text-primary transition-colors"><Users className="w-5 h-5" /> {mtg.participants} Analysts</span>
                                {mtg.live && <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-primary text-[8px] animate-pulse">Now Live</span>}
                              </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {mtg.live ? (
                              <Link href={`/meeting/${mtg.id}`}>
                                  <button className="btn-premium !bg-primary h-16 w-48 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:neon-border transition-all">Join Space</button>
                              </Link>
                            ) : (
                              <button className="btn-premium h-16 w-48 text-sm font-black uppercase tracking-widest hover:bg-white/10 transition-all">Details</button>
                            )}
                            <button className="w-16 h-16 rounded-[22px] glass-panel flex items-center justify-center text-white/20 hover:text-white transition-all">
                              <MoreVertical className="w-7 h-7" />
                            </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
            </div>

            {/* ANALYTICS RAIL: Space-Tech Widgets */}
            <div className="xl:col-span-2 space-y-16">
                {/* ADVANCED USAGE RADIOS */}
                <section>
                   <div className="flex items-center justify-between mb-12">
                      <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 border-l-4 border-indigo-400 pl-6">Cognitive Metrics</h2>
                   </div>
                   <div className="grid grid-cols-1 gap-8">
                      <div className="glass-panel p-12 rounded-[45px] hover:neon-border transition-all group cursor-default">
                         <div className="flex justify-between items-start mb-10">
                            <div className="w-16 h-16 rounded-[24px] bg-primary/10 text-primary flex items-center justify-center p-4">
                               <TrendingUp className="w-full h-full" />
                            </div>
                            <Activity className="w-6 h-6 text-white/10 group-hover:text-primary transition-colors animate-pulse" />
                         </div>
                         <p className="text-[10px] font-black text-white/2) uppercase tracking-[0.5em] mb-4">Space Productivity Score</p>
                         <h3 className="text-7xl font-[900] font-outfit text-white tracking-tighter leading-none mb-10">92<span className="text-primary text-4xl">%</span></h3>
                         <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_20px_rgba(139,92,246,0.6)]" />
                         </div>
                      </div>
                   </div>
                </section>

                {/* AI INTELLIGENCE PIPELINE */}
                <section>
                  <div className="flex items-center justify-between mb-12">
                    <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 border-l-4 border-emerald-400 pl-6">AI Knowledge Cluster</h2>
                  </div>
                  <div className="space-y-6">
                     {intelligenceCards.map((card, idx) => (
                        <div key={idx} className="glass-panel p-8 rounded-[35px] border-white/5 hover:border-emerald-500/30 transition-all flex flex-col gap-6 group cursor-pointer active:scale-[0.98]">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/5 group-hover:bg-emerald-500/20 text-emerald-500 flex items-center justify-center p-4 transition-all">
                                    <Globe2 className="w-full h-full" />
                                 </div>
                                 <div className="flex flex-col">
                                   <h4 className="font-exrabold text-xl font-outfit text-white tracking-tight leading-tight">{card.title}</h4>
                                   <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[9px] font-black text-emerald-500/60 uppercase tracking-widest">{card.role}</span>
                                   </div>
                                 </div>
                              </div>
                              <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{card.confidence}% Accuracy</span>
                           </div>
                           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between">
                              <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                 <Sparkles className="w-3.5 h-3.5" /> {card.insights} Intelligent Decisions Synthesized
                              </span>
                              <ChevronRight className="w-4 h-4 text-emerald-500" />
                           </div>
                        </div>
                     ))}
                  </div>
                </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
