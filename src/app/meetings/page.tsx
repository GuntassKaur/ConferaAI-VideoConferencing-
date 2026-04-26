'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Video, Search, Plus, Clock, Users, Calendar, Filter, ChevronRight, MoreVertical } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function MeetingsPage() {
  const { currentUser } = useProductStore();
  const router = useRouter();

  const meetings = currentUser?.meetings || [];

  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Meeting History</h1>
            <p className="text-slate-500 text-sm">
              Review and manage your past collaborations and AI recaps.
            </p>
          </div>
          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-all">
                <Filter size={16} /> Filter
             </button>
             <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
             >
                <Plus size={16} /> New Meeting
             </button>
          </div>
        </header>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Meeting</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Participants</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="wait">
                {meetings.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                          <Video size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">No meetings found</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                          Once you host or join a meeting, it will appear here in your archives.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  meetings.map((m, i) => (
                    <motion.tr 
                      key={m.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/meeting/${m.id}`)}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              <Calendar size={18} />
                           </div>
                           <div>
                             <span className="block font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{m.title}</span>
                             <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Session ID: {m.id}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Clock size={14} className="text-slate-300" />
                          <span className="text-xs">{m.createdAt}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <div className="flex -space-x-1.5">
                             {[1,2].map(i => (
                               <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-bold text-slate-600">
                                 {String.fromCharCode(64+i)}
                               </div>
                             ))}
                           </div>
                           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-1">2 People</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                           <ChevronRight size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex items-center justify-between px-2">
           <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
             Showing {meetings.length} sessions
           </p>
           <div className="flex gap-4">
             <button className="text-xs font-bold text-slate-400 hover:text-slate-600 disabled:opacity-30 uppercase tracking-widest" disabled>Prev</button>
             <button className="text-xs font-bold text-slate-400 hover:text-slate-600 disabled:opacity-30 uppercase tracking-widest" disabled>Next</button>
           </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
