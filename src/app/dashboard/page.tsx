'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Search, Video, LogOut, User as UserIcon } from 'lucide-react';

export default function Dashboard() {
  const [meetingId, setMeetingId] = useState('');
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
    } else if (savedUser) {
      const parsed = JSON.parse(savedUser);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(parsed);
    }
  }, [router]);



  const createMeeting = () => {
    const id = Math.random().toString(36).substr(2, 9);
    router.push(`/meeting/${id}`);
  };

  const joinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId) {
      router.push(`/meeting/${meetingId}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-16">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">My Workspace</h1>
          <div className="flex items-center gap-2 text-slate-400">
             <UserIcon size={16} />
             <span>Logged in as <strong>{user.name}</strong></span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 text-slate-400 hover:text-white"
        >
          <LogOut size={20} />
        </button>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Create Meeting Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 flex flex-col items-center text-center group"
        >
          <div className="w-16 h-16 bg-indigo-600/20 text-indigo-500 rounded-3xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
            <Video size={32} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Host a Session</h3>
          <p className="text-slate-500 mb-8 max-w-[240px]">Instantly create a new secure neural meeting link.</p>
          <button onClick={createMeeting} className="btn-primary w-full flex items-center justify-center gap-2">
            <Plus size={20} />
            Establish New Link
          </button>
        </motion.div>

        {/* Join Meeting Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass-card p-8 flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-3">Sync Session</h3>
            <p className="text-slate-500">Enter a shared ID to join an existing session.</p>
          </div>
          <form onSubmit={joinMeeting} className="space-y-4 mt-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Enter Invite ID..." 
                value={meetingId} 
                onChange={(e) => setMeetingId(e.target.value)} 
                className="input-field w-full pl-12"
                required
              />
            </div>
            <button type="submit" className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all">
              Initialize Sync
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
