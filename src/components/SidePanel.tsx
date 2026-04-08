'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Sparkles, PieChart, Send, 
  RotateCcw, Copy, Check, ChevronRight, LayoutList 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeeting } from '@/context/MeetingContext';

export const SidePanel = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'recap' | 'insights'>('chat');
  const { messages, recap, requestRecap, isRecapLoading } = useMeeting();
  const [input, setInput] = useState('');

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${
        activeTab === id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      {activeTab === id && (
        <motion.div 
          layoutId="tab-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
        />
      )}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0F172A] border-l border-border">
      
      {/* Tabs Header */}
      <div className="flex items-center px-2 bg-slate-50 dark:bg-slate-900/50 border-b border-border">
        <TabButton id="chat" label="Chat" icon={MessageSquare} />
        <TabButton id="recap" label="Recap" icon={LayoutList} />
        <TabButton id="insights" label="Insights" icon={PieChart} />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col h-full gap-4"
            >
              <div className="chat-bubble-ai">
                <p className="font-semibold text-indigo-600 mb-1">AI Assistant</p>
                How can I help you today? I have access to the live transcript and meeting context.
              </div>
              
              <div className="chat-bubble-user">
                What were the main points Alex discussed regarding the Q4 roadmap?
              </div>

              <div className="chat-bubble-ai">
                Alex highlighted three main vectors for Q4:
                1. Infrastructure scaling for 10M+ users.
                2. AI Recap optimization.
                3. Enterprise security certification.
              </div>
            </motion.div>
          )}

          {activeTab === 'recap' && (
            <motion.div
              key="recap"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              <button
                onClick={requestRecap}
                disabled={isRecapLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-600/20"
              >
                <Sparkles className={`w-5 h-5 ${isRecapLoading ? 'animate-spin' : ''}`} />
                {isRecapLoading ? 'Extracting Intelligence...' : 'Generate 5-min Recap'}
              </button>

              {recap ? (
                <div className="space-y-4">
                   <div className="bg-slate-50 dark:bg-slate-800/40 border border-border p-5 rounded-2xl prose dark:prose-invert prose-sm max-w-none">
                      {recap.split('\n').map((line, i) => (
                        <p key={i} className="m-0 mb-2 last:mb-0 leading-relaxed text-slate-600 dark:text-slate-300">
                          {line}
                        </p>
                      ))}
                   </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                   <LayoutList className="w-12 h-12 mb-4 opacity-20" />
                   <p className="text-sm font-medium">No recap generated yet.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="p-5 border border-border rounded-2xl bg-slate-50 dark:bg-slate-800/40">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Speaker Engagement</h4>
                 <div className="space-y-4">
                    {[
                      { name: 'Alex M.', role: 'Moderator', color: 'bg-indigo-500', width: '75%' },
                      { name: 'Sarah J.', role: 'Speaker', color: 'bg-blue-500', width: '45%' },
                      { name: 'You', role: 'Participant', color: 'bg-emerald-500', width: '20%' },
                    ].map((s) => (
                      <div key={s.name} className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-bold">
                           <span className="text-slate-700 dark:text-slate-200">{s.name} <span className="text-slate-400 font-medium font-inter">({s.role})</span></span>
                           <span className="text-slate-500">{s.width}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                           <div className={`h-full ${s.color}`} style={{ width: s.width }} />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-5 border border-border rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20">
                 <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">Meeting Sentiment</h4>
                 <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                    The conversation is highly collaborative and positive. Strong alignment on technical goals.
                 </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeTab === 'chat' && (
        <div className="p-4 border-t border-border bg-slate-50 dark:bg-slate-900/50">
          <div className="relative flex items-center">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Confera AI..."
              className="w-full bg-white dark:bg-slate-800 border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none shadow-sm"
            />
            <button 
              className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
