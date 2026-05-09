"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { 
  Plus, 
  Video, 
  History, 
  Settings, 
  LogOut, 
  Clock, 
  ChevronRight, 
  Calendar,
  MoreVertical,
  Search,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

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
          room_name: `${user?.name}'s Sync`,
          host_id: user?.id 
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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#0F172A]">
        
        {/* Navigation */}
        <nav className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                C
              </div>
              <span className="font-bold text-slate-900 tracking-tight">Confera AI</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
               <button className="text-sm font-semibold text-slate-900 border-b-2 border-indigo-600 h-16 flex items-center">Dashboard</button>
               <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Meetings</button>
               <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Recaps</button>
               <button className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Settings</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600">
                <Search size={14} />
                <span className="text-xs font-medium">Search...</span>
             </div>
             <div className="w-px h-6 bg-slate-200 mx-2" />
             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                   <p className="text-[10px] font-medium text-slate-500">{user?.email}</p>
                </div>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                   <LogOut size={18} />
                </button>
             </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-10">
          
          {/* Header & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
              <p className="text-slate-500 text-sm">Manage your strategic sessions and AI insights.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                <input 
                  placeholder="Room Code" 
                  className="bg-transparent border-none outline-none px-3 py-2 text-sm w-32 font-medium"
                />
                <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-bold transition-all">
                  Join
                </button>
              </div>
              <button 
                onClick={handleCreateMeeting}
                disabled={isCreating}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus size={18} />}
                New Meeting
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Recent Meetings */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Recent Sessions</h2>
                <button className="text-xs font-bold text-indigo-600 hover:underline">View all</button>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                {isLoading ? (
                  <div className="p-20 flex flex-col items-center justify-center space-y-4 opacity-30">
                    <History size={40} />
                    <p className="text-sm font-medium tracking-tight">Syncing history...</p>
                  </div>
                ) : meetings.length === 0 ? (
                  <div className="p-20 flex flex-col items-center justify-center space-y-4 opacity-40">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                       <Video size={24} className="text-slate-400" />
                    </div>
                    <div className="text-center">
                       <p className="text-sm font-bold text-slate-900">No sessions yet</p>
                       <p className="text-xs text-slate-500 mt-1">Start your first AI-powered meeting.</p>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {meetings.map((m) => (
                      <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer" onClick={() => router.push(`/room/${m.id}`)}>
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                              <Video size={20} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900">{m.room_name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{m.id}</span>
                                 <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                    <Clock size={10} /> 2 hours ago
                                 </span>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="hidden md:flex -space-x-2">
                              {[1, 2, 3].map(i => (
                                 <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200" />
                              ))}
                           </div>
                           <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-600 transition-all" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Stats & Insights */}
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-1">Quick Insights</h2>
              
              <div className="space-y-4">
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Users size={20} />
                       </div>
                       <span className="text-xs font-bold text-slate-400">Monthly</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">12.5h</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Total session duration</p>
                 </div>

                 <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <Zap size={20} />
                       </div>
                       <span className="text-xs font-bold text-slate-400">Efficiency</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 tracking-tight">92%</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">AI Recap accuracy score</p>
                 </div>

                 <div className="bg-indigo-600 rounded-2xl p-6 shadow-xl shadow-indigo-600/20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <Plus size={80} />
                    </div>
                    <p className="text-sm font-bold opacity-80 mb-2">Upgrade to Pro</p>
                    <h3 className="text-lg font-bold leading-tight mb-4">Unlock unlimited <br /> AI intelligence.</h3>
                    <button className="w-full py-2.5 bg-white text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-all">
                       Learn More
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
