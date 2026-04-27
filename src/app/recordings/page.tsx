'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { MonitorPlay, Download, Trash2, Clock, ShieldCheck, Play, ArrowRight, Share2 } from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function RecordingsPage() {
  const { recordings } = useProductStore();
  const router = useRouter();

  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-semibold text-text-primary mb-1">Recordings</h1>
            <p className="text-text-secondary text-sm">
              Access your library of past sessions with automated AI recaps.
            </p>
          </motion.div>
        </header>

        <AnimatePresence mode="wait">
          {recordings.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-background-elevated border border-background-border rounded-xl p-24 flex flex-col items-center text-center shadow-sm"
            >
               <div className="w-20 h-20 bg-background-sub rounded-2xl flex items-center justify-center mb-6 text-text-secondary">
                  <MonitorPlay size={40} />
               </div>
               <h2 className="text-lg font-semibold text-text-primary mb-2">No recordings yet</h2>
               <p className="text-text-secondary text-sm leading-relaxed mb-10 max-w-sm mx-auto">
                 Once you end a session with recording enabled, it will appear here with an intelligent summary.
               </p>
               <div className="flex items-center gap-2 px-4 py-2 bg-background-sub text-text-secondary rounded-lg text-xs font-medium border border-background-border">
                  <ShieldCheck size={16} /> 
                  End-to-End Encrypted Storage
               </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recordings.map((rec: any, i: number) => (
                <motion.div 
                  key={rec.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-background-elevated border border-background-border rounded-xl overflow-hidden group hover:border-accent/50 transition-all"
                >
                  <div className="aspect-video bg-background-sub relative flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => router.push(`/meeting/${rec.id}`)}>
                     <MonitorPlay size={48} className="text-text-secondary group-hover:scale-110 group-hover:text-accent transition-all duration-500" />
                     <div className="absolute top-4 right-4 z-20">
                        <div className="px-2 py-1 bg-background-elevated border border-background-border rounded text-[10px] font-medium text-text-secondary shadow-sm">
                           1080P HD
                        </div>
                     </div>
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30 bg-background-base/50 backdrop-blur-[2px]">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white shadow-xl scale-90 group-hover:scale-100 transition-transform">
                           <Play size={20} fill="currentColor" />
                        </div>
                     </div>
                  </div>
                  <div className="p-5">
                     <div className="flex items-center gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-text-secondary">Archived</span>
                     </div>
                     <h3 className="font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors truncate">{rec.title}</h3>
                     <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
                        <Clock size={14} />
                        {rec.createdAt}
                     </div>
                     
                     <div className="flex items-center gap-2 pt-4 border-t border-background-border">
                        <button 
                          onClick={() => router.push(`/meeting/${rec.id}`)}
                          className="flex-1 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-all flex items-center justify-center gap-2"
                        >
                           Review Insights
                        </button>
                        <button title="Share" className="p-2 bg-background-sub text-text-secondary rounded-lg hover:text-text-primary hover:bg-background-border transition-all border border-background-border">
                           <Share2 size={18} />
                        </button>
                        <button title="Delete" className="p-2 bg-background-sub text-text-secondary rounded-lg hover:text-rose-500 hover:bg-background-border transition-all border border-background-border">
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
