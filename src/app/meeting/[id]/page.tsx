'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  PhoneOff, Brain, Sparkles, CheckCircle2,
  Settings, Maximize2, Activity, ShieldAlert,
  Copy, Check, UserPlus, X, UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      // Filter pending requests for host
      if (data.hostId === currentUser?.id) {
        setRequests(data.joinRequests.filter((r: any) => r.status === 'pending'));
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

  const copyLink = () => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const endCall = async () => {
    try {
      const res = await fetch(`/api/meeting/${meetingId}/end`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        saveRecording(meetingId, data.recap);
        setRecap(data.recap);
        setIsAiOpen(true);
      }
    } catch (e) {
      console.error(e);
    }
    // Don't redirect yet if we want to show recap
    if (!recap) router.push('/dashboard');
  };

  if (!currentUser) return null;

  return (
    <div className="h-screen bg-[#050507] flex overflow-hidden font-sans selection:bg-indigo-500/30">
      <div className="flex-1 flex flex-col p-6 lg:p-10">
        {/* Meeting Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/30">
                <VideoIcon size={24} />
             </div>
             <div>
                <h2 className="text-xl font-black text-white tracking-tight">{meetingData?.name || 'Active Session'}</h2>
                <div className="flex items-center gap-3 mt-1">
                   <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">E2EE Secured</span>
                   </div>
                   <div className="h-3 w-px bg-white/10" />
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{meetingId}</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
              onClick={copyLink}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-3 group"
             >
                {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} className="group-hover:scale-110 transition-transform" />}
                {copied ? 'Link Copied' : 'Invite Node'}
             </button>
             <div className="px-5 py-3 bg-[#0a0a0c] border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <Activity size={16} className="text-indigo-500" /> 
                <span className="text-white">12MS</span> LATENCY
             </div>
          </div>
        </div>

        {/* Video Stage */}
        <div className="flex-1 grid grid-cols-1 gap-6 relative">
          <div className="bg-[#0a0a0c] rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl relative group">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-all duration-1000 ${isCamOn ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            />
            
            <AnimatePresence>
              {!isCamOn && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-[#050507]/80 backdrop-blur-xl"
                >
                  <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl relative">
                    {currentUser.name.charAt(0)}
                    <div className="absolute -inset-4 bg-indigo-600/20 blur-2xl rounded-full -z-10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* User Label Overlay */}
            <div className="absolute bottom-10 left-10 flex items-center gap-4 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
              <span className="text-xs font-black text-white uppercase tracking-widest">{currentUser.name} (Host)</span>
            </div>
            
            {/* Host Approval Notification */}
            <AnimatePresence>
              {isHost && requests.length > 0 && (
                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  className="absolute bottom-10 right-10 z-40"
                >
                  <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-6 border border-indigo-100">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                       <UserPlus size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-1">Join Request</p>
                      <h4 className="text-sm font-bold text-slate-900">{requests[0].name} wants to enter</h4>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => approveUser(requests[0].userId, true)}
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                       >
                         <UserCheck size={20} />
                       </button>
                       <button 
                        onClick={() => approveUser(requests[0].userId, false)}
                        className="p-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                       >
                         <X size={20} />
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Tactical Control Bar */}
        <div className="flex justify-center items-center py-10">
           <div className="bg-[#0a0a0c] px-10 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center gap-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-4 pr-8 border-r border-white/5">
                <button 
                  onClick={() => { stream?.getAudioTracks().forEach(t => t.enabled = !isMicOn); setIsMicOn(!isMicOn); }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]'}`}
                >
                  {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                <button 
                  onClick={() => { stream?.getVideoTracks().forEach(t => t.enabled = !isCamOn); setIsCamOn(!isCamOn); }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isCamOn ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]'}`}
                >
                  {isCamOn ? <VideoIcon size={24} /> : <VideoOff size={24} />}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsAiOpen(true)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isAiOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                >
                  <Brain size={24} />
                </button>
                <button 
                  onClick={() => {}} // Screen share placeholder
                  className="w-14 h-14 rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  <Maximize2 size={24} />
                </button>
              </div>

              <div className="w-px h-10 bg-white/5 mx-2" />

              <button 
                onClick={endCall}
                className="px-10 h-14 bg-rose-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center gap-4 shadow-2xl shadow-rose-600/20 hover:bg-rose-500 active:scale-95 transition-all"
              >
                <PhoneOff size={20} />
                Terminate
              </button>
           </div>
        </div>
      </div>

      {/* Intelligence Side Drawer */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-[480px] bg-[#0a0a0c] border-l border-white/5 p-12 flex flex-col shadow-2xl z-[60] relative"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent" />
            
            <div className="flex justify-between items-center mb-16">
              <div className="flex items-center gap-4 text-indigo-500">
                 <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <Sparkles size={20} />
                 </div>
                 <h3 className="text-2xl font-black text-white tracking-tight uppercase">Neural Intel</h3>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center text-slate-500 transition-colors"><X size={24} /></button>
            </div>

            {!recap ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                   <div className="w-20 h-20 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="text-indigo-400" size={24} />
                   </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Analyzing Session Data</h4>
                <p className="text-slate-500 text-sm font-medium">Synthesizing audio vectors and semantic context...</p>
              </div>
            ) : (
              <div className="space-y-12 overflow-y-auto custom-scrollbar pr-4">
                 <section className="animate-in fade-in slide-in-from-right-4 duration-500">
                    <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                       Strategic Summary
                    </h4>
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] relative group">
                       <div className="absolute -top-4 -left-4 text-indigo-500/10 group-hover:scale-110 transition-transform">"</div>
                       <p className="text-sm text-slate-300 leading-relaxed font-medium">
                         {recap.tldr}
                       </p>
                    </div>
                 </section>

                 <section className="animate-in fade-in slide-in-from-right-4 duration-700">
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                       Key Intelligence
                    </h4>
                    <div className="space-y-4">
                       {recap.keyPoints.map((p: string, i: number) => (
                         <div key={i} className="flex gap-5 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all group">
                            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                               <CheckCircle2 size={14} />
                            </div>
                            <p className="text-sm font-bold text-slate-200">{p}</p>
                         </div>
                       ))}
                    </div>
                 </section>

                 <section className="animate-in fade-in slide-in-from-right-4 duration-1000">
                    <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                       Action Protocols
                    </h4>
                    <div className="space-y-3">
                       {recap.actionItems.map((item: any, i: number) => (
                         <div key={i} className="p-5 rounded-3xl border border-dashed border-white/10 flex items-center justify-between group hover:border-amber-500/30 transition-all">
                            <div>
                               <p className="text-sm font-bold text-slate-200 mb-1">{item.task}</p>
                               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.owner}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity">
                               <ArrowRight size={14} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
              </div>
            )}
            
            <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <ShieldAlert size={18} className="text-indigo-500/40" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Neural Node Secured</p>
               </div>
               <button 
                onClick={() => router.push('/dashboard')}
                className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-white transition-colors"
               >
                 Close & Exit
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

