'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Trash2, 
  Download,
  Share2,
  MousePointer2,
  Minus
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export const Whiteboard = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#2563eb');
    const [tool, setTool] = useState<'pen' | 'rect' | 'circle' | 'eraser' | 'select'>('pen');
    const [lineWidth, setLineWidth] = useState(3);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas resolution
        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
            ctx.scale(devicePixelRatio, devicePixelRatio);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
        };

        window.addEventListener('resize', resize);
        resize();

        return () => window.removeEventListener('resize', resize);
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = tool === 'eraser' ? '#020617' : color;
        ctx.lineWidth = tool === 'eraser' ? 20 : lineWidth;
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden relative">
            {/* Toolbar */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
                <GlassCard className="flex items-center gap-1.5 p-2 rounded-[24px] border-slate-200 shadow-2xl fluent-glass !fluent-shadow">
                    {[
                      { id: 'select', icon: <MousePointer2 className="w-4 h-4" /> },
                      { id: 'pen', icon: <Pencil className="w-4 h-4" /> },
                      { id: 'rect', icon: <Square className="w-4 h-4" /> },
                      { id: 'circle', icon: <Circle className="w-4 h-4" /> },
                      { id: 'eraser', icon: <Eraser className="w-4 h-4" /> },
                    ].map(t => (
                      <Button 
                        key={t.id}
                        variant={tool === t.id ? 'primary' : 'ghost'} 
                        size="icon" 
                        className={`h-11 w-11 rounded-xl transition-all duration-300 ${tool === t.id ? 'shadow-lg shadow-primary/30' : 'text-secondary'}`}
                        onClick={() => setTool(t.id as any)}
                      >
                         {t.icon}
                      </Button>
                    ))}
                    <div className="w-px h-10 bg-slate-50 mx-2" />
                    <div className="flex gap-1.5 px-2">
                        {[ '#2563eb', '#9333ea', '#ef4444', '#10b981', '#f59e0b', '#ffffff' ].map(c => (
                        <button 
                            key={c}
                            className={`w-7 h-7 rounded-full border-white transition-all flex items-center justify-center ${color === c ? 'border-primary ring-4 ring-primary/10 scale-125' : 'border-slate-200'}`}
                            style={{ backgroundColor: c }}
                            onClick={() => { setColor(c); setTool('pen'); }}
                        >
                            {color === c && <div className="w-1.5 h-1.5 rounded-full bg-[#020617] opacity-50" />}
                        </button>
                        ))}
                    </div>
                    <div className="w-px h-10 bg-slate-50 mx-2" />
                    <Button variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-all" onClick={clearCanvas}>
                       <Trash2 className="w-4 h-4" />
                    </Button>
                </GlassCard>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-zinc-950/20 backdrop-blur-sm relative cursor-crosshair">
                <canvas 
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full touch-none"
                />
            </div>

            {/* Export Controls */}
            <div className="absolute bottom-6 right-6 z-20 flex gap-3">
                 <Button variant="secondary" className="gap-2.5 h-12 px-6 rounded-2xl text-[11px] font-bold shadow-2xl hover:scale-105 transition-transform"><Share2 className="w-4 h-4 text-primary" /> Live Link</Button>
                 <Button className="gap-2.5 h-12 px-6 rounded-2xl text-[11px] font-bold shadow-2xl hover:scale-105 transition-transform"><Download className="w-4 h-4" /> Save Export</Button>
            </div>
        </div>
    );
};
