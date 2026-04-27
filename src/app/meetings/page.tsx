'use client';
import { useState, useEffect } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { 
  Video, Calendar, Clock, Users, 
  ChevronRight, MoreVertical, Filter, 
  Plus, Search, Shield, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function MeetingsPage() {
  const { user: currentUser } = useAuthStore();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetings = async () => {
      const userId = currentUser?.id || 'guest_global';
      try {
        const res = await fetch(`/api/meetings?userId=${userId}`);
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
    fetchMeetings();
  }, [currentUser]);

  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12 font-inter">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Collaboration Archive</h1>
            <p className="text-slate-400 text-sm font-medium">Review, replay, and manage your past encrypted sessions.</p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-5 py-2.5 bg-[#111827] border border-[#1F2937] text-slate-300 font-bold text-xs uppercase tracking-widest rounded-xl hover:text-white hover:border-slate-500 transition-all">
                <Filter size={16} /> Filter
             </button>
             <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#6366F1] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#4F46E5] transition-all shadow-xl shadow-[#6366F1]/10"
             >
                <Plus size={16} /> New Session
             </button>
          </div>
        </header>

        <div className="bg-[#111827] border border-[#1F2937] rounded-[2rem] overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#6366F1]/50 to-transparent" />
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1F2937] bg-[#0F172A]/50">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Session Title</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Timeline</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Network</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2937]">
              {isLoading ? (
                <tr>
                   <td colSpan={4} className="py-24 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-[#6366F1] mx-auto" />
                   </td>
                </tr>
              ) : meetings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-32 text-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-20 h-20 bg-[#6366F1]/5 rounded-3xl flex items-center justify-center mb-6 text-slate-600 border border-[#6366F1]/10">
                        <Video size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">No sessions archived</h3>
                      <p className="text-slate-500 text-sm max-w-xs mx-auto font-medium">
                        Completed meetings with recorded transcripts or summaries will appear here.
                      </p>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                meetings.map((m: any, i: number) => (
                  <motion.tr 
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-[#0F172A] transition-all cursor-pointer"
                    onClick={() => router.push(`/meeting/${m.roomId || m.id}`)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-[#0F172A] border border-[#1F2937] rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-[#6366F1] group-hover:border-[#6366F1]/30 transition-all shadow-inner">
                            <Calendar size={22} />
                         </div>
                         <div>
                           <span className="block font-bold text-white text-sm mb-1 group-hover:text-[#6366F1] transition-colors">{m.name || m.roomId || m.id}</span>
                           <div className="flex items-center gap-2">
                              <Shield size={12} className="text-emerald-500" />
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Secure Room ID: {m.roomId || m.id}</span>
                           </div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Clock size={16} className="text-[#6366F1]" />
                        <span className="text-sm font-medium">
                          {new Date(m.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                         <div className="flex -space-x-2">
                           {[1,2,3].map(j => (
                             <div key={j} className="w-7 h-7 rounded-full bg-[#0F172A] border-2 border-[#111827] flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-xl">
                               {String.fromCharCode(64+j)}
                             </div>
                           ))}
                         </div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Live Nodes</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2.5 text-slate-500 hover:text-white hover:bg-[#1F2937] rounded-xl transition-all border border-transparent hover:border-[#1F2937]">
                           <ChevronRight size={20} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sync Status: Operational</span>
              </div>
           </div>
           <div className="flex items-center gap-6">
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Showing {meetings.length} encrypted sessions</span>
             <div className="flex gap-2">
               <button className="px-4 py-2 bg-[#111827] border border-[#1F2937] text-[10px] font-bold text-slate-500 uppercase tracking-widest rounded-lg disabled:opacity-20 transition-all hover:text-white" disabled>Prev</button>
               <button className="px-4 py-2 bg-[#111827] border border-[#1F2937] text-[10px] font-bold text-slate-500 uppercase tracking-widest rounded-lg disabled:opacity-20 transition-all hover:text-white" disabled>Next</button>
             </div>
           </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
