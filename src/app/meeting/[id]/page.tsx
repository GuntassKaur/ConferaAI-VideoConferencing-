'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, LogOut, MessageSquare, Users, Video, VideoOff, 
  Mic, MicOff, Camera, Shield, Settings2, MoreHorizontal, 
  Monitor, Layout, PhoneOff, User as UserIcon, Brain 
} from 'lucide-react';
import AIPanel from '@/components/AIPanel';

export default function MeetingPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // States
  const [user, setUser] = useState<{name: string, id: string} | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);
  const [messages, setMessages] = useState<{user: string, text: string, time: string}[]>([]);
  const [inputText, setInputText] = useState('');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);

  // Authenticate and Initialize Media
  useEffect(() => {
    const savedUser = localStorage.getItem('confera-auth');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    // zustand persist might store it differently, let's extract the user object correctly
    const realUser = parsedUser.state?.user || parsedUser;
    setUser(realUser);

    let currentStream: MediaStream | null = null;

    const initMedia = async () => {
      try {
        console.log("Requesting neural optics...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error("Neural optics failed:", err);
        // Fallback or error message could go here
        alert(`Media Error: ${err.message}. Please ensure camera/mic permissions are granted.`);
      }
    };

    initMedia();

    return () => {
      // Clean up on disconnect
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          track.stop();
          console.log(`Stopped track: ${track.kind}`);
        });
      }
    };
  }, [router]);

  // Sync ref with stream state changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Working Control Handlers
  const toggleMic = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleCam = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  };

  const handleEndCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    router.push('/dashboard');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;
    
    setMessages(prev => [...prev, {
      user: user.name,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputText('');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-mesh text-slate-200 overflow-hidden font-outfit">
      {/* Dynamic Header */}
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-950/40 backdrop-blur-3xl z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shadow-inner">
            <Shield size={16} className="text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Node: {id}</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="flex items-center gap-3">
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Secure Link Active</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Settings2 size={20} /></button>
           <button 
             onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
             className={`flex items-center gap-3 px-6 py-2.5 rounded-xl border transition-all text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 ${isAIPanelOpen ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/20' : 'bg-white/5 text-slate-400 border-white/5 hover:border-white/10'}`}
           >
             <Brain size={16} />
             <span>Neural Intel</span>
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Stage */}
        <main className="flex-1 p-10 relative flex flex-col items-center justify-center">
          <div className="w-full h-full max-w-6xl relative group animate-float">
            <div className={`video-container w-full h-full transition-all duration-700 ring-1 ring-white/10 ${isCamOn ? 'shadow-[0_40px_100px_rgba(79,70,229,0.15)]' : 'shadow-none'}`}>
              {isCamOn ? (
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror-mode"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-3xl">
                   <motion.div 
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className="w-40 h-40 rounded-[3rem] bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center mb-8 shadow-2xl relative"
                   >
                      <UserIcon size={80} className="text-indigo-400/50" />
                      <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
                   </motion.div>
                   <h3 className="text-3xl font-black text-white tracking-tighter mb-4">{user.name}</h3>
                   <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20">
                      <VideoOff size={14} className="text-red-500" />
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Transmission Silenced</span>
                   </div>
                </div>
              )}

              {/* Identity Overlay */}
              <div className="absolute bottom-10 left-10 p-5 bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center gap-4 shadow-2xl ring-1 ring-white/5">
                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg">
                    <UserIcon size={20} className="text-white" />
                 </div>
                 <div>
                    <p className="text-sm font-black tracking-tight mb-0.5 text-white">{user.name}</p>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-indigo-400 font-black">Session Commander</p>
                 </div>
                 {!isMicOn && (
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     className="ml-2 w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30"
                   >
                      <MicOff size={14} className="text-red-500" />
                   </motion.div>
                 )}
              </div>
            </div>

            {/* Float Controls Overlay */}
            <div className="absolute top-10 right-10 flex flex-col gap-3">
               <button className="w-14 h-14 rounded-2xl bg-slate-950/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all shadow-2xl active:scale-90"><Monitor size={24} /></button>
               <button className="w-14 h-14 rounded-2xl bg-slate-950/40 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-all shadow-2xl active:scale-90"><Layout size={24} /></button>
            </div>
          </div>
        </main>

        {/* AI Sidebar */}
        <AnimatePresence>
          {isAIPanelOpen && (
            <motion.aside 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[450px] border-l border-white/5 relative z-40 h-full shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="h-full bg-slate-950/60 backdrop-blur-3xl overflow-hidden">
                <AIPanel />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat Sidebar (Mini) */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.aside 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="fixed right-6 top-24 bottom-32 w-[380px] glass-card z-50 flex flex-col p-8 border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Nexus Comms</h3>
                    <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">End-to-End Encrypted</p>
                 </div>
                 <button onClick={() => setIsChatOpen(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><LogOut size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-8 mb-8 custom-scrollbar px-1">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 py-12">
                    <MessageSquare size={48} className="opacity-10 mb-6" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Uplink</p>
                  </div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className={`flex flex-col gap-2 ${m.user === user.name ? 'items-end' : 'items-start'}`}>
                       <div className="flex items-center gap-3 px-1">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{m.user}</span>
                          <span className="text-[9px] text-slate-600 font-bold">{m.time}</span>
                       </div>
                       <div className={`p-4 rounded-2x border text-sm max-w-[90%] leading-relaxed ${m.user === user.name ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-100 rounded-tr-none' : 'bg-white/5 border-white/10 text-slate-300 rounded-tl-none'}`}>
                          {m.text}
                       </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="relative mt-auto">
                 <input 
                   type="text" 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="Transmit to nexus..."
                   className="w-full h-14 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm focus:outline-none focus:border-indigo-500/50 shadow-inner"
                 />
                 <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 rounded-xl flex items-center justify-center text-white transition-all shadow-lg active:scale-90"><Send size={18} /></button>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Floating Controls */}
      <footer className="h-28 flex items-center justify-center relative z-50">
         <div className="control-bar group">
            <button 
              onClick={toggleMic}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isMicOn ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] border-transparent'}`}
            >
               {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>
            <button 
              onClick={toggleCam}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isCamOn ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10' : 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)] border-transparent'}`}
            >
               {isCamOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>
            
            <div className="h-10 w-[1px] bg-white/10 mx-3" />

            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isChatOpen ? 'bg-indigo-600 text-white shadow-indigo-600/30' : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'}`}
            >
               <MessageSquare size={24} />
            </button>
            <button className="w-16 h-16 rounded-2xl bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-110"><Users size={24} /></button>
            <button className="w-16 h-16 rounded-2xl bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-110"><MoreHorizontal size={24} /></button>

            <div className="h-10 w-[1px] bg-white/10 mx-3" />

            <button 
              onClick={handleEndCall}
              className="w-20 h-16 bg-red-600 hover:bg-red-500 text-white rounded-[1.25rem] transition-all shadow-[0_15px_30px_rgba(239,68,68,0.4)] flex items-center justify-center group/btn active:scale-90"
            >
               <PhoneOff size={28} className="group-hover/btn:rotate-[135deg] transition-all duration-500" />
            </button>
         </div>
         
         <div className="absolute left-10 bottom-10 hidden xl:block">
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
               <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]" /> Neural Bridge Synchronized
            </div>
         </div>
      </footer>

      <style jsx global>{`
        .mirror-mode {
          transform: scaleX(-1);
        }
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
