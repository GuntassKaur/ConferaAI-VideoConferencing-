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
    { id: 'local', name: 'You (Host)', stream: localStream, isLocal: true, avatar: 'JD', status: 'Host' },
    ...remoteParticipants,
    { id: 'mock1', name: 'Sarah J. (Lead)', isMock: true, avatar: 'SJ', status: 'Speaker' },
    { id: 'mock2', name: 'Alex M. (CTO)', isMock: true, avatar: 'AM', status: 'Engaged' },
    { id: 'mock3', name: 'Zoe R. (AI Eng)', isMock: true, avatar: 'ZR', status: 'Active' },
  ];

  return (
    <div className="w-full h-full p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar bg-transparent relative z-10">
      <AnimatePresence>
        {participants.map((p: any, idx) => {
          const isSpeaking = activeSpeaker === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ 
                type: 'spring', 
                stiffness: 100, 
                damping: 20, 
                delay: idx * 0.05 
              }}
              className={`group relative w-full aspect-video cyber-glass rounded-[2rem] overflow-hidden border-white/5 transition-all duration-500 transform-gpu ${isSpeaking ? 'animate-breathe border-[#00f2fe]/50 z-20 shadow-[0_0_50px_rgba(0,242,254,0.3)]' : 'hover:border-white/20'}`}
            >
              {/* Background Ambient Glow */}
              <div className="absolute inset-0 bg-[#050505]/40 z-0" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

              {/* Video/Avatar Surface */}
              {p.isLocal ? (
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  className={`w-full h-full object-cover transition-opacity duration-1000 z-10 ${!isCamOn ? 'opacity-0' : 'opacity-90'}`}
                />
              ) : p.isMock ? (
                <div className="w-full h-full flex items-center justify-center relative z-10">
                   <div className="relative">
                      {isSpeaking && (
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                      )}
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold text-white font-outfit shadow-inner">
                        {p.avatar}
                      </div>
                   </div>
                </div>
              ) : (
                <div className="w-full h-full bg-white/[0.02] flex items-center justify-center z-10" />
              )}

              {/* Offline Local State UI */}
              {p.isLocal && !isCamOn && (
                 <div className="absolute inset-0 bg-[#050505] flex items-center justify-center z-[15]">
                    <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl font-bold font-outfit text-white">
                      {p.avatar}
                    </div>
                 </div>
              )}

              {/* Top Right Quick Actions */}
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 translate-y-2 group-hover:translate-y-0">
                 <button className="w-9 h-9 rounded-lg cyber-glass text-white/60 hover:text-white transition-all p-2">
                    <Maximize2 className="w-full h-full" />
                 </button>
                 <button className="w-9 h-9 rounded-lg cyber-glass text-white/60 hover:text-white transition-all p-2">
                    <MoreHorizontal className="w-full h-full" />
                 </button>
              </div>

              {/* Status Badges (Top Left) */}
              <div className={`absolute top-4 left-4 z-30 transition-all ${!p.isLocal || isMicOn ? 'opacity-100' : 'opacity-0'}`}>
                 <div className="flex items-center gap-2 px-3 py-1 cyber-glass rounded-full border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isSpeaking ? 'bg-[#00f2fe] animate-pulse shadow-[0_0_8px_#00f2fe]' : 'bg-white/40'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      {isSpeaking ? 'Speaking' : 'Live'}
                    </span>
                 </div>
              </div>

              {/* Participant Footer */}
              <div className="absolute bottom-4 left-4 right-4 z-30">
                 <div className="flex items-center justify-between w-full px-4 py-3 cyber-glass rounded-xl border-white/5 shadow-2xl">
                   <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-[#00f2fe] uppercase tracking-widest opacity-80 leading-tight mb-0.5">{p.status}</span>
                         <span className="text-sm font-bold text-white font-outfit tracking-tight leading-tight">{p.name}</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-3">
                      {p.isLocal && !isMicOn && (
                         <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                            <MicOff className="w-4 h-4 text-red-500" />
                         </div>
                      )}
                      <button className="w-8 h-8 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-all flex items-center justify-center">
                         <BarChart3 className="w-4 h-4" />
                      </button>
                   </div>
                 </div>
              </div>

              {/* AI Insight Sparkle */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute bottom-4 right-4 z-40"
                  >
                    <div className="p-2 cyber-glass rounded-lg border-[#00f2fe]/20 text-[#00f2fe]">
                       <Sparkles className="w-4 h-4" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
