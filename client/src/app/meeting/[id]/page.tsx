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
    const [activePanel, setActivePanel] = useState<'chat' | 'participants' | 'recap' | 'none'>('none');

    const handleJoin = () => {
        if (userName.trim()) {
            joinRoom(params.id as string, userName);
            setIsJoined(true);
        }
    };

    if (!isJoined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
                
                <h1 className="text-4xl font-bold outfit-font mb-12 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"><Video className="w-6 h-6 text-white" /></div>
                   Confera AI <span className="text-secondary font-medium">/</span> Lobby
                </h1>

                <div className="flex flex-col lg:flex-row items-center gap-12 max-w-5xl w-full">
                    <div className="w-full lg:w-1/2 aspect-video bg-zinc-900 rounded-3xl overflow-hidden glass-morphism relative border border-white/5 shadow-2xl">
                         <div className="absolute inset-0 flex items-center justify-center">
                             <User className="w-24 h-24 text-zinc-800" />
                         </div>
                         <div className="absolute bottom-6 left-6 flex gap-3">
                             <Button variant="ghost" size="icon" className="h-10 w-10 bg-black/40 rounded-xl border border-white/10 text-white hover:bg-black/60"><Shield className="w-4 h-4" /></Button>
                         </div>
                    </div>

                    <div className="w-full lg:w-1/3 space-y-8 flex flex-col justify-center">
                         <div>
                            <h2 className="text-2xl font-bold mb-2">Ready to join?</h2>
                            <p className="text-secondary text-sm">Meeting ID: <span className="text-primary font-mono">{params.id}</span></p>
                         </div>
                         <div className="space-y-4">
                             <div className="relative group">
                                <input 
                                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 focus:outline-none focus:border-primary/50 transition-all text-lg font-medium"
                                    placeholder="Your Display Name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                />
                             </div>
                             <Button 
                                className="w-full h-14 text-lg font-bold shadow-primary/30"
                                onClick={handleJoin}
                             >
                                Join Meeting
                             </Button>
                         </div>
                         <p className="text-xs text-center text-secondary leading-relaxed max-w-xs mx-auto">
                            By joining, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                         </p>
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
                    <SidePanel activePanel={activePanel} />
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
