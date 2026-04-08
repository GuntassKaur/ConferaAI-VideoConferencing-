'use client';

import React, { useState, useEffect } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { useRoomStore } from '@/store/useRoomStore';
import { Send, Sparkles, User, FileText, Globe2, BarChart3, MessageSquare, Download, Mic, Plus, CheckCircle2, Wand2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SidePanel = () => {
  const { requestRecap, recap, isRecapLoading } = useMeeting();
  const { transcripts } = useRoomStore();
  
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat'|'notes'|'analytics'|'translate'>('chat');
  const [messages, setMessages] = useState<{role: string, text: string, timestamp: Date}[]>([]);
  
  // Smart Notes States
  const [notes, setNotes] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);

  const handleAIMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date() }]);
    setChatInput('');
    
    // Simulate AI typing response with context awareness
    setTimeout(() => {
      let aiResponse = "I'm analyzing the meeting flow...";
      if (userMsg.toLowerCase().includes('discuss')) {
         aiResponse = "We're currently focusing on the Q4 Product Vision. Alex Miller suggested integrating higher-tier glassmorphism into the lobby experience.";
      } else if (userMsg.toLowerCase().includes('action')) {
          aiResponse = "I've picked up 2 action items so far: 1. Sarah to finalize the API docs. 2. Engineering to fix the build memory leaks.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse, timestamp: new Date() }]);
    }, 1200);
  };

  const handleGenerateSmartNotes = async () => {
    if (transcripts.length < 2) return;
    setIsGeneratingNotes(true);
    try {
      const context = transcripts.slice(-30).map(t => `${t.speaker}: ${t.text}`).join('\n');
      const response = await fetch('/api/recap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: context })
      });
      const data = await response.json();
      if (data.recap) {
          // Append to existing notes with a separator
          const separator = notes ? '\n\n---\n\n' : '';
          setNotes(prev => prev + separator + data.recap);
          setActiveTab('notes');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const tabs = [
    { id: 'chat', label: 'AI Pilot', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'notes', label: 'Smart Notes', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Engagement', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[#050505] w-full text-white">
      {/* Header Tabs (Teams/Microsoft Style) */}
      <div className="p-4 border-b border-white/5 flex gap-1 flex-shrink-0 bg-[#0a0a0f]/50 backdrop-blur-md">
         {tabs.map((tab) => (
            <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${activeTab === tab.id ? 'bg-[#00f2fe]/10 border-[#00f2fe]/40 text-[#00f2fe] shadow-[0_0_15px_rgba(0,242,254,0.1)]' : 'bg-transparent border-transparent text-white/40 hover:text-white/60'}`}
            >
               {tab.icon} {tab.label}
            </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
         <AnimatePresence mode="wait">
            
         {/* TAB: AI PILOT */}
         {activeTab === 'chat' && (
           <motion.div key="chat" initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-10}} className="space-y-6">
             <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#00f2fe]/10 flex-shrink-0 flex items-center justify-center text-[#00f2fe] border border-[#00f2fe]/20">
                   <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div className="cyber-glass border border-white/10 p-4 rounded-2xl rounded-tl-sm text-sm text-white/80 leading-relaxed max-w-[85%] font-medium">
                   Hello. I'm the Confera AI. I am monitoring the live audio stream. How can I assist you?
                </div>
             </div>

             {messages.map((m, i) => (
                <div key={i} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center border ${m.role === 'user' ? 'bg-white/5 border-white/10 text-white/60' : 'bg-[#00f2fe]/10 border-[#00f2fe]/20 text-[#00f2fe]'}`}>
                       {m.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className={`${m.role === 'user' ? 'bg-[#00f2fe] text-black rounded-tr-sm font-bold shadow-[0_0_20px_rgba(0,242,254,0.3)]' : 'cyber-glass border border-white/10 text-white/80 rounded-tl-sm'} p-4 rounded-2xl text-sm max-w-[85%] font-medium`}>
                       {m.text}
                       <div className={`text-[9px] mt-2 opacity-40 font-bold uppercase tracking-widest ${m.role === 'user' ? 'text-black' : 'text-white'}`}>
                          {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                </div>
             ))}
           </motion.div>
         )}

         {/* TAB: SMART NOTES */}
         {activeTab === 'notes' && (
           <motion.div key="notes" initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-10}} className="h-full flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#00f2fe]">Intelligent Workspace</h3>
                 <button 
                  onClick={handleGenerateSmartNotes}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-2 rounded-lg hover:bg-[#00f2fe]/20 transition-all border border-[#00f2fe]/30"
                 >
                    {isGeneratingNotes ? <Loader2 className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3" />}
                    Magic Bullet Points
                 </button>
              </div>

              <div className="flex-1 min-h-[300px] cyber-glass border border-white/10 rounded-2xl p-6 flex flex-col relative group">
                 <textarea 
                    className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-white/80 font-medium leading-relaxed placeholder:text-white/10"
                    placeholder="Start typing your thoughts or use 'Magic Bullet Points'..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                 />
                 
                 {notes === '' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10 pointer-events-none">
                       <FileText className="w-20 h-20 mb-4" />
                       <span className="text-xs font-black uppercase tracking-widest">Workspace Empty</span>
                    </div>
                 )}

                 <div className="pt-4 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold">Auto-syncing to cloud...</span>
                    <div className="flex items-center gap-3">
                       <button className="text-white hover:text-[#00f2fe]"><Plus className="w-4 h-4" /></button>
                       <button className="text-white hover:text-[#00f2fe]"><Download className="w-4 h-4" /></button>
                       <button className="text-white hover:text-[#00f2fe]"><CheckCircle2 className="w-4 h-4" /></button>
                    </div>
                 </div>
              </div>
           </motion.div>
         )}

         {/* TAB: ENGAGEMENT ANALYTICS */}
         {activeTab === 'analytics' && (
           <motion.div key="analytics" initial={{opacity:0, x:10}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-10}}>
             <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#7000ff] mb-6">Neural Insights</h3>
             <div className="space-y-4">
                <div className="cyber-glass p-5 border border-white/10 group">
                   <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-xs uppercase tracking-widest text-white/60">Voice Profile: You</span>
                      <span className="text-xs font-black text-[#00f2fe]">42%</span>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#00f2fe] to-indigo-500 h-full w-[42%] group-hover:shadow-[0_0_15px_rgba(0,242,254,0.5)] transition-all" />
                   </div>
                </div>
                <div className="cyber-glass p-5 border border-white/10 group">
                   <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-xs uppercase tracking-widest text-white/60">Voice Profile: Guest #1</span>
                      <span className="text-xs font-black text-[#7000ff]">38%</span>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-[#7000ff] h-full w-[38%] group-hover:shadow-[0_0_15px_rgba(112,0,255,0.5)] transition-all" />
                   </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                   <div className="cyber-glass p-4 border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Sentiment</div>
                      <div className="text-xl font-black text-green-400">92%</div>
                   </div>
                   <div className="cyber-glass p-4 border border-white/5 text-center">
                      <div className="text-[10px] font-bold text-white/40 uppercase mb-1">Clarity</div>
                      <div className="text-xl font-black text-[#00f2fe]">High</div>
                   </div>
                </div>
             </div>
           </motion.div>
         )}
         
         </AnimatePresence>
      </div>

      {/* Input Area (Only for AI Pilot) */}
      {activeTab === 'chat' && (
         <div className="p-6 border-t border-white/5 bg-[#0a0a0f]/50 backdrop-blur-xl flex-shrink-0">
          <div className="relative group flex items-center gap-3">
             <button className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white/5 hover:bg-[#00f2fe]/10 text-white/60 hover:text-[#00f2fe] rounded-2xl transition-all border border-white/10 group-focus-within:border-[#00f2fe]/30" title="Voice Commands">
                <Mic className="w-5 h-5" />
             </button>
             <div className="relative flex-1">
                <input 
                   type="text"
                   placeholder="Command Confera AI..."
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAIMessage()}
                   className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-[#00f2fe]/50 focus:bg-white/10 transition-all font-medium placeholder:text-white/20 pr-12"
                />
                <button 
                  onClick={handleAIMessage} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#00f2fe] to-[#7000ff] text-black rounded-xl hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                >
                   <Send className="w-4 h-4 ml-0.5" />
                </button>
             </div>
          </div>
         </div>
      )}
    </div>
  );
};
