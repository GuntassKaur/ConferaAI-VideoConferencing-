'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, LogOut, User as UserIcon, Calendar, Clock, ArrowRight, FileText, CheckCircle2, ChevronRight, Activity, Users, Settings } from 'lucide-react';

export default function Dashboard() {
  const [meetingId, setMeetingId] = useState('');
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const displayName = user?.name || 'Guest User';

  const handleCreateMeeting = async () => {
    setIsCreateLoading(true);
    setError('');
    
    try {
      const id = `mtg-${Date.now().toString(36)}`;
      // Simulate network delay for real feel
      await new Promise(r => setTimeout(r, 800));
      router.push(`/meeting/${id}`);
    } catch (err: any) {
      setError('Failed to initialize meeting session.');
    } finally {
      setIsCreateLoading(false);
    }
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = meetingId.trim();
    
    if (!cleanId) {
      setError('Please enter a valid Meeting ID.');
      return;
    }
    
    setIsJoinLoading(true);
    setError('');

    setTimeout(() => {
      router.push(`/meeting/${cleanId}`);
      setIsJoinLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-inter">
      {/* SaaS Navbar */}
      <nav className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Video className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">Confera <span className="text-blue-500">AI</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
              <UserIcon size={14} className="text-slate-300" />
            </div>
            <span className="text-sm font-medium text-slate-200">{displayName}</span>
          </div>
          {user && (
            <button 
              onClick={() => { logout(); router.push('/login'); }}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Actions (Left) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="enterprise-card p-8 bg-gradient-to-br from-slate-900 to-slate-900/50">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Guest'}</h1>
              <p className="text-sm text-slate-400 font-medium">Start or join your meetings with AI-powered insights</p>
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
                    <h3 className="font-semibold text-white">{m.title}</h3>
                    <span className={`status-badge ${m.status === 'Live' ? 'status-live' : m.status === 'Completed' ? 'status-completed' : 'status-followup'}`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                     <span className="flex items-center gap-1.5"><Clock size={12} /> {m.time}</span>
                     <span className="flex items-center gap-1.5"><Users size={12} /> {m.participants} participants</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-slate-700 group-hover:text-blue-500 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </motion.div>
            ))}
          </div>

          {/* AI Insights Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="enterprise-card p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                   <FileText size={18} className="text-blue-500" />
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest">Last Meeting Action Items</h3>
                </div>
                <ul className="space-y-4 flex-1">
                   {[
                     "Finalize design tokens for enterprise layout",
                     "Schedule stakeholders review for recap feature",
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
