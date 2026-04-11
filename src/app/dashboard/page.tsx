'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import MeetingCard from '@/components/MeetingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List, Search, Loader2, Video } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [meetingId, setMeetingId] = useState('');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMeetings();
  }, [user]);

  const fetchMeetings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/meetings?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Failed to fetch meetings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    if (!user) return;
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/create-meeting', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title: `${user.name}'s Sync` })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${data.meeting.id}`);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId || !user) return;
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/join-meeting', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, userId: user.id }) 
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${meetingId}`);
      } else {
        alert(data.error || 'Meeting not found');
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-[1200px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-4xl font-black mb-2 tracking-tight">Workspace</h1>
                <p className="text-slate-500 font-medium">Capture every insight from your active sessions.</p>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                 <form onSubmit={handleJoinMeeting} className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Enter Meeting ID..."
                      value={meetingId}
                      onChange={(e) => setMeetingId(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-slate-900 border border-white/5 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                 </form>
                 <button 
                  onClick={handleCreateMeeting}
                  disabled={isActionLoading}
                  className="btn-primary w-full sm:w-auto min-w-[180px]"
                 >
                   {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                   New Meeting
                 </button>
              </div>
            </div>

            {/* List Stats / Filters */}
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Active Sessions ({meetings.length})</span>
               </div>
               <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5">
                  <button className="p-2 bg-slate-800 rounded-lg text-primary shadow-sm">
                    <LayoutGrid size={18} />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-white transition-all">
                    <List size={18} />
                  </button>
               </div>
            </div>

            {/* Meetings View */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-32 flex flex-col items-center justify-center"
                >
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </motion.div>
              ) : meetings.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-24 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center px-6"
                >
                  <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center mb-6">
                     <Video className="w-10 h-10 text-slate-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Build your first neural link</h3>
                  <p className="text-slate-500 text-sm max-w-sm mb-10">
                    No active sessions found. Start a meeting to begin generating AI recaps and transcripts.
                  </p>
                  <button onClick={handleCreateMeeting} className="btn-secondary h-14 px-10">
                    Host Session
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {meetings.map((meeting, i) => (
                    <motion.div 
                      key={meeting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <MeetingCard 
                        title={meeting.title}
                        date={new Date(meeting.createdAt).toLocaleDateString()}
                        time={new Date(meeting.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        participants={meeting.participants.length}
                        meetingId={meeting.id}
                        status="live"
                      />
                    </motion.div>
                  ))}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    onClick={handleCreateMeeting}
                    className="p-8 rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/[0.02] hover:border-primary/50 transition-all duration-300 group"
                  >
                    <Plus className="w-10 h-10 text-slate-600 group-hover:text-primary transition-colors" />
                    <span className="mt-4 text-xs font-bold text-slate-500 uppercase tracking-widest group-hover:text-white">Schedule Batch</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
