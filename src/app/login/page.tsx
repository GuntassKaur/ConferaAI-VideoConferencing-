'use client';
import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, ShieldCheck, Zap, ArrowRight, User } from 'lucide-react';

export default function LoginPage() {
  const [name, setName] = useState('');
  const { login, currentUser } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) router.push('/dashboard');
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-violet-600/10 blur-[100px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a0c] border border-white/5 rounded-[3rem] p-12 shadow-2xl relative z-10"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
            <Video size={24} />
          </div>
          <span className="font-bold text-3xl text-white tracking-tighter uppercase">Confera</span>
        </div>

        <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Enter Workspace</h1>
        <p className="text-slate-500 text-base mb-10 font-medium">Access your personalized neural communication hub.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 group">
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2 group-focus-within:text-indigo-400 transition-colors">Access Name</label>
             <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Guntass Kaur"
                  className="w-full pl-14 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-[1.8rem] text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all placeholder:text-slate-700"
                />
             </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-[1.8rem] shadow-xl hover:bg-indigo-500 hover:text-white transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2 group"
          >
            Authenticate <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-16 pt-10 border-t border-white/[0.03] flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
           <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500/40" /> Neural Lock</div>
           <div className="flex items-center gap-2"><Zap size={14} className="text-amber-500/40" /> Edge Node</div>
           <div className="font-bold text-white/40 tracking-tighter">CONFERA v2.1</div>
        </div>
      </motion.div>
    </div>
  );
}
