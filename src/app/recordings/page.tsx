'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { MonitorPlay, Download, Trash2, Clock, ShieldCheck, Play } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecordingsPage() {
  const { currentUser } = useProductStore();
  
  const recordings = currentUser?.recordings || [];

  return (
    <SidebarWrapper>
      <div className="max-w-7xl mx-auto px-8 py-12 lg:py-20">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">Recordings</h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              Securely archived video sessions with automated intelligence recaps.
            </p>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {recordings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0a0a0c] border border-white/5 rounded-[4rem] p-24 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
               <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10 shadow-inner">
                  <MonitorPlay size={40} className="text-slate-700" />
               </div>
               <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">No recordings found</h2>
               <p className="text-slate-500 text-base leading-relaxed mb-12 max-w-sm mx-auto font-medium">
                 Session recordings will appear here automatically after meetings conclude. Each recording includes a full semantic recap.
               </p>
               <div className="flex items-center gap-4 px-8 py-4 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                  <ShieldCheck size={18} className="text-indigo-400/60" /> 
                  End-to-End Encrypted Storage
               </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {recordings.map((rec, i) => (
                <motion.div 
                  key={rec.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#0a0a0c] border border-white/5 rounded-[3.5rem] overflow-hidden group hover:border-indigo-500/30 transition-all shadow-2xl"
                >
                  <div className="aspect-video bg-white/[0.02] relative flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                     <MonitorPlay size={64} className="text-white/5 group-hover:scale-110 group-hover:text-indigo-500/20 transition-all duration-700" />
                     <div className="absolute bottom-8 left-8 z-20">
                        <div className="px-4 py-1.5 bg-indigo-600 rounded-lg text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                           HD 1080P
                        </div>
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                           <Play size={24} fill="black" />
                        </div>
                     </div>
                  </div>
                  <div className="p-10">
                     <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Session Archived</span>
                     </div>
                     <h3 className="font-bold text-2xl text-white mb-3 group-hover:text-indigo-400 transition-colors leading-tight">{rec.title}</h3>
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-10 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                           <Clock size={14} className="text-indigo-500/50" />
                           {rec.createdAt}
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4 pt-10 border-t border-white/[0.03]">
                        <button className="flex-1 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95">
                           Play Recording
                        </button>
                        <div className="flex gap-2">
                           <button title="Download" className="p-4 bg-white/5 text-slate-500 rounded-2xl hover:text-white hover:bg-white/10 transition-all border border-white/5">
                              <Download size={20} />
                           </button>
                           <button title="Delete" className="p-4 bg-white/5 text-slate-500 rounded-2xl hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-white/5">
                              <Trash2 size={20} />
                           </button>
                        </div>
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
