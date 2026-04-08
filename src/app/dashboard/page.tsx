'use client';

import React, { useState } from 'react';
import { 
  Plus, Video, Calendar, Clock, Settings, User, 
  MoreVertical, LogOut, ChevronRight, BarChart3, TrendingUp, Sparkles, 
  FileText, ShieldCheck, Activity, BrainCircuit, Users, Search, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const upcomingMeetings = [
    { title: 'Executive Sync: Q4 Roadmap', time: '10:30 AM', duration: '45m', participants: 8, id: 'q4-sync', live: true, category: 'Strategy' },
    { title: 'Global Ops Briefing', time: '1:00 PM', duration: '60m', participants: 4, id: 'ops-brief', live: false, category: 'Operations' },
    { title: 'Product Review: Confera AI v2', time: '2:30 PM', duration: '30m', participants: 6, id: 'product-v2', live: false, category: 'Product' },
    { title: 'Future Strategy: SpaceSync', time: '4:15 PM', duration: '90m', participants: 12, id: 'future-strat', live: false, category: 'Research' },
  ];

  const SidebarIcon = ({ icon: Icon, active = false }: any) => (
    <button className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all group relative ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600'
    }`}>
      <Icon className="w-5 h-5" />
      {!active && (
        <div className="absolute left-16 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
          {Icon.name}
        </div>
      )}
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F9FAFB] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 overflow-hidden font-inter transition-colors duration-500">
      
      {/* Sidebar (Icons Only) */}
      <aside className="w-[80px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl flex flex-col items-center py-8 gap-4 z-50">
        <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/20">
          <Video className="w-6 h-6 text-white" />
        </div>
        
        <nav className="flex flex-col gap-3">
          <SidebarIcon icon={BrainCircuit} active />
          <SidebarIcon icon={Calendar} />
          <SidebarIcon icon={Users} />
          <SidebarIcon icon={BarChart3} />
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <SidebarIcon icon={Settings} />
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 mt-2 border-2 border-white dark:border-slate-700 shadow-sm overflow-hidden">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Top Navbar */}
        <header className="h-[72px] flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-10 flex items-center justify-between z-40">
           <div className="flex items-center gap-8 flex-1">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Dashboard</h2>
              <div className="relative max-w-md w-full">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input 
                    placeholder="Search meetings, insights, files..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                 />
              </div>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative">
                 <Bell className="w-5 h-5" />
                 <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />
              <Link href={`/meeting/${Math.random().toString(36).substr(2, 9)}`}>
                  <button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 text-sm">
                     <Plus className="w-4 h-4" /> Create Meeting
                  </button>
              </Link>
           </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
           <div className="max-w-7xl mx-auto space-y-12">
              
              {/* Welcome Section */}
              <section className="flex flex-col gap-2">
                 <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Welcome Back</span>
                 <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Meetings</h1>
              </section>

              {/* Statistics Grid */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[
                   { label: 'Total Syncs', value: '12', icon: Video, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
                   { label: 'AI Insights', value: '142', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
                   { label: 'Action Items', value: '28', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-500/10' },
                   { label: 'Time Saved', value: '5.2h', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-500/10' },
                 ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-5 hover:border-indigo-500/50 transition-all group">
                       <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</span>
                          <span className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</span>
                       </div>
                    </div>
                 ))}
              </section>

              {/* Upcoming Meetings Grid */}
              <section className="space-y-6">
                 <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Synchronizations</h3>
                    <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                       View All <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                    {upcomingMeetings.map((mtg, i) => (
                      <div key={i} className="group p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2">
                               <div className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                                  {mtg.category}
                               </div>
                               {mtg.live && (
                                  <div className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-widest border border-red-500/20 animate-pulse">
                                     Live Now
                                  </div>
                               )}
                            </div>
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                               <MoreVertical className="w-5 h-5" />
                            </button>
                         </div>
                         
                         <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-indigo-600 transition-colors">{mtg.title}</h4>
                         
                         <div className="flex items-center gap-6 mb-8 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                               <Clock className="w-4 h-4 text-indigo-500" />
                               {mtg.time}
                            </div>
                            <div className="flex items-center gap-2">
                               <Users className="w-4 h-4" />
                               {mtg.participants} Analysts
                            </div>
                            <div className="flex items-center gap-2">
                               <Activity className="w-4 h-4" />
                               {mtg.duration}
                            </div>
                         </div>

                         <div className="flex items-center gap-3">
                            <Link href={`/meeting/${mtg.id}`} className="flex-1">
                               <button className={`w-full h-11 rounded-xl font-bold text-sm transition-all ${
                                 mtg.live ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-100 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-slate-900 dark:text-white'
                               }`}>
                                  {mtg.live ? 'Join Space' : 'Meeting Details'}
                               </button>
                            </Link>
                            <button className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-500/50 transition-all">
                               <Plus className="w-5 h-5" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Bottom Quick Insight */}
              <section className="p-8 bg-indigo-600 rounded-[2rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-600/30">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-xl">
                       <div className="flex items-center gap-2 uppercase text-[10px] font-black tracking-widest opacity-80">
                          <Sparkles className="w-4 h-4" />
                          AI Intelligence Insight
                       </div>
                       <h3 className="text-2xl font-bold leading-tight">Your team's focus on "Infrastructure Scaling" has increased by 42% over the last 3 sessions.</h3>
                    </div>
                    <button className="h-12 px-8 bg-white text-indigo-600 rounded-xl font-bold flex items-center hovber:bg-indigo-50 transition-all shrink-0">
                       Generate Full Report
                    </button>
                 </div>
              </section>

           </div>
        </div>
      </main>
    </div>
  );
}
