"use client";

export const dynamic = 'force-dynamic';

import { use, useState, useEffect } from 'react';
import { useRoom } from '@/hooks/useRoom';
import { useMediaStream } from '@/hooks/useMediaStream';
import { usePeerConnection } from '@/hooks/usePeerConnection';
import { VideoTile } from '@/components/VideoTile';
import { TranscriptPanel } from '@/components/TranscriptPanel';
import { MeetingTimeline } from '@/components/MeetingTimeline';
import { ScreenShareView } from '@/components/ScreenShareView';
import { BreakoutManager } from '@/components/BreakoutManager';
import { LiveCaptions } from '@/components/LiveCaptions';
import { EngagementSidebar } from '@/components/EngagementSidebar';
import { PreMeetingBriefing } from '@/components/PreMeetingBriefing';
import { useTranscriptStore } from '@/store/useTranscriptStore';
import { useEngagementStore } from '@/store/useEngagementStore';
import { useScreenShare } from '@/hooks/useScreenShare';
import { Loader2, Users, Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff, MessageSquareText, Network, SmilePlus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [hasJoined, setHasJoined] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [isBreakoutOpen, setIsBreakoutOpen] = useState(false);
  const [isEngagementOpen, setIsEngagementOpen] = useState(false);
  const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
  
  const { setMeetingStartTime, segments, addHighlights } = useTranscriptStore();
  const { addReaction, addPoll, votePoll, submitMood, raiseHand, lowerHand } = useEngagementStore();
  
  const { status, participants, error, roomData, socket } = useRoom(id);
  
  const { 
    stream: localStream, 
    isMuted: isAudioMuted, 
    isVideoOff: isVideoMuted, 
    toggleMic: toggleAudio, 
    toggleVideo 
  } = useMediaStream();
  
  const { peers: remoteStreams, quality } = usePeerConnection(socket?.id || null, localStream, socket);
  const { isSharing, screenStream, startSharing, stopSharing, captureFrame, screenContext, annotations } = useScreenShare();

  // Meeting duration timer
  const [meetingDuration, setMeetingDuration] = useState(0);
  useEffect(() => {
    if (!hasJoined) return;
    const interval = setInterval(() => setMeetingDuration(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [hasJoined]);

  const getTimerColor = () => {
    if (meetingDuration > 3600) return 'text-red-400';
    if (meetingDuration > 2700) return 'text-yellow-400';
    return 'text-emerald-400';
  };
  
  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (status === 'connected') {
      setMeetingStartTime(Date.now());
    }
  }, [status, setMeetingStartTime]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      const emojiMap: Record<string, string> = { '1': '👍', '2': '❤️', '3': '😂', '4': '😮', '5': '👏', '6': '🔥' };
      const emoji = emojiMap[e.key];
      if (emoji) {
        const reaction = { id: Math.random().toString(), emoji, participantId: socket?.id || 'local', timestamp: Date.now() };
        addReaction(reaction);
        socket?.emit('engagement-reaction', reaction);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addReaction, socket]);

  const handleLeave = () => {
    window.location.href = '/';
  };

  const allParticipants = ['local', ...Array.from(participants)];
  const totalCount = allParticipants.length;

  let gridClass = 'grid gap-4 w-full h-full p-4';
  if (isSharing) {
    gridClass = 'flex flex-col space-y-4 w-[300px] h-full overflow-y-auto p-4 shrink-0';
  } else if (totalCount === 1) {
    gridClass = 'flex items-center justify-center w-full h-full p-8';
  } else if (totalCount <= 4) {
    gridClass = 'grid grid-cols-2 gap-4 w-full h-full p-6';
  } else if (totalCount <= 9) {
    gridClass = 'grid grid-cols-3 gap-4 w-full h-full p-6';
  } else {
    gridClass = 'grid grid-cols-4 gap-4 w-full h-full p-6 overflow-y-auto';
  }

  if (!hasJoined) {
    return <PreMeetingBriefing roomId={id} onJoin={() => setHasJoined(true)} />;
  }

  if (status === 'connecting') {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex flex-col items-center justify-center text-white relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4 relative z-10" />
        <p className="text-white/60 relative z-10">Connecting to secure mesh network...</p>
      </div>
    );
  }

  if (status === 'failed' || error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl max-w-md text-center space-y-4">
          <h2 className="text-xl font-semibold text-red-400">Connection Failed</h2>
          <p className="text-white/60">{error || 'Could not connect to the room'}</p>
          <button onClick={() => window.location.href = '/'} className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden flex flex-col relative font-sans">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none z-0" />
      
      <header className="relative z-20 h-16 bg-white/[0.02] border-b border-white/[0.05] flex items-center justify-between px-6 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/[0.05] border border-white/[0.1] px-3 py-1.5 rounded-lg backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <input type="text" defaultValue={roomData?.room_name || "ConferaAI Strategic Sync"} className="bg-transparent border-none outline-none text-white font-medium text-sm w-48 focus:ring-0" />
          </div>
          <div className="flex items-center space-x-2 text-sm font-medium bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
            <Clock className={`w-4 h-4 ${getTimerColor()}`} />
            <span className={getTimerColor()}>{formatTimer(meetingDuration)}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-indigo-500/20 transition-colors">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse mr-2" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">AI Active</span>
          </div>
          <div className="flex items-center text-white/70 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
            <Users className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{totalCount}</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className={`flex-1 flex ${isSharing ? 'flex-row' : 'flex-col'} transition-all duration-500`}>
          <AnimatePresence>
            {isSharing && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full flex-1 min-h-0 p-4">
                <ScreenShareView stream={screenStream} context={screenContext} annotations={annotations} captureFrame={captureFrame} socket={socket} roomId={id} participantId={socket?.id || 'local'} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className={gridClass}>
            {allParticipants.map((pId) => {
              const isLocal = pId === 'local';
              const stream = isLocal ? localStream : remoteStreams[pId] || null;
              const isActive = activeSpeakerId === pId;
              let tileClass = "w-full h-full min-h-[200px] transition-all duration-500 relative";
              if (!isSharing && totalCount >= 2 && totalCount <= 4 && isActive) tileClass += " col-span-2 row-span-2";
              else if (!isSharing && totalCount === 1) tileClass += " max-w-5xl mx-auto max-h-[80vh]";
              return (
                <motion.div key={pId} layout className={tileClass}>
                  <VideoTile stream={stream} isLocal={isLocal} participantId={pId} isActiveSpeaker={isActive} />
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {isBreakoutOpen && <BreakoutManager socket={socket} participants={[]} isHost={true} onClose={() => setIsBreakoutOpen(false)} roomId={id} />}
          {isTranscriptOpen && <TranscriptPanel onClose={() => setIsTranscriptOpen(false)} />}
          {isEngagementOpen && <EngagementSidebar onClose={() => setIsEngagementOpen(false)} socket={socket} localParticipantId={socket?.id || 'local'} />}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] px-6 py-3 rounded-full flex items-center space-x-3 shadow-2xl">
          <div className="relative group">
            <button onClick={toggleAudio} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isAudioMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`} title="Toggle Audio">
              {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            {!isAudioMuted && activeSpeakerId === 'local' && <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-50 pointer-events-none" />}
          </div>
          <button onClick={toggleVideo} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isVideoMuted ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white hover:bg-white/20'}`} title="Toggle Video">
            {isVideoMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button onClick={isSharing ? stopSharing : startSharing} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isSharing ? 'bg-indigo-500/30 text-indigo-300 ring-2 ring-indigo-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`} title="Share Screen">
            <MonitorUp className="w-5 h-5" />
          </button>
          <button onClick={() => setIsBreakoutOpen(!isBreakoutOpen)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isBreakoutOpen ? 'bg-amber-500/30 text-amber-300 ring-2 ring-amber-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`} title="Breakout Rooms">
            <Network className="w-5 h-5" />
          </button>
          <button onClick={() => setIsEngagementOpen(!isEngagementOpen)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isEngagementOpen ? 'bg-pink-500/30 text-pink-300 ring-2 ring-pink-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`} title="Reactions & Polls">
            <SmilePlus className="w-5 h-5" />
          </button>
          <button onClick={() => setIsTranscriptOpen(!isTranscriptOpen)} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 ${isTranscriptOpen ? 'bg-blue-500/30 text-blue-300 ring-2 ring-blue-500/50' : 'bg-white/10 text-white hover:bg-white/20'}`} title="AI Sidebar">
            <MessageSquareText className="w-5 h-5" />
          </button>
          <div className="w-px h-8 bg-white/10 mx-2" />
          <button onClick={handleLeave} className="w-16 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all ml-2" title="Leave Meeting">
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
