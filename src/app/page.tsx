'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Sparkles, ShieldCheck, Globe2, BarChart3, 
  Plus, CheckCircle2, ChevronRight, Play, Users, MessageSquare 
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0F172A] selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden font-inter transition-colors duration-500">
      
      {/* Navbar */}
      <nav className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-[100] px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black font-inter tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">
            Confera<span className="text-indigo-600">AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
           <Link href="/login">
              <button className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest px-4">Login</button>
           </Link>
           <Link href="/login">
              <button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 text-sm">
                 Get Started <ChevronRight className="w-4 h-4" />
              </button>
           </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-12 py-32 md:py-48 relative overflow-hidden">
        {/* Ambient Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50 dark:bg-indigo-500/5 blur-[120px] rounded-[100%] -z-10" />

        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm">
           <Sparkles className="w-4 h-4" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Meeting Intelligence</span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight max-w-5xl">
          Everything your meetings <br />were <span className="text-indigo-600">missing.</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          The enterprise video platform that synthesizes your conversations into actionable intelligence. 
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
           <Link href="/login">
              <button className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95">
                 Get Started for Free <Plus className="w-5 h-5" />
              </button>
           </Link>
           <Link href="/login">
             <button className="h-16 px-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-3">
                <Play className="w-5 h-5 fill-indigo-600 text-indigo-600" /> Book a Demo
             </button>
           </Link>
        </div>

        <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto opacity-70">
           {[
             { icon: Sparkles, text: "AI Decision manifests" },
             { icon: ShieldCheck, text: "SOC2 Security" },
             { icon: Globe2, text: "Global Edge Network" }
           ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-4 group">
                 <item.icon className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-black uppercase tracking-[0.15em] text-slate-400">{item.text}</span>
              </div>
           ))}
        </div>
      </main>

      <footer className="py-24 px-8 border-t border-slate-200 dark:border-slate-800 flex justify-center text-xs font-bold text-slate-400 uppercase tracking-widest">
         © 2026 Confera AI. All rights reserved.
      </footer>
    </div>
  );
}
