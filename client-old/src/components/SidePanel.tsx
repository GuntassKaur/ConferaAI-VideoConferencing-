'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Transcription } from '@/components/Transcription';
import { Polls } from '@/components/Polls';
import { BreakoutRooms } from '@/components/BreakoutRooms';
import { MeetingTimeline } from '@/components/MeetingTimeline';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Search,
  Plus,
  Languages,
  PieChart,
  Grid,
  Clock,
  X,
  Zap,
  Smile
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SidePanel = ({ activePanel, onClose }: { 
    activePanel: 'chat' | 'participants' | 'recap' | 'none' | 'transcription' | 'breakout' | 'polls',
    onClose: () => void 
}) => {
  const { messages, sendMessage, requestRecap, recap, isRecapLoading } = useMeeting();
  const [chatInput, setChatInput] = useState('');

  const handleSend = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  if (activePanel === 'none') return null;

  const getIcon = () => {
    switch (activePanel) {
      case 'chat': return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'recap': return <Sparkles className="w-5 h-5 text-primary" />;
      case 'participants': return <Users className="w-5 h-5 text-primary" />;
      case 'transcription': return <Languages className="w-5 h-5 text-primary" />;
      case 'breakout': return <Grid className="w-5 h-5 text-primary" />;
      case 'polls': return <PieChart className="w-5 h-5 text-primary" />;
      default: return null;
    }
  };

  return (
    <motion.aside
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="w-[420px] border-l border-white/5 fluent-glass h-full flex flex-col z-[40] shadow-2xl overflow-hidden"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10">
              {getIcon()}
           </div>
           <div>
             <h2 className="font-bold outfit-font text-lg leading-tight capitalize">{activePanel === 'recap' ? 'Meeting Intelligence' : activePanel}</h2>
             <span className="text-[10px] font-bold text-secondary uppercase tracking-widest leading-none">Security Core • Encrypted</span>
           </div>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5 border border-white/5" onClick={onClose}>
              <X className="w-4 h-4" />
           </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
        {activePanel === 'chat' && (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${m.senderId === 'ai' ? 'items-center my-6' : 'items-start'}`}
                >
                  {m.senderId === 'ai' ? (
                    <GlassCard className="bg-primary/5 border-primary/20 p-4 rounded-2xl text-xs text-secondary leading-relaxed max-w-[90%] text-center shadow-xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 -mr-2 -mt-2 w-8 h-8 bg-primary/10 rounded-full blur-lg group-hover:scale-150 transition-transform" />
                       <span className="font-bold text-primary flex items-center justify-center gap-1.5 mb-2 lowercase tracking-widest text-[9px]">
                          <Sparkles className="w-3 h-3" /> CONFERA AI INSIGHT
                       </span>
                       {m.content}
                    </GlassCard>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-1.5 ml-1">
                         <span className="text-[10px] font-bold text-foreground/80">{m.sender}</span>
                         <span className="text-[9px] text-zinc-500 font-medium">10:45 AM</span>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-3xl rounded-tl-sm px-5 py-3 text-sm text-foreground shadow-xl">
                        {m.content}
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {activePanel === 'recap' && (
          <div className="space-y-10">
            <div className="space-y-4">
                <Button 
                   className="w-full h-16 font-bold gap-3 text-lg shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform"
                   onClick={requestRecap}
                   disabled={isRecapLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                  {isRecapLoading ? <Sparkles className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
                  Generate AI Recap
                </Button>
                <p className="text-[9px] text-center text-secondary font-bold uppercase tracking-tighter">Powered by Confera-Intelligence Large Language Model</p>
            </div>

            {recap ? (
               <div className="space-y-8 pb-10">
                 <GlassCard className="border-emerald-500/20 bg-emerald-500/5 p-6 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
                    <div className="flex items-center gap-2 mb-4 text-emerald-500 font-bold text-sm">
                       <CheckCircle2 className="w-5 h-5" /> AI Summary Generated
                    </div>
                    <p className="text-sm text-secondary leading-relaxed font-medium">{recap}</p>
                 </GlassCard>

                 <MeetingTimeline />

                 <div className="space-y-4">
                    <h4 className="text-xs font-bold text-white uppercase ml-1 flex items-center gap-2">
                       <Zap className="w-4 h-4 text-primary" /> Key Action Items
                    </h4>
                    {[
                      'Finalize frontend design system (Due: Friday)',
                      'Scale backend to 10k concurrent users',
                      'Schedule next sync with stakeholders'
                    ].map((action, i) => (
                      <div key={i} className="flex gap-4 items-start bg-white/[0.02] p-4 rounded-2xl border border-white/5 hover:bg-white/5 transition-colors group shadow-lg">
                        <div className="mt-1 w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                             <input type="checkbox" className="accent-primary w-3 h-3 cursor-pointer" />
                        </div>
                        <span className="text-xs text-secondary font-medium leading-normal">{action}</span>
                      </div>
                    ))}
                 </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/5">
                  <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center text-primary mb-6 shadow-2xl border border-primary/20">
                     <AlertCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Intelligence Ready</h3>
                  <p className="text-xs text-secondary leading-relaxed max-w-[200px]">AI Assistant is listening. Start the meeting and click generate when ready.</p>
               </div>
            )}
          </div>
        )}

        {activePanel === 'transcription' && <Transcription />}
        {activePanel === 'polls' && <Polls />}
        {activePanel === 'breakout' && <BreakoutRooms />}
        {activePanel === 'participants' && (
            <div className="flex flex-col items-center justify-center h-full text-secondary opacity-50 space-y-4">
                <Users className="w-16 h-16" />
                <p className="font-bold text-xs uppercase tracking-widest">Active Participant List</p>
            </div>
        )}
      </div>

      {activePanel === 'chat' && (
        <div className="p-6 border-t border-white/5 bg-white/[0.02] gap-4 flex flex-col shadow-[0_-10px_20px_0px_rgba(0,0,0,0.1)]">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Message everyone..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-foreground/90 shadow-inner"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors">
                 <MessageSquare className="w-4 h-4" />
            </div>
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-primary hover:text-white hover:bg-primary transition-all rounded-xl"
                onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-secondary uppercase tracking-tighter px-2">
             <span>Encrypted Session</span>
             <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors"><Smile className="w-3.5 h-3.5" /> Reactions</span>
          </div>
        </div>
      )}
    </motion.aside>
  );
};
