'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, ArrowRight, ShieldCheck, Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen flex bg-[#020617] text-white font-inter selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Left Pane - Brand / Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-slate-900/40">
         <div className="absolute inset-0 z-0">
            {/* Abstract Background blobs */}
            <motion.div 
               className="absolute top-[-10%] left-[-20%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen"
               animate={{ x: [0, 50, 0], y: [0, 20, 0] }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
               className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen text-indigo-500"
               animate={{ x: [0, -50, 0], y: [0, -20, 0] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
         </div>

         <div className="relative z-10 flex items-center gap-2 group cursor-pointer w-max" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black font-outfit tracking-tight uppercase">
               Confera<span className="text-indigo-500">AI</span>
            </span>
         </div>

         <div className="relative z-10 max-w-xl">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
               <h1 className="text-5xl font-black leading-tight mb-6">
                  Log in to your <span className="premium-gradient-text">intelligence hub.</span>
               </h1>
               <p className="text-xl text-slate-400 font-medium">
                  Access real-time synthesis, transcriptions, and high-fidelity video conferencing tailored for the modern enterprise.
               </p>
            </motion.div>
         </div>

         <div className="relative z-10 flex items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
            <ShieldCheck className="w-5 h-5 text-indigo-500" /> SOC2 COMPLIANT ENTERPRISE SECURITY
         </div>
      </div>

      {/* Right Pane - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
         {/* Subtle background glow for right side */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

         <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-[440px] space-y-10 relative z-10"
         >
            <div className="space-y-3">
               <h2 className="text-3xl font-black tracking-tight text-white">Welcome back</h2>
               <p className="text-slate-400 font-medium text-lg">Enter your details to continue to Confera AI.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Work Email</label>
                  <div className="relative group">
                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                     <input 
                        required
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-slate-500 hover:border-white/20 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all duration-300"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Password</label>
                     <span onClick={() => router.push('/forgot-password')} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer transition-colors">Forgot Password?</span>
                  </div>
                  <div className="relative group">
                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                     <input 
                        required
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder-slate-500 hover:border-white/20 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all duration-300"
                     />
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 premium-gradient-bg text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-[0.98] disabled:opacity-70 text-lg mt-4 group"
               >
                  {isLoading ? 'Authenticating...' : 'Sign In'} 
                  {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
               </button>
            </form>

            <div className="pt-8 text-center border-t border-white/5">
               <p className="text-slate-400 font-medium">
                  Don't have an account? <span className="text-white hover:text-indigo-400 font-bold cursor-pointer transition-colors">Contact administrator</span>
               </p>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
