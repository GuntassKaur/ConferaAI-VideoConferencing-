'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { useRoomStore } from '@/store/useRoomStore';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, 
  SmilePlus, MessageSquare, ShieldCheck, Share2, Hand, Users, Settings2,
  Zap, Layers, LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomBar = () => {
  const { isMicOn, toggleMic, isCamOn, toggleCam, localStream } = useMeeting();
  const { focusMode, toggleFocusMode, viewMode, setViewMode } = useRoomStore();

  return (
    <div className="flex items-center justify-center w-full px-10 pb-8 pointer-events-none">
      <div className="flex items-center gap-3 px-6 py-4 bg-[#1E293B]/90 backdrop-blur-xl border border-white/10 rounded-[28px] shadow-2xl pointer-events-auto">
         
         <button 
           onClick={toggleMic}
           className={`control-btn ${!isMicOn ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'control-btn-active'}`}
           title="Toggle Microphone"
         >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
         </button>

         <button 
           onClick={toggleCam}
           className={`control-btn ${!isCamOn ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'control-btn-active'}`}
           title="Toggle Camera"
         >
            {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
         </button>

         <div className="w-px h-8 bg-white/10 mx-2" />

         <button 
           className="control-btn"
           title="Share Screen"
         >
            <MonitorUp className="w-5 h-5" />
         </button>

         <button 
           onClick={toggleFocusMode}
           className={`control-btn ${focusMode ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' : ''}`}
           title="AI Focus Mode"
         >
            <Zap className="w-5 h-5" />
         </button>

         <div className="w-px h-8 bg-white/10 mx-2" />

         <button 
            onClick={() => {
              localStream?.getTracks().forEach(track => track.stop());
              window.location.href = '/dashboard';
            }}
            className="w-14 h-12 flex items-center justify-center rounded-2xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all"
            title="Leave Meeting"
         >
            <PhoneOff className="w-5 h-5" />
         </button>

      </div>
    </div>
  );
};
