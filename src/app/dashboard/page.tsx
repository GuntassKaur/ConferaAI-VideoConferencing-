'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, Video, Calendar, Clock, Settings, User, 
  Search, Bell, LogOut, ChevronRight, BarChart3, 
  Users, Activity, Sparkles, ShieldCheck 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
    <div className="flex h-screen bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 font-inter transition-colors duration-500">
      
      {/* Structural Sidebar */}
      <aside className="w-[280px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col p-6 z-50">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight">Confera<span className="text-indigo-600">AI</span></span>
        </div>
        
        <nav className="flex-1 space-y-1">
          {[
            { label: 'Overview', icon: BarChart3, active: true },
            { label: 'Meetings', icon: Calendar },
            { label: 'Participants', icon: Users },
            { label: 'Intelligence', icon: Sparkles },
          ].map((item, i) => (
            <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              item.active ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-4">
             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden flex items-center justify-center font-bold text-indigo-600 uppercase">
                {user.email?.[0]}
             </div>
             <div className="flex flex-col truncate">
                <span className="text-sm font-bold truncate">{user.email?.split('@')[0]}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">Pro Analyst</span>
             </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('confera_user'); router.push('/login'); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-[72px] flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between z-40">
           <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                 placeholder="Search workspace..."
                 className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none font-medium"
              />
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>
              <div className="h-6 w-px bg-slate-200 dark:border-slate-800" />
              <button 
                 onClick={handleCreateMeeting}
                 className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 text-sm active:scale-95"
              >
                 <Plus className="w-4 h-4" /> Create Sync
              </button>
           </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           <div className="max-w-6xl mx-auto space-y-10">
              
              <section className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                    <h2 className="text-3xl font-black tracking-tight leading-none">Join a Synchronization</h2>
                    <p className="text-slate-500 font-medium">Enter a meeting ID or paste a link to join your team space.</p>
                    <form onSubmit={handleJoinMeeting} className="flex gap-4 pt-2">
                       <input 
                          placeholder="meeting-id-here"
                          value={meetingId}
                          onChange={(e) => setMeetingId(e.target.value)}
                          className="flex-1 h-12 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                       />
                       <button type="submit" className="h-12 px-8 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95">
                          Join Sync
                       </button>
                    </form>
                 </div>
                 <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </section>

              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest text-xs">Recent Activities</h3>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">See Schedule</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {meetings.map((mtg, i) => (
                      <div key={i} className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
                         <div className="flex justify-between items-start mb-6">
                            <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                              mtg.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                            }`}>
                               {mtg.status}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                               <Clock className="w-4 h-4 text-indigo-500" /> {mtg.time}
                            </div>
                         </div>
                         <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-none">{mtg.title}</h4>
                         <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {mtg.participants} Analysts</span>
                               <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> {mtg.duration}</span>
                            </div>
                            <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">
                               <ChevronRight className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

           </div>
        </div>
      </main>
    </div>
  );
}
