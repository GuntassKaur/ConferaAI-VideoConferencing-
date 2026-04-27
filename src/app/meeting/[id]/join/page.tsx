'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Shield, Loader2, ArrowLeft, 
  User, CheckCircle2, XCircle, ChevronRight,
  Clock, ShieldCheck
} from 'lucide-react';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const meetingId = params.id as string;
  
  const [status, setStatus] = useState<'idle' | 'requesting' | 'waiting' | 'accepted' | 'rejected'>('idle');
  const [meetingName, setMeetingName] = useState('');
  const [guestInfo, setGuestInfo] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    if (!currentUser && typeof window !== 'undefined') {
      let gId = localStorage.getItem('confera-guest-id');
      if (!gId) {
        gId = 'guest_' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('confera-guest-id', gId);
      }
      setGuestInfo({ id: gId, name: 'Guest User' });
    }
  }, [currentUser]);

  const checkStatus = useCallback(async () => {
    if (status !== 'waiting') return;
    const uId = currentUser?.id || guestInfo?.id;
    const uName = currentUser?.name || guestInfo?.name;
    if (!uId) return;

    try {
      const res = await fetch(`/api/meeting/${meetingId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uId, name: uName })
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
  }, [meetingId, currentUser, guestInfo, status, router]);

  useEffect(() => {
    const fetchMeeting = async () => {
      const res = await fetch(`/api/meeting/${meetingId}`);
      if (res.ok) {
        const data = await res.json();
        setMeetingName(data.name);
        if (currentUser && data.hostId === currentUser.id) {
            router.push(`/meeting/${meetingId}`);
        }
      } else {
        router.push(currentUser ? '/dashboard' : '/login');
      }
    };
    fetchMeeting();
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
    const uId = currentUser?.id || guestInfo?.id;
    const uName = currentUser?.name || guestInfo?.name;
    
    try {
      const res = await fetch(`/api/meeting/${meetingId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uId, name: uName })
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
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-600/5 rounded-full blur-[120px] -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-600/5 rounded-full blur-[120px] -z-10 -translate-x-1/4 translate-y-1/4" />
      
      <div className="w-full max-w-md relative z-10">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-all mb-8 group px-2"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Back to dashboard</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] border border-[#1F2937] rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#6366F1]" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center text-[#6366F1] mx-auto mb-6 border border-[#6366F1]/20 shadow-lg shadow-[#6366F1]/5">
               <Video size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {meetingName || 'Connecting...'}
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Waiting for host approval to enter the session.
            </p>
          </div>

          <div className="bg-[#0F172A] rounded-2xl p-6 mb-10 border border-[#1F2937]">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#111827] border border-[#1F2937] flex items-center justify-center text-slate-500">
                   <User size={20} />
                </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{currentUser ? 'Signed in as' : 'Joining as Guest'}</p>
                    <p className="text-sm font-bold text-white">{currentUser?.name || 'Guest User'}</p>
                 </div>
             </div>
             <div className="h-px bg-[#1F2937] mb-4" />
             <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-xs font-medium">Secure Session Tunnel Active</span>
             </div>
          </div>

          <div className="min-h-[64px] flex items-center justify-center">
            {status === 'idle' && (
              <button
                onClick={requestJoin}
                className="w-full py-4 bg-[#6366F1] text-white font-bold text-sm rounded-xl hover:bg-[#4F46E5] transition-all shadow-xl shadow-[#6366F1]/20 flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                Request Access
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {(status === 'requesting' || status === 'waiting') && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 text-[#6366F1] font-bold mb-2">
                   <Loader2 className="w-5 h-5 animate-spin" />
                   <span className="text-sm uppercase tracking-widest">Waiting for host...</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Host notified. Please stand by.</p>
              </div>
            )}

            {status === 'accepted' && (
              <div className="flex flex-col items-center text-emerald-500">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                   <CheckCircle2 size={24} />
                </div>
                <h3 className="font-bold uppercase tracking-widest text-sm">Entry Granted</h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Initializing call matrix...</p>
              </div>
            )}

            {status === 'rejected' && (
              <div className="flex flex-col items-center text-rose-500 text-center">
                <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20 shadow-lg shadow-rose-500/5">
                   <XCircle size={24} />
                </div>
                <h3 className="font-bold uppercase tracking-widest text-sm">Access Denied</h3>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-[10px] font-bold text-[#6366F1] hover:underline uppercase tracking-widest"
                >
                  Request Again
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-10 flex items-center justify-center gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em]">
           <div className="flex items-center gap-2">
              <Shield size={12} className="text-[#6366F1]" />
              <span>E2EE Active</span>
           </div>
           <div className="w-1 h-1 bg-[#1F2937] rounded-full" />
           <div className="flex items-center gap-2">
              <Clock size={12} className="text-[#6366F1]" />
              <span>Real-time</span>
           </div>
        </div>
      </div>
    </div>
  );
}
