'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Eye, EyeOff, Shield, Sparkles, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Direct login logic for quick auth in this product
      // In a real multi-user scenario, this would call /api/auth/login
      const mockUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        email: email
      };
      
      // Simulate network delay for "Real" feel
      await new Promise(r => setTimeout(r, 1200));
      
      setUser(mockUser);
      router.push('/dashboard');
    } catch (err) {
      setError('Neural calibration failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-mesh overflow-hidden font-outfit">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="glass-card p-10 relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(79,70,229,0.5)]"
            >
              <Shield className="text-white w-10 h-10" />
            </motion.div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Confera<span className="text-indigo-500">AI</span></h1>
            <p className="text-slate-400 font-medium tracking-wide">Next-Gen Video Collaboration</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Universal ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@nexus.ai"
                required
                className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Access Token</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-14 bg-white/[0.03] border border-white/5 rounded-2xl px-6 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-slate-600"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors p-2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Enter Neural Space</span>
                </>
              )}
            </button>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]"
          >
            <Sparkles size={12} className="text-indigo-500" />
            <span>Encrypted Quantum Link</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
