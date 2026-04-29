import { useState, useEffect, useRef, useCallback } from 'react';

export function useMediaStream() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  
  const originalVideoTrack = useRef<MediaStreamTrack | null>(null);
  const originalAudioTrack = useRef<MediaStreamTrack | null>(null);

  const startMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      originalVideoTrack.current = mediaStream.getVideoTracks()[0] || null;
      originalAudioTrack.current = mediaStream.getAudioTracks()[0] || null;
      
      setStream(mediaStream);
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  }, []);

  const toggleMic = useCallback(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTracks[0].enabled = !audioTracks[0].enabled;
        setIsMuted(!audioTracks[0].enabled);
      }
    }
  }, [stream]);

  const toggleVideo = useCallback(() => {
    if (stream && originalVideoTrack.current) {
      if (!isVideoOff) {
        // Create black frame to keep track alive
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'black';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        const canvasStream = canvas.captureStream(30);
        const blackVideoTrack = canvasStream.getVideoTracks()[0];
        
        stream.removeTrack(originalVideoTrack.current);
        stream.addTrack(blackVideoTrack);
        setIsVideoOff(true);
      } else {
        const currentTracks = stream.getVideoTracks();
        if (currentTracks.length > 0) {
          stream.removeTrack(currentTracks[0]);
        }
        stream.addTrack(originalVideoTrack.current);
        setIsVideoOff(false);
      }
    }
  }, [stream, isVideoOff]);

  const toggleScreenShare = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true // Request system audio capture
        });
        
        const screenTrack = displayStream.getVideoTracks()[0];
        screenTrack.onended = () => {
          stopScreenShare();
        };

        if (stream) {
          const currentVideo = stream.getVideoTracks()[0];
          if (currentVideo) stream.removeTrack(currentVideo);
          stream.addTrack(screenTrack);
          setIsScreenSharing(true);
        }
      } catch (err) {
        console.error("Error sharing screen", err);
      }
    } else {
      stopScreenShare();
    }
  }, [isScreenSharing, stream]);

  const stopScreenShare = useCallback(() => {
    if (stream && isScreenSharing && originalVideoTrack.current) {
      const currentTracks = stream.getVideoTracks();
      if (currentTracks.length > 0) {
        currentTracks[0].stop();
        stream.removeTrack(currentTracks[0]);
      }
      stream.addTrack(originalVideoTrack.current);
      setIsScreenSharing(false);
    }
  }, [stream, isScreenSharing]);

  // Virtual background logic placeholder
  const setVirtualBackground = useCallback((type: 'none' | 'blur' | 'image') => {
    console.warn(`Virtual background (${type}) requires ML processing (e.g. TFJS/BodyPix).`);
    // In production, pipe originalVideoTrack into a canvas, process each frame with ML model,
    // and use canvas.captureStream() to replace the stream's video track.
  }, []);

  useEffect(() => {
    startMedia();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    stream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    toggleMic,
    toggleVideo,
    toggleScreenShare,
    setVirtualBackground
  };
}
