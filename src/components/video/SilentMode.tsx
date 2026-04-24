'use client';
import { useState, useCallback } from 'react';
import { useDataChannel, useLocalParticipant } from '@livekit/components-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactionBubble from './ReactionBubble';
import WhisperInput from './WhisperInput';

const REACTIONS = ['🔥', '👏', '❤️', '😮', '😂', '🤔'];

interface DataMessage {
  type: 'reaction' | 'whisper';
  emoji?: string;
  text?: string;
  from: string;
}

interface SilentModeProps {
  isHost: boolean;
  isSilentMode: boolean;
  onToggleSilentMode: () => void;
}

export default function SilentMode({ isHost, isSilentMode, onToggleSilentMode }: SilentModeProps) {
  const { localParticipant } = useLocalParticipant();
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; emoji: string }[]>([]);
  const [whispers, setWhispers] = useState<{ id: number; text: string; from: string }[]>([]);

  const { send } = useDataChannel('silent-mode', (msg) => {
    try {
      const decoded = JSON.parse(new TextDecoder().decode(msg.payload)) as DataMessage;
      if (decoded.type === 'reaction' && decoded.emoji) {
        const id = Date.now();
        setFloatingReactions(prev => [...prev, { id, emoji: decoded.emoji! }]);
        setTimeout(() => setFloatingReactions(prev => prev.filter(r => r.id !== id)), 2500);
      }
      if (decoded.type === 'whisper' && decoded.text && isHost) {
        const id = Date.now();
        setWhispers(prev => [...prev, { id, text: decoded.text!, from: decoded.from }]);
        setTimeout(() => setWhispers(prev => prev.filter(w => w.id !== id)), 5000);
      }
    } catch (e) {}
  });

  const sendReaction = useCallback((emoji: string) => {
    const msg: DataMessage = {
      type: 'reaction',
      emoji,
      from: localParticipant?.identity || 'Guest',
    };
    send(new TextEncoder().encode(JSON.stringify(msg)), { reliable: true });
    const id = Date.now();
    setFloatingReactions(prev => [...prev, { id, emoji }]);
    setTimeout(() => setFloatingReactions(prev => prev.filter(r => r.id !== id)), 2500);
  }, [send, localParticipant]);

  const sendWhisper = useCallback((text: string) => {
    const msg: DataMessage = {
      type: 'whisper',
      text,
      from: localParticipant?.identity || 'Guest',
    };
    send(new TextEncoder().encode(JSON.stringify(msg)), { reliable: true });
  }, [send, localParticipant]);

  return (
    <>
      {/* Floating Reactions Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
        <AnimatePresence>
          {floatingReactions.map(r => (
            <ReactionBubble key={r.id} emoji={r.emoji} />
          ))}
        </AnimatePresence>
      </div>

      {/* Host Whisper Overlay */}
      <AnimatePresence>
        {isHost && whispers.map(w => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -10, x: '-50%' }}
            className="absolute bottom-28 left-1/2 z-50 pointer-events-none"
          >
            <div className="bg-indigo-950/90 backdrop-blur-xl border border-indigo-500/30 rounded-2xl px-5 py-3 shadow-2xl shadow-indigo-500/10 max-w-sm">
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                Whisper from @{w.from}
              </p>
              <p className="text-sm text-white font-medium italic">{w.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Silent Mode Reaction Bar */}
      <AnimatePresence>
        {isSilentMode && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2"
          >
            {/* Silent Mode Banner */}
            <div className="flex items-center gap-3 bg-indigo-950/90 backdrop-blur-2xl border border-indigo-500/20 rounded-full px-5 py-2.5 shadow-2xl">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Silent Mode</span>
              <div className="w-[1px] h-4 bg-indigo-800 mx-1" />
              {REACTIONS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="text-xl hover:scale-150 transition-transform active:scale-90"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Whisper Input */}
            {!isHost && <WhisperInput onSend={sendWhisper} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Host Toggle Button */}
      {isHost && (
        <motion.button
          whileHover={{ scale: 0.97 }}
          whileTap={{ scale: 0.93 }}
          onClick={onToggleSilentMode}
          className={`absolute top-4 left-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
            isSilentMode
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
              : 'bg-[#18181b]/80 text-slate-400 border-[#27272a] hover:border-indigo-500/40 backdrop-blur-lg'
          }`}
        >
          <span>{isSilentMode ? '🤫 Silent Active' : '🤫 Silent Mode'}</span>
        </motion.button>
      )}
    </>
  );
}
