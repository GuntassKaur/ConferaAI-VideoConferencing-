'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, Calendar, Clock, Settings, User, 
  Search, Bell, LogOut, ChevronRight, BarChart3, 
  Users, Activity, Sparkles, ShieldCheck, Play
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [meetingId, setMeetingId] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('confera_user');
    if (!savedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  const handleCreateMeeting = () => {
    const id = Math.random().toString(36).substr(2, 9);
    router.push(`/meeting/${id}`);
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim()) {
      router.push(`/meeting/${meetingId.trim()}`);
    }
  };

  const meetings = [
    { title: 'Project X Sync', time: '10:30 AM', duration: '45m', participants: 6, status: 'Live' },
    { title: 'AI Engineering Sync', time: '2:00 PM', duration: '30m', participants: 4, status: 'Upcoming' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-inter overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Structural Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-white/10 bg-slate-950/50 backdrop-blur-3xl flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer group" onClick={() => router.push('/')}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black font-outfit tracking-tight uppercase group-hover:text-indigo-200 transition-colors">
            Confera<span className="text-indigo-500">AI</span>
          </span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {[
            { label: 'Overview', icon: BarChart3, active: true },
            { label: 'Meetings', icon: Calendar },
            { label: 'Participants', icon: Users },
            { label: 'Intelligence', icon: Sparkles },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all group ${
              item.active 
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 shadow-inner' 
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}>
              <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-400' : 'group-hover:text-white transition-colors'}`} /> 
              {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
             <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 uppercase shadow-inner">
                {user.email?.[0]}
             </div>
             <div className="flex flex-col truncate">
                <span className="text-sm font-bold truncate text-white">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Pro User</span>
             </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('confera_user'); router.push('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Top Navbar */}
        <header className="h-[80px] flex-shrink-0 bg-slate-950/40 backdrop-blur-md border-b border-white/10 px-10 flex items-center justify-between z-40 sticky top-0">
           <div className="relative max-w-md w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                 placeholder="Search workspace..."
                 className="w-full bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:border-indigo-500/50 focus:bg-white/10 transition-all outline-none font-medium placeholder-slate-500"
              />
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-white transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              </button>
              <div className="h-6 w-px bg-white/10" />
              <button 
                 onClick={handleCreateMeeting}
                 className="h-11 px-6 premium-gradient-bg text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.7)] hover:scale-105 active:scale-95 text-sm"
              >
                 <Plus className="w-4 h-4" /> Create Sync
              </button>
           </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative">
           <div className="max-w-6xl mx-auto space-y-12 pb-20">
              
              <motion.section 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col md:flex-row md:items-center justify-between gap-8 enterprise-glass p-10 rounded-[2.5rem] relative overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                 
                 <div className="relative z-10 space-y-4">
                    <h2 className="text-4xl font-black tracking-tight leading-none text-white">Join a Synchronization</h2>
                    <p className="text-slate-400 font-medium text-lg">Enter a meeting ID or paste a link to join your team space.</p>
                    <form onSubmit={handleJoinMeeting} className="flex gap-4 pt-4">
                       <input 
                          placeholder="meeting-id-here"
                          value={meetingId}
                          onChange={(e) => setMeetingId(e.target.value)}
                          className="flex-1 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-base font-bold focus:border-indigo-500/50 focus:bg-white/10 outline-none transition-all placeholder-slate-500"
                       />
                       <button type="submit" className="h-14 px-8 bg-white text-slate-950 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                          Join Sync
                       </button>
                    </form>
                 </div>
                 <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              </motion.section>

              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Recent Activities</h3>
                    <button className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-[0.2em] transition-colors">See Schedule</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {meetings.map((mtg, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * (i + 1) }}
                        key={i} 
                        className="glass-card p-8 rounded-[2rem] hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                      >
                         <div className="flex justify-between items-start mb-8">
                            <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                              mtg.status === 'Live' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse' : 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}>
                               {mtg.status === 'Live' ? (
                                  <span className="flex items-center gap-1.5"><Play className="w-3 h-3 fill-emerald-300" /> LIVE</span>
                               ) : mtg.status}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                               <Clock className="w-4 h-4 text-indigo-400" /> {mtg.time}
                            </div>
                         </div>
                         <h4 className="text-3xl font-black text-white mb-8 group-hover:text-indigo-300 transition-colors uppercase tracking-tight leading-none">{mtg.title}</h4>
                         <div className="flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                               <span className="flex items-center gap-2"><Users className="w-4 h-4 text-slate-500" /> {mtg.participants} Analysts</span>
                               <span className="flex items-center gap-2"><Activity className="w-4 h-4 text-slate-500" /> {mtg.duration}</span>
                            </div>
                            <button className="p-3 rounded-xl bg-white/5 text-indigo-400 hover:bg-indigo-500 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all">
                               <ChevronRight className="w-5 h-5" />
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
