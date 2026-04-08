'use client';

import React from 'react';
import VideoGrid from '@/components/VideoGrid';
import AIPanel from '@/components/AIPanel';
import ControlBar from '@/components/ControlBar';
import { motion } from 'framer-motion';
import { Shield, Users, Info, Settings } from 'lucide-react';

export default function MeetingRoom() {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden text-white font-inter">
      {/* Top Header Room Info */}
      <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              E2EE Active
           </div>
           <h1 className="text-sm font-bold text-slate-300">Weekly Product Sync <span className="text-slate-500 font-medium ml-2">#882-991</span></h1>
        </div>
        
        <div className="flex items-center gap-2">
           <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
              <Users size={18} />
           </button>
           <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
              <Info size={18} />
           </button>
           <div className="h-4 w-[1px] bg-white/10 mx-2" />
           <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
              <Settings size={18} />
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video Grid (70%) */}
        <div className="flex-grow relative h-full">
           <VideoGrid />
           {/* Control Bar stays here if relative, or fixed globally */}
           <ControlBar />
        </div>

        {/* Right: AI Panel (30%) */}
        <AIPanel />
      </div>
    </div>
  );
}
