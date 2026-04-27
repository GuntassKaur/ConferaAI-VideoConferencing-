'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, ShieldCheck, MailCheck, ArrowRight } from 'lucide-react';
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
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
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
          x: error ? [0, -5, 5, -3, 3, 0] : 0
        }}
        className="w-full max-w-md bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-xl relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 mb-6">
            {message ? <MailCheck size={24} /> : <ShieldCheck size={24} />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Recover Access</h1>
          <p className="text-slate-500 text-sm text-center">Enter your email to receive a secure recovery link.</p>
        </div>

        {message ? (
          <div className="space-y-8 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
               <p className="text-sm font-semibold text-emerald-600 leading-snug">{message}</p>
            </div>
            <Link 
              href="/login" 
              className="w-full py-4 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Return to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Registered Email</label>
               <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'} rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all font-medium`}
                  />
               </div>
               {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <>
                  Send Recovery Link
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <Link href="/login" className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
               <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
