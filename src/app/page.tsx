'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Video, Sparkles, ShieldCheck, Globe2, 
  Plus, ChevronRight, Play, Users, BrainCircuit, Activity
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-inter">
      
      {/* Background Animated Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen opacity-50"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen opacity-30"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen opacity-40 animate-blob"
        />
      </div>

      {/* Floating Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 inset-x-0 mx-auto w-[90%] max-w-5xl h-16 enterprise-glass rounded-2xl z-[100] px-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black font-outfit tracking-tight text-white uppercase group-hover:text-indigo-200 transition-colors duration-300">
            Confera<span className="text-indigo-500">AI</span>
          </span>
        </div>
        
        <div className="flex items-center gap-6">
           <Link href="/login">
              <button className="text-sm font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-widest px-4">Login</button>
           </Link>
           <Link href="/login">
              <button className="h-10 px-5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-white/10 text-sm hover:scale-105">
                 Get Started <ChevronRight className="w-4 h-4" />
              </button>
           </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 pt-48 pb-32 relative z-10 w-full max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full enterprise-glass border border-indigo-500/30 text-indigo-300 shadow-xl shadow-indigo-500/10 mb-8"
        >
           <Sparkles className="w-4 h-4 text-indigo-400" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Gen Meeting Intelligence</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[1.05] tracking-tight max-w-[1200px]"
        >
          Meetings that <br className="hidden md:block"/>
          <span className="premium-gradient-text inline-block">think for you.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium mt-8 mb-12"
        >
          Experience zero-latency video conferencing with built-in real-time AI context, automated insights, and absolute enterprise security.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full"
        >
           <Link href="/login" className="w-full sm:w-auto">
              <button className="group relative w-full sm:w-auto h-16 px-10 premium-gradient-bg text-white rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.8)] flex items-center justify-center gap-3 active:scale-95 overflow-hidden">
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                 <span className="relative z-10 flex items-center gap-2">Start for Free <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /></span>
              </button>
           </Link>
           <Link href="/login" className="w-full sm:w-auto">
             <button className="w-full sm:w-auto h-16 px-10 enterprise-glass text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 hover:scale-105">
                <Play className="w-5 h-5 text-indigo-400 fill-indigo-400" /> See it in action
             </button>
           </Link>
        </motion.div>

        {/* Floating Dashboard Preview Mockup */}
        <motion.div 
          style={{ y: y1 }}
          className="relative mt-32 w-full max-w-5xl rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-2xl p-4 shadow-2xl shadow-indigo-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent pointer-events-none rounded-3xl" />
          <div className="w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden border border-white/5 relative">
            {/* Fake Dashboard UI */}
            <div className="absolute top-0 w-full h-12 bg-slate-900/80 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
            </div>
            <div className="absolute inset-x-0 top-12 bottom-0 bg-slate-950 flex">
               <div className="w-64 border-r border-white/5 p-4 hidden md:block">
                  <div className="h-8 w-32 bg-white/5 rounded-lg mb-8" />
                  <div className="space-y-4">
                     {[...Array(4)].map((_, i) => (
                       <div key={i} className="h-10 w-full bg-white/5 rounded-xl" />
                     ))}
                  </div>
               </div>
               <div className="flex-1 p-6 flex flex-col gap-6">
                  <div className="flex gap-4">
                     <div className="flex-1 h-64 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 relative overflow-hidden">
                        <div className="absolute bottom-4 left-4 flex gap-2">
                           <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center"><Video className="w-4 h-4 text-white" /></div>
                        </div>
                     </div>
                     <div className="flex-1 h-64 bg-purple-500/10 rounded-2xl border border-purple-500/20 relative overflow-hidden">
                     </div>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-2xl border border-white/5 p-4">
                     <div className="h-6 w-48 bg-white/10 rounded-md mb-4" />
                     <div className="space-y-2">
                        <div className="h-4 w-full bg-white/5 rounded" />
                        <div className="h-4 w-[80%] bg-white/5 rounded" />
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
           {[
             { icon: BrainCircuit, title: "Neural Synthesis", desc: "Automated real-time summaries and action items extracted with 99% accuracy." },
             { icon: Activity, title: "Zero Latency", desc: "Global edge network ensures crisp 4k video anywhere in the world without lag." },
             { icon: ShieldCheck, title: "Enterprise Grade", desc: "End-to-end encryption, SOC2 certified, and custom data retention policies." }
           ].map((feature, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 40 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 0.6, delay: i * 0.2 }}
               className="glass-card p-8 rounded-3xl hover:-translate-y-2 transition-all duration-300 group"
             >
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                   <feature.icon className="w-7 h-7 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
             </motion.div>
           ))}
        </div>
        
      </main>

      <footer className="py-12 border-t border-white/10 flex flex-col items-center justify-center gap-6 z-10 bg-slate-950/50 backdrop-blur-lg">
         <div className="flex items-center gap-2">
           <Video className="w-5 h-5 text-indigo-500" />
           <span className="text-xl font-black font-outfit tracking-tight text-white uppercase">
             Confera<span className="text-indigo-500">AI</span>
           </span>
         </div>
         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
           © 2026 Confera AI. Built for the future.
         </span>
      </footer>
    </div>
  );
}
