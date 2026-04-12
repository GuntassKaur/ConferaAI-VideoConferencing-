'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, LogOut, MessageSquare, Users, Video, VideoOff, 
  Mic, MicOff, Shield, Settings, MoreHorizontal, 
  Monitor, Layout, PhoneOff, User as UserIcon, Brain, 
  Record, Info, ChevronRight, Activity, FileText
} from 'lucide-react';
import AIPanel from '@/components/AIPanel';
import { useAuthStore } from '@/store/useAuthStore';
import { useMeeting } from '@/context/MeetingContext';

export default function MeetingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    messages, 
    sendMessage, 
    joinRoom, 
    leaveRoom,
    isMicOn: contextMicOn,
    isCamOn: contextCamOn,
    toggleMic: contextToggleMic,
    toggleCam: contextToggleCam,
    localStream
  } = useMeeting();
  
  // States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(true);
  const [inputText, setInputText] = useState('');
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize Media and Auth Check
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (id && user.name) {
      joinRoom(id as string, user.name);
    }

    return () => {
      leaveRoom();
    };
  }, [user, router, id, joinRoom, leaveRoom]);

  // Sync ref with stream state changes
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  // Copy Link Handler
  const copyMeetingId = () => {
    navigator.clipboard.writeText(id as string);
    // In a real app we'd show a toast here
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F172A] text-slate-200 overflow-hidden font-inter">
      {/* SaaS Header */}
      <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div 
            onClick={copyMeetingId}
            className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md cursor-pointer hover:bg-blue-500/20 transition-all"
          >
            <Shield size={14} className="text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">SID: {id}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex items-center gap-2 text-slate-400">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] uppercase font-bold tracking-widest">Secure Cluster Active</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Session Info"><Info size={18} /></button>
           <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Settings"><Settings size={18} /></button>
           <button 
             onClick={() => setIsInsightsOpen(!isInsightsOpen)}
             className={`flex items-center gap-2 px-4 py-1.5 rounded-md border transition-all text-[10px] font-bold uppercase tracking-widest ${isInsightsOpen ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'}`}
           >
             <Brain size={14} />
             <span>AI Insights</span>
           </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Meeting Stage */}
        <main className="flex-1 p-6 relative flex flex-col items-center justify-center bg-slate-950/30">
          <div className="w-full h-full max-w-5xl relative group">
            <div className={`video-container w-full h-full transition-all duration-700 ${isCamOn ? 'ring-2 ring-blue-500/20 shadow-blue-500/10' : 'shadow-none'}`}>
              {isCamOn ? (
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror-mode"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/50">
                   <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-6 border-4 border-slate-800 shadow-2xl">
                      <UserIcon size={48} className="text-slate-600" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-300">{user?.name}</h3>
                   <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-slate-800/80 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <VideoOff size={12} className="text-red-500" />
                      Camera Disabled
                   </div>
                </div>
              )}

              {/* Identity Overlay */}
              <div className="absolute bottom-6 left-6 p-4 glass-card bg-slate-900/80 rounded-xl flex items-center gap-3 border-slate-800">
                 <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <UserIcon size={16} className="text-white" />
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white leading-none mb-1">{user?.name}</p>
                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Meeting Host</p>
                 </div>
                 {!contextMicOn && (
                   <div className="ml-2 w-6 h-6 rounded-md bg-red-500/20 flex items-center justify-center border border-red-500/30">
                      <MicOff size={12} className="text-red-500" />
                   </div>
                 )}
              </div>
            </div>

            {/* Float Controls Overlay */}
            <div className="absolute top-6 right-6 flex flex-col gap-2">
               <button className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-white transition-all"><Monitor size={18} /></button>
               <button className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-white transition-all"><Layout size={18} /></button>
            </div>
          </div>
        </main>

        {/* AI Sidebar */}
        <AnimatePresence>
          {isInsightsOpen && (
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-[380px] border-l border-slate-800 relative z-40 h-full bg-slate-900/50 backdrop-blur-3xl"
            >
              <AIPanel />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat Drawer */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-14 bottom-20 w-[320px] bg-slate-900 border-l border-slate-800 z-50 flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Meeting Chat</h3>
                 <button onClick={() => setIsChatOpen(false)} className="text-slate-500 hover:text-white transition-colors"><LogOut size={16} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 mb-6 custom-scrollbar">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">No messages yet</div>
                ) : (
                  messages.map((m, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-blue-500 uppercase">{m.user}</span>
                          <span className="text-[9px] text-slate-600">{m.time}</span>
                       </div>
                       <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-medium">
                          {m.text}
                       </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSendMessage} className="relative">
                 <input 
                   type="text" 
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   placeholder="Type a message..."
                   className="w-full h-10 bg-slate-800 border border-slate-700 rounded-lg px-4 text-xs focus:outline-none focus:border-blue-500/50"
                 />
                 <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-400 transition-colors"><Send size={16} /></button>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <footer className="h-20 border-t border-slate-800 px-8 flex items-center justify-center relative bg-slate-950">
         <div className="flex items-center gap-3">
            <button 
              onClick={contextToggleMic}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${contextMicOn ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-red-500 text-white'}`}
            >
               {contextMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button 
              onClick={contextToggleCam}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${contextCamOn ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-red-500 text-white'}`}
            >
               {contextCamOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
            
            <div className="h-8 w-[1px] bg-slate-800 mx-2" />

            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isChatOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}
            >
               <MessageSquare size={20} />
            </button>
            <button className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all"><Users size={20} /></button>
            <button className="w-12 h-12 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all"><MoreHorizontal size={20} /></button>

            <div className="h-8 w-[1px] bg-slate-800 mx-2" />

            <button 
              onClick={() => { leaveRoom(); router.push('/dashboard'); }}
              className="px-6 h-12 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest"
            >
               <PhoneOff size={20} />
               <span>End Session</span>
            </button>
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
