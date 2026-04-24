'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface WhisperInputProps {
  onSend: (text: string) => void;
}

export default function WhisperInput({ onSend }: WhisperInputProps) {
  const [text, setText] = useState('');
  const MAX_CHARS = 80;

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > MAX_CHARS) return;
    onSend(trimmed);
    setText('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#18181b]/90 backdrop-blur-2xl border border-[#27272a] rounded-2xl px-3 py-2 flex items-center gap-2 shadow-2xl min-w-[220px]"
    >
      <span className="text-xs">🤫</span>
      <input
        type="text"
        maxLength={MAX_CHARS}
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSend()}
        placeholder="Whisper to host..."
        className="bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none flex-1 w-full"
      />
      <span className="text-[9px] font-black text-slate-700 tabular-nums">
        {text.length}/{MAX_CHARS}
      </span>
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className="p-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 rounded-lg text-white transition-all"
      >
        <Send size={10} />
      </button>
    </motion.div>
  );
}
