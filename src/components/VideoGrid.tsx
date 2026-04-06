'use client';

import React, { useRef, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { MicOff, Maximize2, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VideoGrid = () => {
  const { localStream, remoteParticipants, isMicOn, isCamOn } = useMeeting();
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const participants = [
    { id: 'local', name: 'You (Host)', stream: localStream, isLocal: true, avatar: 'You' },
    ...remoteParticipants,
    // Mocks for visual demo
    { id: 'mock1', name: 'Sarah Chen (AI Expert)', isMock: true, avatar: 'SC' },
    { id: 'mock2', name: 'Alex Miller (PM)', isMock: true, avatar: 'AM' },
  ];

  return (
    <div className="w-full h-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto custom-scrollbar bg-[var(--background)]">
      <AnimatePresence>
        {participants.map((p: any, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full aspect-video bg-[var(--muted)] rounded-[28px] overflow-hidden border border-[var(--border)] shadow-sm group hover:shadow-[0_10px_30px_-10px_var(--glow)] transition-all duration-300 transform-gpu hover:scale-[1.01]"
          >
            {p.isLocal ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transition-opacity duration-300 ${!isCamOn ? 'opacity-0' : 'opacity-100'}`}
              />
            ) : p.isMock ? (
              <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center relative">
                 <div className="w-24 h-24 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-3xl font-bold text-[var(--foreground)] font-outfit premium-shadow">
                   {p.avatar}
                 </div>
              </div>
            ) : (
              <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center" />
            )}

            {/* Offline Local State Camera Off */}
            {p.isLocal && !isCamOn && (
               <div className="absolute inset-0 bg-[var(--muted)] flex items-center justify-center">
                 <div className="w-24 h-24 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-3xl font-bold font-outfit text-[var(--foreground)] premium-shadow">
                   {p.avatar}
                 </div>
               </div>
            )}

            {/* Top Right Controls (Hover) */}
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="w-9 h-9 rounded-full bg-[var(--card)] backdrop-blur-md border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:text-[var(--primary)] shadow-sm transition-colors">
                  <Maximize2 className="w-4 h-4" />
               </button>
               <button className="w-9 h-9 rounded-full bg-[var(--card)] backdrop-blur-md border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] hover:text-[var(--primary)] shadow-sm transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
               </button>
            </div>

            {/* Bottom Left Info Tag (macOS FaceTime style) */}
            <div className="absolute bottom-4 left-4">
               <div className="flex items-center gap-3 px-4 py-2 bg-[var(--card)] backdrop-blur-xl rounded-2xl border border-[var(--border)] shadow-sm leading-none">
                 <span className="text-[13px] font-semibold text-[var(--foreground)] font-outfit">{p.name}</span>
                 {p.isLocal && !isMicOn && (
                     <div className="w-6 h-6 rounded-full bg-red-500/10 flex items-center justify-center">
                        <MicOff className="w-3 h-3 text-red-500" />
                     </div>
                 )}
               </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
