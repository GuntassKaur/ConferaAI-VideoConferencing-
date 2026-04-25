'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore } from '@/store/useToastStore';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = Info;
          let borderColor = 'border-l-indigo-500';
          let iconColor = 'text-indigo-400';

          if (toast.type === 'success') {
            Icon = CheckCircle;
            borderColor = 'border-l-emerald-500';
            iconColor = 'text-emerald-400';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderColor = 'border-l-rose-500';
            iconColor = 'text-rose-400';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderColor = 'border-l-amber-500';
            iconColor = 'text-amber-400';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`bg-[#0f0f13] border border-[#1e1e27] border-l-[3px] ${borderColor} rounded-lg shadow-2xl p-4 pr-10 min-w-[300px] flex items-start gap-3 relative pointer-events-auto`}
            >
              <Icon size={18} className={`mt-0.5 shrink-0 ${iconColor}`} />
              <p className="text-sm text-slate-200 font-medium leading-snug">{toast.message}</p>
              <button 
                onClick={() => removeToast(toast.id)}
                className="absolute top-4 right-3 text-slate-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
