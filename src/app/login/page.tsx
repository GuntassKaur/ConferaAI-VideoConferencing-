'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video, Mail, Lock, ArrowRight, ChevronLeft, User, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate fields
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const res = await fetch(endpoint, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData) 
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        // Mock successful session storage
        localStorage.setItem('confera-session', JSON.stringify(data.user));
        setUser(data.user);
        
        // Wait a tiny bit for state to settle then redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setError('Connection refused. Our servers might be undergoing maintenance.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 selection:bg-primary/30">
      {/* Decorative Blur */}
      <div className="absolute top-[20%] left-[20%] w-64 h-64 bg-indigo-500/10 blur-[120px] -z-10" />
      <div className="absolute bottom-[20%] right-[20%] w-64 h-64 bg-blue-500/10 blur-[120px] -z-10" />

      <Link href="/" className="fixed top-10 left-10 flex items-center gap-2 text-slate-500 hover:text-white transition-all duration-300 font-bold text-xs uppercase tracking-widest">
        <ChevronLeft className="w-4 h-4" /> Exit to home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] p-1 scale-100"
      >
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-3 tracking-tight">
              {isLogin ? 'Welcome back' : 'Join the evolution'}
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              {isLogin ? (
                <>Use <span className="text-indigo-400">admin@confera.ai</span> / <span className="text-indigo-400">password123</span> for testing</>
              ) : 'Start your journey with Confera AI today.'}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-black text-center uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Full Identity</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                  <input 
                    required
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Access Key</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                <input 
                  required
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-slate-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-14 text-base mt-4"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-slate-500 font-bold">
              {isLogin ? "No account?" : "Status check?"}{' '}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-primary hover:text-white transition-colors duration-200 uppercase tracking-widest text-xs ml-1"
              >
                {isLogin ? 'Join now' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
