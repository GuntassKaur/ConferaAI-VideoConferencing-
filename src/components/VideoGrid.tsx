'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MicOff, VideoOff, MoreHorizontal } from 'lucide-react';

const participants = [
  { id: 1, name: 'Guntass Kaur (You)', isSelf: true, isSpeaking: true },
  { id: 2, name: 'Sarah Chen' },
  { id: 3, name: 'Alex Thompson' },
  { id: 4, name: 'Dante Rivera' },
  { id: 5, name: 'Jane Doe' },
  { id: 6, name: 'John Smith' },
];

const VideoGrid = () => {
  return (
    <div className="flex-grow bg-slate-950 p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr h-full">
      {participants.map((person) => (
        <motion.div 
          key={person.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative rounded-2xl overflow-hidden bg-slate-900 border-2 transition-all group ${
            person.isSpeaking ? 'border-indigo-500 shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)]' : 'border-transparent'
          }`}
        >
          {/* Avatar / Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950">
             <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-3xl font-black text-slate-400">
                {person.name.charAt(0)}
             </div>
          </div>

          {/* Name Label */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md text-xs font-bold text-white">
             {person.isSpeaking && <div className="flex gap-0.5"><div className="w-1 h-3 bg-indigo-400 animate-pulse" /><div className="w-1 h-3 bg-indigo-400 animate-pulse delay-75" /><div className="w-1 h-3 bg-indigo-400 animate-pulse delay-150" /></div>}
             {person.name}
          </div>

          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60"><MicOff size={16} /></button>
             <button className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60"><MoreHorizontal size={16} /></button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default VideoGrid;
