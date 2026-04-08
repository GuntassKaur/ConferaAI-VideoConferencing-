'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import MeetingCard from '@/components/MeetingCard';
import { motion } from 'framer-motion';
import { Plus, Search, Filter } from 'lucide-react';

const meetings = [
  { id: 1, title: 'Weekly Product Sync', date: 'Apr 12, 2026', time: '10:00 AM', participants: 8, status: 'ongoing' as const },
  { id: 2, title: 'Q3 Strategy Review', date: 'Apr 12, 2026', time: '02:30 PM', participants: 12 },
  { id: 3, title: 'Frontend Architecture', date: 'Apr 13, 2026', time: '11:00 AM', participants: 4 },
  { id: 4, title: 'Client Onboarding', date: 'Apr 14, 2026', time: '09:00 AM', participants: 6 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-black font-heading tracking-tight text-slate-900 dark:text-white mb-2">
                  Your Meetings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Manage and join your upcoming AI-powered sessions.
                </p>
              </div>
              <button className="btn-primary h-12 px-6 text-sm">
                <Plus className="w-5 h-5" /> Create Meeting
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
               <div className="relative flex-grow max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search meetings..." 
                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                  />
               </div>
               <button className="h-11 px-4 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <Filter className="w-4 h-4" /> Filter
               </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.map((meeting) => (
                <MeetingCard 
                  key={meeting.id}
                  title={meeting.title}
                  date={meeting.date}
                  time={meeting.time}
                  participants={meeting.participants}
                  status={meeting.status}
                />
              ))}

              {/* Empty State / New Card */}
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="p-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
              >
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <Plus className="w-6 h-6" />
                 </div>
                 <div className="text-sm font-bold text-slate-400">Schedule New</div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
