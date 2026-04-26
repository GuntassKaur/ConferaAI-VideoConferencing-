'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Video, Search, Plus, Clock, Users } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MeetingsPage() {
  const { currentUser } = useProductStore();
  const router = useRouter();

  const meetings = currentUser?.meetings || [];

  return (
    <SidebarWrapper>
      <div className="max-w-7xl mx-auto px-8 py-12 lg:py-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">Archives</h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              Access and review your library of intelligent communication sessions.
            </p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                <Search size={16} /> Filter
             </button>
             <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
             >
                <Plus size={16} /> New Session
             </button>
          </div>
        </header>

        <div className="bg-[#0a0a0c] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Session Details</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Timestamp</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Node</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              <AnimatePresence mode="wait">
                {meetings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-slate-700">
                          <Video size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Archive is empty</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                          Your meeting history will appear here once you host or join your first session.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  meetings.map((m, i) => (
                    <motion.tr 
                      key={m.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => router.push(`/meeting/${m.id}`)}
                    >
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                           <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                              <Video size={22} />
                           </div>
                           <div>
                             <span className="block font-bold text-white text-lg group-hover:text-indigo-400 transition-colors">{m.title}</span>
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">E2EE Protected</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2 text-slate-400 font-medium">
                          <Clock size={14} className="text-indigo-400/50" />
                          <span className="text-sm">{m.createdAt}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-2">
                           <div className="flex -space-x-2">
                             {[1,2].map(i => (
                               <div key={i} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-[#0a0a0c] flex items-center justify-center text-[8px] font-bold text-white">
                                 U{i}
                               </div>
                             ))}
                           </div>
                           <span className="text-xs text-slate-500 font-medium ml-2">+3 more</span>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                          View Insight
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex items-center justify-between px-6">
           <p className="text-xs text-slate-500 font-medium">Showing {meetings.length} of {meetings.length} archived sessions</p>
           <div className="flex gap-2">
             <button className="p-2 text-slate-500 hover:text-white disabled:opacity-30" disabled>Previous</button>
             <button className="p-2 text-slate-500 hover:text-white disabled:opacity-30" disabled>Next</button>
           </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
