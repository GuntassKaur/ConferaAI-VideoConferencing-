'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/productStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Video, ShieldCheck, Zap, ArrowRight, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Subtle Background Blobs */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-50/50 rounded-full blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-50/50 rounded-full blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: errorMsg ? [0, -5, 5, -3, 3, 0] : 0
        }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-xl relative z-10"
      >
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Video size={20} />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">Confera</span>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
          <p className="text-slate-500 text-sm">Enter your credentials to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${errorMsg === 'Invalid email' ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'} rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all font-medium`}
                />
             </div>
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
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${errorMsg === 'Wrong password' ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'} rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all font-medium`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
             </div>
             {errorMsg === 'Wrong password' && <p className="text-red-500 text-sm mt-1">Wrong password</p>}
             <div className="flex justify-end mt-2">
                <Link href="/forgot-password" size="sm" className="text-xs font-bold text-indigo-600 hover:underline px-1">
                  Forgot password?
                </Link>
             </div>
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
              <>
                {isLoading ? 'Logging in...' : 'Sign in'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 font-medium">
          Don't have an account? <Link href="/signup" className="text-indigo-600 hover:underline font-bold">Sign up</Link>
        </p>

        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-indigo-400/50" /> Secure</div>
           <div className="flex items-center gap-1.5"><Zap size={14} className="text-amber-400/50" /> Fast</div>
           <span className="text-slate-300">v2.1.0</span>
        </div>
      </motion.div>
    </div>
  );
}
