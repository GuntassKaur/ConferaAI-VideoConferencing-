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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'notes'>('ai');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  
  const [notes, setNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [recap, setRecap] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // --- 🎥 VIDEO LOGIC ---
  const initMedia = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) { 
      console.error("Camera access denied:", e);
      setError("Camera or Microphone access denied. Please check your permissions.");
    }
  }, []);

  useEffect(() => {
    const startup = async () => {
      await fetchMeetingData();
      await initMedia();
      await fetchNotes();
    };
    startup();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
      screenStream?.getTracks().forEach(t => t.stop());
    };
  }, [meetingId]);

  const fetchMeetingData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/meeting/${meetingId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error("Meeting not found");
        throw new Error("Failed to fetch meeting data");
      }
      const data = await res.json();
      setMeetingData(data);
      if (data.recap) setRecap(data.recap);
    } catch (e: any) { 
      console.error(e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 🖥️ SCREEN SHARING ---
  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      screenStream?.getTracks().forEach(t => t.stop());
      setScreenStream(null);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsSharingScreen(false);
    } else {
      try {
        const ss = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(ss);
        if (videoRef.current) videoRef.current.srcObject = ss;
        setIsSharingScreen(true);
        
        ss.getVideoTracks()[0].onended = () => {
          setIsSharingScreen(false);
          if (videoRef.current) videoRef.current.srcObject = stream;
        };
      } catch (e) { console.error("Screen share failed:", e); }
    }
  };

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
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/meeting/${meetingId}/end`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setRecap(data.recap);
        setActiveTab('ai');
      } else {
        alert("Failed to generate AI recap. Using fallback intelligence.");
      }
    } catch (e) { 
      console.error(e);
      alert("AI Synthesis Engine offline.");
    } finally { setIsGenerating(false); }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white font-inter">
         <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-8" />
         <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#020617] flex flex-col items-center justify-center text-white font-inter p-6 text-center">
         <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 mb-8 border border-rose-500/20 shadow-2xl">
            <AlertCircle size={40} />
         </div>
         <h1 className="text-3xl font-black tracking-tight mb-4">{error}</h1>
         <p className="text-slate-400 max-w-md mb-10 font-medium">The transmission could not be established. Ensure the meeting ID is correct and you have active network connectivity.</p>
         <button 
           onClick={() => window.location.href = '/dashboard'}
           className="px-10 py-4 bg-[#111827] border border-white/5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all shadow-xl"
         >
            Return to Command Center
         </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] flex overflow-hidden font-inter text-white">
      
      {/* 📹 MAIN STAGE */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/90 to-transparent">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <VideoIcon size={20} className="text-white" />
             </div>
             <div>
                <h2 className="text-sm font-black tracking-tight uppercase tracking-wider">{meetingData?.name || 'Secure Session'}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Live • E2E Encrypted • ID: {meetingId}</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
             }} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Invite'}
             </button>
             <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-slate-400 shadow-xl">
                <Settings size={18} />
             </button>
          </div>
        </div>

        {/* Video Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 pb-32">
           <div className="w-full h-full max-w-6xl aspect-video bg-[#0F172A] rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative border border-white/5 group">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-all duration-1000 ${isCamOn || isSharingScreen ? 'opacity-100' : 'opacity-0 scale-110 blur-3xl'}`}
              />
              
              {!isCamOn && !isSharingScreen && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#0F172A] to-[#020617]">
                   <div className="w-48 h-48 rounded-full bg-indigo-500/5 border-2 border-indigo-500/20 flex items-center justify-center text-6xl font-black text-white shadow-[0_0_50px_rgba(99,102,241,0.2)] animate-pulse">
                      {currentUser?.name?.charAt(0) || 'G'}
                   </div>
                </div>
              )}

              {/* Reactions Overlay */}
              <div className="absolute inset-0 pointer-events-none z-30">
                 <AnimatePresence>
                    {reactions.map(r => (
                      <motion.div
                        key={r.id}
                        initial={{ y: '100%', opacity: 0, x: `${r.x}%` }}
                        animate={{ y: '-10%', opacity: [0, 1, 1, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: "easeOut" }}
                        className="absolute bottom-0 text-6xl"
                      >
                        {r.emoji}
                      </motion.div>
                    ))}
                 </AnimatePresence>
              </div>

              {/* Status Tags */}
              <div className="absolute bottom-10 left-10 flex items-center gap-3">
                <div className="px-5 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] flex items-center gap-3 shadow-2xl">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-[11px] font-black uppercase tracking-widest">{currentUser?.name || 'Guest User'}</span>
                </div>
                {isSharingScreen && (
                  <div className="px-5 py-2.5 bg-indigo-500 text-white rounded-[1.5rem] flex items-center gap-2 shadow-[0_10px_30px_rgba(99,102,241,0.4)]">
                     <Monitor size={14} />
                     <span className="text-[11px] font-black uppercase tracking-widest text-white">Sharing</span>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* 🎛️ CONTROL BAR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#111827]/90 backdrop-blur-3xl px-10 py-6 rounded-[4rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
           <button onClick={() => {
             stream?.getAudioTracks().forEach(t => t.enabled = !isMicOn);
             setIsMicOn(!isMicOn);
           }} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isMicOn ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.4)]'}`}>
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
           </button>
           
           <button onClick={() => {
             stream?.getVideoTracks().forEach(t => t.enabled = !isCamOn);
             setIsCamOn(!isCamOn);
           }} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isCamOn ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.4)]'}`}>
              {isCamOn ? <VideoIcon size={22} /> : <VideoOff size={22} />}
           </button>

           <div className="w-px h-10 bg-white/10 mx-2" />

           <button onClick={toggleScreenShare} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isSharingScreen ? 'bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
              <Monitor size={22} />
           </button>

           <div className="relative group">
              <button className="w-14 h-14 rounded-full bg-white/5 text-slate-300 flex items-center justify-center hover:bg-white/10 transition-all duration-300">
                 <Smile size={22} />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 p-4 bg-[#1F2937] border border-white/10 rounded-[2rem] flex gap-4 shadow-[0_30px_60px_rgba(0,0,0,0.5)] opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                 {['👍','😂','👏','❤️','😮','🔥'].map(e => (
                   <button key={e} onClick={() => addReaction(e)} className="text-3xl hover:scale-125 active:scale-95 transition-transform">{e}</button>
                 ))}
              </div>
           </div>

           <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isRightPanelOpen ? 'bg-indigo-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.4)]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
              <Brain size={22} />
           </button>

           <div className="w-px h-10 bg-white/10 mx-2" />

           <button onClick={() => window.location.href = '/dashboard'} className="px-10 h-14 bg-rose-600 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-full hover:bg-rose-700 transition-all flex items-center gap-3 shadow-[0_15px_40px_rgba(225,29,72,0.4)] active:scale-95">
              <PhoneOff size={18} />
              Leave Session
           </button>
        </div>
      </div>

      {/* 🧩 COLLABORATION PANEL */}
      <AnimatePresence>
        {isRightPanelOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-[450px] bg-[#111827] border-l border-white/5 flex flex-col shadow-[-40px_0_100px_rgba(0,0,0,0.5)] relative z-40"
          >
             <div className="flex border-b border-white/5">
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'ai' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   AI Intelligence
                   {activeTab === 'ai' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500" />}
                </button>
                <button 
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === 'notes' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   Shared Notes
                   {activeTab === 'notes' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-indigo-500" />}
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                {activeTab === 'ai' ? (
                   <div className="space-y-10 h-full flex flex-col">
                      {!recap ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                           <div className="w-24 h-24 bg-indigo-500/5 rounded-[2.5rem] flex items-center justify-center mb-10 text-indigo-500/30 border border-indigo-500/10 shadow-inner">
                              <Brain size={48} />
                           </div>
                           <h3 className="text-2xl font-black text-white mb-4">Neural Session Analyzer</h3>
                           <p className="text-sm text-slate-500 font-medium leading-relaxed mb-12 px-6">
                              Confera is processing the live transmission. Generate a high-fidelity intelligence recap at any moment.
                           </p>
                           <button 
                             onClick={generateRecap}
                             disabled={isGenerating}
                             className="w-full py-5 bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(99,102,241,0.3)] disabled:opacity-50 active:scale-98"
                           >
                              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                              {isGenerating ? 'Synthesizing...' : 'Generate AI Recap'}
                           </button>
                        </div>
                      ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 space-y-12 pb-12">
                           <section>
                              <div className="flex items-center gap-4 mb-6">
                                 <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                                    <Sparkles size={20} />
                                 </div>
                                 <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Executive TL;DR</label>
                              </div>
                              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] leading-relaxed italic text-sm text-indigo-100 shadow-inner relative overflow-hidden group">
                                 <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/30" />
                                 "{recap.tldr}"
                              </div>
                           </section>
                           
                           <section>
                              <label className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] block mb-8">Strategic Key Points</label>
                              <div className="space-y-5">
                                 {recap.keyPoints?.map((p: string, i: number) => (
                                    <div key={i} className="flex gap-5 group">
                                       <div className="w-7 h-7 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-all shadow-sm">
                                          <Check size={14} className="text-emerald-500" />
                                       </div>
                                       <span className="text-sm font-medium text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">{p}</span>
                                    </div>
                                 ))}
                              </div>
                           </section>

                           <section>
                              <label className="text-[11px] font-black text-amber-500 uppercase tracking-[0.3em] block mb-8">Operational Actions</label>
                              <div className="space-y-5">
                                 {recap.actionItems?.map((item: any, i: number) => (
                                    <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] hover:border-indigo-500/20 transition-all group shadow-sm">
                                       <p className="text-sm font-black text-white mb-4 group-hover:text-indigo-400 transition-colors leading-tight">{item.task}</p>
                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                             <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">{item.owner?.charAt(0)}</div>
                                             <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{item.owner}</span>
                                          </div>
                                          <div className="px-2 py-0.5 bg-amber-500/5 rounded text-[8px] font-black text-amber-500/50 uppercase tracking-widest border border-amber-500/10">Priority</div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </section>

                           <button onClick={() => setRecap(null)} className="w-full py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 hover:text-slate-400 transition-all flex items-center justify-center gap-3">
                              <Trash2 size={14} /> Reset Intelligence View
                           </button>
                        </div>
                      )}
                   </div>
                ) : (
                   <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                               <FileText size={20} />
                            </div>
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Shared Knowledge Base</label>
                         </div>
                         {isSavingNotes && <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Syncing</div>}
                      </div>
                      <textarea 
                        value={notes}
                        onChange={(e) => saveNotes(e.target.value)}
                        placeholder="Synthesize collective thoughts here..."
                        className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 text-sm text-slate-300 leading-relaxed placeholder:text-slate-800 focus:outline-none focus:border-indigo-500/30 transition-all resize-none shadow-inner custom-scrollbar font-medium"
                      />
                   </div>
                )}
             </div>

             <div className="p-10 border-t border-white/5">
                <button onClick={() => setIsRightPanelOpen(false)} className="w-full py-5 bg-white/5 hover:bg-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all border border-white/5">
                   Collapse Intel Panel
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

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



