'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/productStore';
import { Mail, Lock, Eye, EyeOff, Loader2, Video, User, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [shake, setShake] = useState(false);
  const [strength, setStrength] = useState(0);
  
  const router = useRouter();
  const { signup, isLoading, setUser } = useAuthStore();

  useEffect(() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    setStrength(s);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg('Password too short');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    
    try {
      await signup(name, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Registration failed. Please try again.';
      setErrorMsg(message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />

      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: shake ? [0, -5, 5, -3, 3, 0] : 0
        }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-[2.5rem] p-10 shadow-xl relative z-10"
      >
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#6366F1]/20">
            <Video size={20} />
          </div>
          <span className="font-bold text-2xl text-white tracking-tight">Confera</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-slate-400 text-sm">Join the next generation of AI-powered conferencing.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
            <ShieldCheck className="text-rose-500 shrink-0 mt-0.5" size={16} />
            <p className="text-sm font-semibold text-rose-600 leading-snug">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
             <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Guntass Kaur"
                  className="w-full pl-11 pr-4 py-3 bg-[#0F172A] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all font-medium"
                />
             </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
             <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pl-11 pr-4 py-3 bg-[#0F172A] border ${errorMsg === 'User already exists' ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-[#1F2937] focus:ring-[#6366F1]/20 focus:border-[#6366F1]'} rounded-xl text-sm text-white focus:outline-none focus:ring-2 transition-all font-medium`}
                />
             </div>
             {errorMsg === 'User already exists' && <p className="text-red-500 text-sm mt-1">User already exists</p>}
             {errorMsg === 'Invalid email' && <p className="text-red-500 text-sm mt-1">Invalid email</p>}
          </div>

          <div className="space-y-1.5">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
             <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full pl-11 pr-12 py-3 bg-[#0F172A] border ${errorMsg === 'Password too short' ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-[#1F2937] focus:ring-[#6366F1]/20 focus:border-[#6366F1]'} rounded-xl text-sm text-white focus:outline-none focus:ring-2 transition-all font-medium`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>
             {errorMsg === 'Password too short' && <p className="text-red-500 text-sm mt-1">Password too short</p>}
             {/* Strength Indicator */}
             {password.length > 0 && (
                <div className="flex gap-1.5 mt-3 px-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        strength >= i 
                          ? strength <= 2 ? 'bg-rose-500' 
                          : strength === 3 ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                          : 'bg-slate-100'
                      }`} 
                    />
                  ))}
                </div>
              )}
          </div>

          <div className="space-y-1.5 pb-4">
             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
             <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-11 pr-12 py-3 bg-[#0F172A] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all font-medium"
                />
             </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#6366F1] text-white font-bold text-sm rounded-xl shadow-lg hover:bg-[#4F46E5] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 group"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>
                {isLoading ? 'Registering...' : 'Create account'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#1F2937]"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-[#111827] px-4 text-slate-400">Or enter as</span>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              const guestId = 'guest_' + Math.random().toString(36).substring(2, 9);
              setUser({ id: guestId, name: 'Guest User', email: 'guest@confera.ai' });
              router.push('/dashboard');
            }}
            className="w-full py-3.5 bg-[#1F2937] text-white font-bold text-sm rounded-xl hover:bg-[#374151] transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <User size={18} className="text-slate-400" />
            Join as Guest
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400 font-medium">
          Already have an account? <Link href="/login" className="text-[#6366F1] hover:underline font-bold">Sign in</Link>
        </p>

        <div className="mt-10 pt-8 border-t border-[#1F2937] flex items-center justify-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo-400/50" /> Secure Encryption</div>
           <div className="w-1 h-1 bg-slate-200 rounded-full" />
           <span className="text-slate-300">v2.1.0</span>
        </div>
      </motion.div>
    </div>
  );
}
