'use client';

import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, 
  ScreenShare, Hand, MessageSquare, 
  Settings, PhoneOff, MoreHorizontal
} from 'lucide-react';

const ControlBar = () => {
  const [mic, setMic] = useState(true);
  const [camera, setCamera] = useState(true);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-slate-900/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-110 md:scale-100 transition-all origin-bottom">
        
        {/* AV Controls */}
        <div className="flex items-center gap-2 pr-4 border-r border-white/10">
          <button 
            onClick={() => setMic(!mic)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              mic ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {mic ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
          <button 
            onClick={() => setCamera(!camera)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              camera ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {camera ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
        </div>

        {/* Feature Controls */}
        <div className="flex items-center gap-2 px-4">
          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95 group">
            <ScreenShare size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95">
            <Hand size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95">
            <MessageSquare size={20} />
          </button>
          <button className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all active:scale-95">
            <Settings size={20} />
          </button>
        </div>

        {/* End Call */}
        <div className="pl-4 border-l border-white/10">
          <button className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-all hover:rotate-12 active:scale-90 shadow-lg shadow-red-600/20">
            <PhoneOff size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlBar;
