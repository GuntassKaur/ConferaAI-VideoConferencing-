'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MicOff, MoreHorizontal } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  isSpeaking?: boolean;
}

const VideoGrid = ({ participants }: { participants: Participant[] }) => {
  return (
    <div className="flex-grow p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr h-full">
      {participants.map((person) => (
        <motion.div 
          key={person.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative rounded-xl overflow-hidden bg-slate-900 border-2 transition-all duration-300 group ${
            person.isSpeaking ? 'border-primary shadow-[0_0_25px_-5px_rgba(99,102,241,0.3)]' : 'border-white/5'
          }`}
        >
          {/* Avatar / Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
             <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700/50 flex items-center justify-center text-4xl font-black text-slate-500 shadow-2xl">
                {person.name.charAt(0)}
             </div>
          </div>

          {/* Name Label */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-xs font-bold text-white border border-white/10">
             {person.isSpeaking && <div className="flex gap-1 items-end h-3"><div className="w-1 h-[60%] bg-primary animate-pulse" /><div className="w-1 h-[100%] bg-primary animate-pulse delay-75" /><div className="w-1 h-[40%] bg-primary animate-pulse delay-150" /></div>}
             {person.name}
          </div>

          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
             <button className="w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 border border-white/10 transition-colors"><MicOff size={18} /></button>
             <button className="w-9 h-9 rounded-xl bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 border border-white/10 transition-colors"><MoreHorizontal size={18} /></button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VideoGrid;
