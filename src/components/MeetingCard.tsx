'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MoreVertical, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface MeetingCardProps {
  title: string;
  date: string;
  time: string;
  participants: number;
  meetingId: string;
  status?: 'upcoming' | 'ongoing' | 'ended' | 'live';
}

const MeetingCard = ({ title, date, time, participants, meetingId, status = 'upcoming' }: MeetingCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="p-8 rounded-[2.5rem] bg-slate-900/40 backdrop-blur-xl border border-white/5 shadow-2xl transition-all duration-300 relative group flex flex-col h-full"
    >
      {/* Visual Indicator */}
      <div className="flex justify-between items-start mb-8">
        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500 shadow-inner">
          <Video className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors duration-500" />
        </div>
        <div className="flex items-center gap-2">
           {status === 'live' && (
             <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live
             </span>
           )}
           <button className="text-slate-500 hover:text-white transition-colors">
              <MoreVertical size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">{title}</h3>
        <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
           <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
              <Calendar size={14} className="text-indigo-400" />
              {date}
           </div>
           <div className="flex items-center gap-2 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5">
              <Clock size={14} className="text-indigo-400" />
              {time}
           </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-10 h-10 rounded-xl border-4 border-[#0f172a] bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400">
               {String.fromCharCode(64 + i)}
            </div>
          ))}
          {participants > 3 && (
            <div className="w-10 h-10 rounded-xl border-4 border-[#0f172a] bg-indigo-500 text-white flex items-center justify-center text-xs font-black">
              +{participants - 3}
            </div>
          )}
        </div>
        
        <Link href={`/meeting/${meetingId}`}>
          <button className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-xl hover:rotate-[360deg] active:scale-90">
             <ArrowUpRight size={24} />
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default MeetingCard;
