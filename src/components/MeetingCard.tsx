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
      className="p-5 rounded-xl bg-card border border-border transition-all duration-200 flex flex-col gap-4 relative group hover:shadow-lg"
    >
      <div className="flex justify-between items-start">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Video className="w-5 h-5 text-primary" />
        </div>
        <button className="text-muted hover:text-foreground transition-colors duration-200">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div>
        <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted font-medium">
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

      <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-7 h-7 rounded-full border-2 border-card bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-7 h-7 rounded-full border-2 border-card bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-muted">
            +{participants - 3}
          </div>
        </div>
        
        <Link href="/meeting/123" className="block">
          <button className="h-9 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-bold flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
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
