'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { Plus, Video, LogOut, User as UserIcon, Calendar, Clock, ChevronRight, Activity, Users, Shield, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface Meeting {
  meetingId: string;
  title: string;
  startTime: string;
  status: string;
  participants: string[];
}

export default function Dashboard() {
  const [meetingId, setMeetingId] = useState('');
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [realMeetings, setRealMeetings] = useState<Meeting[]>([]);
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
  }, [user?.id]);

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

      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">Enterprise Command Center</p>
              <h1 className="text-4xl font-bold text-white tracking-tight">System <span className="text-slate-500 font-medium">Overview</span></h1>
            </div>
            <div className="flex items-center gap-3">
               <button 
                 onClick={handleCreateMeeting}
                 disabled={isCreateLoading}
                 className="btn-primary px-8 py-4 flex items-center gap-3 group shadow-xl shadow-blue-600/10"
               >
                 {isCreateLoading ? <Activity className="animate-spin text-white" size={18} /> : <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />}
                 <span className="text-xs uppercase tracking-widest font-bold">Initiate Session</span>
               </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-8 space-y-8">
            <div className="enterprise-card p-8 bg-slate-900 border-slate-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.05] group-hover:scale-110 transition-all duration-700">
                <Shield className="w-48 h-48 text-blue-500" />
              </div>
              
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Session Gate
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="space-y-4">
                  <p className="text-xs font-medium text-slate-400">Join an existing session via secure identifier</p>
                  <form onSubmit={handleJoinMeeting} className="flex gap-2">
                    <input 
                      type="text" 
                      value={meetingId}
                      onChange={(e) => setMeetingId(e.target.value)}
                      placeholder="Enter SID-XXXX..."
                      className="input-field flex-1"
                    />
                    <button 
                      type="submit"
                      disabled={isJoinLoading}
                      className="btn-secondary px-6"
                    >
                      {isJoinLoading ? <Activity size={18} className="animate-spin" /> : 'Verify & Join'}
                    </button>
                  </form>
                </div>
                <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
                   <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Infrastructure</p>
                      <p className="text-sm font-bold text-slate-300">Global SSL Mesh - Active</p>
                   </div>
                   <Activity className="text-emerald-500/50" size={24} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  <Clock size={16} className="text-blue-500" />
                  Recent Sessions
                </h2>
              </div>
              
              <div className="space-y-3">
                {!user ? (
                   <div className="enterprise-card p-10 bg-slate-900/50 border-slate-800 text-center space-y-4">
                      <ShieldCheck className="mx-auto text-slate-700" size={32} />
                      <p className="text-xs text-slate-500 font-medium">Session history is restricted to authenticated users.</p>
                      <Link href="/login" className="text-xs font-bold text-blue-500 uppercase tracking-widest hover:underline">Link Account</Link>
                   </div>
                ) : isLoadingMeetings ? (
                   <div className="flex flex-col items-center justify-center p-12 space-y-4">
                      <Activity className="animate-spin text-blue-500" size={24} />
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Querying database...</p>
                   </div>
                ) : realMeetings.length === 0 ? (
                   <div className="enterprise-card p-10 bg-slate-900/50 border-slate-800 text-center">
                      <p className="text-xs text-slate-500 font-medium italic">No recent sessions found for this account.</p>
                   </div>
                ) : (
                  realMeetings.map((meeting, i) => (
                    <motion.div 
                      key={meeting.meetingId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="enterprise-card p-5 bg-slate-900 border-slate-800 hover:border-slate-700 transition-all group flex items-center justify-between cursor-pointer"
                      onClick={() => router.push(`/meeting/${meeting.meetingId}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Video size={18} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-blue-500 transition-colors">{meeting.title}</h3>
                          <p className="text-[10px] text-slate-500 font-medium uppercase mt-1">SID: {meeting.meetingId} • {new Date(meeting.startTime).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right hidden sm:block">
                           <p className="text-xs font-bold text-slate-300">{meeting.participants?.length || 0}</p>
                           <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Authorized</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          meeting.status === 'live' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                          meeting.status === 'completed' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                          'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          {meeting.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Intelligence Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="enterprise-card p-6 bg-slate-900 border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                <Sparkles size={16} className="text-blue-500" />
                Intelligence
              </h2>
              
              <div className="space-y-6">
                <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Priority Action Items</p>
                   <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-slate-800/20 border border-slate-800 rounded-xl">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5" />
                         <p className="text-xs text-slate-300 font-medium">Verify AES-256 protocols for outbound nodes</p>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-slate-800/20 border border-slate-800 rounded-xl">
                         <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5" />
                         <p className="text-xs text-slate-300 font-medium">Draft summary for regional security alignment</p>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Engagement Analysis</p>
                   <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                           <span className="text-slate-300">Your Presence</span>
                           <span className="text-blue-500">64%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '64%' }}
                              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                           />
                        </div>
                      </div>
                   </div>
                </div>

                <div className="p-4 bg-blue-600/5 border border-blue-500/10 rounded-2xl">
                   <div className="flex items-center gap-3 mb-2">
                      <Calendar size={14} className="text-blue-500" />
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Next Sync</span>
                   </div>
                   <p className="text-sm font-bold text-slate-300">Global Tech Alignment</p>
                   <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase">Automated Schedule Active</p>
                </div>
              </div>
            </div>

            <div className="enterprise-card p-6 bg-slate-900 border-slate-800 relative overflow-hidden">
               <div className="flex items-center gap-3 mb-6 relative z-10">
                  <ShieldCheck className="text-blue-500" size={16} />
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">Compliance</h2>
               </div>
               <p className="text-xs text-slate-500 leading-relaxed mb-4 relative z-10">System is currently operating under SOC2 Type II security guidelines. All data is encrypted at rest and in transit.</p>
               <div className="flex gap-2 relative z-10">
                  <div className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold text-slate-400 border border-slate-700">AES-256</div>
                  <div className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold text-slate-400 border border-slate-700">HIPAA</div>
                  <div className="px-2 py-1 bg-slate-800 rounded text-[9px] font-bold text-slate-400 border border-slate-700">GDPR</div>
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
