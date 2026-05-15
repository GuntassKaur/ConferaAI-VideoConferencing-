'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Brain, Send, Crown, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import AIBrain from './ai/AIBrain';

interface SidebarProps {
  activeTab: 'chat' | 'people' | 'ai';
}

export default function Sidebar({ activeTab }: SidebarProps) {
  const { user } = useAuthStore();
  
  return (
    <div className="h-full flex flex-col bg-[#111113]">
      <AnimatePresence mode="wait">
        {activeTab === 'chat' && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col p-4"
          >
             <div className="flex-1 space-y-4 overflow-y-auto mb-4 custom-scrollbar pr-2">
                <div className="bg-[#18181b] p-3 rounded-2xl border border-[#27272a] max-w-[85%] self-start">
                  <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1">System Intelligence</p>
                  <p className="text-xs text-slate-300 leading-relaxed">Welcome to the secure session. Neural encryption is active. You can now communicate across the mesh.</p>
                </div>
             </div>
             
             <div className="relative mt-auto">
               <input 
                 type="text" 
                 placeholder="Type your message..."
                 className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all pr-12 shadow-inner"
               />
               <button className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors shadow-lg">
                 <Send size={14} />
               </button>
             </div>
          </motion.div>
        )}

        {activeTab === 'people' && (
          <motion.div 
            key="people"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 p-4"
          >
            <div className="flex items-center justify-between mb-4 px-1">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Authorized Nodes</h3>
               <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">1 Online</span>
            </div>
            
            <div className="space-y-2">
               <div className="flex items-center justify-between p-3 bg-[#18181b] rounded-xl border border-[#27272a] hover:border-[#3f3f46] transition-all cursor-default group">
                 <div className="flex items-center gap-3">
                   <div className="relative">
                     <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs uppercase shadow-lg shadow-indigo-600/20">
                       {user?.name?.charAt(0) || 'U'}
                     </div>
                     <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111113] rounded-full" />
                   </div>
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">{user?.name || 'Authorized User'}</span>
                     <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Session Host</span>
                   </div>
                 </div>
                 <Crown className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]" size={14} />
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'ai' && (
          <motion.div 
            key="ai"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden"
          >
            <AIBrain />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
