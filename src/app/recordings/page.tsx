'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { MonitorPlay, Download, Trash2, Clock, ShieldCheck, Play, ArrowRight, Share2 } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function RecordingsPage() {
  const { currentUser } = useProductStore();
  const router = useRouter();
  
  const recordings = currentUser?.recordings || [];

  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Recordings</h1>
            <p className="text-slate-500 text-sm font-medium">
              Access your library of past sessions with automated AI recaps.
            </p>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {recordings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-24 flex flex-col items-center text-center shadow-sm"
            >
               <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-300">
                  <MonitorPlay size={40} />
               </div>
               <h2 className="text-xl font-bold text-slate-900 mb-2">No recordings yet</h2>
               <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
                 Once you end a session with recording enabled, it will appear here with an intelligent summary.
               </p>
               <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                  <ShieldCheck size={16} className="text-indigo-500" /> 
                  End-to-End Encrypted Storage
               </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordings.map((rec, i) => (
                <motion.div 
                  key={rec.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden group hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all"
                >
                  <div className="aspect-video bg-slate-100 relative flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => router.push(`/meeting/${rec.id}`)}>
                     <MonitorPlay size={48} className="text-slate-300 group-hover:scale-110 group-hover:text-indigo-200 transition-all duration-500" />
                     <div className="absolute top-4 right-4 z-20">
                        <div className="px-2 py-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg text-[8px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
                           1080P HD
                        </div>
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-indigo-600/5 backdrop-blur-[2px]">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                           <Play size={20} fill="currentColor" />
                        </div>
                     </div>
                  </div>
                  <div className="p-6">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Archived</span>
                     </div>
                     <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors truncate">{rec.title}</h3>
                     <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 mb-6">
                        <div className="flex items-center gap-1.5">
                           <Clock size={14} className="text-slate-300" />
                           {rec.createdAt}
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => router.push(`/meeting/${rec.id}`)}
                          className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center justify-center gap-2 group"
                        >
                           Review Insights
                           <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <button title="Share" className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100">
                           <Share2 size={18} />
                        </button>
                        <button title="Delete" className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-100">
                           <Trash2 size={18} />
                        </button>
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </SidebarWrapper>
  );
}
