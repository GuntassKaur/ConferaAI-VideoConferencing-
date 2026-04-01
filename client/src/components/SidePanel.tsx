'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Download,
  Search,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SidePanel = ({ activePanel }: { activePanel: 'chat' | 'participants' | 'recap' | 'none' }) => {
  const { messages, sendMessage, requestRecap, recap, isRecapLoading } = useMeeting();
  const [chatInput, setChatInput] = useState('');

  const handleSend = () => {
    if (chatInput.trim()) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  if (activePanel === 'none') return null;

  return (
    <motion.aside
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="w-96 border-l border-white/5 glass-morphism h-full flex flex-col z-20"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
           {activePanel === 'chat' && <MessageSquare className="w-5 h-5 text-primary" />}
           {activePanel === 'recap' && <Sparkles className="w-5 h-5 text-primary" />}
           {activePanel === 'participants' && <Users className="w-5 h-5 text-primary" />}
           <h2 className="font-bold outfit-font capitalize">{activePanel}</h2>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="icon" className="h-8 w-8"><Search className="w-4 h-4" /></Button>
           <Button variant="ghost" size="icon" className="h-8 w-8"><Plus className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {activePanel === 'chat' && (
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${m.senderId === 'ai' ? 'items-center my-4' : 'items-start'}`}
                >
                  {m.senderId === 'ai' ? (
                    <GlassCard className="bg-primary/10 border-primary/20 p-3 rounded-xl text-xs text-secondary leading-relaxed max-w-[90%] text-center">
                       <span className="font-bold text-primary block mb-1">AI INSIGHT</span>
                       {m.content}
                    </GlassCard>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold text-secondary mb-1 ml-1">{m.sender}</span>
                      <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-2 text-sm text-foreground">
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
          <div className="space-y-6">
            <Button 
               className="w-full py-6 font-bold gap-2 text-lg shadow-primary/30"
               onClick={requestRecap}
               disabled={isRecapLoading}
            >
              {isRecapLoading ? <Sparkles className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate AI Recap
            </Button>

            <div className="flex items-center justify-between px-1">
               <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Meeting Intelligence</span>
               <Button variant="ghost" size="sm" className="h-6 text-[10px]"><Download className="w-3 h-3" /> Export</Button>
            </div>

            {recap ? (
               <div className="space-y-4">
                 <GlassCard className="border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2 mb-3 text-emerald-500 font-bold text-sm">
                       <CheckCircle2 className="w-4 h-4" /> AI Summary Generated
                    </div>
                    <p className="text-sm text-secondary leading-relaxed">{recap}</p>
                 </GlassCard>

                 <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase ml-1">Key Actions</h4>
                    {[
                      'Finalize frontend design system (Due: Friday)',
                      'Scale backend to 10k concurrent users',
                      'Schedule next sync with stakeholders'
                    ].map((action, i) => (
                      <div key={i} className="flex gap-3 items-start bg-white/5 p-3 rounded-xl border border-white/5">
                        <input type="checkbox" className="mt-1 accent-primary" />
                        <span className="text-xs text-secondary">{action}</span>
                      </div>
                    ))}
                 </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center p-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                     <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold mb-2">No recap available</h3>
                  <p className="text-xs text-secondary">Start the meeting and let AI analyze your conversation history.</p>
               </div>
            )}
          </div>
        )}
      </div>

      {activePanel === 'chat' && (
        <div className="p-4 border-t border-white/5">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Message everyone..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1.5 top-1.5 h-9 w-9 text-primary hover:text-primary/80"
                onClick={handleSend}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.aside>
  );
};
