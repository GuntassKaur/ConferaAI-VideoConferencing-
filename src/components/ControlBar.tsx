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
    <div className="flex items-center gap-3 p-3 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl z-50">
      <button 
        onClick={() => setMicOn(!micOn)}
        className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${micOn ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-red-600 text-white'}`}
      >
        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      <button 
        onClick={() => setVideoOn(!videoOn)}
        className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${videoOn ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700' : 'bg-red-600 text-white'}`}
      >
        {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      <div className="h-6 w-[1px] bg-slate-800 mx-1" />

      <button 
        className="w-11 h-11 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all"
      >
        <ScreenShare size={20} />
      </button>

      <button 
        className="w-11 h-11 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all"
      >
        <MoreVertical size={20} />
      </button>

      <div className="h-6 w-[1px] bg-slate-800 mx-1" />

      <button 
        onClick={() => router.push('/dashboard')}
        className="h-11 px-4 bg-red-600 text-white hover:bg-red-500 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20 transition-all font-bold text-[10px] uppercase tracking-widest gap-2"
      >
        <PhoneOff size={20} />
        <span>End Call</span>
      </button>
    </div>
  );
};

export default ControlBar;
