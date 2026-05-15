'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, ChevronRight, User } from 'lucide-react';

interface PreCallLobbyProps {
  roomId: string;
  userName: string;
  onJoin: (cam: boolean, mic: boolean) => void;
}

export default function PreCallLobby({ roomId, userName, onJoin }: PreCallLobbyProps) {
  const [camEnabled, setCamEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [name, setName] = useState(userName);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    if (camEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          currentStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => setCamEnabled(false));
    } else {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        setStream(null);
      }
    }
    return () => {
      if (currentStream) currentStream.getTracks().forEach(t => t.stop());
    };
  }, [camEnabled]);

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex items-start justify-center pt-20 px-6 font-inter overflow-hidden relative">
      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1e1e27_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
        {/* Left Col - Video Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-full aspect-video bg-[#0f0f13] border border-[#1e1e27] rounded-2xl overflow-hidden relative shadow-2xl flex items-center justify-center">
            {camEnabled ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover -scale-x-100" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#17171d] border border-[#27272a] flex items-center justify-center text-4xl font-bold text-slate-400">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
            
            {/* Absolute Badges on Preview */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur rounded-lg px-3 py-1 text-xs font-medium border border-white/10">
              {name || 'Guest'}
            </div>
            {!micEnabled && (
              <div className="absolute top-4 right-4 bg-rose-500/80 backdrop-blur rounded-lg p-2 border border-rose-500">
                <MicOff size={16} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 bg-[#0f0f13] border border-[#1e1e27] rounded-2xl px-4 py-3 shadow-lg">
            <button 
              onClick={() => setMicEnabled(!micEnabled)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${micEnabled ? 'bg-[#17171d] hover:bg-[#27272a] text-white' : 'bg-rose-500/20 border border-rose-500/50 text-rose-500'}`}
            >
              {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button 
              onClick={() => setCamEnabled(!camEnabled)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${camEnabled ? 'bg-[#17171d] hover:bg-[#27272a] text-white' : 'bg-rose-500/20 border border-rose-500/50 text-rose-500'}`}
            >
              {camEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          </div>
        </motion.div>

        {/* Right Col */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-start max-w-sm"
        >
          <div className="inline-block bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
            Room: {roomId.slice(0, 8)}
          </div>
          <h1 className="text-3xl font-bold mb-8 text-white">Ready to join?</h1>

          <div className="w-full space-y-4 mb-8">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-[#0f0f13] border border-[#1e1e27] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 shadow-inner"
              />
            </div>
            <div className="bg-[#0f0f13] border border-[#1e1e27] rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-[#1e1e27]" />
                <div className="w-6 h-6 rounded-full bg-slate-700 border border-[#1e1e27]" />
              </div>
              <span className="text-sm text-slate-400 font-medium">2 others are waiting</span>
            </div>
          </div>

          <button 
            onClick={() => {
              if (stream) stream.getTracks().forEach(t => t.stop());
              onJoin(camEnabled, micEnabled);
            }}
            className="w-full bg-[#6366f1] hover:bg-indigo-500 text-white font-bold text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-indigo-500/20 mb-4"
          >
            Join now <ChevronRight size={16} />
          </button>
          
          <button 
            onClick={() => {
              if (stream) stream.getTracks().forEach(t => t.stop());
              onJoin(false, micEnabled);
            }}
            className="text-sm text-slate-500 hover:text-slate-300 font-medium transition-colors mx-auto block"
          >
            Join without camera
          </button>
        </motion.div>
      </div>
    </div>
  );
}
