'use client';

import React from 'react';
import { 
  Plus, Video, Calendar, Clock, Settings, User, 
  MoreVertical, LogOut, ChevronRight, BarChart3, TrendingUp, Sparkles, FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Dashboard() {
  const upcomingMeetings = [
    { title: 'Project Zenith Sync', time: '10:30 AM', duration: '45m', participants: 8, id: 'zenith-sync', isNow: true },
    { title: 'Design Review', time: '1:00 PM', duration: '60m', participants: 4, id: 'design-review', isNow: false },
    { title: 'Quarterly Planning', time: '4:15 PM', duration: '90m', participants: 12, id: 'q-planning', isNow: false },
  ];

  const recentSummaries = [
    { title: 'Marketing Sync Q3', date: 'Yesterday', insights: 4 },
    { title: 'Tech Architecture Review', date: 'Oct 12', insights: 7 },
  ];

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden font-sans text-[var(--foreground)] selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-[88px] border-r border-[var(--border)] flex flex-col items-center py-8 gap-8 bg-[var(--card)] z-20 backdrop-blur-xl">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center premium-shadow mb-4">
          <Video className="w-6 h-6 text-white" />
        </div>
        
        <nav className="flex flex-col gap-4 w-full px-4">
          <button className="w-full aspect-square rounded-[18px] bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center transition-all">
            <Calendar className="w-6 h-6" />
          </button>
          <button className="w-full aspect-square rounded-[18px] text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center justify-center transition-all">
            <Clock className="w-6 h-6" />
          </button>
          <Link href="/profile" className="w-full aspect-square rounded-[18px] text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center justify-center transition-all">
            <User className="w-6 h-6" />
          </Link>
          <button className="w-full aspect-square rounded-[18px] text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center justify-center transition-all">
            <BarChart3 className="w-6 h-6" />
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-4 w-full px-4">
          <div className="flex justify-center mb-4"><ThemeToggle /></div>
          <button className="w-full aspect-square rounded-[18px] text-[var(--muted-fg)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] flex items-center justify-center transition-all">
            <Settings className="w-6 h-6" />
          </button>
          <button className="w-full aspect-square rounded-[18px] text-[var(--muted-fg)] hover:text-red-500 hover:bg-red-500/10 flex items-center justify-center transition-all">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--bg-accent-1)] rounded-full blur-[150px] -z-10 opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--bg-accent-2)] rounded-full blur-[150px] -z-10 opacity-40 pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <header className="px-14 py-12 flex justify-between items-end">
           <div>
              <h1 className="text-4xl font-extrabold font-outfit text-[var(--foreground)] tracking-tight">Good Morning, Alex</h1>
              <p className="text-[var(--muted-fg)] mt-2 font-medium text-lg">You have 3 meetings scheduled today.</p>
           </div>
           <Link href={`/meeting/${Math.random().toString(36).substr(2, 9)}`}>
               <button className="btn-primary py-3.5 px-8 font-bold gap-3 flex items-center shadow-lg shadow-indigo-500/20">
                  <Plus className="w-5 h-5" /> Instant Meeting
               </button>
           </Link>
        </header>

        <div className="flex-1 overflow-y-auto px-14 pb-14 custom-scrollbar">
          <div className="max-w-[1400px] grid grid-cols-1 xl:grid-cols-3 gap-10">
            
            {/* Left Column: Upcoming Meetings */}
            <div className="xl:col-span-2 space-y-10">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-fg)]">Upcoming Today</h2>
                  </div>
                  <div className="grid gap-5">
                    {upcomingMeetings.map((mtg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[var(--primary)] transition-all duration-500 group"
                      >
                        <div className="flex items-center gap-6 md:gap-8">
                            <div className="flex flex-col items-center justify-center w-24 h-24 rounded-[24px] bg-[var(--muted)] border border-[var(--border)] shadow-sm group-hover:bg-[var(--primary)] group-hover:bg-opacity-10 transition-all duration-500">
                              <span className="text-xs font-bold text-[var(--muted-fg)] uppercase tracking-widest">Time</span>
                              <span className="text-[17px] font-extrabold text-[var(--primary)] mt-1">{mtg.time}</span>
                            </div>
                            <div>
                              <h3 className="font-extrabold text-xl font-outfit text-[var(--foreground)] tracking-tight">{mtg.title}</h3>
                              <div className="flex items-center gap-5 text-sm text-[var(--muted-fg)] mt-2 font-medium">
                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {mtg.duration}</span>
                                <span className="flex items-center gap-2"><User className="w-4 h-4" /> {mtg.participants} Attendees</span>
                              </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {mtg.isNow ? (
                              <Link href={`/meeting/${mtg.id}`}>
                                  <button className="btn-primary py-3 px-8 rounded-[18px] text-sm font-bold tracking-wide shadow-md shadow-indigo-500/30">Join</button>
                              </Link>
                            ) : (
                              <button className="btn-secondary py-3 px-8 rounded-[18px] text-sm font-bold tracking-wide">Details</button>
                            )}
                            <button className="btn-icon bg-[var(--muted)] border border-[var(--border)] hover:bg-[var(--background)] text-[var(--muted-fg)] shadow-sm">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
            </div>

            {/* Right Column: AI Analytics & Summaries */}
            <div className="space-y-10">
                {/* Analytics Snapshot */}
                <section>
                   <div className="flex items-center justify-between mb-8">
                      <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-fg)]">Analytics</h2>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="glass-card p-6 border border-[var(--border)]">
                         <div className="w-10 h-10 rounded-[14px] bg-green-500/10 text-green-500 flex items-center justify-center mb-4">
                            <Clock className="w-5 h-5" />
                         </div>
                         <p className="text-sm font-semibold text-[var(--muted-fg)]">Meeting Hours</p>
                         <h3 className="text-3xl font-extrabold font-outfit mt-1">14.2<span className="text-lg text-[var(--muted-fg)] font-medium">h</span></h3>
                      </div>
                      <div className="glass-card p-6 border border-[var(--border)]">
                         <div className="w-10 h-10 rounded-[14px] bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
                            <TrendingUp className="w-5 h-5" />
                         </div>
                         <p className="text-sm font-semibold text-[var(--muted-fg)]">Engagement</p>
                         <h3 className="text-3xl font-extrabold font-outfit mt-1">87<span className="text-lg text-[var(--muted-fg)] font-medium">%</span></h3>
                      </div>
                   </div>
                </section>

                {/* AI Summaries */}
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--muted-fg)]">Recent AI Intelligence</h2>
                    <span className="text-xs font-bold text-[var(--primary)] cursor-pointer hover:underline">View All</span>
                  </div>
                  <div className="space-y-4">
                     {recentSummaries.map((summary, idx) => (
                        <div key={idx} className="glass-card p-5 border border-[var(--border)] hover:border-[var(--primary)] transition-all flex flex-col gap-3 group cursor-pointer">
                           <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-[var(--muted)] flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all text-[var(--foreground)]">
                                    <FileText className="w-5 h-5" />
                                 </div>
                                 <div>
                                   <h4 className="font-bold font-outfit text-[var(--foreground)]">{summary.title}</h4>
                                   <p className="text-xs font-medium text-[var(--muted-fg)]">{summary.date}</p>
                                 </div>
                              </div>
                           </div>
                           <div className="bg-[var(--primary)]/5 rounded-xl p-3 flex flex-col gap-1 border border-[var(--primary)]/10">
                              <span className="text-xs font-bold text-[var(--primary)] flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> {summary.insights} Key Actions Extracted</span>
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
