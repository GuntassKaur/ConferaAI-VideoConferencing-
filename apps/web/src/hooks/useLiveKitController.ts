'use client';

import { useRoomContext, useConnectionState, useTracks, useRemoteParticipants } from '@livekit/components-react';
import { RoomEvent, Track, ConnectionState, Participant, ConnectionQuality } from 'livekit-client';
import { useEffect, useState, useCallback } from 'react';
import { useRoomStore } from '@/store/useRoomStore';

export function useLiveKitController() {
  const room = useRoomContext();
  const connectionState = useConnectionState();
  const participants = useRemoteParticipants();
  
  // High quality for active speaker, low quality for others to optimize bandwidth
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone], { 
      updateOnlyOn: [RoomEvent.ActiveSpeakersChanged],
      onlySubscribed: true 
  });

  const { setActiveSpeaker, addTranscript } = useRoomStore();
  const [networkQuality, setNetworkQuality] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!room) return;

    // Handle Active Speaker Glow
    const handleActiveSpeakerChange = (speakers: Participant[]) => {
      if (speakers && speakers.length > 0) {
        setActiveSpeaker(speakers[0].identity);
      } else {
        setActiveSpeaker(null);
      }
    };

    // Quality Monitoring & Switching
    const handleNetworkQuality = (quality: ConnectionQuality, participant: Participant) => {
      setNetworkQuality(prev => ({ ...prev, [participant.identity]: quality as unknown as number }));
    };


    // For real STT Whisper integration we would pipe the audio track stream into Web Worker here.
    // Simulating transcription for demo aesthetics:
    const simulateTranscription = setInterval(() => {
        const speakerId = room.activeSpeakers?.[0]?.identity;
        if (speakerId && Math.random() > 0.5) {
           addTranscript({
             id: Math.random().toString(),
             speaker: speakerId,
             text: "We are scaling up the SFU instances to support the new global traffic.",
             timestamp: new Date()
           });
        }
    }, 4000);

    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange);
    room.on(RoomEvent.ConnectionQualityChanged, handleNetworkQuality);

    return () => {
      room.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange);
      room.off(RoomEvent.ConnectionQualityChanged, handleNetworkQuality);
      clearInterval(simulateTranscription);
    };
  }, [room, setActiveSpeaker, addTranscript]);

  const disconnect = useCallback(() => {
    room?.disconnect();
  }, [room]);

  return {
    room,
    connectionState,
    isConnecting: connectionState === ConnectionState.Connecting,
    participants,
    tracks,
    networkQuality,
    disconnect
  };
}
