'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Eye, EyeOff, Shield, Sparkles, Loader2, Video, UserPlus, Mail, Lock, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const body = isLogin ? { email, password } : { name, email, password };
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setUser(data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Calibration failed. Check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-inter">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/5 to-transparent -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="enterprise-card p-10 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 transition-all duration-500" />
          
          <div className="flex flex-col items-center mb-8">
            <motion.div 
               key={isLogin ? 'login-icon' : 'signup-icon'}
               initial={{ rotate: -20, opacity: 0 }}
               animate={{ rotate: 0, opacity: 1 }}
               className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20"
            >
              <Video className="text-white w-6 h-6" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Confera <span className="text-blue-500">AI</span></h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Enterprise Platform</p>
          </div>

          <div className="flex p-1 bg-slate-800/50 rounded-lg mb-8">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${isLogin ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <LogIn size={14} /> Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${!isLogin ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
               <UserPlus size={14} /> Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="input-field w-full pl-11"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="input-field w-full pl-11"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Secure Password</label>
                {isLogin && <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest">Forgot?</Link>}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field w-full pl-11 pr-11"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center bg-red-400/5 py-3 rounded-lg border border-red-400/10"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-6 text-xs uppercase tracking-[0.2em] mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isLogin ? 'Sign In to Portal' : 'Create Enterprise Account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              {isLogin ? "Need access?" : "Already have an account?"} 
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 text-blue-500 hover:text-blue-400 transition-colors"
              >
                {isLogin ? "Request Registration" : "Return to Log In"}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between px-2 opacity-50">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Confera SaaS v2.4</p>
           <div className="flex gap-4">
              <button className="text-[10px] font-bold text-slate-600 hover:text-slate-400">Privacy</button>
              <button className="text-[10px] font-bold text-slate-600 hover:text-slate-400">Terms</button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
