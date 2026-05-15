'use client';
import { useState, useEffect } from 'react';
import { 
  Video, Clock, Plus, ArrowLeft, Loader2, ChevronRight, Trash2 
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MeetingsPage() {
  const { user } = useAuthStore();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchMeetings();
  }, [user]);

  const fetchMeetings = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/meetings?userId=${user.id}`);
      const data = await res.json();
      if (data.success) {
        setMeetings(data.meetings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeeting = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Remove this meeting from your history?')) return;
    try {
      await fetch(`/api/meetings?meetingId=${id}&userId=${user?.id}`, {
        method: 'DELETE'
      });
      fetchMeetings();
    } catch (e) { console.error(e); }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B1020] text-slate-200 font-sans">
        <header className="h-16 border-b border-[#1F2937] bg-[#111827]/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#6366F1] rounded flex items-center justify-center text-white">
                <Video size={14} />
              </div>
              <span className="font-bold text-sm text-white tracking-tight">Confera AI</span>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto py-12 px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Meeting History</h1>
              <p className="text-slate-400 text-sm">Review your past encrypted sessions.</p>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2.5 bg-[#6366F1] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#4F46E5] transition-all"
            >
              <Plus size={16} className="inline mr-2" /> New Session
            </button>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-3xl overflow-hidden shadow-2xl">
            {isLoading ? (
              <div className="py-32 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#6366F1] mb-4" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Fetching Archives...</p>
              </div>
            ) : meetings.length === 0 ? (
              <div className="py-32 text-center">
                <div className="w-16 h-16 bg-[#0B1020] rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-600 border border-[#1F2937]">
                  <Video size={32} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No sessions found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Your recent meeting history will appear here once you complete a session.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#1F2937]">
                {meetings.map((m) => (
                  <div 
                    key={m.meetingId}
                    onClick={() => router.push(`/room/${m.meetingId}`)}
                    className="flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-[#0B1020] border border-[#1F2937] rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-[#6366F1] group-hover:border-[#6366F1]/30 transition-all">
                        <Video size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-[#6366F1] transition-colors">
                          {m.name || `Meeting ${m.meetingId}`}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ID: {m.meetingId}</span>
                          <div className="w-1 h-1 bg-slate-800 rounded-full" />
                          <span className="text-[10px] text-slate-500 font-medium">
                            {new Date(m.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => deleteMeeting(m.meetingId, e)}
                        className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
