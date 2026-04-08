'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, ArrowRight, ShieldCheck, Mail, Lock, Sparkles, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('confera_user', JSON.stringify({ email }));
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-[#020617] text-white font-inter selection:bg-blue-500/30">
      
      {/* Back to Home */}
      <Link href="/" className="absolute top-8 left-8 z-50 flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm">
        <ChevronLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Left Pane - Brand / Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden bg-black/50 border-r border-white/5">
         <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]" />
         </div>

         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-20 group cursor-pointer" onClick={() => router.push('/')}>
               <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform">
                  <Video className="w-6 h-6 text-white" />
               </div>
               <span className="text-2xl font-black font-outfit tracking-tighter uppercase">
                  Confera<span className="text-blue-500">AI</span>
               </span>
            </div>

            <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="max-w-md"
            >
               <h1 className="text-6xl font-black leading-[0.9] tracking-tighter mb-8">
                  The future of <br />
                  <span className="text-blue-500">Work Sync.</span>
               </h1>
               <p className="text-xl text-slate-400 font-medium leading-relaxed">
                  Enterprise-grade intelligence for high-performance teams. Login to access your workspace and AI insights.
               </p>
            </motion.div>
         </div>

         <div className="relative z-10">
            <div className="flex items-center gap-4 text-xs font-black text-slate-500 uppercase tracking-[0.3em]">
               <ShieldCheck className="w-5 h-5 text-blue-500" /> SOC2 Type II Certified Security
            </div>
         </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
         {/* Adaptive Glow */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[140px] pointer-events-none" />

         <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[400px] relative z-10"
         >
            <div className="mb-12">
               <h2 className="text-3xl font-black tracking-tight text-white mb-3">Enterprise Access</h2>
               <p className="text-slate-400 font-medium h">Welcome back. Please enter your credentials.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Work Email</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                     <input 
                        required
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-slate-600 hover:border-white/20 focus:border-blue-500 focus:bg-white/10 outline-none transition-all duration-300 font-medium"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Password</label>
                     <Link href="/forgot-password" virtual className="text-xs font-black text-blue-500 hover:text-blue-400 transition-colors tracking-widest uppercase">Forgot?</Link>
                  </div>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                     <input 
                        required
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-slate-600 hover:border-white/20 focus:border-blue-500 focus:bg-white/10 outline-none transition-all duration-300 font-medium"
                     />
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-70 text-lg group"
               >
                  {isLoading ? 'Wait...' : 'Sign In to Workspace'} 
                  {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
               </button>
            </form>

            <div className="mt-12 pt-8 text-center border-t border-white/5">
               <p className="text-slate-500 font-bold text-sm">
                  New to ConferaAI? <span className="text-white hover:text-blue-400 cursor-pointer transition-colors">Contact Administrator</span>
               </p>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
