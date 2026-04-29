import { useRef, useState, useEffect } from 'react';
import { Eye, MousePointer2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnnotationLayer } from './AnnotationLayer';

interface ScreenShareViewProps {
  stream: MediaStream | null;
  context: string;
  annotations: any[];
  captureFrame: () => string | null;
  socket?: any; // To pass down to annotation layer
  roomId?: string;
  participantId?: string;
}

export function ScreenShareView({ stream, context, annotations, captureFrame, socket, roomId = 'demo', participantId = 'local' }: ScreenShareViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  const [spotlight, setSpotlight] = useState<{x: number, y: number, text: string} | null>(null);
  const [isAnalyzingSpotlight, setIsAnalyzingSpotlight] = useState(false);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleContainerClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Laser pointer effect
    setSpotlight({ x, y, text: 'Analyzing area...' });
    setIsAnalyzingSpotlight(true);
    
    const base64 = captureFrame();
    if (!base64) {
      setSpotlight(null);
      setIsAnalyzingSpotlight(false);
      return;
    }
    
    try {
      const res = await fetch('/api/screen-analyze', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: base64, action: 'spotlight', area: { x, y } })
      });
      const data = await res.json();
      setSpotlight({ x, y, text: data.summary || "No summary available." });
    } catch (err) {
      setSpotlight({ x, y, text: 'Failed to analyze area.' });
    } finally {
      setIsAnalyzingSpotlight(false);
      // Auto clear spotlight after 8 seconds
      setTimeout(() => setSpotlight(null), 8000);
    }
  };

  if (!stream) return null;

  return (
    <div 
      className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden border border-indigo-500/30 group flex items-center justify-center cursor-crosshair shadow-2xl shadow-indigo-500/10"
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="max-w-full max-h-full object-contain pointer-events-none"
      />

      <AnnotationLayer 
        socket={socket} 
        roomId={roomId} 
        participantId={participantId} 
        width={dimensions.width} 
        height={dimensions.height} 
        captureFrame={captureFrame}
      />

      {/* AI Context Badge */}
      <AnimatePresence>
        {context && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 flex items-center space-x-2 bg-indigo-600/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-2xl border border-indigo-400/50 z-20"
          >
            <Eye className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-medium text-white">AI Context: {context}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auto Annotations overlay */}
      {annotations?.map((ann, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-10"
          style={{ left: `${ann.x * 100}%`, top: `${ann.y * 100}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative group/tooltip cursor-help">
            <div className="w-5 h-5 bg-yellow-400 rounded-full animate-ping absolute opacity-50"></div>
            <div className="w-5 h-5 bg-yellow-400 rounded-full border-2 border-white relative z-10 shadow-lg"></div>
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-black/95 backdrop-blur-md rounded-xl text-xs text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity border border-white/20 pointer-events-none z-20 shadow-2xl">
              {ann.text}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Interactive Laser Spotlight */}
      <AnimatePresence>
        {spotlight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-30 flex flex-col items-center"
            style={{ left: `${spotlight.x * 100}%`, top: `${spotlight.y * 100}%`, transform: 'translate(-50%, -50%)' }}
          >
            <MousePointer2 className="w-8 h-8 text-red-500 fill-red-500/30 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
            
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-2 px-3 py-2 bg-black/90 backdrop-blur-md rounded-xl border border-red-500/50 text-xs text-white max-w-[240px] text-center shadow-2xl leading-relaxed"
            >
              {isAnalyzingSpotlight ? (
                <span className="flex items-center space-x-2">
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Claude is analyzing this area...</span>
                </span>
              ) : (
                spotlight.text
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Presenter Mode Hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/10 text-white/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Click anywhere on the screen to deploy the AI Laser Pointer
      </div>
    </div>
  );
}
