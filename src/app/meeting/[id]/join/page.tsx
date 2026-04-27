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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />
      
      <div className="w-full max-w-md">
        <button 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider">Back to dashboard</span>
        </button>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6 shadow-sm">
               <Video size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {meetingName || 'Connecting...'}
            </h1>
            <p className="text-slate-500 text-sm">
              Wait for the host to let you in.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-100">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                   <User size={20} />
                </div>
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{currentUser ? 'Signed in as' : 'Joining as Guest'}</p>
                    <p className="text-sm font-bold text-slate-800">{currentUser?.name || 'Guest User'}</p>
                 </div>
             </div>
             <div className="h-px bg-slate-200/50 mb-4" />
             <div className="flex items-center gap-3 text-slate-500">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-xs font-medium">Encryption active for this session</span>
             </div>
          </div>

          <div className="min-h-[64px] flex items-center justify-center">
            {status === 'idle' && (
              <button
                onClick={requestJoin}
                className="w-full py-4 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 group"
              >
                Ask to join
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {(status === 'requesting' || status === 'waiting') && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 text-indigo-600 font-bold mb-2">
                   <Loader2 className="w-5 h-5 animate-spin" />
                   <span className="text-sm">Waiting for approval...</span>
                </div>
                <p className="text-xs text-slate-400">The host will see your request shortly.</p>
              </div>
            )}

            {status === 'accepted' && (
              <div className="flex flex-col items-center text-emerald-600">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                   <CheckCircle2 size={24} />
                </div>
                <h3 className="font-bold">Entry Granted</h3>
                <p className="text-xs text-slate-400">Redirecting to call...</p>
              </div>
            )}

            {status === 'rejected' && (
              <div className="flex flex-col items-center text-rose-600 text-center">
                <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mb-4 border border-rose-100">
                   <XCircle size={24} />
                </div>
                <h3 className="font-bold">Entry Denied</h3>
                <button 
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
           <div className="flex items-center gap-1.5">
              <Shield size={12} />
              <span>E2EE Secure</span>
           </div>
           <div className="w-1 h-1 bg-slate-300 rounded-full" />
           <div className="flex items-center gap-1.5">
              <Clock size={12} />
              <span>Low Latency</span>
           </div>
        </div>
      </div>
    </div>
  );
}
