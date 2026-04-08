'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { useRoomStore } from '@/store/useRoomStore';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, 
  SmilePlus, MessageSquare, ShieldCheck, Share2, Hand, Users, Settings2,
  Maximize, Layers, LayoutGrid, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomBar = () => {
  const { isMicOn, toggleMic, isCamOn, toggleCam, localStream } = useMeeting();
  const { focusMode, toggleFocusMode, viewMode, setViewMode } = useRoomStore();

  const ControlButton = ({ active, icon: Icon, onClick, colorClass, danger, label }: any) => (
    <motion.button
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all cyber-glass border border-white/5 relative group p-3.5
        ${danger ? 'hover:bg-red-500 hover:text-white hover:border-red-500' : 'hover:bg-[#00f2fe]/20 hover:text-[#00f2fe] hover:border-[#00f2fe]/50'}
        ${!active && !danger ? 'bg-red-500/10 text-red-500 border-red-500/30' : active && label?.includes('Mode') ? 'bg-[#00f2fe]/20 text-[#00f2fe] border-[#00f2fe]/50 shadow-[0_0_20px_rgba(0,242,254,0.3)]' : 'text-white/40'}`}
    >
      <Icon className="w-full h-full stroke-[2.5]" />
      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 cyber-glass backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-white/5 whitespace-nowrap z-50`}>
          {label || (danger ? 'End Session' : 'Toggle Control')}
      </div>
    </motion.button>
  );

  return (
    <div className="flex items-center justify-center w-full px-10 relative">
      {/* Encryption Badge Offset */}
      <div className="absolute left-10 hidden xl:flex items-center gap-4 py-3 px-6 cyber-glass rounded-[22px] border-[#00f2fe]/20 text-[#00f2fe] bg-[#00f2fe]/5 shadow-[0_0_20px_rgba(0,242,254,0.1)]">
         <ShieldCheck className="w-5 h-5 animate-pulse" />
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Encrypted Session</span>
            <span className="text-xs font-bold leading-none">Security: High-Tier</span>
         </div>
      </div>

      {/* Main Control Cluster */}
      <div className="flex items-center gap-6 px-10 py-6 cyber-glass border border-white/10 rounded-[32px] shadow-2xl relative">
         <ControlButton active={isMicOn} icon={isMicOn ? Mic : MicOff} onClick={toggleMic} label="Microphone" />
         <ControlButton active={isCamOn} icon={isCamOn ? Video : VideoOff} onClick={toggleCam} label="Camera" />
         
         <div className="w-px h-10 bg-white/5 mx-2" />
         
         {/* Advanced Features (Prompt Requested) */}
         <ControlButton 
            active={focusMode} 
            icon={Zap} 
            onClick={toggleFocusMode} 
            label={focusMode ? "Focus Mode: Enabled" : "Enable Focus Mode"} 
         />
         <ControlButton 
            active={viewMode === 'together'} 
            icon={viewMode === 'together' ? LayoutGrid : Layers} 
            onClick={() => setViewMode(viewMode === 'grid' ? 'together' : 'grid')} 
            label={viewMode === 'together' ? "View: Together Mode" : "Switch to Together View"}
         />
         
         <div className="w-px h-10 bg-white/5 mx-2" />
         
         <ControlButton active icon={MonitorUp} onClick={() => {}} label="Screen Share" />
         <ControlButton active icon={Hand} onClick={() => {}} label="Raise Hand" />
         
         <div className="w-px h-10 bg-white/5 mx-2" />
         
         <motion.button 
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStream?.getTracks().forEach(track => track.stop());
              window.location.href = '/dashboard';
            }}
            className="px-8 h-14 rounded-[20px] bg-red-500 text-white font-black hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition-all uppercase tracking-widest text-[10px] flex items-center gap-3 border border-red-400/30"
         >
            <PhoneOff className="w-5 h-5 stroke-[3]" /> Leave Room
         </motion.button>
      </div>

      {/* Right Side Settings Offset */}
      <div className="absolute right-10 hidden xl:flex items-center gap-4">
         <button className="flex items-center gap-3 py-3 px-6 cyber-glass rounded-[22px] text-white/40 hover:text-white transition-all border border-white/5">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-widest">Participants</span>
         </button>
         <button className="w-14 h-14 flex items-center justify-center cyber-glass rounded-[22px] text-white/40 hover:text-white transition-all border border-white/5 p-4">
            <Settings2 className="w-full h-full" />
         </button>
      </div>
    </div>
  );
};
