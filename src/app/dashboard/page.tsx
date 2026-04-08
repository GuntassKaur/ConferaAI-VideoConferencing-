'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, Calendar, Clock, Settings, User, 
  Search, Bell, LogOut, ChevronRight, BarChart3, 
  Users, Activity, Sparkles, ShieldCheck, Play,
  LayoutDashboard, Terminal, MessageSquare
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
    { title: 'Executive Sync Q2', time: '10:30 AM', duration: '45m', participants: 6, status: 'Live' },
    { title: 'AI Engineering Review', time: '2:00 PM', duration: '30m', participants: 4, status: 'Upcoming' },
    { title: 'Global Product Update', time: '4:15 PM', duration: '60m', participants: 12, status: 'Upcoming' },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-inter overflow-hidden">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Corporate Sidebar */}
      <aside className="w-[300px] flex-shrink-0 bg-black/40 border-r border-white/5 flex flex-col z-50">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black font-outfit tracking-tighter uppercase">
              Confera<span className="text-blue-500">AI</span>
            </span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { label: 'Dashboard', icon: LayoutDashboard, active: true },
            { label: 'Cloud Synchronizations', icon: Calendar },
            { label: 'Neural Insights', icon: Sparkles },
            { label: 'Global Directory', icon: Users },
            { label: 'System Analytics', icon: Activity },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all group ${
              item.active 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/10' 
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}>
              <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-400' : 'group-hover:text-white transition-colors'}`} /> 
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto space-y-4 border-t border-white/5">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors">
             <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-black text-blue-400 uppercase">
                {user.email?.[0]}
             </div>
             <div className="flex flex-col truncate">
                <span className="text-sm font-bold truncate text-white uppercase tracking-tight">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Enterprise Tier</span>
             </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('confera_user'); router.push('/login'); }}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold text-sm text-red-500/80 hover:bg-red-500/10 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout Session
          </button>
        </div>
      </aside>

      {/* Content Engine */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Superior Header */}
        <header className="h-[90px] flex-shrink-0 bg-black/20 backdrop-blur-md border-b border-white/5 px-10 flex items-center justify-between">
           <div className="relative max-w-xl w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                 placeholder="Search neural intelligence, transcripts, and action items..."
                 className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:border-blue-500/50 focus:bg-white/10 transition-all outline-none font-medium text-slate-200 placeholder-slate-600"
              />
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-slate-500 hover:text-white transition-colors relative">
                 <Bell className="w-6 h-6" />
                 <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
              </button>
              <div className="h-8 w-px bg-white/10" />
              <button 
                 onClick={handleCreateMeeting}
                 className="h-12 px-8 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] active:scale-95 text-sm"
              >
                 <Plus className="w-4 h-4" /> Initialize Sync
              </button>
           </div>
        </header>

        {/* Dynamic Workspace */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
           <div className="max-w-6xl mx-auto space-y-16">
              
              <motion.section 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-10 md:p-14 rounded-[3rem] bg-gradient-to-br from-blue-600/10 via-black to-black border border-blue-500/20 relative overflow-hidden group shadow-2xl"
              >
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
                 
                 <div className="relative z-10 max-w-2xl space-y-6">
                    <h2 className="text-5xl font-black tracking-tight leading-none text-white">Universal <br /> <span className="text-blue-400">Connection.</span></h2>
                    <p className="text-slate-400 font-medium text-xl leading-relaxed">Bridge your team instantaneously. Enter a synchronization key or secure link to begin.</p>
                    <form onSubmit={handleJoinMeeting} className="flex gap-4 pt-6">
                       <input 
                          placeholder="meeting-id-key"
                          value={meetingId}
                          onChange={(e) => setMeetingId(e.target.value)}
                          className="flex-1 h-16 bg-white/5 border border-white/10 rounded-[1.25rem] px-8 text-lg font-bold focus:border-blue-500/50 outline-none transition-all placeholder-slate-700"
                       />
                       <button type="submit" className="h-16 px-10 bg-white text-black rounded-[1.25rem] font-black text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                          Join Sync
                       </button>
                    </form>
                 </div>
              </motion.section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <section className="lg:col-span-2 space-y-8">
                   <div className="flex items-center justify-between px-2">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Active Synchronizations</h3>
                      <button className="text-xs font-black text-blue-500 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors">Global Schedule</button>
                   </div>

                   <div className="space-y-4">
                      {meetings.map((mtg, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/20 hover:bg-white/[0.07] transition-all group cursor-pointer"
                        >
                           <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${mtg.status === 'Live' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-slate-700'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mtg.status === 'Live' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {mtg.status === 'Live' ? 'Live Transmission' : 'Scheduled'}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-500" /> {mtg.time}
                              </span>
                           </div>
                           <div className="flex items-end justify-between">
                             <h4 className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tight">{mtg.title}</h4>
                             <button className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                               <ChevronRight className="w-6 h-6" />
                             </button>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </section>

                <section className="space-y-8">
                   <div className="flex items-center justify-between px-2">
                      <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">System Insights</h3>
                   </div>
                   <div className="p-8 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 space-y-6">
                      <div className="flex items-center gap-4">
                        <Terminal className="w-6 h-6 text-indigo-400" />
                        <h4 className="font-black text-white">Neural Load</h4>
                      </div>
                      <div className="h-2 w-full bg-indigo-900/50 rounded-full overflow-hidden">
                        <div className="h-full w-[72%] bg-indigo-400 rounded-full" />
                      </div>
                      <p className="text-sm text-slate-400 font-medium">System is performing optimally. All AI recap engines are primed.</p>
                      <button className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Run Diagnostics</button>
                   </div>

                   <div className="p-8 rounded-[2rem] bg-blue-600/10 border border-blue-500/20 flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <MessageSquare className="w-6 h-6 text-blue-400" />
                        <div className="flex flex-col">
                          <span className="font-black text-white">Team Chat</span>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-blue-300 transition-colors">4 New Synapses</span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-6 h-6 text-slate-600 group-hover:text-white transition-all" />
                   </div>
                </section>
              </div>

           </div>
        </div>
      </main>
    </div>
  );
}
