'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Copy, Check, Loader2, Link as LinkIcon } from 'lucide-react';

export default function NewSessionModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [sessionName, setSessionName] = useState('');
  const [requireName, setRequireName] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  // Fake ID for the UI
  const inviteLink = `https://confera.ai/join/${Math.random().toString(36).substring(2, 9)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      // Attempt to hit the rooms/create endpoint
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sessionName, requireName })
      });
      
      const data = await res.json();
      
      if (data.roomId) {
        router.push(`/session/${data.roomId}`);
      } else {
        // Fallback for demo
        router.push(`/session/${Math.random().toString(36).substring(2, 10)}`);
      }
    } catch (error) {
      console.error(error);
      setIsStarting(false);
      // Fallback
      router.push(`/session/${Math.random().toString(36).substring(2, 10)}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-[#0f0f13] border border-[#1e1e27] rounded-2xl p-6 w-full max-w-[440px] mt-[20vh] pointer-events-auto shadow-2xl relative mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Start a new session</h3>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-[#1e1e27] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Session name (optional)</label>
                  <input 
                    type="text" 
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="e.g. Q3 Design Sync"
                    className="w-full bg-[#08080a] border border-[#1e1e27] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400">Invite link</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
                      <input 
                        type="text" 
                        readOnly
                        value={inviteLink}
                        className="w-full bg-[#08080a] border border-[#1e1e27] rounded-xl pl-9 pr-4 py-3 text-sm text-slate-400 focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="w-11 h-11 shrink-0 bg-[#17171d] border border-[#1e1e27] rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:border-indigo-500 transition-all"
                    >
                      {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#08080a] border border-[#1e1e27] rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-white">Require name for guests</p>
                    <p className="text-xs text-slate-500">Unregistered users must enter a name</p>
                  </div>
                  <button 
                    onClick={() => setRequireName(!requireName)}
                    className={`w-10 h-6 rounded-full transition-colors relative flex items-center ${requireName ? 'bg-indigo-500' : 'bg-[#1e1e27]'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute transition-transform shadow-sm ${requireName ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-[#1e1e27] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <motion.button 
                  whileTap={{ scale: 0.97 }}
                  onClick={handleStart}
                  disabled={isStarting}
                  className="flex-1 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isStarting ? <Loader2 size={18} className="animate-spin" /> : "Start session now"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
