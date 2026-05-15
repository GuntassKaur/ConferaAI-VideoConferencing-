'use client';

import React, { useState } from 'react';
import { 
  useTracks, 
  VideoTrack, 
  AudioTrack,
  DisconnectButton,
  TrackToggle,
  useIsSpeaking,
  useLocalParticipant,
} from '@livekit/components-react';
import { Track, RoomEvent } from 'livekit-client';
import { 
  Layout, 
  Users, 
  PhoneOff, 
  MonitorUp, 
  Smile, 
  MoreHorizontal,
  MicOff,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SilentMode from './video/SilentMode';
import MeetingHealthIndicator from './video/MeetingHealthIndicator';
import { useMeetingHealth } from '@/hooks/useMeetingHealth';
import { useParams } from 'next/navigation';

export default function DynamicVideoGrid() {
  const [isSpeakerView, setIsSpeakerView] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isSilentMode, setIsSilentMode] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);

  const { localParticipant } = useLocalParticipant();
  const params = useParams();
  const roomId = (params?.roomId as string) || 'room';

  // Meeting Health (host only — determined by checking if localParticipant is host)
  const isHost = localParticipant?.permissions?.canPublish ?? true;
  const healthData = useMeetingHealth(roomId, reactionCount);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false }
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false }
  );

  const activeSpeakerTrack = tracks.find(track => track.participant.isSpeaking) || tracks[0];

  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-2 grid-rows-1';
    if (count <= 4) return 'grid-cols-2 grid-rows-2';
    return 'grid-cols-3 grid-rows-3';
  };

  const handleReactionSend = (emoji: string) => {
    setReactionCount(c => c + 1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#09090b] relative overflow-hidden group">

      {/* Meeting Health Indicator — top right, host only */}
      {isHost && (
        <MeetingHealthIndicator healthData={healthData} />
      )}

      {/* Silent Mode overlay + reaction bubbles */}
      <SilentMode
        isHost={isHost}
        isSilentMode={isSilentMode}
        onToggleSilentMode={() => setIsSilentMode(v => !v)}
      />

      {/* View Toggle — top right (behind health if host) */}
      <div className={`absolute z-30 flex gap-2 ${isHost ? 'top-20 right-4' : 'top-4 right-4'}`}>
        <button
          onClick={() => setIsSpeakerView(false)}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all ${!isSpeakerView ? 'bg-indigo-600/80 border-indigo-500 text-white shadow-lg' : 'bg-[#18181b]/60 border-[#27272a] text-slate-500 hover:text-white'}`}
          title="Grid View"
        >
          <Users size={16} />
        </button>
        <button
          onClick={() => setIsSpeakerView(true)}
          className={`p-2 rounded-xl backdrop-blur-md border transition-all ${isSpeakerView ? 'bg-indigo-600/80 border-indigo-500 text-white shadow-lg' : 'bg-[#18181b]/60 border-[#27272a] text-slate-500 hover:text-white'}`}
          title="Speaker View"
        >
          <Layout size={16} />
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-hidden mb-20">
        {isSpeakerView ? (
          <div className="flex flex-col md:flex-row gap-4 w-full h-full max-w-[1600px]">
            <div className="w-full md:w-[75%] h-full">
              {activeSpeakerTrack && <CustomParticipantTile track={activeSpeakerTrack} isLarge />}
            </div>
            <div className="w-full md:w-[25%] flex flex-row md:flex-col gap-3 overflow-y-auto custom-scrollbar p-1">
              <AnimatePresence mode="popLayout">
                {tracks.filter(t => t.participant.identity !== activeSpeakerTrack?.participant.identity).map((track) => (
                  <motion.div
                    key={track.participant.identity + track.source}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex-shrink-0 w-[200px] md:w-full aspect-video"
                  >
                    <CustomParticipantTile track={track} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className={`w-full h-full max-w-[1400px] mx-auto grid gap-3 transition-all duration-700 ${getGridClass(tracks.length)}`}>
            <AnimatePresence mode="popLayout">
              {tracks.map((track) => (
                <motion.div
                  key={track.participant.identity + track.source}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full h-full"
                >
                  <CustomParticipantTile track={track} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 2030 Floating Pill Control Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-[#18181b]/90 backdrop-blur-2xl border border-[#27272a] rounded-[24px] px-5 py-3 flex items-center gap-2 shadow-2xl shadow-black/50"
        >
          {/* Mic + Camera */}
          <div className="flex items-center gap-1.5">
            <TrackToggle
              source={Track.Source.Microphone}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all bg-[#27272a] hover:bg-[#3f3f46] text-white data-[state=off]:bg-rose-600/20 data-[state=off]:text-rose-500 border border-transparent"
            >
              <AudioBars />
            </TrackToggle>
            <TrackToggle
              source={Track.Source.Camera}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all bg-[#27272a] hover:bg-[#3f3f46] text-white data-[state=off]:bg-rose-600/20 data-[state=off]:text-rose-500 border border-transparent"
            />
          </div>

          {/* Screen + Reactions + More */}
          <div className="flex items-center gap-1.5 px-3 border-x border-[#27272a]">
            <TrackToggle
              source={Track.Source.ScreenShare}
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all bg-[#27272a] hover:bg-[#3f3f46] text-white data-[state=off]:bg-indigo-600 border border-transparent"
            >
              <MonitorUp size={18} />
            </TrackToggle>

            {/* Reactions popover */}
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border border-transparent ${showReactions ? 'bg-indigo-600 text-white' : 'bg-[#27272a] hover:bg-[#3f3f46] text-white'}`}
              >
                <Smile size={18} />
              </button>
              <AnimatePresence>
                {showReactions && (
                  <motion.div
                    initial={{ y: 10, opacity: 0, scale: 0.85 }}
                    animate={{ y: -60, opacity: 1, scale: 1 }}
                    exit={{ y: 10, opacity: 0, scale: 0.85 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="absolute left-1/2 -translate-x-1/2 bg-[#18181b] border border-[#27272a] rounded-2xl p-2 flex gap-2 shadow-2xl"
                  >
                    {['🔥', '👏', '❤️', '😂', '😮'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => { handleReactionSend(emoji); setShowReactions(false); }}
                        className="w-9 h-9 flex items-center justify-center hover:bg-[#27272a] rounded-xl transition-all text-lg hover:scale-125 active:scale-90"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all bg-[#27272a] hover:bg-[#3f3f46] text-white border border-transparent">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Leave */}
          <DisconnectButton className="px-5 h-11 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl transition-all flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-600/20">
            <PhoneOff size={16} /> Leave
          </DisconnectButton>
        </motion.div>
      </div>
    </div>
  );
}

// ── Custom Participant Tile ────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomParticipantTile({ track, isLarge = false }: { track: any; isLarge?: boolean }) {
  const participant = track.participant;
  const isSpeaking = useIsSpeaking(participant);
  const isVideoMuted = !participant.isCameraEnabled;
  const isAudioMuted = !participant.isMicrophoneEnabled;
  const displayName = participant.name || participant.identity || 'Guest Node';

  return (
    <motion.div
      animate={{ scale: isSpeaking ? 1.01 : 1 }}
      className={`w-full h-full relative rounded-2xl overflow-hidden bg-[#111113] border transition-all duration-500 group ${
        isSpeaking ? 'border-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.15)] z-10' : 'border-[#27272a]'
      }`}
    >
      {/* Video / Avatar */}
      {isVideoMuted ? (
        <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0 bg-[#09090b]">
          <motion.div
            animate={isSpeaking ? { scale: [1, 1.08, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`${isLarge ? 'w-36 h-36' : 'w-20 h-20'} rounded-full bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center`}
          >
            <span className={`${isLarge ? 'text-5xl' : 'text-2xl'} font-black text-indigo-500 uppercase`}>
              {displayName.charAt(0)}
            </span>
          </motion.div>
          <p className="mt-3 text-[9px] font-black text-[#71717a] uppercase tracking-[0.3em]">Video Off</p>
        </div>
      ) : (
        <VideoTrack trackRef={track} className="w-full h-full object-cover absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity" />
      )}

      <AudioTrack trackRef={track} />

      {/* Mute Badge — top right */}
      {isAudioMuted && (
        <div className="absolute top-3 right-3 px-2 py-1 bg-rose-600/80 backdrop-blur-xl rounded-lg flex items-center gap-1.5 border border-rose-500/40 z-20">
          <MicOff size={10} className="text-white" />
          <span className="text-[8px] font-black text-white uppercase tracking-tighter">Muted</span>
        </div>
      )}

      {/* Name Pill — bottom left */}
      <div className="absolute bottom-3 left-3 z-20 max-w-[85%]">
        <div className="px-3 py-1.5 rounded-2xl bg-[#09090b]/70 backdrop-blur-2xl border border-white/5 flex items-center gap-2 shadow-xl">
          <div className="flex items-center gap-[2px]">
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={isSpeaking ? { height: [3, 10, 3] } : { height: 3 }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                className="w-[2px] bg-indigo-500 rounded-full"
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-white truncate tracking-tight">{displayName}</span>
          {participant.isLocal && <span className="text-[9px] text-indigo-400/60 font-black uppercase ml-1">You</span>}
        </div>
      </div>

      {/* Speaking ring */}
      {isSpeaking && (
        <div className="absolute inset-0 ring-2 ring-indigo-500 rounded-2xl pointer-events-none z-10 shadow-[inset_0_0_30px_rgba(99,102,241,0.15)]" />
      )}

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] z-10 bg-[length:100%_2px]" />
    </motion.div>
  );
}

function AudioBars() {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3].map(i => (
        <motion.div
          key={i}
          animate={{ height: [6, 14, 6] }}
          transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
          className="w-[2px] bg-white rounded-full"
        />
      ))}
    </div>
  );
}
