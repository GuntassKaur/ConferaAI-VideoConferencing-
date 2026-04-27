'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  Brain, Sparkles, Check, X, User,
  MessageSquare, Users, PhoneOff,
  Monitor, Smile, Copy, FileText, Send,
  Loader2, Trash2
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
  const [copied, setCopied] = useState(false);

  // --- 🎥 VIDEO LOGIC ---
  const initMedia = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) { console.error("Camera access denied:", e); }
  }, []);

  useEffect(() => {
    initMedia();
    fetchMeetingData();
    fetchNotes();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
      screenStream?.getTracks().forEach(t => t.stop());
    };
  }, [initMedia]);

  const fetchMeetingData = async () => {
    try {
      const res = await fetch(`/api/meeting/${meetingId}`);
      if (res.ok) {
        const data = await res.json();
        setMeetingData(data);
        if (data.recap) setRecap(data.recap);
      }
    } catch (e) { console.error(e); }
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
        
        // Handle stop sharing from browser UI
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
    const x = Math.random() * 60 + 20; // Random horizontal position
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
        setNotes(data.notes);
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
        body: JSON.stringify({ notes: val, userId: currentUser?.id })
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
      }
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  return (
    <div className="h-screen bg-[#020617] flex overflow-hidden font-inter text-white">
      
      {/* 📹 MAIN STAGE (70% - 80%) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Top Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
                <VideoIcon size={20} className="text-white" />
             </div>
             <div>
                <h2 className="text-sm font-bold tracking-tight">{meetingData?.name || 'Secure Enterprise Session'}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live • 128-bit Encryption</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
             }} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Invite'}
             </button>
             <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-slate-400">
                <Settings size={18} />
             </button>
          </div>
        </div>

        {/* Video Canvas */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
           <div className="w-full h-full max-w-6xl aspect-video bg-[#0F172A] rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/5 group">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-all duration-1000 ${isCamOn || isSharingScreen ? 'opacity-100' : 'opacity-0 scale-105 blur-3xl'}`}
              />
              
              {!isCamOn && !isSharingScreen && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]">
                   <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#6366F1]/20 to-indigo-500/5 border-2 border-[#6366F1]/20 flex items-center justify-center text-5xl font-black text-white shadow-2xl animate-pulse">
                      {currentUser?.name?.charAt(0) || 'G'}
                   </div>
                </div>
              )}

              {/* Floatings Reactions Overlay */}
              <div className="absolute inset-0 pointer-events-none z-30">
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

              {/* Status Tags */}
              <div className="absolute bottom-8 left-8 flex items-center gap-3">
                <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-3 shadow-2xl">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                   <span className="text-[11px] font-bold uppercase tracking-widest">{currentUser?.name || 'Guest User'}</span>
                </div>
                {isSharingScreen && (
                  <div className="px-4 py-2 bg-[#6366F1] text-white rounded-2xl flex items-center gap-2 shadow-lg shadow-[#6366F1]/40">
                     <Monitor size={14} />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Sharing Screen</span>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* 🎛️ ENTERPRISE CONTROL BAR */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#111827]/80 backdrop-blur-3xl px-8 py-5 rounded-[3rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
           <button onClick={() => {
             stream?.getAudioTracks().forEach(t => t.enabled = !isMicOn);
             setIsMicOn(!isMicOn);
           }} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
              {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
           </button>
           
           <button onClick={() => {
             stream?.getVideoTracks().forEach(t => t.enabled = !isCamOn);
             setIsCamOn(!isCamOn);
           }} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCamOn ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
              {isCamOn ? <VideoIcon size={22} /> : <VideoOff size={22} />}
           </button>

           <div className="w-px h-8 bg-white/10 mx-2" />

           <button onClick={toggleScreenShare} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isSharingScreen ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
              <Monitor size={22} />
           </button>

           <div className="relative group">
              <button className="w-14 h-14 rounded-full bg-white/5 text-slate-300 flex items-center justify-center hover:bg-white/10 transition-all">
                 <Smile size={22} />
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-[#1F2937] border border-white/10 rounded-2xl flex gap-3 shadow-2xl opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                 {['👍','😂','👏','❤️','😮','🔥'].map(e => (
                   <button key={e} onClick={() => addReaction(e)} className="text-2xl hover:scale-125 transition-transform">{e}</button>
                 ))}
              </div>
           </div>

           <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isRightPanelOpen ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>
              <Brain size={22} />
           </button>

           <div className="w-px h-8 bg-white/10 mx-2" />

           <button onClick={() => router.push('/dashboard')} className="px-8 h-14 bg-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-rose-700 transition-all flex items-center gap-3 shadow-xl shadow-rose-600/30">
              <PhoneOff size={18} />
              End Call
           </button>
        </div>
      </div>

      {/* 🧩 COLLABORATION PANEL (AI + NOTES) */}
      <AnimatePresence>
        {isRightPanelOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[400px] bg-[#111827] border-l border-white/5 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)] relative z-40"
          >
             {/* Tab Navigation */}
             <div className="flex border-b border-white/5">
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'ai' ? 'text-[#6366F1]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   AI Intelligence
                   {activeTab === 'ai' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6366F1]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('notes')}
                  className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'notes' ? 'text-[#6366F1]' : 'text-slate-500 hover:text-slate-300'}`}
                >
                   Shared Notes
                   {activeTab === 'notes' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6366F1]" />}
                </button>
             </div>

             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'ai' ? (
                   <div className="space-y-8 h-full flex flex-col">
                      {!recap ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                           <div className="w-20 h-20 bg-[#6366F1]/5 rounded-3xl flex items-center justify-center mb-8 text-[#6366F1]/50 border border-[#6366F1]/10">
                              <Brain size={40} />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-3">AI Session Analyzer</h3>
                           <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 px-4">
                              Confera is analyzing the audio transmission. Generate a professional recap with a single click.
                           </p>
                           <button 
                             onClick={generateRecap}
                             disabled={isGenerating}
                             className="w-full py-5 bg-[#6366F1] text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-3 shadow-2xl shadow-[#6366F1]/20 disabled:opacity-50"
                           >
                              {isGenerating ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                              {isGenerating ? 'Synthesizing...' : 'Generate AI Recap'}
                           </button>
                        </div>
                      ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-10 pb-12">
                           <section>
                              <div className="flex items-center gap-3 mb-5">
                                 <div className="w-8 h-8 bg-[#6366F1]/10 rounded-lg flex items-center justify-center text-[#6366F1]">
                                    <Sparkles size={16} />
                                 </div>
                                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Executive Summary</label>
                              </div>
                              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] leading-relaxed italic text-[13px] text-indigo-100 shadow-inner">
                                 "{recap.tldr}"
                              </div>
                           </section>
                           
                           <section>
                              <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] block mb-6">Strategic Key Points</label>
                              <div className="space-y-4">
                                 {recap.keyPoints?.map((p: string, i: number) => (
                                   <div key={i} className="flex gap-4 group">
                                      <div className="w-6 h-6 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-all">
                                         <Check size={12} className="text-emerald-500" />
                                      </div>
                                      <span className="text-[13px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed">{p}</span>
                                   </div>
                                 ))}
                              </div>
                           </section>

                           <section>
                              <label className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-6">Operational Action Items</label>
                              <div className="space-y-4">
                                 {recap.actionItems?.map((item: any, i: number) => (
                                   <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#6366F1]/20 transition-all group">
                                      <p className="text-[13px] font-bold text-white mb-3 group-hover:text-[#6366F1] transition-colors">{item.task}</p>
                                      <div className="flex items-center gap-2">
                                         <div className="w-5 h-5 bg-slate-800 rounded-full flex items-center justify-center text-[9px] font-black text-slate-400 uppercase">{item.owner?.charAt(0)}</div>
                                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.owner}</span>
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </section>

                           <button onClick={() => setRecap(null)} className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-all flex items-center justify-center gap-2">
                              <Trash2 size={12} /> Clear Analysis
                           </button>
                        </div>
                      )}
                   </div>
                ) : (
                   <div className="h-full flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                               <FileText size={16} />
                            </div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shared Canvas</label>
                         </div>
                         {isSavingNotes && <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">Syncing...</div>}
                      </div>
                      <textarea 
                        value={notes}
                        onChange={(e) => saveNotes(e.target.value)}
                        placeholder="Start typing collective session notes..."
                        className="flex-1 w-full bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 text-[13px] text-slate-300 leading-relaxed placeholder:text-slate-700 focus:outline-none focus:border-[#6366F1]/30 transition-all resize-none shadow-inner custom-scrollbar"
                      />
                   </div>
                )}
             </div>

             {/* Footer Button - Switch View */}
             <div className="p-8 border-t border-white/5">
                <button onClick={() => setIsRightPanelOpen(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border border-white/5">
                   Collapse Panel
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

function Settings({ size }: { size?: number }) {
  return <Loader2 size={size} />;
}
