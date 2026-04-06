'use client';

import React from 'react';
import { 
  Plus, 
  Video, 
  Calendar, 
  Clock, 
  Settings, 
  User,
  MoreVertical,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const upcomingMeetings = [
    { title: 'Project Zenith Sync', time: '10:30 AM', duration: '45m', participants: 8, id: 'zenith-sync', isNow: true },
    { title: 'Design Review', time: '1:00 PM', duration: '60m', participants: 4, id: 'design-review', isNow: false },
    { title: 'Quarterly Planning', time: '4:15 PM', duration: '90m', participants: 12, id: 'q-planning', isNow: false },
  ];

  return (
    <div className="flex h-screen bg-[#fdfdfd] overflow-hidden font-sans text-slate-900">
      {/* Sidebar (Icons Only) */}
      <aside className="w-[88px] border-r border-slate-100 flex flex-col items-center py-8 gap-8 bg-white z-20">
        <div className="w-12 h-12 rounded-[16px] bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center premium-shadow mb-4">
          <Video className="w-6 h-6 text-white" />
        </div>
        
        <nav className="flex flex-col gap-4 w-full px-4">
          <button className="w-full aspect-square rounded-[18px] bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all">
            <Calendar className="w-6 h-6" />
          </button>
          <button className="w-full aspect-square rounded-[18px] text-slate-400 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all">
            <Clock className="w-6 h-6" />
          </button>
          <button className="w-full aspect-square rounded-[18px] text-slate-400 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all">
            <User className="w-6 h-6" />
          </button>
        </nav>

        <div className="mt-auto flex flex-col gap-4 w-full px-4">
          <button className="w-full aspect-square rounded-[18px] text-slate-400 hover:text-slate-900 hover:bg-slate-50 flex items-center justify-center transition-all">
            <Settings className="w-6 h-6" />
          </button>
          <button className="w-full aspect-square rounded-[18px] text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all">
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 rounded-full blur-[150px] -z-10 opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-100 rounded-full blur-[150px] -z-10 opacity-40 pointer-events-none -translate-x-1/3 translate-y-1/3" />
        
        <header className="px-14 py-12">
           <h1 className="text-4xl font-extrabold font-outfit text-slate-900 tracking-tight">Good Morning, Alex</h1>
           <p className="text-slate-500 mt-2 font-medium text-lg">You have 3 meetings scheduled today.</p>
        </header>

        <div className="flex-1 overflow-y-auto px-14 pb-14 custom-scrollbar">
          <div className="max-w-4xl space-y-12">
            
            {/* Quick Create Action */}
            <section>
              <Link href={`/meeting/${Math.random().toString(36).substr(2, 9)}`} className="block group">
                <div className="w-full glass-card p-10 flex items-center justify-between border-white/80 hover:border-indigo-100 hover:shadow-[0_30px_60px_-15px_rgba(79,70,229,0.15)] transition-all duration-500 cursor-pointer">
                   <div className="flex items-center gap-8">
                      <div className="w-20 h-20 rounded-[28px] bg-indigo-600 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(79,70,229,0.4)] group-hover:scale-110 !transition-transform !duration-500">
                         <Plus className="w-10 h-10" />
                      </div>
                      <div>
                         <h2 className="text-3xl font-extrabold font-outfit text-slate-900 tracking-tight">Start an Instant Meeting</h2>
                         <p className="text-slate-500 text-base mt-2 font-medium">Create a secure link and invite participants instantly</p>
                      </div>
                   </div>
                   <div className="w-16 h-16 rounded-full bg-slate-50 border border-white shadow-inner group-hover:bg-indigo-50 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors duration-500">
                      <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
              </Link>
            </section>

            {/* Upcoming Meetings List */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Upcoming Today</h2>
              </div>
              <div className="grid gap-5">
                {upcomingMeetings.map((mtg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 group"
                  >
                     <div className="flex items-center gap-8">
                        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-[24px] bg-slate-50/50 border border-white shadow-sm group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all duration-500">
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Time</span>
                           <span className="text-[17px] font-extrabold text-indigo-600 mt-1">{mtg.time}</span>
                        </div>
                        <div>
                           <h3 className="font-exrabold text-xl font-outfit text-slate-900 tracking-tight">{mtg.title}</h3>
                           <div className="flex items-center gap-5 text-sm text-slate-500 mt-2 font-medium">
                             <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {mtg.duration}</span>
                             <span className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> {mtg.participants} Attendees</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4">
                        {mtg.isNow ? (
                           <Link href={`/meeting/${mtg.id}`}>
                              <button className="btn-primary py-3.5 px-8 rounded-[18px] text-sm w-full sm:w-auto font-bold tracking-wide">Join Now</button>
                           </Link>
                        ) : (
                           <button className="btn-secondary py-3.5 px-8 rounded-[18px] text-sm w-full sm:w-auto font-bold tracking-wide">Details</button>
                        )}
                        <button className="btn-icon bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-400 shadow-sm">
                           <MoreVertical className="w-5 h-5" />
                        </button>
                     </div>
                  </motion.div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
