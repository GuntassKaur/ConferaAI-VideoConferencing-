'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Sparkles, ShieldCheck, Globe2, BarChart3, 
  Plus, CheckCircle2, ChevronRight, Zap, Play, Users, MessageSquare 
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'Intelligence Engine', desc: 'Real-time summaries and action items extracted from every conversation.' },
    { icon: <Globe2 className="w-6 h-6" />, title: 'Global Connectivity', desc: 'Enterprise-grade WebRTC mesh network with sub-50ms global latency.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Military-Grade Security', desc: 'SOC2 Type II compliant meetings with end-to-end asymmetric encryption.' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0F172A] selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden font-inter transition-colors duration-500">
      
      {/* Premium Navbar */}
      <nav className="h-20 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-[100] px-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black font-inter tracking-tight text-slate-900 dark:text-white">
            Confera<span className="text-indigo-600">AI</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Platform</a>
          <a href="#solutions" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Solutions</a>
          <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">Enterprise</a>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/dashboard">
              <button className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/20 text-sm">
                 Dashboard <ChevronRight className="w-4 h-4" />
              </button>
           </Link>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-40 px-8 flex flex-col items-center justify-center text-center overflow-hidden">
           {/* Ambient Gradients */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-50 dark:bg-indigo-500/5 blur-[120px] rounded-[100%] -z-10" />
           
           <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl space-y-10"
           >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 shadow-sm">
                 <Sparkles className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Meeting Intelligence</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
                Quality meetings,<br />made <span className="text-indigo-600">intelligent.</span>
              </h1>

              <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
                The enterprise video platform that works as hard as you do. Powered by context-aware AI for higher team velocity.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                 <Link href="/dashboard">
                    <button className="h-16 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-3 active:scale-95">
                       Get Started for Free <Plus className="w-5 h-5" />
                    </button>
                 </Link>
                 <button className="h-16 px-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center gap-3">
                    <Play className="w-5 h-5 fill-indigo-600 text-indigo-600" /> Book a Demo
                 </button>
              </div>

              <div className="pt-20 flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                 <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 w-full mb-4">Trusted by innovative teams</h4>
                 {['Microsoft', 'Stripe', 'Airbnb', 'Vercel', 'Linear'].map(brand => (
                    <span key={brand} className="text-2xl font-black font-inter tracking-tighter text-slate-400">{brand}</span>
                 ))}
              </div>
           </motion.div>
        </section>

        {/* Features Preview Section */}
        <section id="features" className="py-32 px-8 bg-slate-50 dark:bg-slate-900/40 relative">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {features.map((f, i) => (
                    <div key={i} className="p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all group">
                       <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                          {f.icon}
                       </div>
                       <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{f.title}</h3>
                       <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 px-8">
           <div className="max-w-6xl mx-auto p-12 md:p-24 bg-indigo-600 rounded-[4rem] text-white text-center relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(99,102,241,0.5)]">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] translate-x-1/4 -translate-y-1/4" />
              <div className="relative z-10 space-y-8">
                 <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Ready to transform your meetings?</h2>
                 <p className="text-xl text-indigo-100 max-w-2xl mx-auto font-medium">Join 50,000+ teams using Confera AI to make every conversation actionable and intelligent.</p>
                 <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/dashboard">
                       <button className="h-16 px-12 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95">
                          Get Started for Free
                       </button>
                    </Link>
                    <button className="h-16 px-12 bg-indigo-700/50 text-white border border-indigo-400/30 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all">
                       Contact Sales
                    </button>
                 </div>
                 <div className="pt-12 flex items-center justify-center gap-8 text-sm font-bold text-indigo-200/60 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 14-Day Free Trial</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> No Credit Card Required</span>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="py-24 px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1120]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-2.5">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
               </div>
               <span className="text-lg font-black tracking-tight dark:text-white">ConferaAI</span>
            </div>
            <div className="flex items-center gap-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
               <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
               <a href="#" className="hover:text-indigo-600 transition-colors">Cookies</a>
            </div>
            <div className="text-sm font-bold text-slate-400">
               © 2026 Confera AI. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}
