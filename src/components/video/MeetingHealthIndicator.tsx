'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HealthData } from '@/hooks/useMeetingHealth';
import { CountUp } from '@/components/ui/AnimatedComponents';

interface MeetingHealthIndicatorProps {
  healthData: HealthData;
}

const STATUS_COLOR = {
  excellent: { stroke: '#22c55e', text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  good:      { stroke: '#6366f1', text: 'text-indigo-500',  bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20'  },
  lagging:   { stroke: '#f59e0b', text: 'text-amber-500',   bg: 'bg-amber-500/10',   border: 'border-amber-500/20'   },
  critical:  { stroke: '#ef4444', text: 'text-red-500',     bg: 'bg-red-500/10',     border: 'border-red-500/20'     },
};

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MeetingHealthIndicator({ healthData }: MeetingHealthIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { score, status, insights, participantTalkTimes } = healthData;
  const colors = STATUS_COLOR[status];
  const dashOffset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  const totalTalk = Object.values(participantTalkTimes).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="absolute top-4 right-4 z-40">
      <motion.div
        layout
        className={`${colors.bg} border ${colors.border} rounded-2xl backdrop-blur-xl shadow-2xl overflow-hidden`}
      >
        {/* Collapsed: circular score */}
        <button
          onClick={() => setIsExpanded(v => !v)}
          className="flex items-center gap-3 p-3 hover:opacity-80 transition-opacity"
        >
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
            <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
            <motion.circle
              cx="28" cy="28" r={RADIUS}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              initial={{ strokeDashoffset: CIRCUMFERENCE }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            {/* Score number in center */}
            <text
              x="28" y="28"
              textAnchor="middle"
              dominantBaseline="central"
              className="rotate-90"
              style={{ transform: 'rotate(90deg)', transformOrigin: '28px 28px' }}
              fill="white"
              fontSize="12"
              fontWeight="900"
            >
              {score}
            </text>
          </svg>
          <div className="text-left">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Health</p>
            <p className={`text-[10px] font-black uppercase tracking-tighter ${colors.text}`}>{status}</p>
          </div>
        </button>

        {/* Expanded: insights + talk time bars */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 space-y-4 max-w-[240px]">
                {/* Insights */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Neural Insights</p>
                  {insights.map((ins, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${colors.text.replace('text-', 'bg-')}`} />
                      <p className="text-[10px] text-slate-300 font-medium leading-snug">{ins}</p>
                    </div>
                  ))}
                </div>

                {/* Talk time bars */}
                {Object.keys(participantTalkTimes).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Talk Distribution</p>
                    {Object.entries(participantTalkTimes).map(([name, time]) => (
                      <div key={name} className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold">
                          <span className="text-slate-400 truncate max-w-[120px]">@{name}</span>
                          <span className={colors.text}>{Math.round((time / totalTalk) * 100)}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(time / totalTalk) * 100}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full`}
                            style={{ background: colors.stroke }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
