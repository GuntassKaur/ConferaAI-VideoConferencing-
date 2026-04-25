'use client';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { useState, useEffect, ReactNode, useRef } from 'react';

// 1. AnimatedButton with Ripple Effect
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AnimatedButton = ({ children, className, onClick, ...props }: any) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    onClick?.(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 0.98 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleRipple}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: 'absolute',
              top: ripple.y,
              left: ripple.x,
              width: '20px',
              height: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// 2. GlowCard
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GlowCard = ({ children, className, ...props }: any) => {
  return (
    <motion.div
      whileHover={{ 
        boxShadow: '0 0 0 1px #6366f1, 0 0 20px rgba(99, 102, 241, 0.15)',
        borderColor: 'rgba(99, 102, 241, 0.5)'
      }}
      transition={{ duration: 0.3 }}
      className={`bg-[#111113] border border-[#27272a] rounded-2xl transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// 3. CountUp
export const CountUp = ({ to, duration = 1.5 }: { to: number; duration?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    return controls.stop;
  }, [to, duration]);

  useEffect(() => {
    return rounded.onChange((latest) => setDisplayValue(latest));
  }, [rounded]);

  return <span>{displayValue}</span>;
};

// 4. StaggerList
export const StaggerList = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.07,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
      }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// 5. TypewriterText
export const TypewriterText = ({ text, speed = 30, cursor = true }: { text: string; speed?: number; cursor?: boolean }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {cursor && <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[2px] h-[1em] bg-indigo-500 ml-1 translate-y-[2px]"
      />}
    </span>
  );
};

// 6. PulsingDot
export const PulsingDot = ({ color = '#f43f5e' }: { color?: string }) => {
  return (
    <div className="relative flex items-center justify-center w-3 h-3">
      <div className="absolute w-full h-full rounded-full opacity-75 animate-ping" style={{ backgroundColor: color }} />
      <div className="relative w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
    </div>
  );
};
