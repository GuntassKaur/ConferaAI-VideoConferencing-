'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Check local storage directly for faster initial redirect feedback
    const savedUser = localStorage.getItem('confera-auth');
    if (user || savedUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 animate-pulse">Initializing Neural Link</p>
      </div>
    </div>
  );
}
