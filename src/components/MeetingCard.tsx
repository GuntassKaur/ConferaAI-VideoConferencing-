'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MoreVertical, Play } from 'lucide-react';
import Link from 'next/link';

interface MeetingCardProps {
  title: string;
  date: string;
  time: string;
  participants: number;
  status?: 'upcoming' | 'ongoing' | 'ended';
}

const MeetingCard = ({ title, date, time, participants, status = 'upcoming' }: MeetingCardProps) => {
  return (
    <motion.div 
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
      className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 transition-all flex flex-col gap-4 relative group"
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {time}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between mt-auto">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
            +{participants - 3}
          </div>
        </div>
        
        <Link href="/meeting/123" className="block">
          <button className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center gap-2 transition-all active:scale-95">
            Join <Play className="w-3.5 h-3.5 fill-white" />
          </button>
        </Link>
      </div>

      {status === 'ongoing' && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-wider">
           <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
           Live
        </div>
      )}
    </motion.div>
  );
};

export default MeetingCard;
