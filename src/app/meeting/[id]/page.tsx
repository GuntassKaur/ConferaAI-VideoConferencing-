'use client';

import React, { useState, useEffect } from 'react';
import { MeetingProvider, useMeeting } from '@/context/MeetingContext';
import { VideoGrid } from '@/components/VideoGrid';
import { BottomBar } from '@/components/BottomBar';
import { SidePanel } from '@/components/SidePanel';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Video, Shield, User } from 'lucide-react';

const MeetingContent = () => {
    const params = useParams();
    const router = useRouter();
    const { joinRoom, leaveRoom, localStream } = useMeeting();
    const [isJoined, setIsJoined] = useState(false);
    const [userName, setUserName] = useState('');
    const [activePanel, setActivePanel] = useState<'chat' | 'participants' | 'recap' | 'none' | 'transcription' | 'breakout' | 'polls'>('none');

    const handleJoin = () => {
        if (userName.trim()) {
            joinRoom(params.id as string, userName);
            setIsJoined(true);
        }
    };

    if (!isJoined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background relative overflow-hidden bg-hero-glow">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
                
                <motion.h1 
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-4xl font-bold outfit-font mb-12 flex items-center gap-4"
                >
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center fluent-shadow"><Video className="w-7 h-7 text-white" /></div>
                   Confera AI <span className="text-secondary/50 font-medium tracking-tighter">/</span> Lobby
                </motion.h1>

                <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl w-full">
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="w-full lg:w-3/5 aspect-video bg-zinc-900 rounded-[40px] overflow-hidden fluent-glass relative border border-white/5 shadow-2xl fluent-shadow"
                    >
                         <div className="absolute inset-0 flex items-center justify-center">
                             <User className="w-24 h-24 text-zinc-800" />
                         </div>
                         <div className="absolute bottom-10 left-10 flex gap-4">
                             <Button variant="ghost" size="icon" className="h-14 w-14 fluent-glass bg-black/40 rounded-2xl border border-white/10 text-white hover:bg-black/60 shadow-xl"><Shield className="w-6 h-6" /></Button>
                         </div>
                    </motion.div>

                    <div className="w-full lg:w-1/3 space-y-10 flex flex-col justify-center">
                         <div>
                            <h2 className="text-3xl font-bold mb-3 outfit-font">Ready to thrive?</h2>
                            <p className="text-secondary text-sm font-medium">Session Space: <span className="text-primary font-mono bg-primary/10 px-2 py-1 rounded-md">{params.id}</span></p>
                         </div>
                         <div className="space-y-6">
                             <div className="relative group">
                                <input 
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-3xl px-8 focus:outline-none focus:border-primary/50 transition-all text-xl font-medium shadow-inner"
                                    placeholder="Your Display Name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                />
                             </div>
                             <Button 
                                className="w-full h-16 text-xl font-bold shadow-2xl shadow-primary/30"
                                onClick={handleJoin}
                             >
                                Enter Conference
                             </Button>
                         </div>
                         <div className="flex items-center gap-4 justify-center py-4 border-y border-white/5">
                            <div className="flex -space-x-3">
                               {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>)}
                            </div>
                            <span className="text-xs text-secondary font-bold uppercase tracking-widest">12+ joined</span>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
            <div className="flex flex-1 overflow-hidden relative">
                <VideoGrid />
                <AnimatePresence>
                    <SidePanel 
                        activePanel={activePanel} 
                        onClose={() => setActivePanel('none')}
                    />
                </AnimatePresence>
            </div>
            <BottomBar 
                 activePanel={activePanel} 
                 setActivePanel={setActivePanel} 
            />
        </div>
    );
};

export default function MeetingPage() {
    return (
        <MeetingProvider>
            <MeetingContent />
        </MeetingProvider>
    );
}
