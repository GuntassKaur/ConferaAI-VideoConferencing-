'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { 
  Video, 
  Plus, 
  Link as LinkIcon, 
  Clock, 
  LogOut, 
  User as UserIcon,
  Loader2,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardContent() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingId, setMeetingId] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMeetings();
    }
  }, [user]);

  const fetchMeetings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/meetings?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Failed to fetch meetings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startMeeting = async () => {
    setIsStarting(true);
    try {
      const response = await fetch("/api/meeting/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, name: user?.name })
      });
      const data = await response.json();
      if (data.success) {
        router.push(`/room/${data.meetingId}`);
      } else {
        alert(data.error || "Failed to start meeting");
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setIsStarting(false);
    }
  };

  const joinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId.trim()) return;
    router.push(`/room/${meetingId.trim()}`);
  };

  const deleteMeeting = async (id: string) => {
    if (!confirm('Remove this meeting from your history?')) return;
    try {
      await fetch(`/api/meetings?meetingId=${id}&userId=${user?.id}`, {
        method: 'DELETE'
      });
      fetchMeetings();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-slate-200 font-sans">
      {/* Top Header */}
      <header className="h-16 border-b border-[#1F2937] bg-[#111827]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center text-white">
              <Video size={18} />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Confera AI</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-semibold text-white">{user?.name}</span>
              <span className="text-[10px] text-slate-500">{user?.email}</span>
            </div>
            <button 
              onClick={() => logout()}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-3">Hello, {user?.name?.split(' ')[0]}</h1>
          <p className="text-slate-400">Start a new encrypted session or join an existing workspace.</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <button 
            onClick={startMeeting}
            disabled={isStarting}
            className="flex flex-col items-center justify-center gap-4 p-10 bg-[#111827] border border-[#1F2937] rounded-2xl hover:border-[#6366F1]/50 hover:bg-[#151C2E] transition-all group"
          >
            <div className="w-14 h-14 bg-[#6366F1]/10 rounded-2xl flex items-center justify-center text-[#6366F1] border border-[#6366F1]/20 group-hover:scale-110 transition-transform">
              {isStarting ? <Loader2 className="animate-spin" size={28} /> : <Plus size={28} />}
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-white">Start Meeting</span>
              <span className="text-xs text-slate-500">Create a secure instant room</span>
            </div>
          </button>

          <div className="flex flex-col p-10 bg-[#111827] border border-[#1F2937] rounded-2xl hover:border-[#6366F1]/50 hover:bg-[#151C2E] transition-all">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <LinkIcon size={28} />
              </div>
              <div className="text-center">
                <span className="block text-lg font-bold text-white">Join Meeting</span>
                <span className="text-xs text-slate-500">Enter a session ID or link</span>
              </div>
            </div>
            <form onSubmit={joinMeeting} className="flex gap-2">
              <input 
                type="text" 
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                placeholder="Meeting ID"
                className="flex-1 bg-[#0B1020] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366F1] transition-all"
              />
              <button 
                type="submit"
                disabled={!meetingId.trim()}
                className="px-6 py-3 bg-[#6366F1] text-white font-bold text-sm rounded-xl hover:bg-[#4F46E5] disabled:opacity-50 transition-all"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Recent Meetings */}
        <div>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Clock size={14} />
              Recent Meetings
            </h2>
            <span className="text-[10px] text-slate-600 font-bold uppercase">{meetings.length} Total</span>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="p-20 flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#6366F1] mb-4" size={32} />
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Loading History...</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="p-12 text-center bg-[#111827] border border-[#1F2937] rounded-2xl border-dashed">
                <p className="text-sm text-slate-500">No recent meetings found.</p>
              </div>
            ) : (
              meetings.map((m) => (
                <div 
                  key={m.meetingId}
                  className="flex items-center justify-between p-4 bg-[#111827] border border-[#1F2937] rounded-xl hover:bg-[#151C2E] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#0B1020] rounded-lg flex items-center justify-center text-slate-500 group-hover:text-[#6366F1] transition-colors">
                      <Video size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Meeting {m.meetingId}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => router.push(`/room/${m.meetingId}`)}
                      className="p-2 text-slate-400 hover:text-white transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <button 
                      onClick={() => deleteMeeting(m.meetingId)}
                      className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
