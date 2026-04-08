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
  const { activeSpeaker, focusMode, viewMode } = useRoomStore();
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

  const hasFocus = focusMode && activeSpeaker;

  return (
    <div className={`w-full h-full p-6 transition-all duration-1000 relative z-10 custom-scrollbar overflow-y-auto ${viewMode === 'together' ? 'bg-gradient-to-t from-[#0a0a0f] to-[#1a1a2e]' : 'bg-transparent'}`}>
      
      {/* Together Mode Backdrop */}
      {viewMode === 'together' && (
        <div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-20">
           <div className="w-[120%] h-[300px] bg-gradient-to-t from-[#7000ff] to-transparent blur-[120px] rounded-[100%]" />
        </div>
      )}

      <div className={`grid gap-6 auto-rows-max ${viewMode === 'together' ? 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'}`}>
        <AnimatePresence>
          {participants.map((p: any, idx) => {
            const isSpeaking = activeSpeaker === p.id;
            const isDimmed = hasFocus && !isSpeaking;
            
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ 
                  opacity: isDimmed ? 0.3 : 1, 
                  scale: isSpeaking && focusMode ? 1.05 : 1,
                  filter: isDimmed ? 'blur(4px) grayscale(50%)' : 'blur(0px) grayscale(0%)',
                }}
                className={`group relative w-full aspect-video cyber-glass rounded-[2rem] overflow-hidden border-white/5 transition-all duration-700 transform-gpu ${isSpeaking ? 'animate-breathe border-[#00f2fe]/50 z-20 shadow-[0_0_50px_rgba(0,242,254,0.4)]' : 'hover:border-white/20'}`}
              >
                {/* Visual content (video/avatar) remains same but responds to dimming */}
                <div className="absolute inset-0 bg-[#050505]/40 z-0" />
                
                {/* Active Speaker Spotlight Glow */}
                {isSpeaking && (
                   <div className="absolute inset-0 bg-[#00f2fe]/5 animate-pulse z-[1]" />
                )}

                {p.isLocal ? (
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className={`w-full h-full object-cover z-10 transition-opacity ${!isCamOn ? 'opacity-0' : 'opacity-90'}`}
                  />
                ) : p.isMock ? (
                  <div className="w-full h-full flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110">
                    <div className="relative">
                       {isSpeaking && (
                         <div className="absolute inset-0 rounded-full bg-[#00f2fe]/20 animate-ping opacity-50" />
                       )}
                       <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full cyber-glass border border-white/10 flex items-center justify-center text-3xl font-bold text-white font-outfit shadow-inner ${isSpeaking ? 'border-[#00f2fe]/50' : ''}`}>
                         {p.avatar}
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-white/[0.02] flex items-center justify-center z-10" />
                )}

                {/* Local Camera Off UI */}
                {p.isLocal && !isCamOn && (
                   <div className="absolute inset-0 bg-[#0a0a10] flex items-center justify-center z-[15]">
                      <div className="w-24 h-24 rounded-full cyber-glass border border-white/10 flex items-center justify-center text-3xl font-bold font-outfit text-white">
                        {p.avatar}
                      </div>
                   </div>
                )}

                {/* Badges & Overlays */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
                   <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full cyber-glass border-white/10 ${isSpeaking ? 'bg-[#00f2fe]/10 text-[#00f2fe]' : 'text-white/40'}`}>
                      <SignalHigh className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{isSpeaking ? 'Highlight' : 'Live'}</span>
                   </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-30">
                   <div className={`flex items-center justify-between w-full px-4 py-3 cyber-glass rounded-2xl border-white/5 transition-all duration-500 ${isSpeaking ? 'bg-[#00f2fe]/10' : ''}`}>
                     <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-0.5">{p.status}</span>
                        <span className="text-sm font-bold text-white tracking-tight">{p.name}</span>
                     </div>
                     {isSpeaking && <Volume2 className="w-4 h-4 text-[#00f2fe] animate-bounce" />}
                   </div>
                </div>

                <AnimatePresence>
                  {isSpeaking && (
                    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute -top-1 -right-1 z-40">
                       <div className="p-3 bg-gradient-to-br from-[#00f2fe] to-[#7000ff] rounded-2xl text-black shadow-[0_0_20px_rgba(0,242,254,0.4)]">
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
    </div>
  );
};
