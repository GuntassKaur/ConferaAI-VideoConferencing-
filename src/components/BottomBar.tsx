'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomBar = () => {
  const { isMicOn, isCamOn, toggleMic, toggleCam, leaveRoom } = useMeeting();

  // Floating minimal bottom bar
  return (
    <div className="flex items-center justify-center gap-4 w-full h-full p-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMic}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm
          ${isMicOn 
            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' 
            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}`}
      >
        {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleCam}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm
          ${isCamOn 
            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' 
            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'}`}
      >
        {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
      </motion.button>

      <div className="w-px h-8 bg-slate-200 mx-2" />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
            leaveRoom();
            window.location.href = '/dashboard';
        }}
        className="px-8 h-14 rounded-full flex items-center justify-center gap-2 bg-red-600 text-white font-medium hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 transition-all font-outfit"
      >
        <PhoneOff className="w-5 h-5" />
        <span>End Call</span>
      </motion.button>
    </div>
  );
};
