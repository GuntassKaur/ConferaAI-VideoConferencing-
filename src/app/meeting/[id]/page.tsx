'use client';

import React from 'react';
import VideoGrid from '@/components/VideoGrid';
import AIPanel from '@/components/AIPanel';
import ControlBar from '@/components/ControlBar';
import { Shield } from 'lucide-react';

export default function MeetingRoom() {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden text-white">
      {/* Top Header */}
      <div className="h-14 px-6 border-b border-white/5 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
              <Shield className="w-3 h-3" />
              Secure Session
           </div>
           <h1 className="text-sm font-bold text-slate-300">Strategy Sync <span className="text-slate-500 font-medium ml-2">#882-991</span></h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Video Grid */}
        <div className="flex-grow relative h-full bg-black/20">
           <VideoGrid />
           <ControlBar />
        </div>

        {/* Right: AI Panel */}
        <AIPanel />
      </div>
    </div>
  );
}
