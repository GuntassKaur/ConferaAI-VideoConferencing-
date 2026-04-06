'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EMOJIS = ['❤️', '👏', '😂', '😮', '😢', '🔥', '👍', '🎉'];

export const EmojiReactions = ({ onReact }: { onReact: (emoji: string) => void }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-white fluent-glass rounded-full border border-slate-200 shadow-xl">
      {EMOJIS.map((emoji) => (
        <motion.button
          key={emoji}
          whileHover={{ scale: 1.3, y: -5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onReact(emoji)}
          className="w-10 h-10 flex items-center justify-center text-xl hover:bg-slate-50 rounded-full transition-colors"
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
};

export const FloatingEmoji = ({ emoji, x, y }: { emoji: string, x: number, y: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 0 }}
      animate={{ opacity: 1, scale: 1.5, y: -200 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
      style={{ left: x, bottom: y }}
      className="fixed pointer-events-none text-3xl z-[100]"
    >
      {emoji}
    </motion.div>
  );
};
