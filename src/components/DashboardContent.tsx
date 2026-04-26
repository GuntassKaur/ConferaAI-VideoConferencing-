'use client';
import { useState, useEffect } from 'react';
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
  const { currentUser, addMeeting } = useProductStore();
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

  const upcomingMeetings = currentUser.meetings || [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Modern Header */}
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Good afternoon, {currentUser.name.split(' ')[0]}
          </h1>
          <p className="text-slate-500 text-lg">
            Ready to start your next collaboration?
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
           <div className="flex -space-x-2 px-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-slate-600">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
           </div>
           <div className="h-6 w-px bg-slate-200" />
           <div className="px-3 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">System Ready</span>
           </div>
        </div>
      </header>

      {/* Primary Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={startMeeting}
          disabled={isStarting}
          className="relative group p-8 bg-indigo-600 rounded-3xl text-left overflow-hidden shadow-lg shadow-indigo-200"
        >
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-md">
               <Video className="text-white" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">New Meeting</h3>
            <p className="text-indigo-100 text-sm mb-8 max-w-[240px]">
              Start an instant meeting and invite others to join your workspace.
            </p>
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              {isStarting ? 'Starting...' : 'Start now'} 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:scale-110 transition-transform duration-500">
             <Video size={160} />
          </div>
        </motion.button>

        <motion.div 
          whileHover={{ y: -4 }}
          className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm group"
        >
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mb-6 text-slate-600">
             <Plus size={24} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Join Meeting</h3>
          <p className="text-slate-500 text-sm mb-8">
            Enter a meeting ID or link to join an existing session.
          </p>
          
          <form onSubmit={handleJoin} className="flex gap-2">
            <input 
              type="text" 
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Meeting ID"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
            />
            <button 
              type="submit"
              disabled={!meetingId}
              className="px-6 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join
            </button>
          </form>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-8">
           <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
             <History size={20} className="text-slate-400" />
             Recent Meetings
           </h4>
           {upcomingMeetings.length > 0 && (
             <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">View all</button>
           )}
        </div>

        <AnimatePresence mode="wait">
          {upcomingMeetings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center"
            >
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm text-slate-300">
                  <Video size={32} />
               </div>
               <h5 className="text-lg font-semibold text-slate-900 mb-1">No recent meetings</h5>
               <p className="text-slate-500 text-sm max-w-[280px] mb-6">
                 Meetings you host or join will appear here for quick access.
               </p>
               <button onClick={startMeeting} className="text-sm font-bold text-indigo-600 flex items-center gap-1 hover:gap-2 transition-all">
                  Create your first meeting <ArrowRight size={14} />
               </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMeetings.map((m, i) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-white border border-slate-200 rounded-2xl group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all relative"
                  onClick={() => router.push(`/meeting/${m.id}`)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Calendar size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                  </div>
                  <h6 className="font-bold text-slate-900 mb-1 truncate">{m.title}</h6>
                  <p className="text-xs text-slate-500 font-medium">{m.createdAt}</p>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-white" />
                        <div className="w-6 h-6 rounded-full bg-slate-200 border border-white" />
                     </div>
                     <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* Feature Promo */}
      <div className="mt-16 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">New</span>
          </div>
          <h5 className="text-xl font-bold mb-2">AI Post-Meeting Recaps</h5>
          <p className="text-slate-300 text-sm max-w-md">
            Get automated summaries, key action items, and transcripts delivered right to your dashboard after every call.
          </p>
        </div>
        <button className="relative z-10 px-6 py-3 bg-white text-slate-900 font-bold text-sm rounded-xl hover:bg-slate-100 transition-all shadow-lg whitespace-nowrap">
          Learn more
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl -mr-32 -mt-32" />
      </div>
    </div>
  );
}
  );
}



