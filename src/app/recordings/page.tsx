'use client';
import { useState, useEffect } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { 
  MonitorPlay, Download, Trash2, Clock, 
  ShieldCheck, Play, ArrowRight, Share2,
  Video, Brain, Sparkles, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function RecordingsPage() {
  const { user: currentUser } = useAuthStore();
  const [recordings, setRecordings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRecordings = async () => {
      const userId = currentUser?.id || 'guest_global';
      try {
        const res = await fetch(`/api/meetings?userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          // Filter meetings that have a recap or are ended
          setRecordings(data.meetings.filter((m: any) => m.recap || m.status === 'ended'));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecordings();
  }, [currentUser]);

  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12 font-inter">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Intelligence Library</h1>
            <p className="text-slate-400 text-sm font-medium">
              Access your past encrypted sessions and AI-generated executive summaries.
            </p>
          </motion.div>
          <div className="flex gap-2">
             <div className="px-4 py-2 bg-[#111827] border border-[#1F2937] rounded-xl flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                E2EE Storage
             </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="py-32 flex flex-col items-center justify-center">
               <Loader2 className="w-10 h-10 animate-spin text-[#6366F1] mb-4" />
               <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Decrypting Library...</p>
            </div>
          ) : recordings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#111827] border border-[#1F2937] rounded-[2.5rem] p-24 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6366F1]/20 to-transparent" />
               <div className="w-24 h-24 bg-[#6366F1]/5 rounded-[2rem] flex items-center justify-center mb-8 text-slate-600 border border-[#6366F1]/10">
                  <MonitorPlay size={48} />
               </div>
               <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">No recordings captured</h2>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                 Once you conclude a session with intelligence logging enabled, it will materialize here with a strategic summary.
               </p>
               <button 
                 onClick={() => router.push('/dashboard')}
                 className="px-8 py-3.5 bg-[#6366F1] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#4F46E5] transition-all shadow-xl shadow-[#6366F1]/10 active:scale-95 flex items-center gap-2"
               >
                  <Plus size={16} /> New Session
               </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recordings.map((rec: any, i: number) => (
                <motion.div 
                  key={rec.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#111827] border border-[#1F2937] rounded-[2rem] overflow-hidden group hover:border-[#6366F1]/50 transition-all shadow-xl hover:shadow-[#6366F1]/5"
                >
                  <div 
                    className="aspect-video bg-[#0F172A] relative flex items-center justify-center overflow-hidden cursor-pointer" 
                    onClick={() => router.push(`/meeting/${rec.roomId || rec.meetingId || rec.id}`)}
                  >
                     <MonitorPlay size={56} className="text-slate-700 group-hover:scale-110 group-hover:text-[#6366F1] transition-all duration-700" />
                     
                     <div className="absolute top-4 right-4 z-20">
                        <div className="px-3 py-1 bg-[#111827]/80 backdrop-blur-md border border-[#1F2937] rounded-lg text-[10px] font-bold text-white shadow-xl uppercase tracking-widest">
                           1080P • Encrypted
                        </div>
                     </div>

                     {/* AI Badge if recap exists */}
                     {rec.recap && (
                       <div className="absolute bottom-4 left-4 z-20">
                          <div className="px-3 py-1 bg-[#6366F1]/20 backdrop-blur-md border border-[#6366F1]/30 rounded-lg text-[10px] font-bold text-[#6366F1] shadow-xl uppercase tracking-widest flex items-center gap-1.5">
                             <Sparkles size={12} />
                             AI Ready
                          </div>
                       </div>
                     )}

                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 bg-[#0F172A]/60 backdrop-blur-[4px]">
                        <div className="w-16 h-16 bg-[#6366F1] rounded-full flex items-center justify-center text-white shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                           <Play size={24} fill="currentColor" className="ml-1" />
                        </div>
                     </div>
                  </div>

                  <div className="p-6">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Archived Session</span>
                     </div>
                     <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#6366F1] transition-colors truncate tracking-tight">
                        {rec.name || rec.roomId || rec.id}
                     </h3>
                     <div className="flex items-center gap-3 text-slate-400 mb-6">
                        <Clock size={14} className="text-[#6366F1]" />
                        <span className="text-[11px] font-semibold uppercase tracking-widest">
                           {new Date(rec.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                     </div>
                     
                     <div className="flex items-center gap-3 pt-5 border-t border-[#1F2937]">
                         <button 
                           onClick={() => router.push(`/meeting/${rec.roomId || rec.meetingId || rec.id}`)}
                           className="flex-1 py-3 bg-[#6366F1] text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#6366F1]/10 active:scale-95"
                         >
                            <Brain size={16} /> Review Insights
                         </button>
                         <button title="Share Access" className="p-3 bg-[#0F172A] text-slate-400 rounded-xl hover:text-white hover:bg-[#1F2937] transition-all border border-[#1F2937] hover:border-slate-600 active:scale-95">
                            <Share2 size={18} />
                         </button>
                         <button title="Purge Record" className="p-3 bg-[#0F172A] text-slate-400 rounded-xl hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-[#1F2937] hover:border-rose-500/30 active:scale-95">
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
function Plus({ size }: { size: number }) {
  return <Video size={size} />;
}
