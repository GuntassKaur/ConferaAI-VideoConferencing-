'use client';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';

export default function Loading() {
  return (
    <div className="h-screen w-full bg-[#08080a] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 bg-[#6366f1] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)]">
        <Video className="text-white w-6 h-6" />
      </div>
      <div className="flex items-center text-slate-500 text-sm font-medium">
        Loading
        <span className="flex ml-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
            >
              .
            </motion.span>
          ))}
        </span>
      </div>
    </div>
  );
}
