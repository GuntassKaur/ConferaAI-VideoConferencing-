import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Socket } from 'socket.io-client';
import { PenTool, MousePointer2, Trash2, Undo, Circle, Camera, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type DrawMode = 'select' | 'pen' | 'laser';

interface AnnotationLayerProps {
  socket: Socket | null;
  roomId: string;
  participantId: string;
  width: number;
  height: number;
  isWhiteboard?: boolean;
  captureFrame?: () => string | null;
}

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export function AnnotationLayer({ socket, roomId, participantId, width, height, isWhiteboard = false, captureFrame }: AnnotationLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [mode, setMode] = useState<DrawMode>('pen');
  const [isAIAnnotating, setIsAIAnnotating] = useState(false);
  const [aiSvgOverlay, setAiSvgOverlay] = useState<string | null>(null);
  
  const [color] = useState(() => {
    let hash = 0;
    for (let i = 0; i < participantId.length; i++) hash = participantId.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
  });

  const historyRef = useRef<any[]>([]);

  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) return;
    
    // Dispose previous instance if width/height changes drastically
    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      isDrawingMode: true,
      selection: false,
    });
    
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = 4;

    setFabricCanvas(canvas);

    // Sync remote paths via Socket
    if (socket) {
      socket.on('annotation-draw', (data: any) => {
        if (data.participantId === participantId) return; // Skip own
        
        if (data.type === 'path') {
          fabric.util.enlivenObjects([data.object], (objects: any[]) => {
            const obj = objects[0];
            canvas.add(obj);
            if (data.isLaser) {
              // Fade out laser stroke automatically
              setTimeout(() => {
                canvas.remove(obj);
              }, 2000);
            }
          }, 'fabric');
        } else if (data.type === 'clear') {
          canvas.clear();
        }
      });
    }

    // Capture local paths
    canvas.on('path:created', (e: any) => {
      const path = e.path;
      historyRef.current.push(path);
      
      if (mode === 'laser') {
        path.set({ stroke: color, opacity: 0.8, shadow: new fabric.Shadow({ color, blur: 10, offsetX: 0, offsetY: 0 }) });
        canvas.requestRenderAll();
        
        socket?.emit('annotation-draw', { roomId, participantId, type: 'path', object: path.toObject(), isLaser: true });
        
        // Laser disappears
        setTimeout(() => {
          canvas.remove(path);
        }, 2000);
      } else {
        socket?.emit('annotation-draw', { roomId, participantId, type: 'path', object: path.toObject(), isLaser: false });
      }
    });

    return () => {
      canvas.dispose();
      socket?.off('annotation-draw');
    };
  }, [width, height, socket, roomId, participantId, color]);

  // Handle Mode Changes
  useEffect(() => {
    if (!fabricCanvas) return;
    
    if (mode === 'select') {
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.selection = true;
    } else {
      fabricCanvas.isDrawingMode = true;
      fabricCanvas.selection = false;
      if (mode === 'laser') {
         fabricCanvas.freeDrawingBrush.color = color;
         fabricCanvas.freeDrawingBrush.width = 8;
      } else {
         fabricCanvas.freeDrawingBrush.color = color;
         fabricCanvas.freeDrawingBrush.width = 4;
      }
    }
  }, [mode, fabricCanvas, color]);

  const handleUndo = () => {
    if (!fabricCanvas || historyRef.current.length === 0) return;
    const lastObj = historyRef.current.pop();
    fabricCanvas.remove(lastObj);
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    setAiSvgOverlay(null);
    historyRef.current = [];
    socket?.emit('annotation-draw', { roomId, participantId, type: 'clear' });
  };

  const handleAIAnnotate = async () => {
    if (!captureFrame) return;
    setIsAIAnnotating(true);
    const base64 = captureFrame();
    if (!base64) {
      setIsAIAnnotating(false);
      return;
    }

    try {
      // In production, the prompt would be derived from the voice transcript "Annotate this: [topic]"
      const res = await fetch('/api/annotate/auto', {
        method: 'POST',
        body: JSON.stringify({ imageBase64: base64, prompt: "Highlight the most important data point on the screen" })
      });
      const data = await res.json();
      if (data.svg) {
        setAiSvgOverlay(data.svg);
        // Clear AI overlay after 10s
        setTimeout(() => setAiSvgOverlay(null), 10000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAIAnnotating(false);
    }
  };

  const handleSnapshot = () => {
    if (!fabricCanvas) return;
    // We would merge the video frame with the canvas overlay to save locally
    const canvasData = fabricCanvas.toDataURL({ format: 'png', quality: 1 });
    const a = document.createElement('a');
    a.href = canvasData; // Note: this only downloads the drawings unless video is drawn onto canvas
    a.download = `meeting-snapshot-${Date.now()}.png`;
    a.click();
  };

  return (
    <div className={`absolute inset-0 z-40 ${isWhiteboard ? 'bg-zinc-900' : ''}`}>
      {/* AI SVG Overlay (underneath the fabric canvas so we can draw over it) */}
      <AnimatePresence>
        {aiSvgOverlay && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            dangerouslySetInnerHTML={{ __html: aiSvgOverlay }}
          />
        )}
      </AnimatePresence>

      <div className={`w-full h-full ${mode !== 'select' ? 'pointer-events-auto' : ''}`}>
        <canvas ref={canvasRef} className="outline-none" />
      </div>

      {/* Annotation Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center space-x-2 pointer-events-auto shadow-2xl z-50">
        <button onClick={() => setMode('select')} className={`p-2 rounded-xl transition-all ${mode === 'select' ? 'bg-indigo-500 text-white' : 'text-white/60 hover:bg-white/10'}`}><MousePointer2 className="w-5 h-5"/></button>
        <button onClick={() => setMode('pen')} className={`p-2 rounded-xl transition-all ${mode === 'pen' ? 'bg-indigo-500 text-white' : 'text-white/60 hover:bg-white/10'}`}><PenTool className="w-5 h-5"/></button>
        <button onClick={() => setMode('laser')} className={`p-2 rounded-xl transition-all ${mode === 'laser' ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'text-white/60 hover:bg-white/10'}`} title="Laser Pointer"><Circle className="w-5 h-5"/></button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        <button onClick={handleUndo} className="p-2 rounded-xl text-white/60 hover:bg-white/10 transition-all" title="Undo"><Undo className="w-5 h-5"/></button>
        <button onClick={handleClear} className="p-2 rounded-xl text-red-400 hover:bg-red-500/20 transition-all" title="Clear All"><Trash2 className="w-5 h-5"/></button>
        
        <div className="w-px h-6 bg-white/20 mx-2"></div>
        
        <button onClick={handleAIAnnotate} disabled={isAIAnnotating} className={`p-2 rounded-xl transition-all flex items-center space-x-2 ${isAIAnnotating ? 'text-indigo-400' : 'text-indigo-300 hover:bg-white/10'}`} title="AI Auto Annotate">
          <BrainCircuit className={`w-5 h-5 ${isAIAnnotating ? 'animate-pulse' : ''}`}/>
          <span className="text-xs font-semibold uppercase">{isAIAnnotating ? 'Thinking...' : 'AI Draw'}</span>
        </button>

        <button onClick={handleSnapshot} className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/20 transition-all" title="Save Snapshot to Recap"><Camera className="w-5 h-5"/></button>
      </div>
    </div>
  );
}
