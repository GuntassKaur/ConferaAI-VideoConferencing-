'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Video, Mic, MicOff, Camera, CameraOff, PhoneOff, 
  MessageSquare, Sparkles, Users, Search, Bell,
  ChevronLeft, Layout, Send, Info, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MeetingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'recap'>('chat');
  const [recapData, setRecapData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'system', content: 'Meeting encryption enabled (SOC2 Type II)' },
    { role: 'user', content: 'Hello everyone, I have the Q4 roadmap ready.' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { role: 'me', content: input.trim() }]);
      setInput('');
    }
  };

  const generateRecap = async () => {
    setIsGenerating(true);
    // Call API or Mock
    setTimeout(() => {
      setRecapData({
        summary: "Primary discussion focused on Q4 Roadmap execution and resource allocation for Project Confera. The team agreed on a 15% increase in compute budget for AI modeling.",
        points: [
          "Infrastructure scaling finalized by Oct 20th",
          "UI/UX review scheduled for next Tuesday",
          "Beta access opening for premium tier customers"
        ],
        actionItems: [
          "Felix to send API documentation by EOD",
          "Sarah to coordinate with the security team on SOC2 audit",
          "John to update the board on technical debt status"
        ]
      });
      setIsGenerating(false);
      setActiveTab('recap');
    }, 2000);
  };

  return (
    <div className="h-screen bg-[#F9FAFB] dark:bg-[#0A0A0B] flex flex-col font-inter overflow-hidden text-slate-900 border-none">
      
      {/* 1. Navbar: Sticky Top */}
      <header className="h-16 flex-shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <button 
           onClick={() => router.push('/dashboard')}
           className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-500" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md">Live Space</span>
            <h1 className="text-sm font-bold tracking-tight">Sync ID: <span className="text-slate-400 font-medium">{id}</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex -space-x-2 mr-4">
              {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 overflow-hidden shadow-sm" />)}
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">+2</div>
           </div>
           <button className="h-9 px-4 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-slate-200 transition-all">
              <Users className="w-4 h-4" /> Participants
           </button>
        </div>
      </header>

      {/* 2. Middle: Video Grid | AI Panel */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 relative">
        
        {/* VIDEO GRID (70%) */}
        <section className="flex-[0.7] h-full relative">
           <div className="grid grid-cols-2 gap-6 h-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-[2.5rem] relative overflow-hidden group border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:scale-[1.01] hover:shadow-xl">
                  {/* Participant Render Mock */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-slate-200 dark:from-indigo-900/20 dark:to-slate-800/20 flex items-center justify-center">
                     <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-700 shadow-xl flex items-center justify-center text-4xl font-black text-indigo-600 opacity-60">
                        {String.fromCharCode(64 + i)}
                     </div>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-xl text-white text-[10px] font-bold">
                     <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     Participant {i} {i === 1 ? '(You)' : ''}
                  </div>
                  {i === 1 && !isCamOn && (
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center text-white gap-4 z-10 transition-all">
                       <CameraOff className="w-12 h-12 text-slate-500" />
                       <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Video Feed Paused</span>
                    </div>
                  )}
                </div>
              ))}
           </div>
        </section>

        {/* AI PANEL (30%) */}
        <aside className="flex-[0.3] h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
           {/* Panel Tabs */}
           <div className="p-4 flex gap-2 border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Sync Chat
              </button>
              <button 
                onClick={() => setActiveTab('recap')}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'recap' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Recap
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {activeTab === 'chat' ? (
                <div className="flex flex-col gap-6">
                   {messages.map((m, idx) => (
                      <div key={idx} className={`flex flex-col ${m.role === 'me' ? 'items-end' : 'items-start'} max-w-[90%] ${m.role === 'me' ? 'ml-auto' : ''}`}>
                         <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
                           m.role === 'system' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-[10px] font-bold uppercase tracking-widest text-center w-full' :
                           m.role === 'me' ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' : 
                           'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                         }`}>
                            {m.content}
                         </div>
                      </div>
                   ))}
                </div>
              ) : (
                <div className="space-y-6">
                   {!recapData && !isGenerating ? (
                      <div className="flex flex-col items-center justify-center text-center p-8 space-y-6">
                         <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-inner">
                            <Sparkles className="w-8 h-8" />
                         </div>
                         <div className="space-y-2">
                           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Ready to synthesize</h3>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed">I've analyzed the transcript. Ready to extract intelligence whenever you are.</p>
                         </div>
                         <button 
                            onClick={generateRecap}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm tracking-tight transition-all shadow-lg shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3"
                         >
                            <Layout className="w-4 h-4" /> Generate 5-min Recap
                         </button>
                      </div>
                   ) : isGenerating ? (
                      <div className="flex flex-col items-center justify-center text-center p-12 space-y-4">
                         <Sparkles className="w-10 h-10 text-indigo-600 animate-spin" />
                         <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600 animate-pulse">Extracting Intelligence...</span>
                      </div>
                   ) : (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                         <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-3 flex items-center gap-2">
                               <Info className="w-3.5 h-3.5" /> High-Level Summary
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{recapData.summary}</p>
                         </div>
                         
                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 pl-2">
                               <Star className="w-3.5 h-3.5" /> Key Intelligence Points
                            </h4>
                            <div className="space-y-3">
                               {recapData.points.map((p: any, idx: number) => (
                                  <div key={idx} className="flex gap-4 items-start p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                                     <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-xs flex-shrink-0">{idx + 1}</div>
                                     <p className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-tight leading-none pt-1.5">{p}</p>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2 pl-2">
                               <Send className="w-3.5 h-3.5 rotate-45" /> Assigned Action Items
                            </h4>
                            <div className="space-y-2">
                               {recapData.actionItems.map((item: any, idx: number) => (
                                  <div key={idx} className="flex items-center gap-3 px-4 py-3 bg-indigo-50/30 dark:bg-indigo-500/5 rounded-xl border border-indigo-100/50 dark:border-indigo-500/10">
                                     <div className="w-2 h-2 rounded-full bg-indigo-600" />
                                     <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item}</span>
                                  </div>
                               ))}
                            </div>
                         </div>

                         <button 
                            onClick={() => setRecapData(null)}
                            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl font-bold text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                         >
                            Regenerate Analysis
                         </button>
                      </motion.div>
                   )}
                </div>
              )}
           </div>

           {/* Panel Footer (only for chat) */}
           {activeTab === 'chat' && (
              <form onSubmit={handleSendMessage} className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                 <input 
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 h-11 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                 />
                 <button type="submit" className="w-11 h-11 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-90">
                    <Send className="w-5 h-5" />
                 </button>
              </form>
           )}
        </aside>

        {/* 3. Floating Control Bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-full shadow-2xl z-[100]">
           <button 
             onClick={() => setIsMicOn(!isMicOn)}
             className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
               isMicOn ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
             }`}
           >
              {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
           </button>
           <button 
             onClick={() => setIsCamOn(!isCamOn)}
             className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
               isCamOn ? 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'
             }`}
           >
              {isCamOn ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
           </button>
           <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2" />
           <button 
             onClick={() => router.push('/dashboard')}
             className="h-14 px-8 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 flex items-center gap-3 active:scale-95"
           >
              <PhoneOff className="w-5 h-5" /> End Synchronization
           </button>
        </div>
      </main>

    </div>
  );
}
