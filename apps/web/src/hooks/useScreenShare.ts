import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranscriptStore } from '@/store/useTranscriptStore';

export function useScreenShare(networkQuality?: { rtt: number, packetLoss: number }) {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [screenContext, setScreenContext] = useState<string>('');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const { addSegment } = useTranscriptStore();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);

  // Hidden capture components
  useEffect(() => {
    videoRef.current = document.createElement('video');
    videoRef.current.autoplay = true;
    videoRef.current.muted = true;
    canvasRef.current = document.createElement('canvas');
  }, []);

  const startSharing = useCallback(async () => {
    try {
      // Prompt user with full screen, window, or tab (system audio included)
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 3840 },
          height: { ideal: 2160 },
          frameRate: { ideal: 30 }
        },
        audio: true
      });

      const videoTrack = stream.getVideoTracks()[0];
      
      // Downscale to 1080p for performance/bandwidth savings
      try { await videoTrack.applyConstraints({ width: 1920, height: 1080 }); } catch(e){}
      
      videoTrack.onended = stopSharing;
      setScreenStream(stream);
      setIsSharing(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      startAnalysisLoop();
    } catch (err) {
      console.error("Error sharing screen", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopSharing = useCallback(() => {
    if (screenStream) {
      screenStream.getTracks().forEach(t => t.stop());
    }
    setScreenStream(null);
    setIsSharing(false);
    setScreenContext('');
    setAnnotations([]);
    if (analysisInterval.current) clearInterval(analysisInterval.current);
  }, [screenStream]);

  // Dynamic Bandwidth Adaptation
  useEffect(() => {
    if (screenStream && networkQuality) {
      const videoTrack = screenStream.getVideoTracks()[0];
      if (!videoTrack) return;
      if (networkQuality.rtt > 0.5 || networkQuality.packetLoss > 50) {
         videoTrack.applyConstraints({ width: 1280, height: 720 }).catch(e => {}); // Drop to 720p
      } else {
         videoTrack.applyConstraints({ width: 1920, height: 1080 }).catch(e => {}); // Back to 1080p
      }
    }
  }, [networkQuality, screenStream]);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !screenStream) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0) return null;

    // Scale to max 1024px for Claude Vision performance
    const scale = Math.min(1024 / video.videoWidth, 1024 / video.videoHeight, 1);
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
    return dataUrl.replace(/^data:image\/jpeg;base64,/, '');
  }, [screenStream]);

  const startAnalysisLoop = useCallback(() => {
    if (analysisInterval.current) clearInterval(analysisInterval.current);
    
    analysisInterval.current = setInterval(async () => {
      const base64 = captureFrame();
      if (!base64) return;
      
      try {
        const res = await fetch('/api/screen-analyze', {
          method: 'POST',
          body: JSON.stringify({ imageBase64: base64, action: 'analyze' })
        });
        const data = await res.json();
        
        if (data.description) {
          setScreenContext(data.description);
          addSegment({
            speakerId: 'ai_system',
            speakerName: 'AI Vision Context',
            text: `[Screen: ${data.description}]`,
            timestamp: Date.now(),
            confidence: 1,
            isFinal: true
          });
        }
        
        if (data.annotations) {
          setAnnotations(data.annotations);
        }
        
        if (data.isNewSlide) {
          addSegment({
            speakerId: 'ai_system',
            speakerName: 'AI Presentation Tracker',
            text: `[Advanced to new slide: ${data.description}]`,
            timestamp: Date.now(),
            confidence: 1,
            isFinal: true
          });
        }
      } catch (err) {
        console.error('Screen analysis failed', err);
      }
    }, 10000); // 10 seconds
  }, [captureFrame, addSegment]);

  return {
    screenStream,
    isSharing,
    startSharing,
    stopSharing,
    screenContext,
    annotations,
    captureFrame
  };
}
