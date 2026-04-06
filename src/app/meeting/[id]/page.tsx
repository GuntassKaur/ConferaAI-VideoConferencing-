'use client';

import React, { useState } from 'react';
import { MeetingProvider, useMeeting } from '@/context/MeetingContext';
import { VideoGrid } from '@/components/VideoGrid';
import { BottomBar } from '@/components/BottomBar';
import { SidePanel } from '@/components/SidePanel';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

const MeetingContent = () => {
    const params = useParams();
    const { joinRoom } = useMeeting();
    const [isJoined, setIsJoined] = useState(false);
    const [userName, setUserName] = useState('');

    const handleJoin = () => {
        if (userName.trim()) {
            joinRoom(params.id as string, userName);
            setIsJoined(true);
        }
    };

    if (!isJoined) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-[#fdfdfd] relative overflow-hidden font-sans text-slate-900">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-80" />
                
                <motion.div 
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="mb-12 flex flex-col items-center gap-4 text-center"
                >
                   <div className="w-16 h-16 rounded-[20px] bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center premium-shadow">
                     <Video className="w-8 h-8 text-white" />
                   </div>
                   <h1 className="text-4xl font-bold font-outfit mt-4 flex items-center gap-2">
                     Confera AI 
                   </h1>
                   <div className="px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm font-medium text-slate-500 shadow-sm mt-2">
                     Session ID: {params.id}
                   </div>
                </motion.div>

                <div className="w-full max-w-sm">
                   <div className="glass-card p-8 hover:shadow-[0_20px_40px_-20px_rgba(79,70,229,0.15)] transition-shadow duration-500">
                       <h2 className="text-2xl font-bold font-outfit mb-6 text-center text-slate-900">Ready to join?</h2>
                       <div className="space-y-4">
                           <input 
                               className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-5 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-400"
                               placeholder="Your Name"
                               value={userName}
                               onChange={(e) => setUserName(e.target.value)}
                               onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                               autoFocus
                           />
                           <button 
                              className="btn-primary w-full h-14 text-lg rounded-xl shadow-md shadow-indigo-600/20"
                              onClick={handleJoin}
                           >
                              Join Meeting
                           </button>
                       </div>
                   </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans p-4 sm:p-6 gap-4 sm:gap-6 relative">
            {/* Ambient Backgrounds */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--bg-accent-1)] rounded-full blur-[150px] -z-10 translate-x-1/4 -translate-y-1/4 opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--bg-accent-2)] rounded-full blur-[150px] -z-10 -translate-x-1/4 translate-y-1/4 opacity-40 pointer-events-none" />
            
            {/* NEW TOP BAR */}
            <header className="flex-shrink-0 h-16 w-full glass-card border-[var(--border)] px-6 flex items-center justify-between z-20">
               <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-500 animate-pulse">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  </div>
                  <h1 className="font-outfit font-extrabold text-lg text-[var(--foreground)]">Project Zenith Sync</h1>
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-[var(--muted)] border border-[var(--border)] rounded-xl font-medium font-mono text-sm">
                  00:42:15
               </div>
            </header>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4 sm:gap-6 rounded-[32px] relative z-10 min-h-0">
                <div className="flex-1 min-h-0 rounded-[32px] overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-[0_10px_40px_-10px_var(--glow)] relative flex">
                   <VideoGrid />
                </div>
                <div className="lg:w-[420px] w-full min-h-0 flex-shrink-0 bg-[var(--card)] backdrop-blur-xl rounded-[32px] border border-[var(--border)] premium-shadow overflow-hidden flex flex-col transition-all">
                   <SidePanel />
                </div>
            </div>
            <div className="flex-shrink-0 flex justify-center w-full relative z-10 transition-all pb-2">
                <BottomBar />
            </div>
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
