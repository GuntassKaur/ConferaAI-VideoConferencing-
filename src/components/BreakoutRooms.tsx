'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Users, 
  MoreHorizontal, 
  Zap, 
  Grid, 
  MessageSquare, 
  Sparkles, 
  Maximize,
  Clock,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BreakoutRooms = () => {
    const rooms = [
        { id: 1, name: 'Frontend Details', participants: 4, aiModerator: 'Mentor-AI' },
        { id: 2, name: 'Backend Scalability', participants: 6, aiModerator: 'ScaleBot' },
        { id: 3, name: 'Design Review', participants: 3, aiModerator: 'UI-Assistant' }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-secondary">Breakout Spaces</h3>
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-[10px] text-primary">
                    <Plus className="w-3 h-3" /> New Room
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {rooms.map((room) => (
                    <GlassCard key={room.id} className="p-4 bg-white/5 border-white/5 hover:bg-white/10 transition-all cursor-pointer group shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-primary font-bold text-xs">
                                <Grid className="w-4 h-4" /> Room {room.id}
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="w-4 h-4" /></Button>
                        </div>
                        <h4 className="font-bold text-sm mb-1">{room.name}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-secondary font-medium tracking-wide mb-4">
                            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {room.participants} active</span>
                            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 15m left</span>
                        </div>
                        
                        <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between group-hover:bg-primary/20 transition-colors">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-bold text-primary">{room.aiModerator}</span>
                            </div>
                            <Button variant="ghost" className="h-6 gap-1 text-[9px] font-bold p-1">Join</Button>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                 <Button variant="secondary" className="font-bold tracking-tight gap-2 py-6 px-10 shadow-2xl">
                    <Users className="w-5 h-5 text-primary" /> Group Automatically
                 </Button>
                 <p className="text-[10px] text-secondary mt-4 font-medium max-w-[200px]">AI will group participants based on their expertise and roles.</p>
            </div>
        </div>
    );
};
