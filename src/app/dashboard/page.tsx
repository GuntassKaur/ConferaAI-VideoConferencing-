'use client';

import React, { useState } from 'react';
import { 
  Plus, Video, Calendar, Clock, Settings, User, 
  MoreVertical, LogOut, ChevronRight, BarChart3, TrendingUp, Sparkles, FileText, Zap, ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const upcomingMeetings = [
    { title: 'Technical Sync: Project Orion', time: '10:30 AM', duration: '45m', participants: 8, id: 'orion-sync', isNow: true },
    { title: 'Global Operations Sync', time: '1:00 PM', duration: '60m', participants: 4, id: 'global-ops', isNow: false },
    { title: 'Future Strategy Review', time: '4:15 PM', duration: '90m', participants: 12, id: 'strat-review', isNow: false },
  ];

  const recentIntelligence = [
    { title: 'Marketing Sync Q3', date: 'Yesterday', insights: 4, score: 87 },
    { title: 'Internal Review: v2.4', date: 'Oct 12', insights: 7, score: 92 },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground selection:bg-primary/30 relative">
      {/* Background Decorators */}
      <div className="fixed inset-0 orb-background z-0" />
      <div className="fixed top-[-100px] left-[-100px] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-[100px] border-r border-white/5 flex flex-col items-center py-10 gap-10 glass-card z-20 backdrop-blur-[32px]">
        <div className="w-14 h-14 rounded-[18px] bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center neon-glow mb-4 p-3">
          <Video className="w-full h-full text-white" />
        </div>
        
        <nav className="flex flex-col gap-6 w-full px-5">
          <button className="w-full aspect-square rounded-[22px] bg-primary/20 text-indigo-400 flex items-center justify-center transition-all p-4 border border-indigo-500/30">
            <Calendar className="w-full h-full" />
          </button>
          <button className="w-full aspect-square rounded-[22px] text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center justify-center transition-all p-4">
            <Clock className="w-full h-full" />
          </button>
          <Link href="/profile" className="w-full aspect-square rounded-[22px] text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center justify-center transition-all p-4">
            <User className="w-full h-full" />
          </Link>
          <button className="w-full aspect-square rounded-[22px] text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center justify-center transition-all p-4">
            <BarChart3 className="w-full h-full" />
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-6 w-full px-5">
          <button className="w-full aspect-square rounded-[22px] text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center justify-center transition-all p-4">
            <Settings className="w-full h-full" />
          </button>
          <button className="w-full aspect-square rounded-[22px] text-muted-foreground hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all p-4">
            <LogOut className="w-full h-full" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="px-16 py-12 flex justify-between items-end">
           <div>
              <h1 className="text-5xl font-extrabold font-outfit text-white tracking-tighter">Good Morning, Alex.</h1>
              <p className="text-muted-foreground mt-3 font-medium text-lg leading-relaxed max-w-lg">Your AI assistant has analyzed 2 recent meetings and has 11 key actions waiting for you.</p>
           </div>
           <Link href={`/meeting/${Math.random().toString(36).substr(2, 9)}`}>
               <button className="bg-white text-black py-4 px-10 rounded-[22px] font-extrabold gap-3 flex items-center shadow-xl hover:bg-indigo-50 transition-all font-outfit text-base">
                  <Plus className="w-5 h-5 stroke-[3]" /> Launch Sync
               </button>
           </Link>
        </header>

        <div className="flex-1 overflow-y-auto px-16 pb-16 custom-scrollbar">
          <div className="max-w-[1440px] grid grid-cols-1 xl:grid-cols-4 gap-12">
            
            {/* Left Multi-Column: Meetings and Dynamic Action Items */}
            <div className="xl:col-span-3 space-y-12">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">Next Priority Syncs</h2>
                    <div className="flex gap-2">
                       <ShieldCheck className="w-4 h-4 text-emerald-400" />
                       <span className="text-xs font-bold text-muted-foreground">Encrypted Pipeline Active</span>
                    </div>
                  </div>
                  <div className="grid gap-6">
                    {upcomingMeetings.map((mtg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10 hover:border-primary/50 transition-all duration-500 group relative overflow-hidden"
                      >
                        <div className="flex items-center gap-10">
                            <div className="flex flex-col items-center justify-center w-28 h-28 rounded-[32px] bg-white text-black border border-white shadow-xl hover:scale-105 transition-all p-4">
                              <span className="text-xs font-black uppercase tracking-widest opacity-60">Session</span>
                              <span className="text-[17px] font-black mt-2">{mtg.time}</span>
                            </div>
                            <div>
                              <h3 className="font-extrabold text-2xl font-outfit text-white tracking-tight">{mtg.title}</h3>
                              <div className="flex items-center gap-6 text-sm text-muted-foreground mt-4 font-bold">
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-400" /> {mtg.duration}</span>
                                <span className="flex items-center gap-2"><User className="w-4 h-4 text-indigo-400" /> {mtg.participants} Experts</span>
                                <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Active Link</div>
                              </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {mtg.isNow ? (
                              <Link href={`/meeting/${mtg.id}`}>
                                  <button className="bg-primary hover:bg-primary/90 text-white py-4 px-10 rounded-[20px] text-base font-extrabold tracking-tight shadow-xl shadow-primary/20 neon-glow transition-all">Join Room</button>
                              </Link>
                            ) : (
                              <button className="glass-card py-4 px-10 rounded-[20px] text-base font-extrabold hover:bg-white/5 transition-all">View Agenda</button>
                            )}
                            <button className="glass-card w-14 h-14 rounded-[20px] flex items-center justify-center text-muted-foreground hover:text-white transition-all">
                              <MoreVertical className="w-6 h-6" />
                            </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
            </div>

            {/* Right Column: AI Insights & Analytics */}
            <div className="space-y-12">
                {/* Analytics Snapshot */}
                <section>
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">Real-time Intel</h2>
                   </div>
                   <div className="grid grid-cols-1 gap-5">
                      <div className="glass-card p-10 rounded-[40px] border border-white/5 group hover:bg-white/5 transition-all">
                         <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6">
                            <TrendingUp className="w-7 h-7" />
                         </div>
                         <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Global Focus Score</p>
                         <h3 className="text-5xl font-black font-outfit mt-2 text-white">94%</h3>
                         <div className="w-full bg-white/5 h-2 rounded-full mt-6 overflow-hidden">
                            <div className="bg-primary w-[94%] h-full rounded-full" />
                         </div>
                      </div>
                   </div>
                </section>

                {/* Recent AI Intelligence */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400">AI Memory</h2>
                    <span className="text-xs font-black text-primary cursor-pointer hover:underline uppercase tracking-tighter">History</span>
                  </div>
                  <div className="space-y-5">
                     {recentIntelligence.map((summary, idx) => (
                        <div key={idx} className="glass-card p-6 border border-white/5 hover:border-primary/40 transition-all flex flex-col gap-4 group cursor-pointer rounded-[30px]">
                           <div className="flex items-start justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all text-muted-foreground p-3">
                                    <FileText className="w-full h-full" />
                                 </div>
                                 <div>
                                   <h4 className="font-bold text-lg font-outfit text-white tracking-tight">{summary.title}</h4>
                                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">{summary.date}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20">
                              <span className="text-xs font-black text-indigo-300 flex items-center gap-2 uppercase tracking-widest"><Sparkles className="w-3.5 h-3.5"/> {summary.insights} Intelligent Actions Found</span>
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
