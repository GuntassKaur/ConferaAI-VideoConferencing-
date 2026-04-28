'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, Video, Clock, 
  Search, Shield, Zap, 
  ArrowRight, MoreVertical,
  Calendar, CheckCircle2,
  Users, LayoutGrid, Settings,
  LogOut, Bell, Monitor, Sparkles,
  Link as LinkIcon, Trash2, Loader2
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardContent() {
  const router = useRouter();
  const { user: currentUser, logout } = useAuthStore();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingId, setMeetingId] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, [currentUser]);

  const fetchMeetings = async () => {
    setIsLoading(true);
    const userId = currentUser?.id || 'guest_global';
    try {
      const res = await fetch(`/api/meetings?userId=${userId}`);
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startMeeting = async () => {
    console.log("Start Meeting clicked");
    setIsStarting(true);
    
    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: currentUser?.id || 'guest_global',
          name: `${currentUser?.name || 'Guest'}'s Workspace`
        })
      });

      if (!res.ok) {
        throw new Error("API failed");
      }

      const data = await res.json();

      if (!data.meetingId) {
        throw new Error("No meeting ID received");
      }

      // 100% reliable redirect
      window.location.href = `/meeting/${data.meetingId}`;
    } catch (err) {
      console.error(err);
      alert("Failed to create meeting");
      setIsStarting(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim()) {
      window.location.href = `/meeting/${meetingId.trim()}`;
    }
  };

  const deleteMeeting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      const res = await fetch(`/api/meetings?meetingId=${id}&userId=${currentUser?.id || 'guest_global'}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchMeetings();
    } catch (e) { console.error(e); }
  };

  const filteredMeetings = meetings.filter(m => 
    (m.name || m.meetingId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 lg:p-10 font-inter">
      {/* 🚀 ELITE HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">Enterprise</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Active</span>
           </div>
           <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Workspace Dashboard
           </h1>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search sessions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-all w-full md:w-64 placeholder:text-slate-600"
              />
           </div>
           <button className="p-2.5 bg-[#111827] border border-[#1F2937] rounded-xl text-slate-400 hover:text-white transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#111827]" />
           </button>
        </div>
      </header>

      {/* 🧱 QUICK ACTIONS & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {/* Start Meeting */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 bg-gradient-to-br from-[#6366F1] to-indigo-700 rounded-[2rem] shadow-xl shadow-indigo-500/10 flex flex-col relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10 group-hover:scale-110 transition-transform">
             <Video size={24} />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">New Session</h3>
          <p className="text-indigo-100 text-sm font-medium mb-10 leading-relaxed">
             Instant HD video encryption and AI recap enabled.
          </p>
          <button 
            onClick={startMeeting}
            disabled={isStarting}
            className="w-full py-4 bg-white text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
          >
            {isStarting ? 'Initializing...' : 'Start Meeting'}
            <Plus size={16} />
          </button>
        </motion.div>

        {/* Join Meeting */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 bg-[#111827] border border-[#1F2937] rounded-[2rem] shadow-xl flex flex-col group"
        >
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
             <LinkIcon size={24} />
          </div>
          <h3 className="text-xl font-extrabold text-white mb-2">Join Room</h3>
          <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
             Access an existing transmission via unique code.
          </p>
          <form onSubmit={handleJoin} className="flex gap-3">
            <input 
              type="text" 
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Session ID"
              className="flex-1 bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-sm font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-all"
            />
            <button 
              type="submit"
              disabled={!meetingId}
              className="px-6 py-4 bg-[#1F2937] text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-[#374151] transition-all disabled:opacity-30 active:scale-[0.98]"
            >
              Join
            </button>
          </form>
        </motion.div>

        {/* AI Stats Card */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 bg-[#111827] border border-[#1F2937] rounded-[2rem] shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-6">
             <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Sparkles size={24} />
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Analysis</p>
                <p className="text-2xl font-black text-white">{meetings.length}</p>
             </div>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase tracking-widest">Efficiency Rating</span>
                <span className="text-emerald-500 font-black">98.4%</span>
             </div>
             <div className="w-full h-2 bg-[#0F172A] rounded-full overflow-hidden">
                <div className="w-[98%] h-full bg-emerald-500" />
             </div>
          </div>
        </motion.div>
      </div>

      {/* 📋 RECENT SESSIONS */}
      <section className="bg-[#111827] border border-[#1F2937] rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-[#1F2937] flex items-center justify-between">
           <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
             <Clock size={18} className="text-indigo-500" />
             Transmission History
           </h4>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Filtered By: Latest</span>
           </div>
        </div>

        <div className="divide-y divide-[#1F2937]">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
               <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Synchronizing Encrypted Data...</p>
            </div>
          ) : filteredMeetings.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mb-6 text-slate-700 border border-[#1F2937]">
                  <Calendar size={32} />
               </div>
               <h5 className="text-xl font-bold text-white mb-2">No Sessions Found</h5>
               <p className="text-sm text-slate-500 font-medium mb-8">Your meeting history is currently empty.</p>
               <button onClick={startMeeting} className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-500 hover:text-white transition-all">Start First Meeting</button>
            </div>
          ) : (
            filteredMeetings.map((m: any) => (
              <div 
                key={m.meetingId} 
                className="flex items-center justify-between p-6 hover:bg-[#0F172A]/40 transition-all group cursor-pointer"
                onClick={() => window.location.href = `/meeting/${m.meetingId}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center text-slate-500 border border-[#1F2937] group-hover:text-indigo-500 group-hover:border-indigo-500/30 transition-all">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white group-hover:text-indigo-500 transition-colors">{m.name || `Session ${m.meetingId}`}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                       <span className="px-2 py-0.5 bg-[#0F172A] border border-[#1F2937] rounded-md text-[9px] font-black text-slate-500 uppercase tracking-widest">{m.meetingId}</span>
                       <div className="w-1 h-1 bg-slate-700 rounded-full" />
                       <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                         {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">
                     <CheckCircle2 size={12} />
                     Completed
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMeeting(m.meetingId);
                    }}
                    className="p-2.5 text-slate-600 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"
                  >
                     <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

