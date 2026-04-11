'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import DashboardSidebar from '@/components/DashboardSidebar';
import MeetingCard from '@/components/MeetingCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List, Search, Loader2, Video, RefreshCcw, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function Dashboard() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [meetingIdInput, setMeetingIdInput] = useState('');
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check local storage if store is empty (handle refresh)
    if (!user) {
      const savedUser = localStorage.getItem('confera-session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        router.push('/login');
        return;
      }
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
    setError('');
    
    try {
      const res = await fetch('/api/create-meeting', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title: `${user.name}'s Sync` })
      });
      const data = await res.json().catch(() => ({}));
      
      if (data.success && data.meeting) {
        router.push(`/meeting/${data.meeting.id}`);
      } else {
        setError(data.error || 'The system could not initialize the session.');
      }
    } catch (error) {
      setError('Neural link initialization failed. Check your network.');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingIdInput || !user) return;
    
    setIsActionLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/join-meeting', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: meetingIdInput, userId: user.id }) 
      });
      const data = await res.json().catch(() => ({}));

      if (data.success) {
        router.push(`/meeting/${meetingIdInput}`);
      } else {
        setError(data.error || 'Could not locate the meeting session.');
      }
    } catch (error) {
      setError('Communication sync failed. Try again.');
    } finally {
      setIsActionLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-foreground font-inter">
      <Navbar />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-y-auto p-6 md:p-12 relative">
          {/* Background Ambient Layers */}
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] -z-10" />

          <div className="max-w-[1200px] mx-auto">
            {/* Action Bar */}
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-16">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-black tracking-widest mb-4">
                   <Activity className="w-3 h-3" /> Command Center
                </div>
                <h1 className="text-5xl font-black mb-3 text-white tracking-tighter">My Workspace</h1>
                <p className="text-slate-500 font-medium">Coordinate, collaborate, and synthesize insights.</p>
              </motion.div>

              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                 <form onSubmit={handleJoinMeeting} className="relative w-full sm:w-80 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text"
                      placeholder="Access with Invite ID..."
                      value={meetingIdInput}
                      onChange={(e) => setMeetingIdInput(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/5 focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300 font-bold text-sm"
                    />
                    <button type="submit" disabled={isActionLoading || !meetingIdInput} className="absolute right-2 top-2 h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-0 transition-all">
                       Join
                    </button>
                 </form>
                 <button 
                  onClick={handleCreateMeeting}
                  disabled={isActionLoading}
                  className="btn-primary min-w-[200px] h-14"
                 >
                   {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                   Establish Link
                 </button>
              </div>
            </div>

            {error && (
               <motion.div 
                 initial={{ opacity: 0, y: -10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black uppercase tracking-widest text-center"
               >
                 {error}
               </motion.div>
            )}

            {/* Content Tabs / Header */}
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-8">
               <div className="flex items-center gap-6">
                  <button className="text-sm font-black uppercase tracking-widest text-white border-b-2 border-primary pb-2">All Sessions</button>
                  <button className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors pb-2">Upcoming</button>
                  <button className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors pb-2">Recordings</button>
               </div>
               
               <div className="flex items-center gap-3">
                  <button onClick={fetchMeetings} className="p-3 text-slate-500 hover:text-primary transition-colors">
                     <RefreshCcw size={18} />
                  </button>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                     <button className="p-2 bg-primary rounded-lg text-white shadow-lg">
                       <LayoutGrid size={16} />
                     </button>
                     <button className="p-2 text-slate-500 hover:text-white transition-all">
                       <List size={16} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Grid Display */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="py-32 flex flex-col items-center justify-center grayscale"
                >
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Retrieving Matrix</span>
                </motion.div>
              ) : meetings.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 rounded-[4rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center px-8 bg-white/[0.01]"
                >
                  <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 flex items-center justify-center mb-8 border border-white/5 shadow-inner">
                     <Video className="w-10 h-10 text-slate-700" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white">Your Workspace is Empty</h3>
                  <p className="text-slate-500 font-medium max-w-sm mb-12 leading-relaxed">
                    Begin the evolution by hosting your first AI-integrated session. All metrics and summaries will appear here.
                  </p>
                  <button onClick={handleCreateMeeting} className="btn-primary px-12 h-16 text-lg">
                    Initialize Phase 1
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10"
                >
                  {meetings.map((meeting, i) => (
                    <motion.div 
                      key={meeting.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
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
                  
                  {/* Quick Shot Card */}
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.01 }}
                    onClick={handleCreateMeeting}
                    className="p-10 rounded-[3rem] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/[0.03] hover:border-primary/40 transition-all duration-500 group"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center group-hover:bg-primary transition-all duration-500 shadow-2xl">
                      <Plus className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <span className="mt-6 text-xs font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-white">Blast Link</span>
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
