'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const [meetingId, setMeetingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMeeting = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/create-meeting', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${data.meetingId}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/join-meeting', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId }) 
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${meetingId}`);
      } else {
        alert('Meeting not found or invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] w-full mx-auto">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Meetings</h1>
                <p className="text-slate-500 font-medium">Manage your upcoming and past AI-powered sessions.</p>
              </div>
              <div className="flex items-center gap-4">
                <form onSubmit={handleJoinMeeting} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Meeting ID"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    className="h-12 px-4 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button type="submit" disabled={isLoading} className="btn-secondary h-12 px-6">
                    Join
                  </button>
                </form>
                <button onClick={handleCreateMeeting} disabled={isLoading} className="btn-primary h-12 px-6">
                  <Plus className="w-5 h-5 mr-2" /> Create Meeting
                </button>
              </div>
            </div>

            {/* View Toggle / Filter Placeholder */}
            <div className="flex items-center gap-4 mb-8">
               <div className="flex bg-card p-1 rounded-xl border border-border">
                  <button className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-primary">
                    <LayoutGrid size={18} />
                  </button>
                  <button className="p-2 text-muted hover:text-foreground transition-all duration-200">
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
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-200 group"
              >
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted group-hover:text-primary group-hover:bg-primary/10 transition-all duration-200">
                    <Plus className="w-6 h-6" />
                 </div>
                 <div className="text-sm font-bold text-muted group-hover:text-foreground transition-colors duration-200">Schedule New</div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
