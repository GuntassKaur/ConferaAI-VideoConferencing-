'use client';
import { motion } from 'framer-motion';

import { useState } from 'react';

interface ReactionBubbleProps {
  emoji: string;
}

export default function ReactionBubble({ emoji }: ReactionBubbleProps) {
  // Randomize horizontal position so reactions don't all stack
  const [randomX] = useState(() => Math.random() * 60 + 20); // 20% to 80% from left

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: -120,
        scale: [0.5, 1.4, 1.2, 1]
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2.2, ease: 'easeOut' }}
      style={{ left: `${randomX}%`, bottom: '20%', position: 'absolute' }}
      className="text-4xl pointer-events-none select-none drop-shadow-2xl"
    >
      {emoji}
    </motion.div>
  );
}
