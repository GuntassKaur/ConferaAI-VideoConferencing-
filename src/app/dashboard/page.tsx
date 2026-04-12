'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, LogOut, User as UserIcon, Calendar, Clock, ArrowRight, FileText, CheckCircle2, ChevronRight, Activity, Users, Settings, Shield, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [meetingId, setMeetingId] = useState('');
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [realMeetings, setRealMeetings] = useState<any[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const displayName = user?.name || 'Guest User';

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user?.id) return;
      setIsLoadingMeetings(true);
      try {
        const res = await fetch(`/api/meetings?userId=${user.id}`);
        const data = await res.json();
        if (data.success) {
          setRealMeetings(data.meetings);
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
      } finally {
        setIsLoadingMeetings(false);
      }
    };

    fetchMeetings();
  }, [user]);

  const handleCreateMeeting = async () => {
    setIsCreateLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/create-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, title: 'New Executive Session' }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      router.push(`/meeting/${data.meeting.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize session.');
    } finally {
      setIsCreateLoading(false);
    }
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = meetingId.trim();
    if (!cleanId) {
      setError('Please enter a valid Session ID.');
      return;
    }
    setIsJoinLoading(true);
    router.push(`/meeting/${cleanId}`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-inter">
      {/* Enterprise Top Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Video className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Confera <span className="text-blue-500">AI</span></span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">End-to-End Secure</span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white leading-none">{displayName}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tighter">
                  {user ? 'Enterprise Access' : 'Guest Mode'}
                </p>
              </div>
              
              {user ? (
                <button 
                  onClick={() => { logout(); router.push('/login'); }}
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-500 font-bold hover:border-blue-500/50 transition-all group"
                >
                  <span className="group-hover:hidden">{displayName.charAt(0).toUpperCase()}</span>
                  <LogOut size={16} className="hidden group-hover:block" />
                </button>
              ) : (
                <Link href="/login" className="btn-primary px-4 py-2 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest">
                  <LogIn size={14} /> Account Access
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

            </div>

            <div className="space-y-4">
              <button 
                onClick={handleCreateMeeting}
                disabled={isCreateLoading}
                className="btn-primary w-full text-base py-6"
              >
                <Plus size={20} className="mr-1" /> Start New Meeting
              </button>

              <form onSubmit={handleJoinMeeting} className="space-y-4 pt-6 border-t border-slate-800">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Enter Meeting ID</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={meetingId}
                      onChange={(e) => setMeetingId(e.target.value)}
                      placeholder="e.g. mtg-k9x2z5"
                      className="input-field flex-1"
                    />
                    <button 
                      type="submit"
                      disabled={isJoinLoading || !meetingId.trim()}
                      className="h-11 px-4 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-all disabled:opacity-50 border border-slate-700"
                    >
                      <ChevronRight size={20} className="text-slate-300" />
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {error && (
              <p className="mt-4 text-red-400 text-xs font-medium bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">{error}</p>
            )}
          </div>

          {/* Quick Insights Section */}
          <div className="enterprise-card p-6 space-y-6">
            <div className="flex items-center gap-2 mb-2">
               <Activity size={16} className="text-blue-500" />
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Personal Insights</h3>
            </div>
            <div className="p-4 bg-slate-800/20 rounded-xl border border-slate-800/50">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Speaking Distribution</p>
               <div className="flex items-center justify-between text-sm font-semibold mb-3">
                  <span className="text-blue-400">You 60%</span>
                  <span className="text-slate-500">Others 40%</span>
               </div>
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full bg-blue-500" style={{ width: '60%' }} />
               </div>
            </div>
            <div className="space-y-3">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upcoming Syncs</p>
               <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex flex-col items-center justify-center text-emerald-500">
                     <span className="text-xs font-bold">14</span>
                     <span className="text-[8px] uppercase">APR</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold">Product Strategy Review</p>
                    <p className="text-[10px] text-slate-500">10:00 AM • 45 mins</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Meeting Logs & Activity (Right) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Meetings</h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              { id: 'mtg-q4str', title: 'Q4 Product Stratagem', time: 'Yesterday, 2:30 PM', participants: 8, status: 'Completed', date: 'apr 11' },
              { id: 'mtg-sync', title: 'Design Alignment Sync', time: 'Today, 11:00 AM', participants: 4, status: 'Live', date: 'today' },
              { id: 'mtg-hrb', title: 'Weekly Core Standup', time: 'Today, 9:00 AM', participants: 12, status: 'Follow-up Required', date: 'today' },
            ].map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="enterprise-card hover:bg-slate-800/50 transition-all p-5 flex items-center gap-6 cursor-pointer group"
                onClick={() => router.push(`/meeting/${m.id}`)}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Video size={20} className="text-slate-400 group-hover:text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                     "Audit media stream performance in low bandwidth"
                   ].map((item, i) => (
                     <li key={i} className="flex gap-4 text-sm text-slate-300 font-medium">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                     </li>
                   ))}
                </ul>
                <button className="mt-8 text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest flex items-center gap-2">View Full Board <ChevronRight size={14} /></button>
             </div>

             <div className="enterprise-card p-6 flex flex-col bg-slate-900/50 border-blue-500/20 ring-1 ring-blue-500/10">
                <div className="flex items-center gap-3 mb-6">
                   <Activity size={18} className="text-emerald-500" />
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest">AI Summary Preview</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium mb-8">
                  The team reached consensus on prioritizing the enterprise refactor. Speaking time was evenly distributed, though technical hurdles in media sync were highlighted...
                </p>
                <div className="mt-auto">
                   <button className="btn-secondary w-full text-xs uppercase tracking-widest">View Full Recap</button>
                </div>
             </div>
          </div>
        </div>
      </main>

      <footer className="p-8 border-t border-slate-800 text-center bg-slate-900/40">
         <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600">Confera Enterprise Platform • Secure Session Protocol</p>
      </footer>
    </div>
  );
}
