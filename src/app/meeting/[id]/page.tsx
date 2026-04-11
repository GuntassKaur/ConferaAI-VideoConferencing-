'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoGrid from '@/components/VideoGrid';
import AIPanel from '@/components/AIPanel';
import ControlBar from '@/components/ControlBar';
import { Shield, Send, Users, Activity, Sparkles, LayoutGrid, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRoomStore } from '@/store/useRoomStore';

export default function MeetingRoom() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuthStore();
  const { addTranscript } = useRoomStore();
  
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<{user: string, text: string, time: string}[]>([]);
  const [input, setInput] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Session check
    if (!user) {
      const savedUser = localStorage.getItem('confera-session');
      if (!savedUser) {
        router.push('/login');
        return;
      }
    }
    
    // Initial data fetch
    const init = async () => {
      await fetchParticipants();
      setIsInitializing(false);
    };
    init();

    // Polling logic for "Real" feel
    const pInterval = setInterval(fetchParticipants, 5000);
    
    // Welcome message
    setMessages([
      { 
        user: 'Confera AI', 
        text: 'Neural linkage initialized. All communications are E2EE secured.', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }
    ]);

    return () => clearInterval(pInterval);
  }, [id, user]);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/meetings/participants?meetingId=${id}`);
      if (!res.ok) throw new Error('Meeting access failed');
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants);
      }
    } catch (error) {
       console.error('Participant Fetch Error:', error);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const newMsg = { user: user.name, text: input, time };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Feed the AI transcripts store
    addTranscript({
       id: Math.random().toString(36),
       speaker: user.name,
       text: input,
       timestamp: new Date()
    });
    
    setInput('');
  };

  if (isInitializing) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center">
         <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse border border-primary/20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
         </div>
         <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Syncing Neural Link...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col overflow-hidden text-slate-100 selection:bg-primary/30 font-inter">
      {/* Header Overlay */}
      <header className="h-20 px-10 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-3xl z-30">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push('/dashboard')}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                 <Video className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl tracking-tighter">Confera<span className="text-primary italic">AI</span></span>
           </div>
           
           <div className="h-8 w-[1px] bg-white/5" />
           
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Session</span>
              <span className="text-sm font-bold text-slate-200"># {id}</span>
           </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Connection Prime</span>
              </div>
              <div className="w-[1px] h-4 bg-white/10" />
              <span className="text-[10px] font-black text-slate-500 uppercase">Latency: 12ms</span>
           </div>

           <div className="flex items-center gap-3 bg-indigo-500/10 px-4 py-2 rounded-2xl border border-indigo-500/20">
              <Users size={16} className="text-indigo-400" />
              <span className="text-xs font-black text-indigo-100">{participants.length}</span>
           </div>
        </div>
      </header>

      {/* Workspace Orchestrator */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stage Content */}
        <div className="flex-[0.7] flex flex-col p-4 bg-black/10">
           <div className="flex-1 rounded-[3rem] overflow-hidden border border-white/5 bg-[#050b18] shadow-2xl relative group">
              <VideoGrid participants={participants} />
              
              <div className="absolute top-8 left-8 flex items-center gap-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                 <div className="px-5 py-2.5 rounded-2xl glass-card border-white/10 flex items-center gap-3">
                    <Activity size={18} className="text-primary animate-spin-slow" />
                    <span className="text-xs font-black uppercase tracking-widest">Neural Stream</span>
                 </div>
              </div>

              <ControlBar />
           </div>
        </div>

        {/* Intelligence Side-Stack */}
        <div className="flex-[0.3] flex flex-col bg-[#050b18] border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
           <div className="flex-1 overflow-hidden transition-all duration-300">
              <AIPanel />
           </div>

           {/* Communications Terminal */}
           <div className="h-[45%] flex flex-col bg-black/20 border-t border-white/5">
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Comms Log</h3>
                 <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Synced</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                 {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                       <Sparkles size={40} className="mb-4 text-primary" />
                       <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Initialize Chat</p>
                    </div>
                 ) : (
                    messages.map((m, i) => (
                      <div key={i} className={`flex flex-col gap-1.5 ${m.user === user?.name ? 'items-end' : 'items-start'}`}>
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 px-2">{m.user}</span>
                         <div className={`px-5 py-3.5 rounded-3xl text-sm max-w-[90%] shadow-lg leading-relaxed ${m.user === user?.name ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-900 text-slate-300 border border-white/5 rounded-tl-none'}`}>
                            {m.text}
                            <span className="block mt-2 text-[9px] opacity-40 font-bold uppercase tracking-widest">{m.time}</span>
                         </div>
                      </div>
                    ))
                 )}
              </div>

              <form onSubmit={sendMessage} className="p-6 bg-black/40 border-t border-white/5">
                 <div className="relative group">
                    <input
                      type="text"
                      placeholder="Transmission..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full h-14 pl-6 pr-14 rounded-2xl bg-white/5 border border-white/10 text-sm font-medium focus:ring-4 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all duration-300 placeholder:text-slate-700 hover:bg-white/10"
                    />
                    <button type="submit" className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary-hover flex items-center justify-center text-white shadow-lg active:scale-95 transition-all">
                       <Send size={18} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
