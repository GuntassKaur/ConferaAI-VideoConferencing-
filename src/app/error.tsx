'use client';
import { useEffect } from 'react';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center font-inter text-center px-6">
      <h1 className="text-[100px] leading-none font-black text-[#1e1e27] mb-4">500</h1>
      <h2 className="text-xl font-medium text-white mb-2">Something went wrong</h2>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">
        An unexpected error occurred. Please try again or contact support.
      </p>
      <button 
        onClick={() => reset()}
        className="bg-[#6366f1] hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] active:scale-95"
      >
        Try again
      </button>
    </div>
  );
}
