"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center font-sans">
        <div className="w-16 h-16 bg-gradient-to-br from-dineva-blue to-dineva-violet rounded-2xl flex items-center justify-center text-white mb-6 animate-pulse shadow-2xl shadow-dineva-blue/20">
          <Sparkles size={32} />
        </div>
        <Loader2 className="w-8 h-8 animate-spin text-dineva-blue opacity-50 mb-4" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">DinevaAI Neural Core Booting...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
