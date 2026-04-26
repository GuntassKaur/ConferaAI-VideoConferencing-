'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SchedulePage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <SidebarWrapper>
      <div className="max-w-7xl mx-auto px-8 py-12 lg:py-16">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">Schedule</h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              Coordinate and manage your future communication workflows.
            </p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <button className="p-3 hover:bg-white/5 border-r border-white/5 transition-colors text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
                <div className="px-8 text-sm font-black text-white uppercase tracking-widest">April 2026</div>
                <button className="p-3 hover:bg-white/5 border-l border-white/5 transition-colors text-slate-400 hover:text-white"><ChevronRight size={20} /></button>
             </div>
             <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
                <Plus size={16} /> Schedule
             </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-9">
              <div className="bg-[#0a0a0c] border border-white/5 rounded-[3rem] p-1 shadow-2xl overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent pointer-events-none" />
                 <div className="grid grid-cols-7 border-b border-white/5 bg-white/[0.01]">
                    {days.map(day => (
                      <div key={day} className="py-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{day}</div>
                    ))}
                 </div>
                 <div className="grid grid-cols-7">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const dayNum = ((i + 26) % 31) + 1;
                      const isInactive = i < 5 || i > 30;
                      return (
                        <div key={i} className={`h-36 border-r border-b border-white/[0.03] p-5 transition-all hover:bg-white/[0.02] relative group ${isInactive ? 'opacity-10' : ''}`}>
                           <span className={`text-xs font-bold ${dayNum === 13 ? 'text-indigo-400' : 'text-slate-600'}`}>{dayNum}</span>
                           {i === 12 && (
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.9 }}
                               animate={{ opacity: 1, scale: 1 }}
                               className="mt-3 p-3 bg-indigo-600 rounded-xl text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-indigo-600/20"
                             >
                               Product Sync
                             </motion.div>
                           )}
                           {i === 15 && (
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.9 }}
                               animate={{ opacity: 1, scale: 1 }}
                               className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-wider"
                             >
                               Client Session
                             </motion.div>
                           )}
                        </div>
                      );
                    })}
                 </div>
              </div>
           </div>

           <div className="lg:col-span-3 space-y-8">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Upcoming Node Activity</h3>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Project Zenith', time: 'Tomorrow, 10:00 AM', type: 'High Priority' },
                  { title: 'Security Audit', time: 'Apr 28, 02:00 PM', type: 'Protocol' },
                  { title: 'Node Scaling', time: 'Apr 30, 09:00 AM', type: 'Maintenance' },
                ].map((m, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-[#0a0a0c] border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all group cursor-pointer"
                  >
                     <div className="flex items-center gap-2 mb-4">
                        <div className="px-2 py-0.5 bg-indigo-500/10 rounded-md text-[8px] font-black text-indigo-400 uppercase tracking-widest border border-indigo-500/20">
                          {m.type}
                        </div>
                     </div>
                     <h4 className="font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">{m.title}</h4>
                     <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Clock size={12} className="text-indigo-500/50" />
                        {m.time}
                     </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
                 <div className="absolute -bottom-10 -right-10 text-white/10 rotate-12">
                   <CalendarIcon size={120} />
                 </div>
                 <h4 className="text-lg font-bold mb-2">Smart Sync</h4>
                 <p className="text-white/70 text-xs leading-relaxed mb-6 font-medium">Auto-schedule sessions based on team availability.</p>
                 <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg">
                   Enable AI
                 </button>
              </div>
           </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
