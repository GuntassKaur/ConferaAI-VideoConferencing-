import { useEffect, useRef, useState } from 'react';
import { MicOff, Activity, Maximize2, MoreHorizontal } from 'lucide-react';
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

  // Network quality representation
  const getQualityDots = () => {
    const q = isLocal ? 3 : Math.floor(Math.random() * 2) + 2; 
    return (
      <div className="flex space-x-0.5 items-end h-3 px-2 py-1 bg-[#0B1120]/40 rounded-lg">
        <div className={`w-0.5 bg-emerald-500 rounded-full ${q >= 1 ? 'h-1.5' : 'h-1 opacity-20'}`} />
        <div className={`w-0.5 bg-emerald-500 rounded-full ${q >= 2 ? 'h-2' : 'h-1 opacity-20'}`} />
        <div className={`w-0.5 bg-emerald-500 rounded-full ${q >= 3 ? 'h-2.5' : 'h-1 opacity-20'}`} />
      </div>
    );
  };

  return (
    <div 
      className={`relative w-full h-full bg-[#0B1120] overflow-hidden rounded-2xl transition-all duration-500 ease-out group ${
        isActiveSpeaker ? 'ring-2 ring-indigo-500 shadow-2xl shadow-indigo-500/20' : 'border border-[#1F2937]'
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
          className={`w-full h-full object-cover transition-transform duration-1000 ${isLocal ? 'scale-x-[-1]' : ''} ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#0B1120]">
           <div className={`w-24 h-24 rounded-full flex items-center justify-center border transition-all duration-700 ${isActiveSpeaker ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-[#111827] border-[#1F2937]'}`}>
              <span className={`text-3xl font-bold transition-colors ${isActiveSpeaker ? 'text-indigo-400' : 'text-[#9CA3AF]'}`}>
                 {isLocal ? 'GK' : (participantId?.substring(0, 2).toUpperCase() || 'P1')}
              </span>
           </div>
        </div>
      )}

      {/* Control Overlay */}
      <div className={`absolute top-3 right-3 flex items-center gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
         <button className="w-8 h-8 rounded-lg bg-[#0B1120]/60 backdrop-blur-md border border-white/5 flex items-center justify-center text-[#F9FAFB]/60 hover:text-[#F9FAFB] hover:bg-[#1F2937] transition-all">
            <Maximize2 size={14} />
         </button>
         <button className="w-8 h-8 rounded-lg bg-[#0B1120]/60 backdrop-blur-md border border-white/5 flex items-center justify-center text-[#F9FAFB]/60 hover:text-[#F9FAFB] hover:bg-[#1F2937] transition-all">
            <MoreHorizontal size={14} />
         </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0B1120]/60 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-xl flex items-center gap-2">
          {isSpeaking && !isAudioMuted && (
             <div className="flex gap-0.5 items-center h-2">
                {[1, 2, 3].map(i => (
                   <div key={i} className="w-0.5 bg-emerald-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }} />
                ))}
             </div>
          )}
          <span className="text-[10px] font-bold text-[#F9FAFB] uppercase tracking-widest">
            {isLocal ? 'You (Host)' : participantId ? `Guest ${participantId.substring(0, 4)}` : 'Remote User'}
          </span>
        </div>

        <div className="flex items-center gap-2">
           {isAudioMuted && (
              <div className="bg-red-500/20 backdrop-blur-md border border-red-500/30 p-1.5 rounded-lg">
                 <MicOff size={12} className="text-red-400" />
              </div>
           )}
           {getQualityDots()}
        </div>
      </div>

      {/* Floating Reactions overlay */}
      <ReactionOverlay participantId={isLocal ? 'local' : participantId || 'unknown'} />
    </div>
  );
}
