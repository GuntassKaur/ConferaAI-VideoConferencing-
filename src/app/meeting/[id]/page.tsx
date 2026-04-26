'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  Brain, Sparkles, Check,
  Copy, UserPlus, X, User,
  MessageSquare, Users, Layout, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import ControlBar from '@/components/ControlBar';

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser, saveRecording } = useProductStore();
  const meetingId = params.id as string;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recap, setRecap] = useState<any>(null);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);

  const fetchMeetingData = useCallback(async () => {
    try {
      const res = await fetch(`/api/meeting/${meetingId}`);
      if (!res.ok) return;
      const data = await res.json();
      setMeetingData(data);
      setIsHost(data.hostId === currentUser?.id);
      
      if (data.hostId === currentUser?.id) {
        setRequests(data.joinRequests?.filter((r: any) => r.status === 'pending') || []);
      }
    } catch (e) {
      console.error(e);
    }
  }, [meetingId, currentUser]);

  useEffect(() => {
    fetchMeetingData();
    const interval = setInterval(fetchMeetingData, 5000);
    return () => clearInterval(interval);
  }, [fetchMeetingData]);

  const initMedia = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      console.error("Hardware denied", e);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) router.push('/login');
    initMedia();
    return () => stream?.getTracks().forEach(t => t.stop());
  }, [currentUser, initMedia]);

  const toggleMic = () => {
    stream?.getAudioTracks().forEach(t => t.enabled = !isMicOn);
    setIsMicOn(!isMicOn);
  };

  const toggleCam = () => {
    stream?.getVideoTracks().forEach(t => t.enabled = !isCamOn);
    setIsCamOn(!isCamOn);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const approveUser = async (userId: string, approve: boolean) => {
    try {
      await fetch(`/api/meeting/${meetingId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, approve })
      });
      fetchMeetingData();
    } catch (e) {
      console.error(e);
    }
  };

  const generateRecap = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch(`/api/meeting/${meetingId}/end`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setRecap(data.recap);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const endCall = async () => {
    if (recap) saveRecording(meetingId, recap);
    router.push('/dashboard');
  };

  if (!currentUser) return null;

  return (
    <div className="h-screen bg-[#020617] flex overflow-hidden font-sans selection:bg-indigo-500/30 text-white">
      {/* 🧩 PREMIUM TOAST NOTIFICATION */}
      <AnimatePresence>
        {copied && (
          <motion.div 
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 20, x: '-50%', opacity: 1 }}
            exit={{ y: -100, x: '-50%', opacity: 0 }}
            className="fixed top-4 left-1/2 z-[100] px-6 py-3 bg-white text-slate-900 rounded-full shadow-2xl flex items-center gap-3 border border-slate-100"
          >
            <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
               <Check size={14} />
            </div>
            <span className="text-sm font-bold tracking-tight">Meeting link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 p-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
          <div className="flex items-center gap-5 pointer-events-auto">
             <div className="bg-indigo-600 p-2.5 rounded-[14px] shadow-2xl shadow-indigo-500/20">
                <VideoIcon size={22} className="text-white" />
             </div>
             <div>
                <h2 className="text-lg font-bold tracking-tight">{meetingData?.name || 'Session in Progress'}</h2>
                <div className="flex items-center gap-2.5 mt-1">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4 pointer-events-auto">
             <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 text-[11px] font-bold uppercase tracking-widest text-slate-300">
                <Users size={16} className="text-indigo-400" />
                <span>{meetingData?.joinRequests?.length || 1} Active Participants</span>
             </div>
             <button 
              onClick={copyLink}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-white text-slate-900 rounded-full font-bold text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20"
             >
                <Copy size={16} />
                Share Link
             </button>
          </div>
        </div>

        {/* Video Stage */}
        <div className="flex-1 p-6 lg:p-10 flex items-center justify-center bg-[#020617]">
          <div className="w-full h-full max-w-6xl relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
             <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-cover transition-all duration-1000 ${isCamOn ? 'opacity-100' : 'opacity-0 scale-105 blur-lg'}`}
              />
              
              <AnimatePresence>
                {!isCamOn && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-[#0F172A]"
                  >
                    <div className="w-40 h-40 rounded-full bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center text-6xl font-bold relative group">
                      <span className="text-indigo-100 group-hover:scale-110 transition-transform duration-500">{currentUser.name.charAt(0)}</span>
                      <div className="absolute -inset-10 bg-indigo-600/10 blur-[80px] rounded-full -z-10 animate-pulse" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Local Tag */}
              <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/90">{currentUser.name} (You)</span>
              </div>
          </div>
        </div>

        {/* 🧩 NEW PREMIUM CONTROL BAR */}
        <ControlBar 
           isMicOn={isMicOn}
           onToggleMic={toggleMic}
           isCamOn={isCamOn}
           onToggleCam={toggleCam}
           isAiOpen={isAiOpen}
           onToggleAi={() => setIsAiOpen(!isAiOpen)}
           onEndCall={endCall}
        />

        {/* 👥 HOST APPROVAL POPUP (MODERN) */}
        <div className="absolute top-32 right-10 z-[60] space-y-4 pointer-events-none w-80">
          <AnimatePresence>
            {isHost && requests.map((req: any) => (
              <motion.div 
                key={req.userId}
                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 100, opacity: 0, scale: 0.9 }}
                className="pointer-events-auto bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col gap-6 border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                     <User size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1">Waiting in Lobby</p>
                    <h4 className="text-base font-bold text-slate-900 truncate">{req.name}</h4>
                  </div>
                </div>
                
                <div className="flex gap-3">
                   <button 
                    onClick={() => approveUser(req.userId, true)}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                   >
                      Accept
                   </button>
                   <button 
                    onClick={() => approveUser(req.userId, false)}
                    className="flex-1 py-3 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95 border border-slate-100"
                   >
                      Reject
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 🤖 PREMIUM AI PANEL (CHATGPT STYLE) */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-[440px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-40 relative text-slate-900"
          >
            {/* Panel Header */}
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-600 rounded-[14px] flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Sparkles size={20} />
                 </div>
                 <div>
                    <h3 className="font-bold text-lg tracking-tight">AI Workspace</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Neural Intelligence</p>
                 </div>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors">
                <X size={22} />
              </button>
            </div>

            {/* Panel Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-white">
              {!recap && !isGenerating && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-indigo-400 shadow-inner">
                     <Brain size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Ready to Recap?</h4>
                  <p className="text-sm text-slate-500 max-w-[280px] leading-relaxed mb-10">
                    Let Confera AI analyze the current session and generate a comprehensive summary.
                  </p>
                  <button 
                    onClick={generateRecap}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 group"
                  >
                    Generate AI Recap
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}

              {isGenerating && (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
                    <h4 className="text-lg font-bold text-slate-900 mb-2">Analyzing Session...</h4>
                    <p className="text-xs text-slate-500 tracking-wider font-bold uppercase">Processing neural nodes</p>
                 </div>
              )}

              {recap && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-12"
                >
                   {/* TLDR Card */}
                   <section>
                      <label className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4 block">Neural Summary</label>
                      <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
                         <p className="text-base text-slate-700 leading-relaxed font-medium italic">
                           "{recap.tldr}"
                         </p>
                      </div>
                   </section>

                   {/* Key Points */}
                   <section>
                      <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.2em] mb-5 block">Strategic Takeaways</label>
                      <div className="space-y-4">
                         {recap.keyPoints?.map((p: string, i: number) => (
                           <motion.div 
                             key={i}
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             className="flex gap-4 items-start"
                           >
                              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                 <Check size={14} className="text-emerald-600" />
                              </div>
                              <span className="text-sm font-semibold text-slate-700 leading-snug">{p}</span>
                           </motion.div>
                         ))}
                      </div>
                   </section>

                   {/* Action Items */}
                   <section>
                      <label className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-5 block">Assigned Tasks</label>
                      <div className="grid grid-cols-1 gap-3">
                         {recap.actionItems?.map((item: any, i: number) => (
                           <motion.div 
                             key={i}
                             initial={{ opacity: 0, scale: 0.95 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: i * 0.15 }}
                             className="p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-lg transition-all group cursor-pointer"
                           >
                              <p className="text-[13px] font-bold text-slate-800 mb-2 leading-tight">{item.task}</p>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase">
                                       {item.owner.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.owner}</span>
                                 </div>
                                 <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                              </div>
                           </motion.div>
                         ))}
                      </div>
                   </section>
                </motion.div>
              )}
            </div>
            
            {/* Panel Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
               <button 
                onClick={endCall}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
               >
                 Close & Save Session
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

