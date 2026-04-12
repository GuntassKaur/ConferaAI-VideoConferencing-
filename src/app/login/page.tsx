'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Eye, EyeOff, Shield, Sparkles, Loader2, Video } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-inter">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/5 to-transparent -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="enterprise-card p-10 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
              <Video className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Confera <span className="text-blue-500">AI</span></h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Enterprise Video Conferencing</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Account Identifier</label>
              <input 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Name or Email"
                className="input-field w-full"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Security Key</label>
                <button type="button" className="text-[10px] font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest">Forgot?</button>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="input-field w-full"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs font-semibold text-center bg-red-400/5 py-3 rounded-lg border border-red-400/10">{error}</p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-6 text-sm uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500 font-medium">
            New to Confera? <button className="text-blue-500 hover:text-blue-400 font-bold">Request Access</button>
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between px-2">
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">v2.4.0 SaaS Edition</p>
           <div className="flex gap-4">
              <button className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest">Privacy</button>
              <button className="text-[10px] font-bold text-slate-600 hover:text-slate-400 uppercase tracking-widest">Terms</button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
