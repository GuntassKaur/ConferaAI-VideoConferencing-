'use client';

import React, { useRef, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { 
  MicOff, Maximize2, MoreHorizontal, User, Sparkles, 
  Volume2, Settings2, BarChart3, SignalHigh 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomStore } from '@/store/useRoomStore';

export const VideoGrid = () => {
  const { localStream, remoteParticipants, isMicOn, isCamOn } = useMeeting();
  const { activeSpeaker } = useRoomStore();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const participants = [
    { id: 'local', name: 'You (Agent)', stream: localStream, isLocal: true, avatar: 'JD', status: 'Host' },
    ...remoteParticipants,
    { id: 'mock1', name: 'Sarah J. (Lead)', isMock: true, avatar: 'SJ', status: 'Speaker' },
    { id: 'mock2', name: 'Alex M. (CTO)', isMock: true, avatar: 'AM', status: 'Engaged' },
    { id: 'mock3', name: 'Zoe R. (AI Eng)', isMock: true, avatar: 'ZR', status: 'Active' },
  ];

  return (
    <div className="w-full h-full p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 overflow-y-auto custom-scrollbar bg-transparent relative z-10">
      <AnimatePresence>
        {participants.map((p: any, idx) => {
          const isSpeaking = activeSpeaker === p.id;
          return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              boxShadow: isSpeaking ? "0px 0px 30px 5px rgba(0,242,254,0.6)" : "0px 0px 0px 0px rgba(0,0,0,0)" 
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`group relative w-full aspect-video glass-panel rounded-[32px] overflow-hidden border-white/[0.08] hover:border-primary/50 transition-all duration-700 transform-gpu ${isSpeaking ? 'border-[#00f2fe]' : ''}`}
          >
            {/* Background Grain/Starfield per feed */}
            <div className="absolute inset-0 bg-[#0a0a0f] z-0 opacity-40" />

            {/* Video/Avatar Surface */}
            {p.isLocal ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transition-opacity duration-1000 z-10 ${!isCamOn ? 'opacity-0' : 'opacity-80'}`}
              />
            ) : p.isMock ? (
              <div className="w-full h-full bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center relative z-10">
                 <div className="pulsing-orb">
                    <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl font-black text-white font-outfit shadow-[0_0_40px_rgba(139,92,246,0.2) inset]">
                      {p.avatar}
                    </div>
                 </div>
              </div>
            ) : (
              <div className="w-full h-full bg-white/[0.02] flex items-center justify-center z-10" />
            )}

            {/* Offline Local State UI */}
            {p.isLocal && !isCamOn && (
               <div className="absolute inset-0 bg-[#0a0a0f] flex items-center justify-center z-[15]">
                 <div className="pulsing-orb">
                    <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl font-black font-outfit text-white shadow-[0_0_40px_rgba(139,92,246,0.2) inset]">
                      {p.avatar}
                    </div>
                 </div>
               </div>
            )}

            {/* LUX OVERLAYS: Top Right Quick Actions */}
            <div className="absolute top-6 right-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 translate-y-2 group-hover:translate-y-0">
               <button className="w-10 h-10 rounded-xl glass-panel text-white/40 hover:text-primary transition-all p-2.5">
                  <Maximize2 className="w-full h-full" />
               </button>
               <button className="w-10 h-10 rounded-xl glass-panel text-white/40 hover:text-primary transition-all p-2.5">
                  <Settings2 className="w-full h-full" />
               </button>
            </div>

            {/* LUX OVERLAYS: Status Badges (Top Left) */}
            <div className={`absolute top-6 left-6 z-30 transition-all ${!p.isLocal || isMicOn ? 'opacity-100' : 'opacity-0'}`}>
               <div className="flex items-center gap-3 px-3 py-1.5 glass-panel rounded-full border-white/5 backdrop-blur-xl">
                  {idx < 2 ? <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" /> : <div className="w-1.5 h-1.5 rounded-full bg-white/20" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">HQ Active</span>
                  <SignalHigh className="w-3 h-3 text-white/20" />
               </div>
            </div>

            {/* LUX OVERLAYS: Participant Footer (macOS Lux Style) */}
            <div className="absolute bottom-6 left-6 right-6 z-30">
               <div className="flex items-center justify-between w-full px-5 py-4 glass-panel rounded-2xl border-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                 <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1.5 opacity-80">{p.status}</span>
                       <span className="text-[15px] font-extrabold text-white font-outfit tracking-tight leading-none">{p.name}</span>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    {p.isLocal && !isMicOn && (
                       <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center pulse">
                          <MicOff className="w-5 h-5 text-red-500" />
                       </div>
                    )}
                    {!p.isLocal && <Volume2 className="w-5 h-5 text-white/20" />}
                    <button className="w-10 h-10 rounded-xl hover:bg-white/5 text-white/20 hover:text-white transition-all flex items-center justify-center">
                       <BarChart3 className="w-5 h-5" />
                    </button>
                 </div>
               </div>
            </div>

            {/* Intelligence Spark Indicator */}
            {idx % 2 === 0 && (
               <div className="absolute bottom-6 right-6 z-40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 glass-panel rounded-lg border-indigo-400/20 text-indigo-400">
                     <Sparkles className="w-5 h-5" />
                  </div>
               </div>
            )}
          </motion.div>
        )})}
      </AnimatePresence>
    </div>
  );
};
