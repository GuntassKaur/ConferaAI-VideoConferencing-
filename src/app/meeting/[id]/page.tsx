'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { 
  Mic, MicOff, Video as VideoIcon, VideoOff, 
  PhoneOff, Brain, Sparkles, CheckCircle2,
  Settings, Maximize2, Activity, ShieldAlert,
  Copy, Check, UserPlus, X, UserCheck, 
  MessageSquare, Users, Layout, ChevronRight
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
      } else {
        router.push('/dashboard');
      }
    } catch (e) {
      console.error(e);
      router.push('/dashboard');
    }
  };

  if (!currentUser) return null;

  return (
    <div className="h-screen bg-slate-950 flex overflow-hidden font-sans selection:bg-indigo-500/30 text-white">
      <div className="flex-1 flex flex-col relative">
        {/* Top Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
          <div className="flex items-center gap-4 pointer-events-auto">
             <div className="bg-indigo-600 p-2 rounded-xl shadow-lg">
                <VideoIcon size={20} className="text-white" />
             </div>
             <div>
                <h2 className="text-sm font-bold tracking-tight">{meetingData?.name || 'Active Session'}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider">Secure Connection</span>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3 pointer-events-auto">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-wider">
                <Users size={14} className="text-indigo-400" />
                <span>1 Participant</span>
             </div>
             <button 
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-1.5 bg-white text-slate-900 rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-slate-100 transition-all"
             >
                {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Invite'}
             </button>
          </div>
        </div>

        {/* Video Stage - Fullscreen */}
        <div className="flex-1 relative bg-slate-900">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover transition-all duration-1000 ${isCamOn ? 'opacity-100' : 'opacity-0'}`}
            />
            
            <AnimatePresence>
              {!isCamOn && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-900"
                >
                  <div className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-5xl font-bold shadow-2xl relative">
                    {currentUser.name.charAt(0)}
                    <div className="absolute -inset-8 bg-indigo-600/20 blur-3xl rounded-full -z-10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Local User Tag */}
            <div className="absolute bottom-24 left-8 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider">{currentUser.name} (You)</span>
            </div>

            {/* Host Approval Notifications */}
            <div className="absolute top-24 right-8 z-30 space-y-3 pointer-events-none">
              <AnimatePresence>
                {isHost && requests.map((req: any) => (
                  <motion.div 
                    key={req.userId}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    className="pointer-events-auto bg-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-100 min-w-[300px]"
                  >
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                       <UserPlus size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Wants to join</p>
                      <h4 className="text-sm font-bold text-slate-900">{req.name}</h4>
                    </div>
                    <div className="flex gap-1.5">
                       <button 
                        onClick={() => approveUser(req.userId, true)}
                        className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                       >
                          <UserCheck size={18} />
                       </button>
                       <button 
                        onClick={() => approveUser(req.userId, false)}
                        className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                       >
                          <X size={18} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
        </div>

        {/* Floating Control Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
           <div className="bg-slate-900/80 backdrop-blur-2xl px-6 py-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4">
              <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                <button 
                  onClick={() => { stream?.getAudioTracks().forEach(t => t.enabled = !isMicOn); setIsMicOn(!isMicOn); }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 hover:bg-white/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
                >
                  {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
                </button>
                <button 
                  onClick={() => { stream?.getVideoTracks().forEach(t => t.enabled = !isCamOn); setIsCamOn(!isCamOn); }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCamOn ? 'bg-white/10 hover:bg-white/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}
                >
                  {isCamOn ? <VideoIcon size={20} /> : <VideoOff size={20} />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAiOpen(!isAiOpen)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isAiOpen ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  <Brain size={20} />
                </button>
                <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <MessageSquare size={20} />
                </button>
                <button className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
                  <Layout size={20} />
                </button>
              </div>

              <div className="w-px h-8 bg-white/10 mx-2" />

              <button 
                onClick={endCall}
                className="px-6 h-12 bg-rose-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-lg shadow-rose-600/20 hover:bg-rose-500 transition-all"
              >
                <PhoneOff size={16} />
                End Call
              </button>
           </div>
        </div>
      </div>

      {/* AI Intelligence Drawer */}
      <AnimatePresence>
        {isAiOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-40 relative text-slate-900"
          >
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Sparkles size={18} />
                 </div>
                 <h3 className="font-bold tracking-tight">AI Insights</h3>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {!recap ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6" />
                  <h4 className="font-bold mb-1">Analyzing meeting...</h4>
                  <p className="text-xs text-slate-500 max-w-[200px]">Generating real-time summary and key takeaways.</p>
                </div>
              ) : (
                <div className="space-y-10">
                   <section>
                      <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-4">Summary</h4>
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                         <p className="text-sm text-slate-600 leading-relaxed italic">
                           "{recap.tldr}"
                         </p>
                      </div>
                   </section>

                   <section>
                      <h4 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-4">Key Points</h4>
                      <ul className="space-y-3">
                         {recap.keyPoints?.map((p: string, i: number) => (
                           <li key={i} className="flex gap-3 text-sm text-slate-700">
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="font-medium">{p}</span>
                           </li>
                         ))}
                      </ul>
                   </section>

                   <section>
                      <h4 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-4">Action Items</h4>
                      <div className="space-y-3">
                         {recap.actionItems?.map((item: any, i: number) => (
                           <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-all group">
                              <p className="text-sm font-bold text-slate-800 mb-1">{item.task}</p>
                              <div className="flex items-center justify-between">
                                 <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{item.owner}</span>
                                 <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-all" />
                              </div>
                           </div>
                         ))}
                      </div>
                   </section>
                </div>
              )}
            </div>
            
            <div className="p-8 border-t border-slate-100 bg-slate-50/50">
               <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert size={16} className="text-slate-400" />
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Enterprise Security Enabled</p>
               </div>
               <button 
                onClick={() => router.push('/dashboard')}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
               >
                 Close Meeting
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

