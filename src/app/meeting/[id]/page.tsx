'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Settings, Info, Brain } from 'lucide-react';
import AIPanel from '@/components/AIPanel';
import { useAuthStore } from '@/store/useAuthStore';
import VideoRoom from '@/components/VideoRoom';

export default function MeetingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [token, setToken] = useState('');

  // Fetch LiveKit Token
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchToken = async () => {
      try {
        const resp = await fetch(`/api/room/token?room=${id}&username=${user.name}`);
        const data = await resp.json();
        if (data.token) {
          setToken(data.token);
        } else {
          console.error("Failed to fetch LiveKit token", data);
        }
      } catch (e) {
        console.error("Error connecting to room", e);
      }
    };

    fetchToken();
  }, [id, user, router]);

  const copyMeetingId = () => {
    navigator.clipboard.writeText(id as string);
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-slate-200 overflow-hidden font-inter">
      {/* SaaS Header */}
      <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div 
            onClick={copyMeetingId}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md cursor-pointer hover:bg-blue-500/20 transition-all"
          >
            <Shield size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">SID: {id}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2 text-slate-400">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] uppercase font-bold tracking-widest">Secure Cluster Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Session Info"><Info size={18} /></button>
           <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Settings"><Settings size={18} /></button>
           <button 
             onClick={() => setIsInsightsOpen(!isInsightsOpen)}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-md border transition-all text-[10px] font-bold uppercase tracking-widest ${isInsightsOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'}`}
           >
             <Brain size={14} />
             <span>AI Insights</span>
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative flex flex-col bg-slate-950 overflow-hidden">
          {/* LiveKit Video Room handles the grid, local video, and controls */}
          <VideoRoom 
            token={token} 
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ''} 
          />
        </main>

        {/* AI Sidebar */}
        <AnimatePresence>
          {isInsightsOpen && (
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-[380px] border-l border-slate-800 relative z-40 h-full bg-slate-900/50 backdrop-blur-3xl"
            >
              <AIPanel />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
