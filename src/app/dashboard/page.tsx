'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Video, LogOut, User as UserIcon, Calendar, Clock, ArrowRight, Brain, Sparkles, Loader2, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const [meetingId, setMeetingId] = useState('');
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [isCreateLoading, setIsCreateLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    if (!user) {
      const savedUser = localStorage.getItem('confera-auth');
      if (!savedUser) router.push('/login');
    }
  }, [user, router]);

  const handleCreateMeeting = async () => {
    setIsCreateLoading(true);
    setError('');
    
    try {
      // Robust client-side ID generation as requested (Date.now() or similar)
      const meetingId = `mtg-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
      
      // Simulate orchestration delay
      await new Promise(r => setTimeout(r, 800));
      
      router.push(`/meeting/${meetingId}`);
    } catch (err: any) {
      setError('Failed to orchestrate new session.');
    } finally {
      setIsCreateLoading(false);
    }
  };


  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = meetingId.trim();
    
    if (!cleanId) {
      setError('Neural Matrix ID cannot be empty.');
      return;
    }
    
    setIsJoinLoading(true);
    setError('');

    // Instant navigation for better UX
    setTimeout(() => {
      router.push(`/meeting/${cleanId}`);
      setIsJoinLoading(false);
    }, 500);
  };


  if (!user) return null;

  return (
    <div className="min-h-screen bg-mesh text-white flex flex-col font-outfit">
      {/* Premium Navbar */}
      <nav className="h-20 border-b border-white/5 bg-slate-950/40 backdrop-blur-3xl px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:rotate-12 transition-transform">
            <Video className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter">Confera<span className="text-indigo-500">AI</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 px-5 py-2.5 bg-white/[0.03] rounded-2xl border border-white/5 shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
              <UserIcon size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-sm font-black leading-none mb-1">{user.name}</p>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Matrix Commander</p>
            </div>
          </div>
          <button 
            onClick={() => { logout(); router.push('/login'); }}
            className="w-12 h-12 rounded-2xl bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/10 shadow-lg active:scale-95"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Side: Actions */}
        <div className="lg:col-span-4 space-y-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-10 space-y-10 border-white/10"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Neutral Sync Ready</h2>
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-none text-white">Salutations,<br /><span className="text-indigo-500">{user.name.split(' ')[0]}</span>.</h1>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleCreateMeeting}
                disabled={isCreateLoading}
                className="w-full h-18 bg-white text-black hover:bg-slate-100 font-black rounded-[1.5rem] transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50 text-lg py-4"
              >
                {isCreateLoading ? <Loader2 className="animate-spin" /> : <><Plus size={24} /> Orchestrate Session</>}
              </button>

              <form onSubmit={handleJoinMeeting} className="space-y-4 pt-8 border-t border-white/5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Connect via ID</label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    placeholder="Nexus Link..."
                    className="flex-1 h-16 bg-white/[0.03] border border-white/10 rounded-2xl px-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                  <button 
                    type="submit"
                    disabled={isJoinLoading || !meetingId.trim()}
                    className="w-16 h-16 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-center transition-all disabled:opacity-50 shadow-lg shadow-indigo-600/20 active:scale-90"
                  >
                    {isJoinLoading ? <Loader2 size={24} className="animate-spin text-white" /> : <ArrowRight size={24} className="text-white" />}
                  </button>
                </div>
              </form>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[10px] font-black uppercase tracking-widest text-center bg-red-500/10 p-4 rounded-2xl border border-red-500/20 shadow-lg"
              >
                {error}
              </motion.p>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 rounded-[2.5rem] space-y-6 shadow-[0_25px_50px_rgba(79,70,229,0.4)] relative overflow-hidden group border border-white/20"
          >
            <div className="absolute top-[-20%] right-[-20%] p-4 opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700">
              <Brain size={250} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <Sparkles size={20} className="text-indigo-200" />
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-indigo-100">Neural Core Active</h3>
              </div>
              <p className="text-2xl font-black leading-tight text-white mb-2">Integrated Recap Synthesis Enabled</p>
              <p className="text-sm text-indigo-100/70 font-medium">Capture every transmission with autonomous AI intelligence.</p>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Activity/Meetings */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <h2 className="text-4xl font-black tracking-tighter text-white">Recent Transmissions</h2>
               <div className="px-4 py-1.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">3 Active Nodes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'x5y-2z8', title: 'Quantum Encryption Standards', time: '14:30', date: 'TODAY' },
              { id: 'm9w-1p0', title: 'Neural Network Optimization', time: '10:00', date: 'TODAY' },
              { id: 'b3k-7v4', title: 'Nexus Core Maintenance', time: 'YESTERDAY', date: 'YESTERDAY' },
            ].map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="glass-card hover:bg-white/[0.06] transition-all group p-8 border-white/10 hover:border-indigo-500/50 cursor-pointer relative overflow-hidden"
                onClick={() => router.push(`/meeting/${m.id}`)}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -z-10 group-hover:bg-indigo-500/20 transition-all" />
                
                <div className="flex items-start justify-between mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-300 shadow-xl">
                      <Video size={24} className="text-slate-500 group-hover:text-white" />
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <ArrowRight size={20} className="text-indigo-400" />
                   </div>
                </div>
                <h3 className="font-black text-2xl mb-6 leading-tight tracking-tight text-white group-hover:text-indigo-400 transition-colors">{m.title}</h3>
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                   <div className="flex items-center gap-2.5">
                      <Clock size={14} className="text-indigo-500" /> {m.time}
                   </div>
                   <div className="flex items-center gap-2.5">
                      <Calendar size={14} className="text-indigo-500" /> {m.date}
                   </div>
                </div>
              </motion.div>
            ))}
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.7 }}
               className="glass-card flex flex-col items-center justify-center p-8 border-dashed border-2 border-white/10 hover:bg-white/5 hover:border-indigo-500/40 transition-all cursor-pointer group active:scale-95 min-h-[250px]"
               onClick={handleCreateMeeting}
            >
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover:rotate-90 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all duration-500">
                <Plus size={32} className="text-slate-500 group-hover:text-indigo-400" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-slate-500 group-hover:text-indigo-400">Initialize New Link</p>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="p-10 border-t border-white/5 bg-slate-950/20 text-center backdrop-blur-md">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-600">© 2026 CONFERA NEURAL SYSTEMS • QUANTUM ENCRYPTED TRANSMISSION</p>
      </footer>
    </div>
  );
}
