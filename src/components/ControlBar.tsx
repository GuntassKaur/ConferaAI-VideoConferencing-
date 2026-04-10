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
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl backdrop-blur-xl">
      <button 
        onClick={() => setMicOn(!micOn)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white hover:bg-red-600'}`}
      >
        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      <button 
        onClick={() => setVideoOn(!videoOn)}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${videoOn ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-500 text-white hover:bg-red-600'}`}
      >
        {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      <button className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
        <ScreenShare size={20} />
      </button>

      <div className="h-8 w-[1px] bg-white/10 mx-2" />

      <button className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all">
        <MoreVertical size={20} />
      </button>

      <button 
        onClick={() => router.push('/dashboard')}
        className="w-12 h-12 rounded-full bg-red-600 text-white hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-600/20 active:scale-95 transition-all"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
};

export default ControlBar;
