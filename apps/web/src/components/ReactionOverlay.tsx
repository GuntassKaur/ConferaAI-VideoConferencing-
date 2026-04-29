import { useEffect, useState } from 'react';
import { useEngagementStore, Reaction } from '@/store/useEngagementStore';
import { motion, AnimatePresence } from 'framer-motion';

export function ReactionOverlay({ participantId }: { participantId: string }) {
  const { reactions } = useEngagementStore();
  const [localReactions, setLocalReactions] = useState<Reaction[]>([]);

  useEffect(() => {
    // Find new reactions aimed at this participant
    const activeReactions = reactions.filter(r => r.participantId === participantId && Date.now() - r.timestamp < 4000);
    setLocalReactions(activeReactions);
  }, [reactions, participantId]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30 flex items-end justify-center pb-4">
      <AnimatePresence>
        {localReactions.map((r) => {
          // Generate deterministic random paths based on ID so it looks natural
          const randomX = (parseInt(r.id.slice(0, 4), 16) % 100) - 50;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20, x: 0, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 0.8, 0], 
                y: -150 - (Math.random() * 50), 
                x: randomX, 
                scale: [0.5, 1.5, 1, 0.8] 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute text-5xl filter drop-shadow-xl"
            >
              {r.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
