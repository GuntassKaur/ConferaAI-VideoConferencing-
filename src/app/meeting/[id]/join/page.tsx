'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Shield, Loader2, ArrowLeft, User, CheckCircle2, XCircle } from 'lucide-react';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useProductStore();
  const meetingId = params.id as string;
  
  const [status, setStatus] = useState<'idle' | 'requesting' | 'waiting' | 'accepted' | 'rejected'>('idle');
  const [meetingName, setMeetingName] = useState('');

  const checkStatus = useCallback(async () => {
    if (status !== 'waiting') return;
    try {
      const res = await fetch(`/api/meeting/${meetingId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, name: currentUser?.name })
      });
      const data = await res.json();
      if (data.status === 'accepted') {
        setStatus('accepted');
        setTimeout(() => router.push(`/meeting/${meetingId}`), 1500);
      } else if (data.status === 'rejected') {
        setStatus('rejected');
      }
    } catch (e) {
      console.error(e);
    }
  }, [meetingId, currentUser, status, router]);

  useEffect(() => {
    const fetchMeeting = async () => {
      const res = await fetch(`/api/meeting/${meetingId}`);
      if (res.ok) {
        const data = await res.json();
        setMeetingName(data.name);
        // If user is host, redirect immediately
        if (data.hostId === currentUser?.id) {
            router.push(`/meeting/${meetingId}`);
        }
      } else {
        router.push('/dashboard');
      }
    };
    if (currentUser) fetchMeeting();
    else router.push('/login');
  }, [meetingId, currentUser, router]);

  useEffect(() => {
    let interval: any;
    if (status === 'waiting') {
      interval = setInterval(checkStatus, 3000);
    }
    return () => clearInterval(interval);
  }, [status, checkStatus]);

  const requestJoin = async () => {
    setStatus('requesting');
    try {
      const res = await fetch(`/api/meeting/${meetingId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser?.id, name: currentUser?.name })
      });
      const data = await res.json();
      if (data.status === 'accepted') {
        setStatus('accepted');
        setTimeout(() => router.push(`/meeting/${meetingId}`), 1000);
      } else {
        setStatus('waiting');
      }
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#0a0a0c] border border-white/5 rounded-[4rem] p-12 lg:p-16 shadow-2xl relative z-10"
      >
        <header className="mb-12">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Hub</span>
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-500 border border-white/10">
              <Video size={24} />
            </div>
            <div>
               <h1 className="text-3xl font-black text-white tracking-tight leading-none mb-1">Join Session</h1>
               <p className="text-slate-500 text-sm font-medium">Node: {meetingId}</p>
            </div>
          </div>
        </header>

        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 mb-10 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
           <h2 className="text-xl font-bold text-white mb-2">{meetingName || 'Connecting...'}</h2>
           <p className="text-slate-500 text-sm mb-10">This session requires host authorization to enter.</p>
           
           <AnimatePresence mode="wait">
             {status === 'idle' && (
               <motion.button
                 key="idle"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 onClick={requestJoin}
                 className="w-full py-6 bg-white text-black font-black text-xs uppercase tracking-widest rounded-3xl hover:bg-indigo-600 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 group"
               >
                 <User size={18} className="group-hover:scale-110 transition-transform" />
                 Request Authorization
               </motion.button>
             )}

             {(status === 'requesting' || status === 'waiting') && (
               <motion.div
                 key="waiting"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="flex flex-col items-center"
               >
                 <div className="relative mb-6">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Shield className="text-indigo-500/50" size={24} />
                    </div>
                 </div>
                 <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">Waiting for host approval...</p>
               </motion.div>
             )}

             {status === 'accepted' && (
               <motion.div
                 key="accepted"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center"
               >
                 <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/20">
                    <CheckCircle2 size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">Access Granted</h3>
                 <p className="text-slate-500 text-sm">Entering neural workspace...</p>
               </motion.div>
             )}

             {status === 'rejected' && (
               <motion.div
                 key="rejected"
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="flex flex-col items-center"
               >
                 <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-6 border border-rose-500/20">
                    <XCircle size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">Access Denied</h3>
                 <button 
                  onClick={() => setStatus('idle')}
                  className="text-xs font-black text-indigo-500 uppercase tracking-widest hover:text-white transition-colors"
                 >
                   Try Again
                 </button>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        <div className="flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest pt-8 border-t border-white/5">
           <div className="flex items-center gap-2">
              <Shield size={14} className="text-indigo-500/40" />
              Neural Encryption Active
           </div>
           <span className="text-white/20">CONFERA v2.1</span>
        </div>
      </motion.div>
    </div>
  );
}
