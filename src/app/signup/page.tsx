'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Lock, Eye, EyeOff, Activity, Video, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [strength, setStrength] = useState(0);
  
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  // Password strength logic
  useEffect(() => {
    let s = 0;
    if (password.length >= 6) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(true);
      setErrorMessage('Access keys do not match.');
      // Shake animation trigger
      setTimeout(() => setError(false), 500);
      return;
    }

    setIsLoading(true);
    setError(false);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Identity registration failed');
      
      setUser({ id: data.user.id, name: data.user.name, email: data.user.email });
      router.push('/dashboard');
    } catch (err: any) {
      setError(true);
      setErrorMessage(err.message);
      // Shake animation trigger
      setTimeout(() => setError(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 font-inter overflow-hidden relative">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Branding */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 flex items-center gap-3 relative z-10"
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Video className="text-white w-5 h-5" />
        </div>
        <span className="text-2xl font-black text-white tracking-tighter">Confera <span className="text-indigo-500">AI</span></span>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          x: error ? [0, -8, 8, -4, 4, 0] : 0
        }}
        transition={{ 
          duration: error ? 0.4 : 0.6,
          ease: "easeOut"
        }}
        className="w-full max-w-md bg-[#111113] border border-[#27272a] rounded-[24px] p-8 shadow-2xl relative overflow-hidden z-10"
      >
        {/* Futuristic Accent */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        
        <div className="flex gap-4 mb-8 p-1 bg-[#09090b] rounded-xl border border-[#27272a]">
           <Link href="/login" className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300 text-center flex items-center justify-center transition-colors">Login</Link>
           <button className="flex-1 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-[#111113] text-white rounded-lg border border-[#27272a] shadow-lg transition-all">Sign Up</button>
        </div>

        <div className="mb-8">
           <h2 className="text-xl font-bold text-white tracking-tight">Register Identity</h2>
           <p className="text-xs text-slate-500 mt-1">Initialize your secure profile on the Confera mesh.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Identity</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Commander Name"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-12 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Node</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="commander@confera.ai"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-12 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-12 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            <div className="flex gap-1.5 mt-2 px-1">
               {[1, 2, 3, 4].map((i) => (
                 <div 
                   key={i} 
                   className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                     strength >= i 
                      ? strength === 1 ? 'bg-rose-500' 
                      : strength === 2 ? 'bg-amber-500' 
                      : strength === 3 ? 'bg-blue-500' 
                      : 'bg-emerald-500'
                      : 'bg-slate-800'
                   }`} 
                 />
               ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Key</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-12 py-3.5 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-700 shadow-inner"
              />
            </div>
          </div>

          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest text-center bg-rose-500/5 border border-rose-500/10 py-2 rounded-lg">{errorMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.2em] py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? <Activity className="animate-spin" size={18} /> : (
              <>
                <span>Initialize Identity</span>
                <ChevronRight size={14} />
              </>
            )}
          </button>
        </form>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest relative z-10"
      >
        Confera Network Protocols Active • Node v4.1
      </motion.p>
    </div>
  );
}
