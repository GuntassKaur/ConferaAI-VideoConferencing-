'use client';

import React, { useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, 
  PhoneOff, ScreenShare, MoreVertical 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const ControlBar = () => {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-5 bg-card/80 backdrop-blur-xl border border-border rounded-full shadow-2xl z-50 transition-all duration-300 hover:shadow-primary/10">
      <button 
        onClick={() => setMicOn(!micOn)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm group ${micOn ? 'bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'}`}
      >
        {micOn ? <Mic size={20} className="group-hover:text-primary transition-colors" /> : <MicOff size={20} />}
      </button>

      <button 
        onClick={() => setVideoOn(!videoOn)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm group ${videoOn ? 'bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700' : 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20'}`}
      >
        {videoOn ? <Video size={20} className="group-hover:text-primary transition-colors" /> : <VideoOff size={20} />}
      </button>

      <button 
        onClick={() => alert('Screen share coming soon!')}
        className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:text-primary"
      >
        <ScreenShare size={20} />
      </button>

      <div className="h-8 w-[1px] bg-border mx-1" />

      <button 
        onClick={() => alert('More options coming soon!')}
        className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-sm hover:text-primary"
      >
        <MoreVertical size={20} />
      </button>

      <button 
        onClick={() => router.push('/dashboard')}
        className="w-14 h-14 rounded-full bg-red-600 text-white hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-600/30 hover:scale-110 active:scale-90 transition-all duration-300 group"
      >
        <PhoneOff size={24} className="group-hover:rotate-12 transition-transform duration-300" />
      </button>
    </div>
  );
};

export default ControlBar;
