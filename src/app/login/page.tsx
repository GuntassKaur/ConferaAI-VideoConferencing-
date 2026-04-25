'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Mail, Lock, Eye, EyeOff, Loader2, Video } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-6 text-white font-inter">
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: error ? [0, -10, 10, -6, 6, 0] : 0
        }}
        transition={{ duration: error ? 0.4 : 0.3 }}
        className="w-full max-w-sm bg-[#0f0f13] border border-[#1e1e27] rounded-2xl p-8 flex flex-col items-center"
      >
        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20">
          <Video className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-sm text-slate-400 mb-8 text-center">Sign in to continue to Confera AI</p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full bg-[#0f0f13] border border-[#1e1e27] rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type={showPassword ? 'text' : 'password'} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#0f0f13] border border-[#1e1e27] rounded-xl pl-11 pr-12 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <motion.button 
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#6366f1] hover:bg-indigo-500 text-white font-medium text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center mt-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign in'}
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Don't have an account? <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
