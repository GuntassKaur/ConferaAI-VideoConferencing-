'use client';

import React, { useRef, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { MicOff, CameraOff, Volume2, User, MoreHorizontal, Maximize } from 'lucide-react';
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
    { id: 'local', name: 'You (Host)', stream: localStream, isLocal: true },
    ...remoteParticipants,
    // Mocks for visual demo if no one else is there
    { id: 'mock1', name: 'Sarah Chen (AI Expert)', isMock: true, avatar: 'SC' },
    { id: 'mock2', name: 'Alex Miller (PM)', isMock: true, avatar: 'AM' },
  ];

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 auto-rows-fr gap-4 p-4 overflow-y-auto custom-scrollbar">
      <AnimatePresence>
        {participants.map((p: any, idx) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="video-grid-item group"
          >
            {p.isLocal ? (
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className={`w-full h-full object-cover transition-all ${!isCamOn ? 'opacity-0' : 'opacity-100'}`}
              />
            ) : p.isMock ? (
              <div className="w-full h-full bg-zinc-900 flex items-center justify-center relative">
                 <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary/20 to-purple-500/20 flex items-center justify-center text-4xl font-bold border border-white/10">
                   {p.avatar}
                 </div>
              </div>
            ) : (
              <div className="w-full h-full bg-zinc-900 border border-white/5" />
            )}

            {/* Overlay Info */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white shadow-sm">{p.name}</span>
                {p.isLocal && !isMicOn && <MicOff className="w-3 h-3 text-red-500" />}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-black/60">
                   <Maximize className="w-4 h-4 text-white" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/40 hover:bg-black/60">
                   <MoreHorizontal className="w-4 h-4 text-white" />
                </Button>
              </div>
            </div>

            {/* Offline State */}
            {p.isLocal && !isCamOn && (
               <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                   <User className="w-10 h-10 text-zinc-600" />
                 </div>
               </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Re-defining Button here for simplicity or we should import it
import { Button } from '@/components/ui/Button';
