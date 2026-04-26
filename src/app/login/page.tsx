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
  }, [currentUser, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Subtle Background Blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-xl relative z-10"
      >
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Video size={20} />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">Confera</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Enter your name to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
             <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Guntass Kaur"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
                />
             </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            Sign in
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo-400/50" /> Secure</div>
           <div className="flex items-center gap-1.5"><Zap size={14} className="text-amber-400/50" /> Fast</div>
           <span className="text-slate-300">v2.1</span>
        </div>
      </motion.div>
    </div>
  );
}
