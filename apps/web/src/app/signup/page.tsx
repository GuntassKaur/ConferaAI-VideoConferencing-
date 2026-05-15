'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Lock, User, ArrowRight, Loader2, Video } from 'lucide-react';
import Link from 'next/link';
import { useToastStore } from '@/store/useToastStore';

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuthStore();
  const { addToast } = useToastStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    try {
      await signup(name, email, password);
      addToast('Account created!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-3xl p-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center text-white shadow-lg">
            <Video size={20} />
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">Confera AI</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Join the professional conferencing platform.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <p className="text-sm font-semibold text-rose-500">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-[#0B1020] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366F1] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full pl-11 pr-4 py-3 bg-[#0B1020] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366F1] transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-[#0B1020] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:border-[#6366F1] transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full py-4 bg-[#6366F1] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#4F46E5] transition-all flex items-center justify-center gap-2 disabled:opacity-70 group mt-4"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                Create account
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Already have an account? <Link href="/login" className="text-[#6366F1] hover:underline font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
