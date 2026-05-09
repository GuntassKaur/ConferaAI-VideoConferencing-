import { useEffect, useRef, useState } from 'react';
import { useTranscriptStore } from '@/store/useTranscriptStore';
import { MessageSquare, X, Zap, FileText, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface TranscriptPanelProps {
  onClose?: () => void;
}

export function TranscriptPanel({ onClose }: TranscriptPanelProps) {
  const { segments } = useTranscriptStore();
  const [activeTab, setActiveTab] = useState<'transcript' | 'recap' | 'notes' | 'insights'>('transcript');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [segments, activeTab]);

  const getSpeakerColor = (speakerId: string) => {
    if (speakerId === 'local') return 'text-indigo-400';
    const colors = ['text-purple-400', 'text-pink-400', 'text-teal-400', 'text-amber-400'];
    let hash = 0;
    for (let i = 0; i < speakerId.length; i++) {
      hash = speakerId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-4 right-4 bottom-32 w-[380px] bg-[#111827]/95 backdrop-blur-2xl border border-[#1F2937] rounded-[24px] shadow-2xl flex flex-col overflow-hidden z-40"
    >
      <div className="p-5 border-b border-[#1F2937] flex items-center justify-between bg-[#111827]/50">
        <div className="flex items-center space-x-3">
          <Activity className="w-4 h-4 text-indigo-400" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#F9FAFB]">Session Intelligence</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#1F2937] rounded-xl transition-all text-[#9CA3AF] hover:text-[#F9FAFB]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex border-b border-[#1F2937] bg-[#0B1120]/20 p-1">
        {[
          { id: 'transcript', label: 'Live', icon: MessageSquare },
          { id: 'recap', label: 'Recap', icon: Zap },
          { id: 'notes', label: 'Notes', icon: FileText },
          { id: 'insights', label: 'Insights', icon: Sparkles }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 rounded-xl ${activeTab === tab.id ? 'text-indigo-400 bg-indigo-500/10' : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]'}`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto relative bg-[#0B1120]/10">
        {activeTab === 'transcript' && (
          <div ref={scrollRef} className="absolute inset-0 p-5 space-y-5 scroll-smooth">
            {segments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF] space-y-4 opacity-50">
                <div className="w-12 h-12 rounded-2xl bg-[#111827] flex items-center justify-center border border-[#1F2937]">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-center px-8 leading-relaxed">No live transcription active. Intelligence will appear here when participants begin speaking.</p>
              </div>
            ) : (
              segments.map((segment) => (
                <div key={segment.id} className="group cursor-default p-1 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${getSpeakerColor(segment.speakerId)}`}>
                      {segment.speakerName}
                    </span>
                    <span className="text-[10px] text-[#9CA3AF] font-bold opacity-30">
                      {new Date(segment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-sm leading-relaxed font-medium ${segment.confidence < 0.7 ? 'italic text-[#9CA3AF]' : 'text-[#F9FAFB]/90'}`}>
                    {segment.text}
                    {!segment.isFinal && <span className="inline-block w-1 h-3 bg-indigo-500/50 rounded-full ml-1 animate-pulse" />}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recap' && (
          <div className="absolute inset-0 p-5 space-y-6">
            <div className="bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                 <Zap className="w-4 h-4 text-indigo-400" />
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#F9FAFB]">Session Summary</h3>
              </div>
              <p className="text-xs text-[#9CA3AF] font-medium leading-relaxed">Intelligence engine is listening. Key decisions and action items will be synthesized in real-time as the session progresses.</p>
            </div>
            
            <div className="space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF] opacity-50 px-1">Milestones</h4>
               <div className="flex items-center justify-center py-10 opacity-20 grayscale">
                  <Activity className="w-12 h-12" />
               </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <textarea 
            placeholder="Type meeting observations..." 
            className="absolute inset-0 bg-transparent p-6 text-sm text-[#F9FAFB] outline-none resize-none placeholder:text-[#9CA3AF] font-medium leading-relaxed"
          />
        )}

        {activeTab === 'insights' && (
          <div className="absolute inset-0 p-5 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <Sparkles className="w-10 h-10 text-indigo-400" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#F9FAFB]">Contextual Intelligence</p>
                <p className="text-xs text-[#9CA3AF] px-6">AI will suggest relevant data and next steps based on the conversation.</p>
              </div>
            </div>
            <div className="p-2 bg-[#0B1120]/30 border border-[#1F2937] rounded-2xl mt-auto">
              <input 
                type="text" 
                placeholder="Ask about the session..." 
                className="w-full bg-transparent px-4 py-3 text-xs text-[#F9FAFB] outline-none placeholder:text-[#9CA3AF] font-medium"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
