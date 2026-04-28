'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  Brain, Sparkles, Check, X, User,
  MessageSquare, Users, PhoneOff,
  Monitor, Smile, Copy, FileText, Send,
  Loader2, Trash2, Settings, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LiveKitRoom, 
  VideoConference, 
  RoomAudioRenderer,
  useTracks,
  TrackReference,
  ParticipantTile,
  LayoutLoop,
  TrackLoop,
  ConnectionState
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';

interface Reaction {
  id: string;
  emoji: string;
  x: number;
}

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const meetingId = params.id as string;
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'ai' | 'notes'>('ai');
  
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [recap, setRecap] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // --- 🎥 LIVEKIT & MEDIA LOGIC ---
  const [token, setToken] = useState<string | null>(null);
  const [wsUrl, setWsUrl] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    try {
      const res = await fetch("/api/meeting/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          meetingId, 
          userId: currentUser?.id || 'guest_' + Math.random().toString(36).substring(2, 7),
          name: currentUser?.name || 'Guest'
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join session registry.");

      setToken(data.token);
      setWsUrl(data.wsUrl);
      setMeetingData(data.meeting);

      // Local Media for preview (optional, LiveKit handles this)
    } catch (e: any) { 
      console.error("Session initialization failed:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [meetingId, currentUser]);

  useEffect(() => {
    initSession();
    fetchNotes();
  }, [initSession]);

  // --- 😀 REACTIONS ---
  const addReaction = (emoji: string) => {
    const id = Math.random().toString(36).substring(7);
    const x = Math.random() * 60 + 20; 
    setReactions(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 3000);
  };

  // --- 📝 NOTES ---
  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/meeting/${meetingId}/notes`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || "");
      }
    } catch (e) { console.error(e); }
  };

  const saveNotes = async (val: string) => {
    setNotes(val);
    setIsSavingNotes(true);
    try {
      await fetch(`/api/meeting/${meetingId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: val, userId: currentUser?.id || 'guest' })
      });
    } catch (e) { console.error(e); } finally { setIsSavingNotes(false); }
  };

  // --- 🤖 AI RECAP ---
  const generateRecap = async () => {
    const { addToast } = useToastStore.getState();
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/ai/recap`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: meetingId, transcript: notes }) 
      });
      if (res.ok) {
        const data = await res.json();
        setRecap(data.recap);
        setActiveTab('ai');
        addToast("Intelligence report generated.", "success");
      } else {
        const data = await res.json();
        addToast(data.error || "Failed to generate AI recap.", "error");
      }
    } catch (e: any) { 
      console.error(e);
      addToast("AI Synthesis Engine offline.", "error");
    } finally { setIsGenerating(false); }
  };


  if (isLoading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white font-inter">
         <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-8" />
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  if (error || !token || !wsUrl) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white font-inter p-6 text-center">
         <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 shadow-2xl">
            <AlertCircle size={32} />
         </div>
         <h1 className="text-2xl font-bold tracking-tight mb-4">{error || "Connection Failed"}</h1>
         <p className="text-slate-400 max-w-sm mb-10 text-sm font-medium">The session could not be established. Ensure the meeting ID is correct and you are authorized.</p>
         <button 
           onClick={() => window.location.href = '/dashboard'}
           className="px-8 py-3 bg-[#111827] border border-white/5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
         >
            Return to Dashboard
         </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] flex overflow-hidden font-sans text-white">
      <LiveKitRoom
        video={true}
        audio={true}
        token={token}
        serverUrl={wsUrl}
        connect={true}
        onDisconnected={() => window.location.href = '/dashboard'}
        data-lk-theme="default"
        className="flex-1 flex overflow-hidden"
      >
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* ⚡ TOP OVERLAY */}
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-[#020617] to-transparent">
            <div className="flex items-center gap-4">
               <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <VideoIcon size={18} className="text-white" />
               </div>
               <div>
                  <h2 className="text-sm font-bold tracking-tight uppercase tracking-wider">{meetingData?.name || 'Secure Session'}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Encrypted Transmission • {meetingId}</span>
                  </div>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               <button onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
               }} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                  {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  {copied ? 'Copied' : 'Invite'}
               </button>
               <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className={`p-2 rounded-lg transition-all border ${isRightPanelOpen ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                  <Brain size={18} />
               </button>
            </div>
          </div>

          {/* 📹 STAGE */}
          <div className="flex-1 p-8 pt-24 pb-32">
             <VideoConference 
               controlBar={false} 
               className="!bg-transparent !border-none !shadow-none h-full"
             />
             
             {/* Reactions Overlay */}
             <div className="absolute inset-0 pointer-events-none z-40">
                <AnimatePresence>
                   {reactions.map(r => (
                     <motion.div
                       key={r.id}
                       initial={{ y: '100%', opacity: 0, x: `${r.x}%` }}
                       animate={{ y: '-10%', opacity: [0, 1, 1, 0] }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 3, ease: "easeOut" }}
                       className="absolute bottom-0 text-5xl"
                     >
                       {r.emoji}
                     </motion.div>
                   ))}
                </AnimatePresence>
             </div>
          </div>

          {/* 🎛️ CONTROLS */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#111827]/80 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/5 shadow-2xl">
             <div className="flex items-center gap-2">
                {/* Standard LiveKit Controls could be used, but for UI consistency I'll use a custom ControlBar wrapper or just use the default one for now to ensure functionality */}
                <ControlBar 
                  variation="minimal" 
                  controls={{ 
                    microphone: true, 
                    camera: true, 
                    chat: false, 
                    screenShare: true, 
                    leave: true 
                  }}
                  className="!bg-transparent !border-none !gap-3"
                />
             </div>
             
             <div className="w-px h-8 bg-white/10 mx-2" />
             
             <div className="relative group">
                <button className="w-10 h-10 rounded-lg bg-white/5 text-slate-400 flex items-center justify-center hover:bg-white/10 transition-all">
                   <Smile size={18} />
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-[#1F2937] border border-white/10 rounded-xl flex gap-3 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                   {['👍','😂','👏','❤️','😮','🔥'].map(e => (
                     <button key={e} onClick={() => addReaction(e)} className="text-2xl hover:scale-125 active:scale-95 transition-transform">{e}</button>
                   ))}
                </div>
             </div>
          </div>

          <RoomAudioRenderer />
        </div>

        {/* 🧩 SIDE PANEL */}
        <AnimatePresence>
          {isRightPanelOpen && (
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[400px] bg-[#111827] border-l border-white/5 flex flex-col shadow-2xl z-50"
            >
               <div className="flex border-b border-white/5">
                  <button 
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'ai' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                     AI Intelligence
                     {activeTab === 'ai' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[1px] bg-indigo-500" />}
                  </button>
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className={`flex-1 py-5 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'notes' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                     Shared Notes
                     {activeTab === 'notes' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[1px] bg-indigo-500" />}
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                  {activeTab === 'ai' ? (
                     <div className="space-y-8 flex flex-col h-full">
                        {!recap ? (
                          <div className="flex-1 flex flex-col items-center justify-center text-center">
                             <div className="w-20 h-20 bg-indigo-500/5 rounded-2xl flex items-center justify-center mb-8 text-indigo-500/20 border border-indigo-500/10">
                                <Brain size={36} />
                             </div>
                             <h3 className="text-xl font-bold text-white mb-3">Neural Analyzer</h3>
                             <p className="text-xs text-slate-500 font-medium leading-relaxed mb-10 px-4">
                                Confera is processing the transmission. Generate a strategic recap at any moment.
                             </p>
                             <button 
                               onClick={generateRecap}
                               disabled={isGenerating}
                               className="w-full py-4 bg-[#6366F1] text-white font-bold text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                             >
                                {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                                {isGenerating ? 'Synthesizing...' : 'Generate Recap'}
                             </button>
                          </div>
                        ) : (
                          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
                             <section>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-4">Executive TL;DR</label>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-sm leading-relaxed text-indigo-100 italic">
                                   "{recap.tldr || recap.summary}"
                                </div>
                             </section>
                             
                             <section>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-6">Key Actions</label>
                                <div className="space-y-4">
                                   {recap.actionItems?.map((item: any, i: number) => (
                                      <div key={i} className="p-4 bg-white/[0.01] border border-white/5 rounded-xl">
                                         <p className="text-xs font-bold text-white mb-3">{item.task}</p>
                                         <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400 uppercase">{item.owner?.charAt(0)}</div>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.owner}</span>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                             </section>
 
                             <button onClick={() => setRecap(null)} className="w-full py-4 text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-all flex items-center justify-center gap-2">
                                <Trash2 size={12} /> Reset View
                             </button>
                          </div>
                        )}
                     </div>
                  ) : (
                     <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6 px-1">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Collaborative Scratchpad</label>
                           {isSavingNotes && <div className="text-[10px] font-bold text-emerald-500 animate-pulse">Syncing...</div>}
                        </div>
                        <textarea 
                          value={notes}
                          onChange={(e) => saveNotes(e.target.value)}
                          placeholder="Synthesize thoughts..."
                          className="flex-1 w-full bg-white/[0.01] border border-white/5 rounded-2xl p-6 text-sm text-slate-300 leading-relaxed placeholder:text-slate-800 focus:outline-none focus:border-indigo-500/20 transition-all resize-none font-medium custom-scrollbar"
                        />
                     </div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LiveKitRoom>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
