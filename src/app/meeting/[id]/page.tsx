'use client';

import React, { useState, useEffect } from 'react';
import { MeetingProvider, useMeeting } from '@/context/MeetingContext';
import { VideoGrid } from '@/components/VideoGrid';
import { BottomBar } from '@/components/BottomBar';
import { SidePanel } from '@/components/SidePanel';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Settings, Mic, MicOff, VideoOff, ChevronDown, User, 
  ShieldCheck, Sparkles, Activity, Home, Calendar, BarChart2,
  Bell, Search, Plus
} from 'lucide-react';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';
import AISidebar from '@/components/AISidebar';

const MeetingContent = () => {
    const params = useParams();
    const { joinRoom } = useMeeting();
    const [isJoined, setIsJoined] = useState(false);
    const [userName, setUserName] = useState('');
    const [token, setToken] = useState('');
    
    // Lobby states
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);

    const handleJoin = async () => {
        if (userName.trim()) {
            const res = await fetch(`/api/room/token?room=${params.id}&username=${encodeURIComponent(userName)}`);
            const data = await res.json();
            if (data.token) {
                setToken(data.token);
                setIsJoined(true);
            }
        }
    };

    if (!isJoined) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A] text-foreground transition-colors duration-500">
                {/* Minimalist Lobby Header */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Video className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">Confera<span className="text-indigo-600">AI</span></span>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                                Quality meetings, <br/>made <span className="text-indigo-600">intelligent.</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">
                                Ready to join? Check your audio and video settings before stepping in.
                            </p>
                            
                            <div className="space-y-4">
                               <div className="p-4 bg-card border border-border rounded-xl shadow-sm space-y-3">
                                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Display Name</label>
                                  <input 
                                      className="w-full bg-slate-50 dark:bg-slate-900 border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                      placeholder="How should we call you?"
                                      value={userName}
                                      onChange={(e) => setUserName(e.target.value)}
                                  />
                               </div>
                               <button 
                                   onClick={handleJoin}
                                   disabled={!userName.trim()}
                                   className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                               >
                                   Join Meeting <ChevronDown className="w-4 h-4" />
                               </button>
                            </div>
                        </div>

                        <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl">
                           <div className="absolute inset-0 flex items-center justify-center">
                              {!isCamOn ? (
                                <div className="w-20 h-20 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center">
                                   <User className="w-10 h-10 text-slate-500" />
                                </div>
                              ) : (
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop')] bg-cover opacity-50" />
                              )}
                           </div>
                           
                           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3">
                              <button onClick={() => setIsMicOn(!isMicOn)} className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all ${isMicOn ? 'bg-white/90 border-slate-200 text-slate-600' : 'bg-red-500 border-red-500 text-white'}`}>
                                 {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                              </button>
                              <button onClick={() => setIsCamOn(!isCamOn)} className={`w-12 h-12 rounded-full flex items-center justify-center border backdrop-blur-md transition-all ${isCamOn ? 'bg-white/90 border-slate-200 text-slate-600' : 'bg-red-500 border-red-500 text-white'}`}>
                                 {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                              </button>
                           </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <LiveKitRoom
            serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
            token={token}
            connect={true}
            video={true}
            audio={true}
            className="flex h-screen bg-[#F9FAFB] dark:bg-[#0F172A] transition-colors"
        >
            {/* Enterprise Sidebar (Icons Only) */}
            <aside className="w-[72px] h-full border-r border-border bg-card/50 backdrop-blur-md flex flex-col items-center py-6 gap-4 z-50 sticky top-0">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-4">
                   <Video className="w-5 h-5 text-white" />
               </div>
               <nav className="flex flex-col gap-2">
                  <button className="sidebar-icon-btn text-indigo-600 bg-indigo-600/10"><Home className="w-5 h-5" /></button>
                  <button className="sidebar-icon-btn"><Calendar className="w-5 h-5" /></button>
                  <button className="sidebar-icon-btn"><BarChart2 className="w-5 h-5" /></button>
               </nav>
               <div className="mt-auto flex flex-col gap-2">
                  <button className="sidebar-icon-btn"><Settings className="w-5 h-5" /></button>
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-700" />
               </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Fixed Sticky Navbar */}
                <header className="h-16 flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-md px-8 flex items-center justify-between z-[60]">
                   <div className="flex items-center gap-3">
                      <h2 className="font-bold text-slate-800 dark:text-white">Strategy & Roadmap Planning</h2>
                      <div className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                         Live
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-slate-400">
                         <Search className="w-4 h-4" />
                         <span className="text-sm font-medium">Search transcript...</span>
                      </div>
                      <div className="h-4 w-px bg-border mx-2" />
                      <button className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                         <Bell className="w-5 h-5" />
                      </button>
                   </div>
                </header>

                {/* Main Content (70/30 Split) */}
                <main className="flex-1 flex overflow-hidden">
                    <div className="flex-1 min-w-0 relative flex flex-col bg-slate-900">
                        <div className="flex-1 overflow-hidden relative">
                           <VideoGrid />
                        </div>
                        {/* Control Bar (Floating) */}
                        <div className="absolute bottom-0 left-0 right-0 z-[70]">
                           <BottomBar />
                        </div>
                    </div>
                    
                    <div className="w-[400px] flex-shrink-0 relative z-50">
                        <SidePanel />
                    </div>
                </main>
            </div>
        </LiveKitRoom>
    );
};

export default function MeetingPage() {
    return (
        <MeetingProvider>
            <MeetingContent />
        </MeetingProvider>
    );
}
