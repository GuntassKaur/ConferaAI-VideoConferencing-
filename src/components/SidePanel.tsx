'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Send, Sparkles, User, FileText, Globe2, BarChart3, MessageSquare, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SidePanel = () => {
  const { requestRecap, recap, isRecapLoading } = useMeeting();
  const [chatInput, setChatInput] = useState('');
  const [activeTab, setActiveTab] = useState<'chat'|'notes'|'analytics'|'translate'>('chat');
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);

  // We make it look like a pure AI assistant panel.
  const handleAIMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    
    // Simulate AI typing response
    setTimeout(() => {
      let aiResponse = "I'm analyzing the meeting context...";
      if (userMsg.toLowerCase().includes('discuss')) {
         aiResponse = "So far we've discussed the Q4 roadmap and UI redesign. Alex suggested migrating the dashboard to the new glassmorphism theme.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  const handleRecapRequest = () => {
    setActiveTab('notes');
    requestRecap();
  };

  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'notes', label: 'Nodes & Recap', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'translate', label: 'Translate', icon: <Globe2 className="w-4 h-4" /> },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--card)] w-full">
      {/* Header Tabs */}
      <div className="p-4 border-b border-[var(--border)] flex gap-2 overflow-x-auto custom-scrollbar flex-shrink-0">
         {tabs.map((tab) => (
            <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[var(--primary)] text-white premium-shadow' : 'bg-[var(--muted)] text-[var(--muted-fg)] hover:text-[var(--foreground)] border border-[var(--border)]'}`}
            >
               {tab.icon} {tab.label}
            </button>
         ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[var(--background)]/50 relative">
         <AnimatePresence mode="wait">
            
         {/* TAB: SMART CHAT AI */}
         {activeTab === 'chat' && (
           <motion.div key="chat" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-6">
             <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0 flex items-center justify-center text-white premium-shadow">
                   <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-sm text-sm text-[var(--foreground)] shadow-sm leading-relaxed max-w-[85%] mt-1 font-medium">
                   Hi! I'm your Confera Assistant. Ask me anything about this meeting, e.g., "What did Alex just say?"
                </div>
             </div>

             {messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-[var(--muted)] text-[var(--foreground)]' : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white premium-shadow'}`}>
                       {m.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className={`${m.role === 'user' ? 'bg-[var(--primary)] text-white rounded-tr-sm' : 'bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-sm'} p-4 rounded-2xl text-sm shadow-sm max-w-[85%] mt-1 font-medium`}>
                       {m.text}
                    </div>
                </div>
             ))}
           </motion.div>
         )}

         {/* TAB: NOTES & RECAP */}
         {activeTab === 'notes' && (
           <motion.div key="notes" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-6">
              {!recap && !isRecapLoading ? (
                 <div className="flex flex-col items-center justify-center text-center p-8 mt-10">
                    <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center text-[var(--primary)] mb-6">
                       <FileText className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold font-outfit mb-2">Meeting Notes</h3>
                    <p className="text-[var(--muted-fg)] text-sm mb-8 font-medium">Generate structured notes, summaries, and action items instantly with AI.</p>
                    <button onClick={handleRecapRequest} className="btn-primary w-full shadow-lg shadow-indigo-500/20">Generate Auto Notes</button>
                 </div>
              ) : isRecapLoading ? (
                 <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex-shrink-0 flex items-center justify-center text-white premium-shadow">
                       <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl rounded-tl-sm text-sm text-[var(--foreground)] shadow-sm flex items-center gap-2 mt-1">
                       Generating pristine intelligence report...
                    </div>
                 </div>
              ) : (
                 <div className="space-y-4 pb-10">
                    <div className="flex items-center justify-between">
                       <h3 className="font-bold text-lg font-outfit">Structured Intelligence</h3>
                       <button className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg hover:bg-[var(--primary)]/20 transition-colors">
                          <Download className="w-3.5 h-3.5" /> PDF
                       </button>
                    </div>
                    <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-[24px] text-sm shadow-sm font-inter space-y-4">
                       <div className="text-[var(--foreground)] leading-relaxed whitespace-pre-wrap format-markdown text-[14px] font-medium">
                           {recap}
                       </div>
                    </div>
                 </div>
              )}
           </motion.div>
         )}

         {/* TAB: ANALYTICS */}
         {activeTab === 'analytics' && (
           <motion.div key="analytics" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <h3 className="font-bold text-lg font-outfit mb-6">Live Speaker Analytics</h3>
             <div className="space-y-4">
                <div className="glass-card p-5 border border-[var(--border)]">
                   <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">You (Host)</span>
                      <span className="text-xs font-bold text-[var(--primary)]">42%</span>
                   </div>
                   <div className="w-full bg-[var(--muted)] h-2 rounded-full overflow-hidden">
                      <div className="bg-[var(--primary)] h-full w-[42%]" />
                   </div>
                </div>
                <div className="glass-card p-5 border border-[var(--border)]">
                   <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">Sarah Jenkins</span>
                      <span className="text-xs font-bold text-[var(--primary)]">38%</span>
                   </div>
                   <div className="w-full bg-[var(--muted)] h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full w-[38%]" />
                   </div>
                </div>
                <div className="glass-card p-5 border border-[var(--border)]">
                   <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">Alex Miller</span>
                      <span className="text-xs font-bold text-[var(--primary)]">20%</span>
                   </div>
                   <div className="w-full bg-[var(--muted)] h-2 rounded-full overflow-hidden">
                      <div className="bg-cyan-500 h-full w-[20%]" />
                   </div>
                </div>
             </div>
           </motion.div>
         )}

         {/* TAB: TRANSLATE */}
         {activeTab === 'translate' && (
           <motion.div key="translate" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
             <h3 className="font-bold text-lg font-outfit mb-2">Live Translation</h3>
             <p className="text-sm text-[var(--muted-fg)] font-medium mb-6">Real-time captions translated to your preference.</p>
             
             <div className="glass-card p-2 border border-[var(--border)] mb-6 flex rounded-[16px] bg-[var(--muted)]">
                 <button className="flex-1 bg-[var(--card)] shadow-sm rounded-[12px] py-1.5 text-sm font-bold">English (EN)</button>
                 <button className="flex-1 text-[var(--muted-fg)] rounded-[12px] py-1.5 text-sm font-bold hover:text-[var(--foreground)]">Español (ES)</button>
             </div>

             <div className="space-y-4">
                <div className="flex gap-4">
                   <span className="text-xs font-bold text-[var(--muted-fg)] mt-1 w-10">10:42</span>
                   <p className="flex-1 text-sm font-medium bg-[var(--card)] p-4 rounded-[20px] border border-[var(--border)]">
                      <span className="text-[var(--primary)] font-bold mb-1 block">Sarah:</span>
                      I think we should migrate entirely to the new layout by next week.
                   </p>
                </div>
                <div className="flex gap-4">
                   <span className="text-xs font-bold text-[var(--muted-fg)] mt-1 w-10">10:43</span>
                   <p className="flex-1 text-sm font-medium bg-[var(--card)] p-4 rounded-[20px] border border-[var(--border)]">
                      <span className="text-indigo-500 font-bold mb-1 block">Alex:</span>
                      ¿Podemos asegurar que el backend soportará la carga?
                      <span className="block mt-2 text-xs text-[var(--muted-fg)] bg-[var(--muted)] p-2 rounded-lg">Translated: Can we ensure the backend handles the load?</span>
                   </p>
                </div>
             </div>
           </motion.div>
         )}
         
         </AnimatePresence>
      </div>

      {/* Input Area (Only for Chat) */}
      {activeTab === 'chat' && (
         <div className="p-4 border-t border-[var(--border)] bg-[var(--card)] flex-shrink-0">
          <div className="relative group">
             <input 
                type="text"
                placeholder="Ask AI or chat with group..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAIMessage()}
                className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-[20px] px-5 py-4 text-sm focus:outline-none focus:border-[var(--primary)] focus:bg-[var(--card)] transition-all font-medium placeholder:text-[var(--muted-fg)] pr-12 shadow-inner"
             />
             <button onClick={handleAIMessage} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-[14px] hover:scale-105 transition-all shadow-md shadow-indigo-500/20">
                <Send className="w-4 h-4 ml-0.5" />
             </button>
          </div>
         </div>
      )}
    </div>
  );
};
