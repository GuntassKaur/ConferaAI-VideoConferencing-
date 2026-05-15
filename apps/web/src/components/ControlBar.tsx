'use client';
import React from 'react';
import { 
  Mic, MicOff, Video, VideoOff, 
  PhoneOff, Brain, MessageSquare, Layout,
  MoreHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlBarProps {
  isMicOn: boolean;
  onToggleMic: () => void;
  isCamOn: boolean;
  onToggleCam: () => void;
  isAiOpen: boolean;
  onToggleAi: () => void;
  onEndCall: () => void;
}

export default function ControlBar({
  isMicOn, onToggleMic,
  isCamOn, onToggleCam,
  isAiOpen, onToggleAi,
  onEndCall
}: ControlBarProps) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0, x: '-50%' }}
      animate={{ y: 0, opacity: 1, x: '-50%' }}
      className="fixed bottom-10 left-1/2 z-50 pointer-events-none"
    >
      <div className="bg-[#0F172A]/90 backdrop-blur-2xl px-8 py-5 rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-6 pointer-events-auto">
        {/* Media Controls */}
        <div className="flex items-center gap-3 pr-6 border-r border-white/10">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isMicOn 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
            }`}
            title={isMicOn ? 'Mute' : 'Unmute'}
          >
            {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCam}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isCamOn 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
            }`}
            title={isCamOn ? 'Stop Video' : 'Start Video'}
          >
            {isCamOn ? <Video size={22} /> : <VideoOff size={22} />}
          </motion.button>
        </div>

        {/* Intelligence & Apps */}
        <div className="flex items-center gap-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleAi}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isAiOpen 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
            title="AI Insights"
          >
            <Brain size={22} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <MessageSquare size={22} />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <Layout size={22} />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <MoreHorizontal size={22} />
          </motion.button>
        </div>

        <div className="w-[2px] h-8 bg-white/10 mx-2" />

        {/* Actions */}
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: '#F43F5E' }}
          whileTap={{ scale: 0.95 }}
          onClick={onEndCall}
          className="px-8 h-12 bg-rose-600 text-white font-bold text-xs uppercase tracking-[0.15em] rounded-full flex items-center gap-3 shadow-xl shadow-rose-600/20 transition-all"
        >
          <PhoneOff size={20} />
          End Call
        </motion.button>
      </div>
    </motion.div>
  );
}
