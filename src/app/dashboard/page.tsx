'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import MeetingCard from '@/components/MeetingCard';
import { motion } from 'framer-motion';
import { Plus, LayoutGrid, List } from 'lucide-react';

const meetings = [
  { id: 1, title: 'Weekly Product Sync', date: 'Apr 12, 2026', time: '10:00 AM', participants: 8, status: 'ongoing' as const },
  { id: 2, title: 'Q3 Strategy Review', date: 'Apr 12, 2026', time: '02:30 PM', participants: 12 },
  { id: 3, title: 'Frontend Architecture', date: 'Apr 13, 2026', time: '11:00 AM', participants: 4 },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Dashboard Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Meetings</h1>
                <p className="text-slate-500 font-medium">Manage your upcoming and past AI-powered sessions.</p>
              </div>
              <button className="btn-primary h-12 px-6">
                <Plus className="w-5 h-5" /> Create Meeting
              </button>
            </div>

            {/* View Toggle / Filter Placeholder */}
            <div className="flex items-center gap-4 mb-8">
               <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                  <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-md text-indigo-600">
                    <LayoutGrid size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-all">
                    <List size={18} />
                  </button>
               </div>
            </div>

            {/* Meetings Grid */}
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

              {/* Create New Card */}
              <motion.div 
                whileHover={{ scale: 0.98 }}
                className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-white dark:hover:bg-slate-900 transition-all group"
              >
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                    <Plus className="w-6 h-6" />
                 </div>
                 <div className="text-sm font-bold text-slate-400 group-hover:text-slate-600">Schedule New</div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
