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
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center font-inter">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">Initializing Secure Session</p>
      </div>
    </div>
  );
}
