import { useEffect, useRef, useState } from 'react';
import { useTranscriptStore } from '@/store/useTranscriptStore';
import { Bot, MessageSquare, X, Zap, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface TranscriptPanelProps {
  onClose?: () => void;
}

export function TranscriptPanel({ onClose }: TranscriptPanelProps) {
  const { segments, getFullTranscript } = useTranscriptStore();
  const [activeTab, setActiveTab] = useState<'transcript' | 'recap' | 'notes' | 'copilot'>('transcript');
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
      className="absolute top-4 right-4 bottom-32 w-[380px] bg-[#0a0a1a]/90 backdrop-blur-3xl border border-white/10 rounded-[24px] shadow-2xl flex flex-col overflow-hidden z-40"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-white">ConferaAI</h2>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex border-b border-white/10 bg-black/20">
        <button onClick={() => setActiveTab('transcript')} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center justify-center space-y-1 ${activeTab === 'transcript' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:text-white/80'}`}>
          <MessageSquare className="w-4 h-4" /> <span>Live</span>
        </button>
        <button onClick={() => setActiveTab('recap')} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center justify-center space-y-1 ${activeTab === 'recap' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:text-white/80'}`}>
          <Zap className="w-4 h-4" /> <span>Recap</span>
        </button>
        <button onClick={() => setActiveTab('notes')} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center justify-center space-y-1 ${activeTab === 'notes' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:text-white/80'}`}>
          <FileText className="w-4 h-4" /> <span>Notes</span>
        </button>
        <button onClick={() => setActiveTab('copilot')} className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors flex flex-col items-center justify-center space-y-1 ${activeTab === 'copilot' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:text-white/80'}`}>
          <Sparkles className="w-4 h-4" /> <span>Copilot</span>
        </button>
      </div>

      {activeTab === 'transcript' && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {segments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-2">
              <MessageSquare className="w-8 h-8 opacity-50" />
              <p className="text-sm text-center">Transcript will appear here when someone speaks</p>
            </div>
          ) : (
            segments.map((segment) => (
              <div key={segment.id} className="group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-semibold ${getSpeakerColor(segment.speakerId)}`}>
                    {segment.speakerName}
                  </span>
                  <span className="text-[10px] text-white/30 font-mono">
                    {new Date(segment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${segment.confidence < 0.7 ? 'italic text-white/60' : 'text-white/90'}`}>
                  {segment.text}
                  {!segment.isFinal && <span className="inline-block w-1 h-1 bg-indigo-500 rounded-full ml-1 animate-pulse" />}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'recap' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex flex-col items-center text-center">
            <Zap className="w-8 h-8 text-indigo-400 mb-2" />
            <h3 className="font-semibold text-white">Live AI Recap</h3>
            <p className="text-xs text-indigo-300 mt-1">Generating summaries from context...</p>
          </div>
          <div className="space-y-3">
             <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-sm text-white/80">
                <span className="font-bold text-emerald-400">Decision:</span> Moving forward with Q3 Budget.
             </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <textarea 
          placeholder="Type private meeting notes here..." 
          className="flex-1 bg-transparent p-4 text-sm text-white outline-none resize-none placeholder:text-white/30"
        />
      )}

      {activeTab === 'copilot' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center text-center">
            <div className="space-y-2">
              <Sparkles className="w-10 h-10 text-purple-400 mx-auto opacity-50" />
              <p className="text-sm text-white/50">Ask anything about the meeting.</p>
            </div>
          </div>
          <div className="p-4 border-t border-white/10">
            <input 
              type="text" 
              placeholder="e.g. What did Sarah say about..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
