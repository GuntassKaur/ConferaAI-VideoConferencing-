'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Brain, Send, Sparkles, Activity, MessageSquare, Zap, ChevronRight } from 'lucide-react';
import { useTranscriptStore } from '@/store/useTranscriptStore';
import { useAuthStore } from '@/store/useAuthStore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIBrain() {
  const { roomId } = useParams();
  const { user } = useAuthStore();
  const { getFullText } = useTranscriptStore();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [liveInsights, setLiveInsights] = useState<string[]>([]);
  const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggestions
  const suggestions = [
    "Summarize so far",
    "What are open questions?",
    "Draft action items",
    "Who spoke the most?"
  ];

  // Auto-refresh insights every 2 minutes
  useEffect(() => {
    refreshInsights();
    const interval = setInterval(refreshInsights, 120000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const refreshInsights = async () => {
    const transcript = getFullText();
    if (!transcript) {
       setLiveInsights(["Monitoring for neural input...", "Spectral analysis active", "Waiting for verbal exchange"]);
       return;
    }

    setIsRefreshingInsights(true);
    try {
      const res = await fetch('/api/ai/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: "Provide 3 concise tactical insights about this meeting so far as a bulleted list. No intro, just the bullets.",
          transcript,
          participants: [user?.name || 'Authorized Node'],
          roomName: roomId
        })
      });
      
      const reader = res.body?.getReader();
      if (!reader) return;

      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            fullText += data.text;
          }
        }
      }
      setLiveInsights(fullText.split('\n').filter(l => l.trim()).slice(0, 3));
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshingInsights(false);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    
    const transcript = getFullText();
    const newUserMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsStreaming(true);
    setStreamingText('');

    try {
      const res = await fetch('/api/ai/brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          transcript,
          participants: [user?.name || 'Authorized Node'],
          roomName: roomId
        })
      });

      const reader = res.body?.getReader();
      if (!reader) return;

      let accumulated = "";
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              accumulated += data.text;
              setStreamingText(accumulated);
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: accumulated }]);
      setStreamingText('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 bg-[#111113]">
      {/* Live Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Sparkles size={16} className="text-amber-500 animate-pulse" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Neural Insights</h3>
           </div>
           {isRefreshingInsights && <Activity size={12} className="text-indigo-500 animate-spin" />}
        </div>
        
        <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-2xl p-4 space-y-3 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-5 transition-opacity">
            <Sparkles size={60} className="text-indigo-500" />
          </div>
          {liveInsights.map((insight, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-3 items-start relative z-10"
            >
              <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{insight.replace(/^[*-]\s*/, '')}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Neural Chat Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} className="text-indigo-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Neural Assistant</h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2 mb-4">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 && !isStreaming && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full opacity-20"
              >
                <Brain size={48} className="mb-4 text-slate-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Awaiting Query</p>
              </motion.div>
            )}
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#18181b] border border-[#27272a] text-slate-300 rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isStreaming && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start"
              >
                <div className="max-w-[90%] p-3.5 rounded-2xl text-xs leading-relaxed bg-[#18181b] border border-[#27272a] text-slate-300 rounded-tl-none shadow-xl">
                  {streamingText}
                  <span className="inline-block w-1 h-3 bg-indigo-500 ml-1 animate-pulse" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-[9px] font-black uppercase tracking-widest text-slate-500 hover:border-indigo-500/50 hover:text-white hover:bg-indigo-500/5 transition-all whitespace-nowrap"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative">
           <input 
             type="text" 
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
             placeholder="Query Neural Brain..."
             className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-4 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all pr-12 shadow-inner"
           />
           <button 
             onClick={() => sendMessage(input)}
             className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
           >
             <Send size={14} />
           </button>
        </div>
      </div>
    </div>
  );
}
