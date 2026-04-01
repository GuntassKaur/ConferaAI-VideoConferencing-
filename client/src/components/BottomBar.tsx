'use client';

import React from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Button } from '@/components/ui/Button';
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
  Grid
} from 'lucide-react';

export const BottomBar = ({ activePanel, setActivePanel }: { 
  activePanel: 'chat' | 'participants' | 'recap' | 'none',
  setActivePanel: (p: 'chat' | 'participants' | 'recap' | 'none') => void 
}) => {
  const { isMicOn, isCamOn, isScreenSharing, toggleMic, toggleCam, toggleScreenShare, leaveRoom } = useMeeting();

  return (
    <div className="h-20 glass-morphism border-t border-white/5 flex items-center justify-between px-8 z-20">
      
      {/* Left Context Info */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex flex-col">
          <span className="font-bold text-sm outfit-font">Q4 Roadmap Planning</span>
          <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Recording • Encrypted
          </span>
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-3">
        <Button 
          variant={isMicOn ? 'secondary' : 'danger'} 
          size="icon" 
          onClick={toggleMic}
          className={`h-12 w-12 rounded-2xl ${isMicOn ? 'bg-white/5 border-white/10' : ''}`}
        >
          {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </Button>
        <Button 
          variant={isCamOn ? 'secondary' : 'danger'} 
          size="icon" 
          onClick={toggleCam}
          className={`h-12 w-12 rounded-2xl ${isCamOn ? 'bg-white/5 border-white/10' : ''}`}
        >
          {isCamOn ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={toggleScreenShare}
          className={`h-12 w-12 rounded-2xl bg-white/5 border-white/10 ${isScreenSharing ? 'text-primary' : ''}`}
        >
          <ScreenShare className="w-5 h-5" />
        </Button>
        <Button variant="secondary" size="icon" className="h-12 w-12 rounded-2xl bg-white/5 border-white/10">
          <Smile className="w-5 h-5" />
        </Button>
        <div className="w-px h-8 bg-white/5 mx-2" />
        <Button 
          onClick={leaveRoom}
          className="h-12 px-6 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 gap-2 font-bold"
        >
          <LogOut className="w-5 h-5" /> End Call
        </Button>
      </div>

      {/* Right Feature Toggles */}
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-10 w-10 rounded-xl ${activePanel === 'chat' ? 'bg-primary/20 text-primary' : 'text-zinc-500'}`}
          onClick={() => setActivePanel(activePanel === 'chat' ? 'none' : 'chat')}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-10 w-10 rounded-xl ${activePanel === 'recap' ? 'bg-primary/20 text-primary' : 'text-zinc-500'}`}
          onClick={() => setActivePanel(activePanel === 'recap' ? 'none' : 'recap')}
        >
          <Sparkles className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-10 w-10 rounded-xl ${activePanel === 'participants' ? 'bg-primary/20 text-primary' : 'text-zinc-500'}`}
          onClick={() => setActivePanel(activePanel === 'participants' ? 'none' : 'participants')}
        >
          <Users className="w-5 h-5" />
        </Button>
        <div className="w-px h-8 bg-white/5 mx-2" />
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-zinc-500">
          <Grid className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
