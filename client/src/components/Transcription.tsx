'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Globe, 
  Search, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Languages,
  Mic,
  Smile,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Transcription = () => {
    const [language, setLanguage] = useState('English');
    const logs = [
        { id: 1, user: 'John Doe', text: 'Hey team, let\'s look at the quarterly goals. We should focus on the AI recap feature first.', time: '10:32 AM' },
        { id: 2, user: 'Sarah Chen', text: 'I agree. The AI recap will have the most impact on our user engagement.', time: '10:33 AM' },
        { id: 3, user: 'AI Assistant', text: 'Suggesting breakout group for specific frontend details.', time: '10:34 AM', type: 'system' }
    ];

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-[10px]">
                   <Languages className="w-3.5 h-3.5" /> {language}
                </div>
                <div className="flex gap-1.5">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-secondary hover:text-foreground">
                      <Search className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-secondary hover:text-foreground">
                      <Globe className="w-4 h-4" />
                   </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {logs.map((log) => (
                    <motion.div 
                        key={log.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-1.5"
                    >
                        <div className="flex items-center justify-between px-1">
                            <span className={`text-[10px] font-bold ${log.type === 'system' ? 'text-primary' : 'text-foreground/60'}`}>
                                {log.user}
                            </span>
                            <span className="text-[10px] text-zinc-600 font-medium">{log.time}</span>
                        </div>
                        <GlassCard className={`p-4 ${log.type === 'system' ? 'bg-primary/5 border-primary/20 shadow-primary/10' : 'bg-white/5 border-white/10 shadow-xl'} !rounded-2xl`}>
                            <p className={`text-xs leading-relaxed ${log.type === 'system' ? 'text-primary' : 'text-foreground'}`}>
                                {log.text}
                            </p>
                        </GlassCard>
                    </motion.div>
                ))}
                
                {/* Live Indicator */}
                <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest pt-4">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                   Live Transcription Underway...
                </div>
            </div>

            <div className="p-4 border-t border-white/5 space-y-3">
                 <Button variant="secondary" className="w-full text-[11px] font-bold gap-2 py-4 shadow-xl">
                    <Download className="w-4 h-4 text-primary" /> Download Full Transcript
                 </Button>
            </div>
        </div>
    );
};
