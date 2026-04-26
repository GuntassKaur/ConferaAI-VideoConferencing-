'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { UserPlus, Shield, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TeamPage() {
  return (
    <SidebarWrapper>
      <div className="max-w-5xl mx-auto px-8 py-12 lg:py-20">
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">Team Space</h1>
            <p className="text-slate-500 text-lg font-medium max-w-xl">
              Collaborate and manage your organization's communication nodes.
            </p>
          </motion.div>
        </header>

        {/* Premium Empty State */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0a0a0c] border border-white/5 rounded-[4rem] p-16 lg:p-24 flex flex-col items-center text-center relative overflow-hidden shadow-2xl"
        >
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/5 blur-[80px] rounded-full" />
           
           <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/10 shadow-inner relative group">
              <UserPlus size={36} className="text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full -z-10" 
              />
           </div>
           
           <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Expand the network</h2>
           <p className="text-slate-500 text-base leading-relaxed mb-12 max-w-md mx-auto font-medium">
             Connect with your colleagues to unlock shared intelligence, team-wide archives, and synchronized communication nodes.
           </p>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg bg-white/[0.02] p-2.5 rounded-[2.2rem] border border-white/5 focus-within:border-indigo-500/50 transition-all shadow-inner">
              <div className="flex-1 flex items-center px-6">
                <Mail className="text-slate-600 mr-4" size={20} />
                <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full bg-transparent border-none text-white text-sm focus:ring-0 placeholder:text-slate-600 font-medium"
                />
              </div>
              <button className="px-10 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-[1.8rem] hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95">
                Send Invite
              </button>
           </div>

           <div className="mt-20 pt-10 border-t border-white/[0.03] w-full flex flex-col md:flex-row items-center justify-center gap-12 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <div className="flex items-center gap-3">
                 <Shield size={16} className="text-indigo-500/60" />
                 Encrypted Management
              </div>
              <div className="flex items-center gap-3">
                 <Zap size={16} className="text-amber-500/60" />
                 Zero-Lag Sync
              </div>
           </div>
        </motion.div>
      </div>
    </SidebarWrapper>
  );
}
