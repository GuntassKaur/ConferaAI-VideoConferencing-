'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, Video, History, Settings, 
  Shield, Clock, Calendar, Users, 
  ArrowRight, Search, Zap, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      const response = await fetch('/api/livekit/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: realId,
          name: `${userName}'s Meeting`,
          hostId: userId
        })
      });

      if (!response.ok) throw new Error('Failed to create meeting');
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
    <div className="max-w-6xl mx-auto px-6 py-12 font-inter">
      {/* 🚀 PREMIUM HEADER */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}` : 'Terminal Access'}
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            {currentUser ? 'Your collaboration dashboard is live and operational.' : 'Authorized guest access enabled for this session.'}
          </p>
        </motion.div>
        <div className="hidden md:flex items-center gap-3">
           <div className="px-4 py-2 bg-[#111827] border border-[#1F2937] rounded-xl flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Zap size={14} className="text-[#6366F1]" />
              Lat: 12ms
           </div>
           <div className="px-4 py-2 bg-[#111827] border border-[#1F2937] rounded-xl flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Shield size={14} className="text-emerald-500" />
              Secure
           </div>
        </div>
      </header>

      {/* 🧩 PRIMARY ACTION CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Start Meeting */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="lg:col-span-7 p-8 bg-[#111827] border border-[#1F2937] rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6366F1]" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 h-full">
            <div className="flex-1">
              <div className="w-14 h-14 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center text-[#6366F1] mb-6 border border-[#6366F1]/20 shadow-lg shadow-[#6366F1]/5">
                 <Video size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Launch Instant Session</h3>
              <p className="text-slate-400 text-sm font-medium mb-8 max-w-xs leading-relaxed">
                Start a high-definition, end-to-end encrypted video meeting in one click.
              </p>
              <button 
                onClick={startMeeting}
                disabled={isStarting}
                className="w-full md:w-auto px-10 py-4 bg-[#6366F1] text-white font-bold text-sm rounded-xl hover:bg-[#4F46E5] transition-all shadow-xl shadow-[#6366F1]/20 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {isStarting ? (
                  <><Zap className="animate-pulse" size={18} /> Initializing...</>
                ) : (
                  <><Plus size={18} /> Create Room</>
                )}
              </button>
            </div>
            <div className="hidden md:flex flex-col gap-3 shrink-0">
               <div className="p-4 bg-[#0F172A] border border-[#1F2937] rounded-2xl flex flex-col items-center gap-1 group-hover:border-[#6366F1]/30 transition-all">
                  <Layout size={20} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Grid View</span>
               </div>
               <div className="p-4 bg-[#0F172A] border border-[#1F2937] rounded-2xl flex flex-col items-center gap-1 group-hover:border-[#6366F1]/30 transition-all">
                  <Shield size={20} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">E2EE</span>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Join Meeting */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="lg:col-span-5 p-8 bg-[#111827] border border-[#1F2937] rounded-[2.5rem] shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col h-full">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-6 border border-slate-700">
               <Zap size={28} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Join Existing</h3>
            <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
              Enter a secure access code to connect to an ongoing transmission.
            </p>
            <form onSubmit={handleJoin} className="mt-auto space-y-4">
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#6366F1] transition-colors" />
                <input 
                  type="text" 
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  placeholder="Enter access code"
                  className="w-full bg-[#0F172A] border border-[#1F2937] rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] transition-all shadow-inner"
                />
              </div>
              <button 
                type="submit"
                disabled={!meetingId}
                className="w-full py-4 bg-[#0F172A] border border-[#1F2937] text-white font-bold text-sm rounded-xl hover:bg-[#1F2937] transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                Join Transmission
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* 🕒 RECENT ACTIVITY SECTION */}
      <section>
        <div className="flex items-center justify-between mb-8 px-4">
           <h4 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
             <History size={20} className="text-[#6366F1]" />
             Recent Transmissions
           </h4>
           <button 
            onClick={() => router.push('/meetings')}
            className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
           >
             View full archive
           </button>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] rounded-[2rem] overflow-hidden shadow-2xl">
          {meetings.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-[#0F172A] rounded-full flex items-center justify-center mb-6 text-slate-700 border border-[#1F2937]">
                  <Clock size={32} />
               </div>
               <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">Zero activity detected</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1F2937]">
              {meetings.slice(0, 4).map((m: any, i: number) => (
                <motion.div 
                  key={m.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-6 hover:bg-[#0F172A] transition-all group cursor-pointer"
                  onClick={() => router.push(`/meeting/${m.roomId || m.id}`)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-[#0F172A] rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-[#6366F1] group-hover:border-[#6366F1]/30 border border-[#1F2937] transition-all shadow-inner">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1 group-hover:text-[#6366F1] transition-colors">{m.name || m.roomId || m.id}</p>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {m.roomId || m.id}</span>
                         <div className="w-1 h-1 bg-slate-700 rounded-full" />
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                           {new Date(m.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                         </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      className="px-6 py-2 bg-[#0F172A] border border-[#1F2937] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg group-hover:border-[#6366F1]/50 group-hover:text-[#6366F1] transition-all"
                    >
                      Re-enter
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
