'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, SmilePlus } from 'lucide-react';

export const BottomBar = () => {
  const { isMicOn, toggleMic, isCamOn, toggleCam, localStream } = useMeeting();

  return (
    <div className="flex items-center gap-4 sm:gap-6 px-6 sm:px-10 py-5 bg-[var(--card)] border border-[var(--border)] rounded-[26px] premium-shadow backdrop-blur-xl">
       <button 
          onClick={toggleMic}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] flex items-center justify-center transition-all ${isMicOn ? 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--background)] border border-[var(--border)]' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-inner'}`}
       >
          {isMicOn ? <Mic className="w-5 h-5 sm:w-6 sm:h-6" /> : <MicOff className="w-5 h-5 sm:w-6 sm:h-6" />}
       </button>
       <button 
          onClick={toggleCam}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] flex items-center justify-center transition-all ${isCamOn ? 'bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--background)] border border-[var(--border)]' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-inner'}`}
       >
          {isCamOn ? <Video className="w-5 h-5 sm:w-6 sm:h-6" /> : <VideoOff className="w-5 h-5 sm:w-6 sm:h-6" />}
       </button>

       {/* Screen Share Mock */}
       <button className="hidden sm:flex w-14 h-14 rounded-[20px] items-center justify-center bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--background)] border border-[var(--border)] transition-all">
          <MonitorUp className="w-6 h-6" />
       </button>

       {/* Reactions Mock */}
       <button className="hidden sm:flex w-14 h-14 rounded-[20px] items-center justify-center bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--background)] border border-[var(--border)] transition-all">
          <SmilePlus className="w-6 h-6" />
       </button>

       {/* End Call */}
       <div className="w-px h-10 bg-[var(--border)] mx-2" />
       <button 
          onClick={() => {
            localStream?.getTracks().forEach(track => track.stop());
            window.location.href = '/dashboard';
          }}
          className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-[20px] bg-red-500 text-white font-bold hover:bg-red-600 shadow-[0_10px_20px_-5px_rgba(239,68,68,0.4)] flex items-center gap-3 transition-colors uppercase tracking-widest text-xs sm:text-sm"
       >
          <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Leave</span>
       </button>
    </div>
  );
};
