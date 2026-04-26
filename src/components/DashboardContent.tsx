'use client';
import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, LogIn, Video, ArrowRight,
  History, Settings, Shield, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardContent() {
  const router = useRouter();
  const { currentUser, addMeeting } = useProductStore();
  const [meetingId, setMeetingId] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  const startMeeting = async () => {
    if (!currentUser) return;
    setIsStarting(true);
    
    const realId = `confera-${Math.random().toString(36).substring(7)}`;
    
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

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 lg:py-24">
      {/* Premium Header */}
      <header className="mb-20 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            Welcome back, <span className="text-indigo-500">{currentUser.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-500 text-xl font-medium max-w-xl leading-relaxed">
            Your intelligence-first communication platform. Start a session or join an active node.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 bg-[#0a0a0c] border border-white/5 p-2 rounded-3xl"
        >
           <div className="flex -space-x-2 px-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0a0a0c] flex items-center justify-center text-[10px] font-bold">U{i}</div>
              ))}
           </div>
           <div className="h-8 w-px bg-white/5" />
           <div className="px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Network Online</span>
           </div>
        </motion.div>
      </header>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24">
        {/* Start Meeting Card - Highlighted */}
        <motion.button
          whileHover={{ y: -8, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={startMeeting}
          disabled={isStarting}
          className="relative group p-1 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/20"
        >
          <div className="bg-[#0a0a0c] h-full w-full rounded-[2.9rem] p-12 flex flex-col items-start text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-white/5 rotate-12 group-hover:scale-125 transition-transform duration-700">
               <Video size={240} />
            </div>
            
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-12 shadow-xl group-hover:rotate-12 transition-transform">
               <Plus className="text-indigo-600" size={32} />
            </div>
            
            <h3 className="text-4xl font-black text-white mb-4">Start Session</h3>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed mb-12">
              Initialize a high-fidelity workspace with real-time AI transcription and spatial audio.
            </p>
            
            <div className="mt-auto flex items-center gap-3 font-black text-sm uppercase tracking-[0.2em] text-white">
              {isStarting ? 'Initializing Neural Node...' : 'Launch Instant Meeting'} 
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </motion.button>

        {/* Join Meeting Card */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="p-12 bg-[#0a0a0c] border border-white/5 rounded-[3rem] flex flex-col items-start relative group"
        >
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-12 text-slate-300">
             <LogIn size={32} />
          </div>
          
          <h3 className="text-4xl font-black text-white mb-4">Join Hub</h3>
          <p className="text-slate-500 text-lg max-w-sm leading-relaxed mb-12">
            Connect to an existing workspace via unique room identifier.
          </p>
          
          <form onSubmit={handleJoin} className="w-full relative mt-auto">
            <input 
              type="text" 
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter Session ID"
              className="w-full bg-white/[0.02] border border-white/10 rounded-[2rem] px-8 py-6 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all pr-40 text-lg font-medium"
            />
            <button 
              type="submit"
              disabled={!meetingId}
              className="absolute right-3 top-3 bottom-3 px-10 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl active:scale-95"
            >
              Join Node
            </button>
          </form>
        </motion.div>
      </div>

      {/* Activity Section */}
      <section>
        <div className="flex items-center justify-between mb-12 px-4">
           <h4 className="text-2xl font-black text-white flex items-center gap-4">
             <div className="w-2 h-10 bg-indigo-500 rounded-full" />
             Neural Archives
           </h4>
           {currentUser.meetings.length > 0 && (
             <button className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-400 transition-colors">Clear All Records</button>
           )}
        </div>

        <AnimatePresence mode="wait">
          {currentUser.meetings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-32 bg-white/[0.01] border border-dashed border-white/5 rounded-[4rem] text-center"
            >
               <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-800">
                  <Video size={48} />
               </div>
               <h5 className="text-2xl font-bold text-white mb-3">No sessions indexed</h5>
               <p className="text-slate-500 text-lg max-w-sm leading-relaxed mb-10 font-medium">
                 Once you conclude your first session, it will be automatically archived here with its AI summary.
               </p>
               <button onClick={startMeeting} className="px-10 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all">
                  Create First Session
               </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentUser.meetings.map((m, i) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-10 bg-[#0a0a0c] border border-white/5 rounded-[3rem] group cursor-pointer hover:border-indigo-500/30 transition-all relative overflow-hidden shadow-xl"
                  onClick={() => router.push(`/meeting/${m.id}`)}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={24} className="text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Clock size={24} />
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                       Archived
                    </div>
                  </div>
                  <h6 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors leading-tight">{m.title}</h6>
                  <p className="text-sm text-slate-500 font-medium">{m.createdAt}</p>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Security Banner */}
      <div className="mt-24 p-12 bg-gradient-to-br from-indigo-500/5 to-transparent border border-white/5 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center text-indigo-400">
             <Shield size={32} />
          </div>
          <div>
            <h5 className="text-xl font-bold text-white mb-1 tracking-tight">Enterprise Privacy Guaranteed</h5>
            <p className="text-slate-500 text-lg font-medium">All sessions are end-to-end encrypted and hosted on isolated nodes.</p>
          </div>
        </div>
        <button className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 hover:bg-white/10 transition-all">
          View Protocol
        </button>
      </div>
    </div>
  );
}



