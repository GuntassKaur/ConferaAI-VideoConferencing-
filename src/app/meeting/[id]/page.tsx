'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import VideoGrid from '@/components/VideoGrid';
import AIPanel from '@/components/AIPanel';
import ControlBar from '@/components/ControlBar';
import { Shield, Send } from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function MeetingRoom() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { user } = useAuthStore();
  const [participants, setParticipants] = useState<any[]>([]);
  const [messages, setMessages] = useState<{user: string, text: string}[]>([]);
  const [input, setInput] = useState('');

  const { transcripts, addTranscript } = useRoomStore();

  React.useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchParticipants();
    
    // Poll for new participants every 5 seconds (Simple "Real" replacement for sockets)
    const interval = setInterval(fetchParticipants, 5000);

    // Simulate real-time transcription from active participants
    const transcriptInterval = setInterval(() => {
      if (participants.length > 0) {
        const randomSpeaker = participants[Math.floor(Math.random() * participants.length)];
        const messages = [
          "We should definitely look into the new architecture.",
          "I think the current timeline is a bit tight.",
          "Let's focus on the design system first.",
          "Does anyone have the final assets?",
          "I've updated the dashboard grid performance."
        ];
        addTranscript({
          id: Math.random().toString(),
          speaker: randomSpeaker.name,
          text: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date()
        });
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(transcriptInterval);
    };
  }, [id, user, participants]);

  const fetchParticipants = async () => {
    try {
      const res = await fetch(`/api/meetings/participants?meetingId=${id}`);
      const data = await res.json();
      if (data.success) {
        setParticipants(data.participants);
      }
    } catch (error) {
      console.error('Failed to fetch participants');
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;
    setMessages([...messages, { user: user.name, text: input }]);
    setInput('');
  };

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden text-white">
      {/* Top Header */}
      <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              Secure Session
           </div>
           <h1 className="text-sm font-bold text-slate-300">Meeting <span className="text-slate-500 font-medium ml-2">#{id}</span></h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden bg-background">
        {/* Left: Video Grid */}
        <div className="w-[70%] relative h-full bg-slate-950 p-6 flex flex-col">
           <div className="flex-1 overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/10 shadow-2xl relative">
             <VideoGrid participants={participants} />
             <ControlBar />
           </div>
        </div>

        {/* Right: AI Panel & Chat */}
        <div className="w-[30%] flex flex-col border-l border-border bg-card shadow-sm">
          <div className="flex-1 overflow-y-auto">
            <AIPanel />
          </div>
          {/* Chat Section */}
          <div className="h-[40%] flex flex-col border-t border-border bg-card">
            <div className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted">Live Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <p className="text-xs text-muted text-center mt-4">No messages yet.</p>
              ) : (
                messages.map((m, i) => (
                  <div key={i} className="text-sm bg-background p-3 rounded-xl border border-border shadow-sm">
                    <span className="font-bold text-primary block mb-1">{m.user}</span>
                    <span className="text-foreground">{m.text}</span>
                  </div>
                ))
              )}
            </div>
            <form onSubmit={sendMessage} className="p-4 border-t border-border bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-background text-sm rounded-xl px-4 py-3 text-foreground border border-border outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
              <button type="submit" className="bg-primary p-3 rounded-xl text-white hover:bg-primary-hover shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
