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
        <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
          {message ? <CheckCircle2 className="text-emerald-500 w-6 h-6" /> : <Lock className="text-blue-500 w-6 h-6" />}
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{message ? 'Security Updated' : 'Reset Password'}</h1>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Confera Account Recovery</p>
      </div>

      {message ? (
        <div className="text-center space-y-6">
           <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
              <p className="text-sm text-slate-300">{message}</p>
           </div>
           <p className="text-[10px] text-slate-500 uppercase tracking-widest animate-pulse">Redirecting to login portal...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">New Security Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="input-field w-full pl-11 pr-11"
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
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Confirm Security Key</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="input-field w-full pl-11"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center bg-red-400/5 py-3 rounded-lg border border-red-400/10">{error}</p>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-6 text-xs uppercase tracking-[0.2em]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Apply Security Update'}
          </button>
        </form>
      )}
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-inter">
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/5 to-transparent -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="enterprise-card p-10 bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
          <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin text-blue-500" size={32} /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
