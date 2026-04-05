'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Button } from '@/components/ui/Button';
import { EmojiReactions, FloatingEmoji } from '@/components/EmojiReactions';
import { 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff, 
  ScreenShare, 
  LogOut, 
  MessageSquare, 
  Users, 
  Sparkles, 
  MoreVertical,
  Smile,
  BarChart,
  Grid,
  Languages,
  PieChart,
  Zap
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const BottomBar = ({ activePanel, setActivePanel }: { 
  activePanel: 'chat' | 'participants' | 'recap' | 'none' | 'transcription' | 'breakout' | 'polls',
  setActivePanel: (p: 'chat' | 'participants' | 'recap' | 'none' | 'transcription' | 'breakout' | 'polls') => void 
}) => {
  const { isMicOn, isCamOn, isScreenSharing, toggleMic, toggleCam, toggleScreenShare, leaveRoom } = useMeeting();
  const [showEmojis, setShowEmojis] = useState(false);
  const [reactions, setReactions] = useState<{id: number, emoji: string, x: number}[]>([]);

  const handleReact = (emoji: string) => {
    const id = Date.now();
    setReactions(prev => [...prev, { id, emoji, x: Math.random() * 400 + (window.innerWidth / 2 - 200) }]);
    setShowEmojis(false);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  };

  return (
    <div className="h-24 fluent-glass border-t border-white/5 flex items-center justify-between px-10 z-[50] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.5)]">
      
      {/* Reactions Render */}
      <AnimatePresence>
        {reactions.map(r => (
          <FloatingEmoji key={r.id} emoji={r.emoji} x={r.x} y={100} />
        ))}
      </AnimatePresence>

      {/* Left Info */}
      <div className="hidden lg:flex items-center gap-4 w-1/4">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
           <Zap className="w-6 h-6 text-primary shadow-sm shadow-primary/20" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm outfit-font tracking-tight">Enterprise Strategy Sync</span>
          <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" /> 
            Live • End-to-End Encrypted
          </span>
        </div>
      </div>

      {/* Center Controls */}
      <div className="flex items-center bg-white/[0.03] p-2 rounded-[28px] border border-white/5 gap-2 shadow-inner">
        <Button 
          variant={isMicOn ? 'secondary' : 'danger'} 
          size="icon" 
          onClick={toggleMic}
          className={`h-14 w-14 rounded-2xl transition-all duration-300 ${isMicOn ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'animate-pulse shadow-lg shadow-red-500/20'}`}
        >
          {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </Button>
        <Button 
          variant={isCamOn ? 'secondary' : 'danger'} 
          size="icon" 
          onClick={toggleCam}
          className={`h-14 w-14 rounded-2xl transition-all duration-300 ${isCamOn ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'animate-pulse shadow-lg shadow-red-500/20'}`}
        >
          {isCamOn ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={toggleScreenShare}
          className={`h-14 w-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-all ${isScreenSharing ? 'text-primary ring-2 ring-primary/20' : ''}`}
        >
          <ScreenShare className="w-6 h-6" />
        </Button>
        
        <div className="relative">
          <Button 
            variant="secondary" 
            size="icon" 
            className={`h-14 w-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 transition-all ${showEmojis ? 'bg-primary/20 text-primary' : ''}`}
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <Smile className="w-6 h-6" />
          </Button>
          <AnimatePresence>
            {showEmojis && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: -80, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-0 z-[60]"
              >
                <EmojiReactions onReact={handleReact} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-10 bg-white/10 mx-2" />
        <Button 
          onClick={leaveRoom}
          className="h-14 px-8 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all gap-2 font-bold shadow-lg shadow-red-500/10 active:scale-90"
        >
          <LogOut className="w-5 h-5" /> End
        </Button>
      </div>

      {/* Right Feature Panel Toggles */}
      <div className="flex items-center bg-white/[0.03] p-1.5 rounded-2xl border border-white/5 gap-1.5 w-1/4 justify-end">
        {[
          { id: 'chat', icon: <MessageSquare className="w-5 h-5" /> },
          { id: 'recap', icon: <Sparkles className="w-5 h-5" /> },
          { id: 'transcription', icon: <Languages className="w-5 h-5" /> },
          { id: 'polls', icon: <PieChart className="w-5 h-5" /> },
          { id: 'breakout', icon: <Grid className="w-5 h-5" /> },
          { id: 'participants', icon: <Users className="w-5 h-5" /> },
        ].map(panel => (
          <Button 
            key={panel.id}
            variant="ghost" 
            size="icon" 
            className={`h-10 w-10 rounded-xl transition-all duration-300 ${activePanel === panel.id ? 'bg-primary/20 text-primary shadow-sm shadow-primary/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            onClick={() => setActivePanel(activePanel === panel.id ? 'none' : panel.id as any)}
          >
            {panel.icon}
          </Button>
        ))}
      </div>
    </div>
  );
};
