'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/productStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, LogIn, Video, ArrowRight,
  History, Settings, Shield, Clock,
  Calendar, Users, Share2, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardContent() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { addMeeting } = useProductStore();
  const [meetingId, setMeetingId] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  const startMeeting = async () => {
    if (!currentUser) return;
    setIsStarting(true);
    
    const realId = `meet-${Math.random().toString(36).substring(7)}`;
    
    try {
      const response = await fetch('/api/livekit/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: realId,
          name: `${currentUser.name}'s Meeting`,
          hostId: currentUser.id
        })
      });

      if (!response.ok) throw new Error('Failed to create meeting');

      const data = await response.json();
      
      const newMeeting = {
        id: realId,
        title: data.meeting.name,
        createdAt: new Date().toLocaleString('en-US', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }),
      };
      
      addMeeting(newMeeting);
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

  if (!currentUser) return null;

  // Use product store meetings for activity list
  const { currentUser: productUser } = useProductStore();
  const upcomingMeetings = productUser?.meetings || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 🚀 PREMIUM HEADER */}
      <header className="mb-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Welcome back, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            Your workspace is ready for the next big idea.
          </p>
        </motion.div>

        <div className="flex items-center gap-4 bg-white border border-slate-200 p-2 rounded-[22px] shadow-sm">
           <div className="flex -space-x-2.5 px-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-9 h-9 rounded-full bg-slate-100 border-[3px] border-white flex items-center justify-center text-[10px] font-bold text-slate-500 ring-1 ring-slate-100">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
           </div>
           <div className="h-8 w-px bg-slate-100 mx-1" />
           <div className="pr-4 pl-2 py-1 flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em]">System Live</span>
           </div>
        </div>
      </header>

      {/* 🧩 PRIMARY ACTION CARDS (HIGH IMPACT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <motion.button
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={startMeeting}
          disabled={isStarting}
          className="relative group p-10 bg-gradient-to-br from-indigo-600 via-indigo-600 to-blue-600 rounded-[2.5rem] text-left overflow-hidden shadow-2xl shadow-indigo-200"
        >
          <div className="relative z-10 h-full flex flex-col">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20 shadow-inner">
               <Video className="text-white" size={28} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">Start Meeting</h3>
            <p className="text-indigo-100 text-base mb-10 max-w-[280px] leading-relaxed">
              Launch an instant AI-powered session and invite your team.
            </p>
            <div className="mt-auto flex items-center gap-2.5 text-white font-bold text-sm bg-white/10 w-fit px-5 py-2.5 rounded-xl backdrop-blur-md border border-white/10 group-hover:bg-white group-hover:text-indigo-600 transition-all">
              {isStarting ? 'Configuring Room...' : 'Go Live Now'} 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          
          {/* Abstract Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-24 -mb-24 pointer-events-none" />
          <div className="absolute top-1/2 right-10 -translate-y-1/2 p-4 text-white/5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
             <Video size={200} />
          </div>
        </motion.button>

        <motion.div 
          whileHover={{ y: -6, scale: 1.01 }}
          className="p-10 bg-white border border-slate-200 rounded-[2.5rem] shadow-xl shadow-slate-100 group flex flex-col"
        >
          <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-8 text-slate-600 shadow-inner">
             <Plus size={28} />
          </div>
          <h3 className="text-3xl font-bold text-slate-900 mb-3">Join Meeting</h3>
          <p className="text-slate-500 text-base mb-10 leading-relaxed">
            Have a meeting ID or link? Paste it below to jump right in.
          </p>
          
          <form onSubmit={handleJoin} className="mt-auto flex gap-3">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                placeholder="Enter 12-digit code"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-base font-semibold"
              />
            </div>
            <button 
              type="submit"
              disabled={!meetingId}
              className="px-8 bg-slate-900 text-white font-bold text-sm rounded-2xl hover:bg-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg active:scale-95"
            >
              Join
            </button>
          </form>
        </motion.div>
      </div>

      {/* 🕒 RECENT ACTIVITY SECTION */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
           <h4 className="text-xl font-bold text-slate-900 flex items-center gap-3">
             <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <History size={18} className="text-slate-500" />
             </div>
             Recent Sessions
           </h4>
           {upcomingMeetings.length > 0 && (
             <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-lg">View History</button>
           )}
        </div>

        <AnimatePresence mode="wait">
          {upcomingMeetings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-28 bg-white border border-slate-200 rounded-[2.5rem] text-center shadow-sm"
            >
               <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6 text-indigo-600 shadow-inner">
                  <Video size={36} />
               </div>
               <h5 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">🚀 No meetings yet</h5>
               <p className="text-slate-500 text-base max-w-[320px] mb-10 font-medium">
                 Start your first AI-powered session and experience the future of collaboration.
               </p>
               <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startMeeting} 
                className="px-8 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all"
               >
                  New Meeting <Plus size={18} />
               </motion.button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMeetings.map((m, i) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-white border border-slate-200 rounded-[2rem] group cursor-pointer hover:border-indigo-300 hover:shadow-xl transition-all relative overflow-hidden"
                  onClick={() => router.push(`/meeting/${m.id}`)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                      <Calendar size={22} />
                    </div>
                    <div className="px-3 py-1 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-full uppercase tracking-widest">
                       Archived
                    </div>
                  </div>
                  <h6 className="font-bold text-lg text-slate-900 mb-1 truncate group-hover:text-indigo-600 transition-colors">{m.title}</h6>
                  <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">{m.createdAt}</p>
                  
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex -space-x-2">
                        {[1, 2].map(j => (
                          <div key={j} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white ring-1 ring-slate-100" />
                        ))}
                        <div className="w-7 h-7 rounded-full bg-indigo-50 border-2 border-white ring-1 ring-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-600">+1</div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ArrowRight size={16} />
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* 💎 PREMIUM PROMO */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 p-10 bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-10 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="px-3 py-1 bg-indigo-500 text-[10px] font-bold rounded-full uppercase tracking-widest text-white shadow-lg shadow-indigo-500/20">
               New Feature
            </div>
          </div>
          <h5 className="text-3xl font-bold mb-3 tracking-tight">AI Post-Meeting Recaps</h5>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-medium">
            Stop taking notes. Confera AI automatically summarizes every call, identifies key decisions, and assigns action items.
          </p>
        </div>
        <button className="relative z-10 px-10 py-4 bg-white text-slate-900 font-bold text-base rounded-[1.25rem] hover:bg-slate-100 transition-all shadow-2xl shadow-black/20 whitespace-nowrap active:scale-95">
          Upgrade Workspace
        </button>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] -ml-32 -mb-32" />
      </motion.div>
    </div>
  );
}
