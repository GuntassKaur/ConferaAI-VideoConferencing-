'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/hero-bg.png" 
          alt="Hero Background" 
          fill 
          className="object-cover opacity-50 dark:opacity-30 blur-sm scale-110"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      </div>

      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-500/10 via-background to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-[-10%] w-[40%] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-[-10%] w-[40%] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />

      <div className="max-container relative z-10 text-center">
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">v2.0 powered by Anthropic & OpenAI</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05]"
        >
          Smarter Meetings <br />
          <span className="text-indigo-600 dark:text-indigo-400">Powered by AI</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium"
        >
          Confera AI transforms your conversations into structured data. Experience crystal clear video with real-time neural transcription and summaries.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="btn-primary w-full sm:w-auto text-lg h-14 px-10 group">
              Start Meeting <Plus className="w-5 h-5 ml-2 group-hover:rotate-90 transition-transform" />
            </button>
          </Link>
          <button className="btn-secondary w-full sm:w-auto text-lg h-14 px-10">
            Join Meeting <Users className="w-5 h-5 ml-2" />
          </button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 relative px-4"
        >
          <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
             <div className="h-10 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10 flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
             </div>
             <div className="bg-white dark:bg-slate-950">
                <Image 
                  src="/dashboard-mock.png" 
                  alt="Platform Preview" 
                  width={1200} 
                  height={800} 
                  className="w-full h-auto"
                />
             </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-2xl glass-premium text-sm font-bold shadow-2xl">
             <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
             12.4k Teams Active Now
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
