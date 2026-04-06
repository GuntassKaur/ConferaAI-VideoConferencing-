'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video, Sparkles, Layout, Zap, ArrowRight, ShieldCheck, Globe2, BarChart3, Star, Play, Users, MessageSquare } from 'lucide-react';
import Link from 'next/link';

const FloatingOrb = ({ color, size, top, left, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.15, scale: 1 }}
    transition={{ duration: 2, delay }}
    className="absolute pointer-events-none rounded-full blur-[120px]"
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top,
      left,
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 20, 0],
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const orbScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.5]);

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'AI Intelligence', desc: 'Real-time summaries, sentiment analysis, and automated action items powered by GPT-4o.' },
    { icon: <Globe2 className="w-6 h-6" />, title: 'Live Translation', desc: 'Break language barriers with seamless real-time translation into 50+ languages.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Low Latency Grid', desc: 'Global edge network ensuring sub-50ms latency for crystal clear audio and video.' },
    { icon: <MessageSquare className="w-6 h-6" />, title: 'Smart Chat', desc: 'Context-aware AI assistant that answers questions based on meeting history.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Speaker Analytics', desc: 'Visualize talk-time distribution and engagement metrics with beautiful charts.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'E2E Encryption', desc: 'Bank-grade security ensures your private meetings stay absolutely private.' },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime' },
    { value: '50M+', label: 'Minutes' },
    { value: '10k+', label: 'Teams' },
    { value: 'E2EE', label: 'Security' },
  ];

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 orb-background z-0" />
      <FloatingOrb color="var(--primary)" size="600px" top="-10%" left="60%" delay={0} />
      <FloatingOrb color="#06b6d4" size="500px" top="60%" left="-10%" delay={1} />
      
      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 w-full z-50 px-6 py-6"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center neon-glow">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-outfit tracking-tight">Confera AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#analytics" className="hover:text-foreground transition-colors">Intelligence</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <button className="bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-50 transition-all">
                Enter Dashboard
              </button>
            </Link>
          </div>
        </nav>
      </motion.header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-48 pb-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            {/* The Planet/Orb Hero Asset */}
            <div className="relative mb-20">
              <motion.div 
                style={{ scale: orbScale }}
                className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-gradient-to-br from-primary/40 via-indigo-500/40 to-cyan-500/40 blur-[40px] animate-orb"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="px-6 py-3 glass-card rounded-2xl flex items-center gap-3 neon-glow">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                    <span className="text-sm font-bold tracking-widest uppercase">AI-Powered Synergy</span>
                 </div>
              </div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-extrabold font-outfit mb-8 text-gradient leading-[1.1] tracking-tighter"
            >
              Collaborate in a <br /> New Dimension.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed"
            >
              Experience the world's most intelligent video conferencing platform. 
              Real-time translation, automated recaps, and deep analytics at your fingertips.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 w-full max-w-md justify-center"
            >
              <Link href="/dashboard" className="flex-1">
                <button className="w-full bg-primary py-4 rounded-[20px] font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all neon-glow">
                  Launch Meeting <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <button className="flex-1 glass-card py-4 rounded-[20px] font-bold hover:bg-white/5 transition-all">
                Join Event
              </button>
            </motion.div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-20 px-6">
           <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="glass-card p-8 rounded-[30px] text-center">
                   <h3 className="text-4xl font-bold text-gradient mb-2">{s.value}</h3>
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Dynamic Feature Cards */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-6xl font-bold font-outfit mb-6">Designed for Peak <br /> <span className="text-indigo-400">Team Performance.</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {features.map((f, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -10 }}
                    className="glass-card p-10 rounded-[40px] group transition-all"
                  >
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all">
                       {f.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                  </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-white/5 bg-black/20 backdrop-blur-xl">
           <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Video className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold font-outfit">Confera AI</span>
              </div>
              <div className="flex gap-10 text-sm font-medium text-muted-foreground">
                 <a href="#" className="hover:text-white">Security</a>
                 <a href="#" className="hover:text-white">API Docs</a>
                 <a href="#" className="hover:text-white">Contact</a>
              </div>
              <p className="text-xs text-muted-foreground">© 2026 Confera AI. All rights reserved.</p>
           </div>
        </footer>
      </main>
    </div>
  );
}
