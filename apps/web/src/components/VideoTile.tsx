import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Signal, SignalHigh, SignalLow, SignalMedium } from 'lucide-react';
import { useTranscription } from '@/hooks/useTranscription';
import { ReactionOverlay } from './ReactionOverlay';

interface VideoTileProps {
  stream: MediaStream | null;
  name?: string;
  isLocal?: boolean;
  participantId?: string;
  isActiveSpeaker?: boolean;
  quality?: { rtt: number; packetLoss: number };
}

export function VideoTile({ stream, name, isLocal = false, participantId, isActiveSpeaker = false, quality }: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volume, setVolume] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-transcribe local user when they speak
  useTranscription('local', isLocal && isSpeaking && !isAudioMuted);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // VAD (Voice Activity Detection)
  useEffect(() => {
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    const track = audioTracks[0];
    setIsAudioMuted(!track.enabled);
    
    const handleMuteChange = () => setIsAudioMuted(!track.enabled);
    track.addEventListener('mute', handleMuteChange);
    track.addEventListener('unmute', handleMuteChange);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      
      // Clone stream for analysis to prevent local audio from looping back in speakers
      const sourceStream = isLocal ? new MediaStream([track]) : stream;
      const source = audioContext.createMediaStreamSource(sourceStream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let animationFrameId: number;

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        
        const average = sum / dataArray.length;
        setVolume(average);

        // Active speaker threshold
        const threshold = 15;
        if (average > threshold && track.enabled) {
          setIsSpeaking(true);
        } else {
          setIsSpeaking(false);
        }

        animationFrameId = requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();

      return () => {
        cancelAnimationFrame(animationFrameId);
        if (audioContext.state !== 'closed') {
          audioContext.close();
        }
        track.removeEventListener('mute', handleMuteChange);
        track.removeEventListener('unmute', handleMuteChange);
      };
    } catch (err) {
      console.warn("VAD setup failed", err);
    }
  }, [stream, isLocal]);

  // Network quality simulation (could be wired to WebRTC stats)
  const getQualityDots = () => {
    // 3 dots logic (mocked randomly for demo)
    const q = isLocal ? 3 : Math.floor(Math.random() * 2) + 2; 
    return (
      <div className="flex space-x-0.5 items-end h-3">
        <div className={`w-1 bg-emerald-400 rounded-full ${q >= 1 ? 'h-1.5' : 'h-1 opacity-20'}`} />
        <div className={`w-1 bg-emerald-400 rounded-full ${q >= 2 ? 'h-2.5' : 'h-1 opacity-20'}`} />
        <div className={`w-1 bg-emerald-400 rounded-full ${q >= 3 ? 'h-3' : 'h-1 opacity-20'}`} />
      </div>
    );
  };

  return (
    <div 
      className={`relative w-full h-full bg-zinc-900 overflow-hidden rounded-[20px] transition-all duration-300 ease-out group ${
        isActiveSpeaker ? 'ring-2 ring-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]' : 'border border-white/5 shadow-xl'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className={`w-full h-full object-cover transition-transform duration-700 ${isLocal ? 'scale-x-[-1]' : ''} ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <span className="text-3xl text-indigo-400 font-medium">
              {isLocal ? 'Y' : (participantId?.charAt(0).toUpperCase() || '?')}
            </span>
          </div>
        </div>
      )}

      {/* Hover Options Overlay */}
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center space-x-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md text-xs font-semibold transition-all">Pin</button>
        <button className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-500/30 rounded-xl backdrop-blur-md text-xs font-semibold transition-all">Spotlight</button>
      </div>

      {/* Name Tag (Bottom Left) */}
      <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isActiveSpeaker ? 'bg-purple-400 animate-pulse' : 'bg-transparent'}`} />
        <span className="text-white font-medium text-xs tracking-wide">
          {isLocal ? 'You' : participantId ? `Guest ${participantId.substring(0, 4)}` : 'Connecting...'}
        </span>
        {isLocal && (
          <div className="ml-1 bg-indigo-500 px-1.5 rounded text-[9px] font-bold uppercase tracking-wider text-white">Host</div>
        )}
      </div>

      {/* Status Icons (Top Right) */}
      <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 flex items-center space-x-2">
        {getQualityDots()}
        {!stream?.getAudioTracks()[0]?.enabled && (
          <MicOff className="w-3.5 h-3.5 text-red-400 ml-2" />
        )}
      </div>

      {/* Floating Reactions overlay */}
      <ReactionOverlay participantId={isLocal ? 'local' : participantId || 'unknown'} />
    </div>
  );
}
