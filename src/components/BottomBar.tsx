'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, 
  SmilePlus, MessageSquare, ShieldCheck, Share2, Hand, Users, Settings2 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomBar = () => {
  const { isMicOn, toggleMic, isCamOn, toggleCam, localStream } = useMeeting();

  const ControlButton = ({ active, icon: Icon, onClick, colorClass, danger }: any) => (
    <motion.button
      whileHover={{ y: -5, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`w-14 h-14 rounded-[20px] flex items-center justify-center transition-all glass-card border border-white/5 relative group p-3.5
        ${danger ? 'hover:bg-red-500 hover:text-white hover:border-red-500' : 'hover:bg-primary/20 hover:text-primary hover:border-primary/50'}
        ${!active && !danger ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'text-muted-foreground'}`}
    >
      <Icon className="w-full h-full stroke-[2.5]" />
      <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-white/5 whitespace-nowrap`}>
          Toggle {danger ? 'Session' : 'Control'}
      </div>
    </motion.button>
  );

  return (
    <div className="flex items-center justify-center w-full px-10 relative">
      {/* Encryption Badge Offset */}
      <div className="absolute left-10 hidden xl:flex items-center gap-4 py-3 px-6 glass-card rounded-[22px] border-emerald-500/20 text-emerald-400 bg-emerald-500/5">
         <ShieldCheck className="w-5 h-5" />
         <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 leading-none mb-1">Encrypted Room</span>
            <span className="text-xs font-bold leading-none">AES-256 Enabled</span>
         </div>
      </div>

      {/* Main Control Cluster */}
      <div className="flex items-center gap-6 px-10 py-6 glass-card border-white/10 rounded-[32px] neon-glow relative">
         <ControlButton active={isMicOn} icon={isMicOn ? Mic : MicOff} onClick={toggleMic} />
         <ControlButton active={isCamOn} icon={isCamOn ? Video : VideoOff} onClick={toggleCam} />
         
         <div className="w-px h-10 bg-white/5 mx-2" />
         
         <ControlButton active icon={MonitorUp} onClick={() => {}} />
         <ControlButton active icon={Share2} onClick={() => {}} />
         <ControlButton active icon={Hand} onClick={() => {}} />
         <ControlButton active icon={SmilePlus} onClick={() => {}} />
         
         <div className="w-px h-10 bg-white/5 mx-2" />
         
         <motion.button 
            whileHover={{ y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              localStream?.getTracks().forEach(track => track.stop());
              window.location.href = '/dashboard';
            }}
            className="px-10 h-14 rounded-[20px] bg-red-500 text-white font-black hover:bg-red-600 shadow-[0_10px_30px_rgba(239,68,68,0.3)] transition-all uppercase tracking-widest text-xs flex items-center gap-3 border border-red-400/30"
         >
            <PhoneOff className="w-5 h-5 stroke-[3]" /> Leave Room
         </motion.button>
      </div>

      {/* Right Side Settings Offset */}
      <div className="absolute right-10 hidden xl:flex items-center gap-4">
         <button className="flex items-center gap-3 py-3 px-6 glass-card rounded-[22px] text-muted-foreground hover:text-white transition-all">
            <Users className="w-5 h-5" />
            <span className="text-xs font-bold">Participants</span>
         </button>
         <button className="w-14 h-14 flex items-center justify-center glass-card rounded-[22px] text-muted-foreground hover:text-white transition-all p-4">
            <Settings2 className="w-full h-full" />
         </button>
      </div>
    </div>
  );
};
