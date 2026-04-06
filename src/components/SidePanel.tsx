'use client';

import React, { useState } from 'react';
import { useMeeting } from '@/context/MeetingContext';
import { Send, Sparkles, User, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SidePanel = () => {
  const { requestRecap, recap, isRecapLoading } = useMeeting();
  const [chatInput, setChatInput] = useState('');
  const [showRecapUi, setShowRecapUi] = useState(false);

  // We make it look like a pure AI assistant panel.
  
  const handleRecapRequest = () => {
    setShowRecapUi(true);
    requestRecap();
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white flex-shrink-0">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
               <Sparkles className="w-4 h-4" />
             </div>
             <h2 className="font-bold font-outfit text-slate-900 tracking-tight text-lg">AI Assistant</h2>
         </div>
         <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Settings2 className="w-5 h-5" />
         </button>
      </div>

      {/* Chat / Timeline Area */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/50 space-y-6">
         {/* Initial greeting bubble */}
         <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white premium-shadow">
               <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm leading-relaxed max-w-[85%] mt-1">
               Hi! I'm monitoring this meeting in the background. I can generate a 5-minute recap whenever you need.
            </div>
         </div>

         <AnimatePresence>
         {showRecapUi && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex gap-3 flex-row-reverse"
             >
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-600">
                   <User className="w-4 h-4" />
                </div>
                <div className="bg-indigo-600 text-white p-4 rounded-2xl rounded-tr-sm text-sm shadow-md max-w-[85%] mt-1 font-medium">
                   Can you generate the 5-Minute Recap of this meeting?
                </div>
             </motion.div>
         )}

         {showRecapUi && isRecapLoading && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex gap-3"
             >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white premium-shadow">
                   <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-700 shadow-sm flex items-center gap-2 mt-1">
                   <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                   <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                   <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
             </motion.div>
         )}

         {recap && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                 <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white premium-shadow mt-1">
                    <Sparkles className="w-4 h-4" />
                 </div>
                 <div className="bg-white border border-slate-100 p-5 rounded-2xl rounded-tl-sm text-sm shadow-sm w-full font-inter space-y-4">
                    <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 font-outfit">Meeting Intelligence Report</h4>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap format-markdown text-[13px]">
                        {recap}
                    </div>
                 </div>
              </motion.div>
         )}
         </AnimatePresence>
      </div>

      {/* Input / Control Area */}
      <div className="p-5 border-t border-slate-100 bg-white flex-shrink-0">
          {!recap && (
               <button 
                  onClick={handleRecapRequest}
                  disabled={isRecapLoading}
                  className="w-full btn-primary h-12 flex items-center justify-center gap-2 mb-4 group"
               >
                  {isRecapLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate 5-Minute Recap
               </button>
          )}

          <div className="relative group">
             <input 
                type="text"
                placeholder="Ask AI anything about the meeting..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-medium placeholder:text-slate-400 pr-12"
             />
             <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                <Send className="w-3.5 h-3.5 -ml-0.5" />
             </button>
          </div>
      </div>
    </div>
  );
};
