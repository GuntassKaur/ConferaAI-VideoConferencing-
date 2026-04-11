'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VideoGrid from '@/components/VideoGrid';
import AIPanel from '@/components/AIPanel';
import ControlBar from '@/components/ControlBar';
import { Shield, Send, Users, Activity, Sparkles, LayoutGrid } from 'lucide-react';
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
  const [meetingTitle, setMeetingTitle] = useState('Workspace Session');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMeetingData();
    const pInterval = setInterval(fetchParticipants, 5000);
    
    // Simulate initial activity
    setMessages([
      { user: 'System', text: 'Encrypted tunnel established. Neural processing online.', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
    ]);

    return () => clearInterval(pInterval);
  }, [id, user]);

  const fetchMeetingData = async () => {
    try {
      const res = await fetch(`/api/meetings/participants?meetingId=${id}`);
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants);
      }
    } catch (error) {
       console.error(error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/meetings/participants?meetingId=${id}`);
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants);
      }
    } catch (e) {}
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    
    const newMsg = { 
      user: user.name, 
      text: input, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };
    setMessages([...messages, newMsg]);
    
    // Add to transcript store for AI recap
    addTranscript({
       id: Math.random().toString(),
       speaker: user.name,
       text: input,
       timestamp: new Date()
    });
    
    setInput('');
  };

  if (!user) return null;

  return (
    <div className="h-screen w-screen bg-[#020617] flex flex-col overflow-hidden text-slate-100 selection:bg-primary/30">
      {/* Top Header Layer */}
      <header className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-2xl z-20">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                 <Video className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-lg tracking-tight">Confera<span className="text-primary">AI</span></span>
           </div>
           <div className="h-6 w-[1px] bg-white/10 mx-2" />
           <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400">ID: <span className="text-indigo-400 ml-1">{id}</span></span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Neural Sync Active</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <LayoutGrid size={14} /> View
           </button>
           <div className="h-10 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400">
              <Users size={14} /> {participants.length} Joined
           </div>
        </div>
      </header>

      {/* Main Orchestration Layer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stage Area (70%) */}
        <div className="flex-[0.7] relative h-full flex flex-col p-4 bg-black/20">
           <div className="flex-1 rounded-[2rem] overflow-hidden border border-white/5 bg-[#050b18] shadow-2xl relative">
              <VideoGrid participants={participants} />
              
              {/* Floating Meta Overlay */}
              <div className="absolute top-6 left-6 flex items-center gap-4 pointer-events-none">
                 <div className="p-4 rounded-2xl glass-card border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-primary" />
                       <span className="text-sm font-bold">Main Stage</span>
                    </div>
                 </div>
              </div>

              {/* Functional Controls Overlay */}
              <ControlBar />
           </div>

           {/* Live Activity Feed (Subtle) */}
           <div className="h-12 flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-6 mt-2">
              <div className="flex items-center gap-2"><Activity size={12} className="text-primary" /> Edge latency: 4ms</div>
              <div className="flex items-center gap-2 text-indigo-400"><Sparkles size={12} /> Neural Synthesis: Enabled</div>
           </div>
        </div>

        {/* Intelligence & Communications Layer (30%) */}
        <div className="flex-[0.3] flex flex-col bg-[#050b18] border-l border-white/5">
           {/* Intelligence Tab */}
           <div className="flex-1 overflow-hidden flex flex-col border-b border-white/5">
              <AIPanel />
           </div>

           {/* Communications Tab */}
           <div className="h-[40%] flex flex-col">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Live Comms</h3>
                 <span className="text-[10px] font-bold text-slate-600 italic">E2EE Secured</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                 {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                       <Send size={24} className="mb-2" />
                       <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting messages</p>
                    </div>
                 ) : (
                    messages.map((m, i) => (
                      <div key={i} className={`flex flex-col gap-1 ${m.user === user.name ? 'items-end' : 'items-start'}`}>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{m.user}</span>
                         <div className={`px-4 py-2.5 rounded-2xl text-sm max-w-[85%] ${m.user === user.name ? 'bg-primary text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                            {m.text}
                            <span className="block mt-1 text-[9px] opacity-40 font-bold">{m.time}</span>
                         </div>
                      </div>
                    ))
                 )}
              </div>

              <form onSubmit={sendMessage} className="p-5 border-t border-white/5 bg-black/20">
                 <div className="relative">
                    <input
                      type="text"
                      placeholder="Collaborate..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full h-12 pl-5 pr-12 rounded-xl bg-white/5 border border-white/10 text-sm focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                    <button type="submit" className="absolute right-2 top-2 h-8 w-8 rounded-lg bg-primary hover:bg-primary-hover flex items-center justify-center text-white transition-all active:scale-90">
                       <Send size={14} />
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
}
