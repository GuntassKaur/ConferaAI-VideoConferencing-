"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Plus, 
  Video, 
  History, 
  LogOut, 
  Clock, 
  ChevronRight, 
  Search,
  LayoutDashboard,
  CalendarDays,
  Settings,
  Sparkles,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [joinId, setJoinId] = useState("");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        setMeetings(data.rooms || []);
      }
    } catch (err) {
      console.error("Failed to fetch meetings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMeeting = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/rooms/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          room_name: `${user?.name || 'User'}'s Sync`,
          host_id: user?.id || 'guest'
        })
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/room/${data.id}`);
      }
    } catch (err) {
      console.error("Creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinId.trim()) {
      router.push(`/room/${joinId.trim()}`);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B1120] flex text-slate-50 font-sans">
        
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/5 bg-[#111827] flex flex-col hidden md:flex">
          <div className="h-16 flex items-center px-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-sm mr-3">
              C
            </div>
            <span className="font-bold text-white tracking-tight">Confera AI</span>
          </div>

          <div className="flex-1 py-6 px-4 space-y-2">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-white/5 text-white rounded-lg text-sm font-medium transition-colors">
              <LayoutDashboard size={18} className="text-indigo-400" />
              Dashboard
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
              <CalendarDays size={18} />
              Meetings
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
              <Sparkles size={18} />
              AI Recaps
            </button>
          </div>

          <div className="p-4 border-t border-white/5">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-sm font-medium transition-colors">
              <Settings size={18} />
              Settings
            </button>
            <div className="mt-4 flex items-center justify-between px-3">
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button onClick={logout} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Topbar */}
          <header className="h-16 border-b border-white/5 bg-[#0B1120] flex items-center justify-between px-8">
            <div>
              <h1 className="text-lg font-semibold text-white">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search meetings..." 
                  className="w-64 h-9 bg-[#111827] border border-white/10 rounded-lg pl-9 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>
          </header>

          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-8">
              
              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Start Meeting Card */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 flex items-start justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                      <Video size={20} />
                    </div>
                    <h2 className="text-base font-semibold text-white mb-1">Start Meeting</h2>
                    <p className="text-sm text-slate-400 mb-6">Create a new secure room instantly.</p>
                    <button 
                      onClick={handleCreateMeeting}
                      disabled={isCreating}
                      className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {isCreating ? <span className="animate-pulse">Creating...</span> : <><Plus size={16} /> New Session</>}
                    </button>
                  </div>
                </div>

                {/* Join Meeting Card */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-6 flex items-start justify-between">
                  <div className="w-full">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                      <Users size={20} />
                    </div>
                    <h2 className="text-base font-semibold text-white mb-1">Join Meeting</h2>
                    <p className="text-sm text-slate-400 mb-6">Enter an existing room code.</p>
                    <form onSubmit={handleJoinMeeting} className="flex gap-3">
                      <input 
                        type="text"
                        value={joinId}
                        onChange={(e) => setJoinId(e.target.value)}
                        placeholder="e.g. ABC-DEF-GHI"
                        className="flex-1 h-10 bg-[#0B1120] border border-white/10 rounded-xl px-4 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500/50 transition-colors"
                      />
                      <button 
                        type="submit"
                        className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors"
                      >
                        Join
                      </button>
                    </form>
                  </div>
                </div>

              </div>

              {/* Recent Meetings */}
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-4">Recent Sessions</h3>
                <div className="bg-[#111827] border border-white/10 rounded-2xl overflow-hidden">
                  {isLoading ? (
                    <div className="p-12 flex items-center justify-center text-slate-500 text-sm">
                      Loading history...
                    </div>
                  ) : meetings.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                      <History size={32} className="text-slate-600 mb-3" />
                      <p className="text-sm text-slate-300 font-medium">No recent meetings</p>
                      <p className="text-xs text-slate-500 mt-1">Your meeting history will appear here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {meetings.map((m) => (
                        <div key={m.id} onClick={() => router.push(`/room/${m.id}`)} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#0B1120] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 transition-colors">
                              <Video size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{m.room_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                                  <Clock size={10} /> {new Date(m.created_at).toLocaleDateString()}
                                </span>
                                <span className="text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded">ID: {m.id}</span>
                              </div>
                            </div>
                          </div>
                          <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
