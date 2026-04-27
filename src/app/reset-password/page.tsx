'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Loader2, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset password');

      setMessage(data.message);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <ShieldAlert className="text-red-500 w-12 h-12 mx-auto" />
        <h1 className="text-xl font-bold text-white">Invalid Reset Link</h1>
        <p className="text-sm text-slate-500">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" title="Go to Home" className="btn-secondary inline-block py-3 px-6 text-xs uppercase tracking-widest mt-4">Request New Link</Link>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center mb-10">
        <div className="w-12 h-12 bg-[#6366F1]/10 rounded-xl flex items-center justify-center mb-4 border border-[#6366F1]/20">
          {message ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <Lock className="text-[#6366F1] w-6 h-6" />}
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{message ? 'Security Updated' : 'Reset Password'}</h1>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Confera Account Recovery</p>
      </div>

      {message ? (
        <div className="text-center space-y-6">
           <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <p className="text-sm text-slate-300">{message}</p>
           </div>
           <p className="text-[10px] text-slate-400 uppercase tracking-widest animate-pulse">Redirecting to login portal...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">New Security Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="w-full pl-11 pr-11 py-3 bg-[#0F172A] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm Security Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full pl-11 pr-11 py-3 bg-[#0F172A] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center bg-red-400/10 py-3 rounded-lg border border-red-400/20">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#6366F1] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#4F46E5] transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Apply Security Update'}
          </button>
        </form>
      )}
    </>
    </>
  );
}

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Subtle Background Blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: error ? [0, -5, 5, -3, 3, 0] : 0
        }}
        className="w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-[2.5rem] p-12 shadow-2xl relative z-10"
      >
        <ResetPasswordForm />
      </motion.div>
    </div>
  );
}
