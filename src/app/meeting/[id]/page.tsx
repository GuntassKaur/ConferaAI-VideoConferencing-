'use client';

import React, { useState, useEffect } from 'react';
import { MeetingProvider, useMeeting } from '@/context/MeetingContext';
import { VideoGrid } from '@/components/VideoGrid';
import { BottomBar } from '@/components/BottomBar';
import { SidePanel } from '@/components/SidePanel';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, Settings, Mic, MicOff, VideoOff, ChevronDown, User, ShieldCheck, Sparkles, Activity } from 'lucide-react';
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
    const [bgBlur, setBgBlur] = useState(false);

    const handleJoin = async () => {
        if (userName.trim()) {
            const res = await fetch(`/api/room/token?room=${params.id}&username=${encodeURIComponent(userName)}`);
            const data = await res.json();
            if (data.token) {
                setToken(data.token);
                setIsJoined(true);
            } else {
                alert('Failed to get token');
            }
        }
    };

    if (!isJoined) {
        return (
            <div className="flex flex-col min-h-screen bg-[#050505] relative overflow-hidden font-sans text-white items-center justify-center">
                {/* Ambient Cyber-Glow */}
                <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#00f2fe]/10 rounded-full blur-[150px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#7000ff]/10 rounded-full blur-[150px] pointer-events-none" />

                <div className="w-full max-w-5xl px-8 z-10 flex flex-col md:flex-row gap-8 items-center">
                    
                    {/* Left Side: Device Preview (Microsoft Teams Style) */}
                    <div className="flex-1 w-full flex flex-col items-center">
                        <h1 className="text-3xl font-bold font-outfit mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60 self-start">
                            Choose your audio and video settings for
                            <br/><span className="text-[#00f2fe]">Confera Pro Session</span>
                        </h1>
                        
                        <div className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-[#0a0a0f] border border-white/10 cyber-glass shadow-2xl transition-all duration-500 ${isCamOn ? '' : 'flex items-center justify-center'}`}>
                            {isCamOn ? (
                                <div className={`absolute inset-0 bg-gradient-to-tr from-indigo-900/40 to-slate-800/40 ${bgBlur ? 'backdrop-blur-md' : ''}`}>
                                    {/* Mock WebCam Feed */}
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full cyber-glass flex items-center justify-center shadow-[0_0_30px_rgba(0,242,254,0.1)]">
                                    <User className="w-10 h-10 text-white/50" />
                                </div>
                            )}

                            {/* Self View Controls */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
                                <button 
                                    onClick={() => setIsMicOn(!isMicOn)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all ${isMicOn ? 'bg-black/50 border-white/10 hover:bg-white/10' : 'bg-red-500/80 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
                                >
                                    {isMicOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5" />}
                                </button>
                                <button 
                                    onClick={() => setIsCamOn(!isCamOn)}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all ${isCamOn ? 'bg-black/50 border-white/10 hover:bg-white/10' : 'bg-red-500/80 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}
                                >
                                    {isCamOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5" />}
                                </button>
                                <button 
                                    onClick={() => setBgBlur(!bgBlur)}
                                    className={`px-4 h-12 rounded-full flex items-center justify-center gap-2 backdrop-blur-xl border transition-all ${bgBlur ? 'bg-[#00f2fe]/20 border-[#00f2fe]/50 text-[#00f2fe]' : 'bg-black/50 border-white/10 text-white/70 hover:bg-white/10'}`}
                                    title="Background Blur"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{bgBlur ? 'Blur On' : 'Blur Off'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Setup Controls */}
                    <div className="w-full md:w-[400px] cyber-glass p-8 rounded-[2rem] border border-white/10 flex flex-col gap-6 relative">
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#7000ff] rounded-full blur-[40px] opacity-20" />
                        
                        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                            <ShieldCheck className="w-5 h-5 text-[#00f2fe]" />
                            <span className="text-sm font-bold tracking-widest text-[#00f2fe] uppercase">End-to-End Encrypted</span>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-white/70 mb-2 block uppercase tracking-wider">Display Name</label>
                            <input 
                                className="w-full h-14 bg-black/40 border border-white/10 rounded-xl px-5 focus:outline-none focus:border-[#00f2fe] focus:ring-1 focus:ring-[#00f2fe] transition-all font-medium text-white placeholder:text-white/30"
                                placeholder="e.g. Alex Mitchell"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                                autoFocus
                            />
                        </div>

                        <div className="bg-black/30 rounded-xl p-4 border border-white/5 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60 flex items-center gap-2"><Mic className="w-4 h-4"/> Microphone</span>
                                <span className="text-[#00f2fe] font-medium flex items-center gap-1">Default (MacBook) <ChevronDown className="w-3 h-3"/></span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60 flex items-center gap-2"><Video className="w-4 h-4"/> Camera</span>
                                <span className="text-[#00f2fe] font-medium flex items-center gap-1">FaceTime HD <ChevronDown className="w-3 h-3"/></span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60 flex items-center gap-2"><Activity className="w-4 h-4"/> Noise Suppression</span>
                                <span className="text-[#00f2fe] font-medium">AI Enhanced</span>
                            </div>
                        </div>

                        <button 
                            className="btn-cyber w-full h-14 text-lg mt-2 group relative"
                            onClick={handleJoin}
                            disabled={!userName.trim()}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Join Confera
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00f2fe] to-[#7000ff] opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                        </button>
                    </div>
                </div>
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
            className="flex flex-col h-[100dvh] bg-[#050505] text-white overflow-hidden font-sans p-4 gap-4 relative"
        >
            {/* Ambient Cyber Backgrounds */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00f2fe]/5 rounded-full blur-[150px] -z-10 translate-x-1/4 -translate-y-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#7000ff]/5 rounded-full blur-[150px] -z-10 -translate-x-1/4 translate-y-1/4 pointer-events-none" />
            
            {/* NEW SLEEK NAVBAR */}
            <header className="flex-shrink-0 h-16 w-full cyber-glass rounded-[20px] px-6 flex items-center justify-between z-20 shadow-lg border border-white/5">
               {/* Left: Meeting Name & Status */}
               <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0a0f] border border-white/10 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse shadow-[0_0_8px_#00f2fe]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-white/80">Live</span>
                      <span className="text-xs font-mono text-white/50 ml-2 border-l border-white/10 pl-2">00:42:15</span>
                  </div>
               </div>

               {/* Center: Brand Logo */}
               <div className="flex items-center justify-center flex-1">
                   <h1 className="font-outfit font-extrabold text-xl tracking-tight flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f2fe] to-[#7000ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                           <Video className="w-4 h-4 text-white" />
                       </div>
                       Confera <span className="text-white/40 font-light">Pro</span>
                   </h1>
               </div>

               {/* Right: Profile & Settings Dropdown */}
               <div className="flex items-center justify-end gap-3 flex-1">
                  <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/60 hover:text-white">
                      <Settings className="w-5 h-5" />
                  </button>
                  <div className="h-6 w-px bg-white/10 mx-1" />
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-white/10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                          {userName.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold hidden md:block">{userName}</span>
                      <ChevronDown className="w-4 h-4 text-white/40" />
                   </div>
                </div>
            </header>

            <div className="flex flex-col xl:flex-row flex-1 overflow-hidden gap-4 relative z-10 min-h-0">
                <div className="flex-1 min-h-0 rounded-[32px] overflow-hidden cyber-glass border border-white/5 relative flex">
                   <VideoGrid />
                   {/* OVERLAY AI SIDEBAR (Transcripts & Recall) */}
                   <div className="absolute top-0 right-0 h-full">
                       <AISidebar />
                   </div>
                </div>
                <div className="xl:w-[400px] w-full min-h-0 flex-shrink-0 cyber-glass rounded-[32px] border border-white/5 shadow-2xl overflow-hidden flex flex-col transition-all">
                   <SidePanel />
                </div>
            </div>
            
            <div className="flex-shrink-0 flex justify-center w-full relative z-10 transition-all pb-2">
                <BottomBar />
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
