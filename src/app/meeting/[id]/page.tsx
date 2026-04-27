'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  Brain, Sparkles, Check, X, User,
  MessageSquare, Users, Layout, PhoneOff,
  Maximize2, Settings, Shield, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const meetingId = params.id as string;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recap, setRecap] = useState<any>(null);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const fetchMeetingData = useCallback(async () => {
    try {
      const res = await fetch(`/api/meeting/${meetingId}`);
      if (res.ok) setMeetingData(await res.json());
    } catch (e) { console.error(e); }
  }, [meetingId]);

  useEffect(() => {
    fetchMeetingData();
    const initMedia = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (e) { console.error(e); }
    };
    initMedia();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [fetchMeetingData]);

  const toggleMic = () => {
    stream?.getAudioTracks().forEach(t => t.enabled = !isMicOn);
    setIsMicOn(!isMicOn);
  };

  const toggleCam = () => {
    stream?.getVideoTracks().forEach(t => t.enabled = !isCamOn);
    setIsCamOn(!isCamOn);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRecap = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/meeting/${meetingId}/end`, { method: 'POST' });
      if (res.ok) setRecap((await res.json()).recap);
    } catch (e) { console.error(e); } finally { setIsGenerating(false); }
  };

  return (
    <div className="h-screen bg-[#020617] flex overflow-hidden font-sans text-white">
      {/* 📹 VIDEO AREA */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
                <VideoIcon size={20} className="text-white" />
             </div>
             <div>
                <h2 className="text-sm font-bold tracking-tight">{meetingData?.name || 'Secure Session'}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E2E Encrypted</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy ID'}
             </button>
             <button className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <Users size={16} />
             </button>
          </div>
        </div>

        {/* Main Stage */}
        <div className="flex-1 flex items-center justify-center p-8">
           <div className="w-full h-full max-w-5xl aspect-video bg-[#0F172A] rounded-[2rem] overflow-hidden shadow-2xl relative border border-white/5">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-all duration-700 ${isCamOn ? 'opacity-100' : 'opacity-0 scale-105 blur-2xl'}`}
              />
              {!isCamOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-32 h-32 rounded-full bg-[#6366F1]/10 border-2 border-[#6366F1]/20 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                      {currentUser?.name?.charAt(0) || 'G'}
                   </div>
                </div>
              )}
              {/* Overlay Name */}
              <div className="absolute bottom-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                 <span className="text-[10px] font-bold uppercase tracking-widest">{currentUser?.name || 'Guest User'} (You)</span>
              </div>
           </div>
        </div>

        {/* 🎛️ CONTROL BAR (Floating) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-[#111827]/90 backdrop-blur-2xl px-8 py-4 rounded-[2.5rem] border border-white/10 shadow-2xl">
           <button onClick={toggleMic} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
           </button>
           <button onClick={toggleCam} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCamOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
              {isCamOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
           </button>
           
           <div className="w-px h-6 bg-white/10 mx-2" />
           
           <button onClick={() => setIsRightPanelOpen(!isRightPanelOpen)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isRightPanelOpen ? 'bg-[#6366F1] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              <Brain size={20} />
           </button>
           
           <button onClick={() => router.push('/dashboard')} className="px-8 h-12 bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-rose-700 transition-all flex items-center gap-3 shadow-lg shadow-rose-600/20">
              <PhoneOff size={18} />
              End Session
           </button>
        </div>
      </div>

      {/* 🧩 RIGHT PANEL (AI & Chat) */}
      <AnimatePresence>
        {isRightPanelOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="w-[380px] bg-[#111827] border-l border-[#1F2937] flex flex-col shadow-2xl relative z-40"
          >
             {/* Header */}
             <div className="p-6 border-b border-[#1F2937] flex justify-between items-center">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-[#6366F1]/10 rounded-lg flex items-center justify-center text-[#6366F1]">
                      <Sparkles size={16} />
                   </div>
                   <h3 className="font-bold text-sm tracking-tight">Intelligence Panel</h3>
                </div>
                <button onClick={() => setIsRightPanelOpen(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                   <X size={20} />
                </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {!recap ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                     <div className="w-16 h-16 bg-[#0F172A] rounded-2xl flex items-center justify-center mb-6 text-slate-700 border border-[#1F2937]">
                        <Brain size={32} />
                     </div>
                     <h4 className="text-lg font-bold text-white mb-2">AI Summary</h4>
                     <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 max-w-[240px]">
                        Confera is monitoring the transmission. Generate a recap when ready.
                     </p>
                     <button 
                       onClick={generateRecap}
                       disabled={isGenerating}
                       className="w-full py-4 bg-[#6366F1] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#6366F1]/10 active:scale-95"
                     >
                        {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                        {isGenerating ? 'Processing...' : 'Generate Insights'}
                     </button>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                     <section>
                        <label className="text-[10px] font-bold text-[#6366F1] uppercase tracking-[0.2em] block mb-4">Strategic Summary</label>
                        <div className="p-5 bg-[#0F172A] rounded-2xl border border-[#1F2937] leading-relaxed italic text-sm text-slate-300">
                           "{recap.tldr}"
                        </div>
                     </section>
                     
                     <section>
                        <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] block mb-4">Key Takeaways</label>
                        <div className="space-y-3">
                           {recap.keyPoints?.map((p: string, i: number) => (
                             <div key={i} className="flex gap-3 text-sm text-slate-400 group">
                                <div className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                                   <Check size={12} className="text-emerald-500" />
                                </div>
                                <span className="font-medium">{p}</span>
                             </div>
                           ))}
                        </div>
                     </section>

                     <section>
                        <label className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] block mb-4">Action Pipeline</label>
                        <div className="space-y-3">
                           {recap.actionItems?.map((item: any, i: number) => (
                             <div key={i} className="p-4 bg-[#0F172A] border border-[#1F2937] rounded-xl hover:border-[#6366F1]/30 transition-all group">
                                <p className="text-[13px] font-bold text-white mb-2">{item.task}</p>
                                <div className="flex items-center gap-2">
                                   <div className="w-4 h-4 bg-slate-800 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400 uppercase">{item.owner.charAt(0)}</div>
                                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.owner}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                     </section>
                  </div>
                )}
             </div>

             {/* Footer */}
             <div className="p-6 border-t border-[#1F2937] bg-[#111827]">
                <div className="relative group">
                   <input 
                     type="text" 
                     placeholder="Message transmission..."
                     className="w-full bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#6366F1] transition-all"
                   />
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Loader2({ className, size }: { className?: string, size?: number }) {
  return <Sparkles className={`${className} animate-pulse`} size={size} />;
}
