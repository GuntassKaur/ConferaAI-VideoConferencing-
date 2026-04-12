'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, ShieldCheck, MailCheck } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send link');

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
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
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20">
              {message ? <MailCheck className="text-emerald-500 w-6 h-6" /> : <ShieldCheck className="text-blue-500 w-6 h-6" />}
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Recover Access</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 text-center">Secure Account Recovery Protocol</p>
          </div>

          {message ? (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                 <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
              </div>
              <Link href="/login" className="btn-secondary w-full py-4 text-xs uppercase tracking-widest">Return to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Registered Email</label>
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

              {error && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center bg-red-400/5 py-3 rounded-lg border border-red-400/10">{error}</p>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-6 text-xs uppercase tracking-[0.2em]"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Authorization'}
              </button>

              <Link href="/login" className="flex items-center justify-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest">
                 <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
