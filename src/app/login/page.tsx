'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, User } from 'lucide-react';

export default function LoginPage() {
  const [name, setName] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    localStorage.setItem('user', JSON.stringify({ name, id: Math.random().toString(36).substr(2, 9) }));
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-600/30">
            <LogIn className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400 text-center">Enter your details to access the neural link</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Your Full Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="input-field w-full pl-12"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            Establish Link
          </button>
        </form>
      </motion.div>
    </div>
  );
}
