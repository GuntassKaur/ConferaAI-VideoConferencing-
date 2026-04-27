'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, Video, Clock, 
  Search, Shield, Zap, 
  ArrowRight, MoreVertical,
  Calendar, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardContent() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingId, setMeetingId] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    const userId = currentUser?.id || 'guest_global';
    fetch(`/api/meetings?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMeetings(data.meetings);
        }
      })
      .catch(console.error);
  }, [currentUser]);

  const startMeeting = async () => {
    setIsStarting(true);
    const realId = `meet-${Math.random().toString(36).substring(7)}`;
    const userName = currentUser?.name || 'Guest User';
    const userId = currentUser?.id || `guest_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      await fetch('/api/livekit/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: realId,
          name: `${userName}'s Meeting`,
          hostId: userId
        })
      });
      router.push(`/meeting/${realId}`);
    } catch (error) {
      console.error(error);
      setIsStarting(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim()) router.push(`/meeting/${meetingId.trim()}/join`);
  };

  return (
    <div className="px-8 py-10">
      {/* 🚀 HEADER SECTION */}
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm font-medium mt-1">Manage your meetings and sessions</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-3 py-1.5 bg-[#111827] border border-[#1F2937] rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              System Online
           </div>
        </div>
      </header>

      {/* 🧱 MAIN GRID (Start | Join) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Start Meeting Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-8 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-sm flex flex-col relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-[#6366F1]" />
          <div className="w-12 h-12 bg-[#6366F1]/10 rounded-xl flex items-center justify-center text-[#6366F1] mb-6 border border-[#6366F1]/20 group-hover:scale-110 transition-transform">
             <Video size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Start Meeting</h3>
          <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
            Launch a secure, high-definition instant session.
          </p>
          <button 
            onClick={startMeeting}
            disabled={isStarting}
            className="w-full py-3.5 bg-[#6366F1] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
          >
            {isStarting ? 'Initializing...' : 'Start Session'}
            <ArrowRight size={14} />
          </button>
        </motion.div>

        {/* Join Meeting Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-8 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-sm flex flex-col group"
        >
          <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 mb-6 border border-slate-700 group-hover:scale-110 transition-transform">
             <Zap size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Join Meeting</h3>
          <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
            Connect to an existing session via access code.
          </p>
          <form onSubmit={handleJoin} className="mt-auto flex gap-3">
            <input 
              type="text" 
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Access code"
              className="flex-1 bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] transition-all"
            />
            <button 
              type="submit"
              disabled={!meetingId}
              className="px-6 py-3.5 bg-[#1F2937] border border-[#1F2937] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:border-slate-500 transition-all disabled:opacity-30 active:scale-[0.98]"
            >
              Join
            </button>
          </form>
        </motion.div>
      </div>

      {/* 📋 RECENT MEETINGS (List View) */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
           <h4 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
             <Clock size={16} className="text-[#6366F1]" />
             Recent Transmissions
           </h4>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden shadow-sm">
          {meetings.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center mb-4 text-slate-700 border border-[#1F2937]">
                  <Calendar size={24} />
               </div>
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No activity history detected</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1F2937]">
              {meetings.slice(0, 5).map((m: any, i: number) => (
                <div 
                  key={m.id} 
                  className="flex items-center justify-between p-5 hover:bg-[#0F172A]/50 transition-all group cursor-pointer"
                  onClick={() => router.push(`/meeting/${m.roomId || m.id}`)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 bg-[#0F172A] rounded-lg flex items-center justify-center text-slate-500 border border-[#1F2937] group-hover:text-[#6366F1] group-hover:border-[#6366F1]/30 transition-all">
                      <Video size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-[#6366F1] transition-colors">{m.name || m.roomId || m.id}</p>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">ID: {m.roomId || m.id}</span>
                         <div className="w-1 h-1 bg-slate-700 rounded-full" />
                         <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                           {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                       <CheckCircle2 size={10} />
                       Secured
                    </div>
                    <button className="p-2 text-slate-600 hover:text-white rounded-lg transition-colors">
                       <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
