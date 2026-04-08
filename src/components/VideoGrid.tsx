'use client';

import React, { useRef, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { 
  MicOff, Maximize2, MoreHorizontal, User, Sparkles, 
  Volume2, Settings2, ShieldCheck, SignalHigh 
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
    { id: 'local', name: 'You', stream: localStream, isLocal: true, avatar: 'JD', status: 'Host' },
    ...remoteParticipants,
    { id: 'mock1', name: 'Sarah Jenkins', isMock: true, avatar: 'SJ', status: 'Product Manager' },
    { id: 'mock2', name: 'Alex Mitchell', isMock: true, avatar: 'AM', status: 'Lead Architect' },
  ];

  return (
    <div className="w-full h-full bg-[#050505] p-6 relative overflow-hidden flex flex-col">
      
      <div className={`grid gap-4 flex-1 ${participants.length > 2 ? 'grid-cols-2 lg:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
        <AnimatePresence>
          {participants.map((p: any) => {
            const isSpeaking = activeSpeaker === p.id;
            
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`group relative w-full h-full rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isSpeaking ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                {/* Visual Content */}
                <div className="absolute inset-0 z-0">
                  {p.isLocal ? (
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      muted 
                      playsInline 
                      className={`w-full h-full object-cover transition-opacity duration-500 ${!isCamOn ? 'opacity-0' : 'opacity-100'}`}
                    />
                  ) : p.isMock ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900/50 relative">
                       <div className="w-24 h-24 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl font-semibold text-indigo-400">
                         {p.avatar}
                       </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-900/50" />
                  )}
                </div>

                {/* Local Camera Off UI */}
                {p.isLocal && !isCamOn && (
                   <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center z-10 text-white/40">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-2xl font-semibold">
                        {p.avatar}
                      </div>
                   </div>
                )}

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20" />

                <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mb-1">{p.status}</span>
                      <span className="text-sm font-semibold text-white">{p.name}</span>
                   </div>
                   
                   <div className="flex items-center gap-2">
                     {isSpeaking && (
                       <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                          <Volume2 className="w-4 h-4 text-white" />
                       </div>
                     )}
                     {!p.isMock && !isMicOn && p.isLocal && (
                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center border border-red-500/30">
                           <MicOff className="w-4 h-4 text-red-500" />
                        </div>
                     )}
                   </div>
                </div>

                {/* Badge */}
                <div className="absolute top-4 left-4 z-30">
                   <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/60">
                      <SignalHigh className="w-3 h-3 text-emerald-500" />
                      HD 1080p
                   </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
