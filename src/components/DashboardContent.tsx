'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { useRouter } from 'next/navigation';

import { 
  Plus, Video, Clock, 
  Search, Shield, Zap, 
  ArrowRight, MoreVertical,
  Calendar, CheckCircle2,
  Users, LayoutGrid, Settings,
  LogOut, Bell, Monitor, Sparkles,
  Link as LinkIcon, Trash2, Loader2,
  ExternalLink
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardContent() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingId, setMeetingId] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) {
      const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
      useAuthStore.getState().setUser({ 
        id: guestId, 
        name: 'Guest Explorer', 
        email: 'guest@confera.ai' 
      });
    }
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
    const { addToast } = useToastStore.getState();
    setIsStarting(true);
    try {
      const res = await fetch("/api/meeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: currentUser?.id || 'guest_global',
          name: `${currentUser?.name || 'Guest'}'s Workspace`
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "API failed");
      if (!data.meetingId) throw new Error("No meeting ID received");


      addToast("Session initialized. Redirecting...", "success");
      window.location.href = `/meeting/${data.meetingId}`;
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "System failure during session initialization.", "error");
      setIsStarting(false);
    }

  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = meetingId.trim();
    if (!id) return;
    
    try {
      const res = await fetch("/api/meeting/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          meetingId: id,
          userId: currentUser?.id || 'guest_global',
          name: currentUser?.name || 'Guest'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join session.");

      useToastStore.getState().addToast("Joining session...", "success");
      window.location.href = `/meeting/${id}`;
    } catch (err: any) {
      useToastStore.getState().addToast(err.message, "error");
    }

  };


  const deleteMeeting = async (id: string) => {
    if (!confirm('Are you sure you want to purge this session data?')) return;
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
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans selection:bg-indigo-500/30">
      <div className="max-w-[1200px] mx-auto p-6 lg:p-12">
        
        {/* ⚡ HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard</h1>
            <p className="text-slate-400 text-sm font-medium">Manage your encrypted sessions and AI recaps.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter sessions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#111827] border border-[#1F2937] rounded-lg pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors w-full md:w-64 placeholder:text-slate-600"
                />
             </div>
             <button className="p-2 bg-[#111827] border border-[#1F2937] rounded-lg text-slate-400 hover:text-white transition-colors">
                <Bell size={16} />
             </button>
          </div>
        </header>

        {/* 🧱 ACTION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Create Meeting */}
          <div className="p-8 bg-[#111827] border border-[#1F2937] rounded-2xl hover:border-indigo-500/50 transition-all duration-200 group">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-500 mb-6 border border-indigo-500/20">
               <Video size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">New Session</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
               Deploy a secure, E2E encrypted meeting room with instant AI intelligence enabled.
            </p>
            <button 
              onClick={startMeeting}
              disabled={isStarting}
              className="px-6 py-2.5 bg-[#6366F1] text-white font-semibold text-xs rounded-lg hover:bg-[#4F46E5] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isStarting ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
              {isStarting ? 'Initializing...' : 'Start Session'}
            </button>
          </div>

          {/* Join Meeting */}
          <div className="p-8 bg-[#111827] border border-[#1F2937] rounded-2xl hover:border-indigo-500/50 transition-all duration-200 group">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
               <LinkIcon size={20} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Join Room</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
               Access an existing workspace via unique transmission code.
            </p>
            <form onSubmit={handleJoin} className="flex gap-2">
              <input 
                type="text" 
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                placeholder="Session ID"
                className="flex-1 bg-[#0F172A] border border-[#1F2937] rounded-lg px-4 py-2.5 text-xs font-medium text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button 
                type="submit"
                disabled={!meetingId}
                className="px-6 py-2.5 bg-[#1F2937] text-white font-semibold text-xs rounded-lg hover:bg-[#374151] transition-colors disabled:opacity-30"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* 📋 RECENT SESSIONS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
             <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Clock size={12} />
               Recent Transmissions
             </h4>
             <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{filteredMeetings.length} Total</span>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden divide-y divide-[#1F2937]">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                 <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-4" />
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Synchronizing History...</p>
              </div>
            ) : filteredMeetings.length === 0 ? (
              <div className="p-12 text-center">
                 <p className="text-sm text-slate-500 font-medium italic">No session history found on this uplink.</p>
              </div>
            ) : (
              filteredMeetings.map((m: any) => (
                <div 
                  key={m.meetingId} 
                  className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 bg-[#0F172A] border border-[#1F2937] rounded-lg flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-colors">
                      <Video size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{m.name || `Session ${m.meetingId}`}</p>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{m.meetingId}</span>
                         <div className="w-1 h-1 bg-slate-800 rounded-full" />
                         <span className="text-[10px] font-medium text-slate-500">
                           {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.location.href = `/meeting/${m.meetingId}`}
                      className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                      title="Rejoin Session"
                    >
                       <ExternalLink size={16} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMeeting(m.meetingId);
                      }}
                      className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
                      title="Purge Record"
                    >
                       <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
