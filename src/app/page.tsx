'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video, Sparkles, Layout, Zap, ArrowRight, ShieldCheck, Globe2, BarChart3, Star, Play, Users, MessageSquare, Mic, Camera, MonitorUp } from 'lucide-react';
import Link from 'next/link';

const FloatingOrb = ({ color, size, top, left, delay, opacity = 0.15 }: any) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity, scale: 1 }}
    transition={{ duration: 2.5, delay }}
    className="absolute pointer-events-none rounded-full blur-[100px]"
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      top,
      left,
    }}
    animate={{
      y: [0, -50, 0],
      x: [0, 30, 0],
    }}
    transition={{
      duration: 20,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleHero = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'Intelligence Engine', desc: 'Real-time GPT-4o powered summaries, sentiment tracking, and decision manifests.' },
    { icon: <Globe2 className="w-6 h-6" />, title: 'Universal Proxy', desc: 'Instant low-latency translation with 98% accuracy for global team synchronicity.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Edge Video Grid', desc: 'Proprietary WebRTC optimization layer for sub-40ms latency and 4K capability.' },
    { icon: <MessageSquare className="w-6 h-6" />, title: 'Contextual AI', desc: 'Ask complex questions about your meeting history and get precise context-aware answers.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Speaker Flow', desc: 'Deep analytics on talk distribution, engagement levels, and group interaction heatmaps.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Zero-Leak Security', desc: 'End-to-end hardware-level encryption ensuring your executive sessions stay private.' },
  ];

  return (
    <div className="relative min-h-[500vh] bg-[#050505] selection:bg-primary/40 selection:text-white overflow-x-hidden">
      {/* Background Layer: Deep Space Physics */}
      <div className="fixed inset-0 z-0 bg-[#050505] overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b_0%,transparent_50%)]" />
         <FloatingOrb color="var(--primary)" size="800px" top="-20%" left="60%" delay={0} opacity={0.2} />
         <FloatingOrb color="#0ea5e9" size="600px" top="30%" left="-10%" delay={1} opacity={0.1} />
         <FloatingOrb color="#ec4899" size="400px" top="80%" left="50%" delay={2} opacity={0.08} />
         
         {/* Animated Micro-Particles (Starfield effect) */}
         <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      
      {/* Navbar: High-End Frosted Glass */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-7xl px-8 py-4 glass-panel rounded-[28px] flex items-center justify-between border-white/[0.12] transition-all hover:bg-white/[0.05]"
      >
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 rounded-[20px] bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center neon-border group-hover:scale-110 transition-transform">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black font-outfit tracking-tighter text-glow underline-offset-8 decoration-primary">CONFERA.AI</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
           <a href="#features" className="text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-[0.2em] relative group">
              Platform
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
           </a>
           <a href="#pro" className="text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-[0.2em] relative group">
              Enterprise
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full" />
           </a>
        </div>

        <div className="flex items-center gap-4">
           <Link href="/dashboard">
              <button className="btn-premium py-2.5 px-8 rounded-[18px] text-sm bg-white text-black font-black uppercase tracking-widest border-none">
                Launch Space
              </button>
           </Link>
        </div>
      </motion.nav>

      <main className="relative z-10">
        {/* HERO: The Core Planet Experience */}
        <section className="h-screen flex flex-col items-center justify-center text-center px-6 sticky top-0 bg-transparent">
          <motion.div 
            style={{ scale: scaleHero, opacity: opacityHero }}
            className="flex flex-col items-center"
          >
            {/* The Planet/Orb Graphic Component */}
            <div className="relative mb-16 pulsing-orb flex items-center justify-center">
              <motion.div 
                className="w-48 h-48 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary via-indigo-500 to-cyan-500 shadow-[0_0_100px_rgba(139,92,246,0.6)] animate-float border-4 border-white/20"
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
                 <div className="p-1 px-4 glass-panel rounded-full border-primary/40 flex items-center gap-3 animate-pulse">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-100">Synchronized Artificial Intel</span>
                 </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-[140px] font-[900] font-outfit mb-8 tracking-tighter leading-[0.85] gradient-heading text-glow">
              REDEFINE<br />CONNECTION.
            </h1>

            <p className="text-xl md:text-2xl text-white/60 max-w-3xl mb-16 leading-relaxed font-light tracking-wide">
              Silicon Valley's premier AI-integrated video infrastructure. 
              Sub-centisecond latency with context-aware intelligence.
            </p>

            <div className="flex flex-col md:flex-row gap-6 w-full max-w-lg justify-center">
              <Link href="/dashboard" className="flex-1">
                <button className="btn-premium w-full !bg-primary !text-white !border-primary/50 shadow-[0_10px_40px_-5px_rgba(139,92,246,0.5)] h-20 text-lg uppercase tracking-[0.2em] font-black">
                  Start Meeting
                </button>
              </Link>
              <button className="btn-premium flex-1 h-20 text-lg uppercase tracking-[0.2em] font-black hover:bg-white/[0.08]">
                Join Space
              </button>
            </div>
          </motion.div>
        </section>

        {/* DEMO: Floating UI Reveal */}
        <section className="min-h-screen py-40 px-6 max-w-7xl mx-auto relative z-20">
           <motion.div 
             initial={{ opacity: 0, y: 100 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ margin: "-100px" }}
             className="glass-panel p-2 rounded-[40px] border-white/20 shadow-[0_0_80px_rgba(0,0,0,1)] relative group overflow-hidden"
           >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="aspect-video rounded-[38px] overflow-hidden bg-[#0a0a0f] relative flex items-center justify-center">
                 {/* Video UI Shell Simulation */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2670&auto=format&fit=crop')] bg-cover opacity-30 blur-sm" />
                 <div className="absolute top-8 left-8 flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/80">Rec: Live AI Transcription Active</span>
                 </div>
                 
                 {/* Floating Avatar Cards Mocks */}
                 <div className="grid grid-cols-2 gap-8 z-10 w-[70%]">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="aspect-video glass-panel rounded-[24px] border-white/10 flex items-center justify-center relative overflow-hidden group/card hover:border-primary/40 transition-all">
                          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center font-black text-xl">JD</div>
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 glass-panel rounded-xl text-[10px] font-bold text-white/90">
                             John Doe {i === 1 ? '(Host)' : ''}
                          </div>
                          {i === 3 && <div className="absolute top-4 right-4"><Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" /></div>}
                       </div>
                    ))}
                 </div>

                 {/* Control Bar Overlay */}
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 px-8 py-5 glass-panel rounded-full border-white/10 z-[30]">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all"><Mic className="w-5 h-5" /></div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all"><Camera className="w-5 h-5" /></div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all"><MonitorUp className="w-5 h-5" /></div>
                    <div className="w-px h-8 bg-white/10 mx-2" />
                    <div className="px-8 py-3.5 bg-red-500 rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(239,68,68,0.35)]">Leave</div>
                 </div>
              </div>
           </motion.div>
        </section>

        {/* FEATURES: Billion-Dollar Scale */}
        <section id="features" className="py-40 px-6 relative z-10 bg-black/40">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                <div>
                  <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-6">Capabilities</h2>
                  <h3 className="text-5xl md:text-7xl font-bold font-outfit text-glow leading-none">THE END OF<br /><span className="text-white/20">BARRIERS.</span></h3>
                </div>
                <p className="text-xl text-white/40 max-w-md font-medium leading-relaxed">Every feature engineered to eliminate friction from global collaboration.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {features.map((f, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -15, backgroundColor: 'rgba(255,255,255,0.04)' }}
                    className="glass-panel p-10 rounded-[42px] border-white/[0.05] group transition-all"
                  >
                    <div className="w-20 h-20 bg-primary/10 rounded-[28px] border border-primary/20 flex items-center justify-center text-primary mb-10 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-[0_0_40px_rgba(139,92,246,0.1) inset]">
                       {f.icon}
                    </div>
                    <h3 className="text-3xl font-black mb-6 font-outfit tracking-tighter">{f.title}</h3>
                    <p className="text-lg text-white/40 leading-relaxed font-medium">{f.desc}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* Footer Lux */}
        <footer className="py-32 px-6 border-t border-white/[0.05] bg-black/60 relative z-20">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-20">
              <div>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-black font-outfit tracking-tight">CONFERA</span>
                </div>
                <p className="text-white/40 font-medium leading-[1.8] max-w-sm mb-12">Building the world's most intelligent real-time conversational layer for high-impact teams.</p>
                <div className="flex gap-6">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10" />
                </div>
              </div>
              <div className="grid grid-cols-2 col-span-2 gap-12 lg:pl-20">
                 <div className="space-y-6">
                    <h4 className="text-sm font-black text-white/20 uppercase tracking-widest">Solutions</h4>
                    <p className="font-bold text-white/60 hover:text-primary cursor-pointer transition-colors">Executive Boardrooms</p>
                    <p className="font-bold text-white/60 hover:text-primary cursor-pointer transition-colors">AI Research Suites</p>
                    <p className="font-bold text-white/60 hover:text-primary cursor-pointer transition-colors">Developer SDK</p>
                 </div>
                 <div className="space-y-6">
                    <h4 className="text-sm font-black text-white/20 uppercase tracking-widest">Company</h4>
                    <p className="font-bold text-white/60 hover:text-primary cursor-pointer transition-colors">Ethics & Security</p>
                    <p className="font-bold text-white/60 hover:text-primary cursor-pointer transition-colors">Global Network</p>
                    <p className="font-bold text-white/60 hover:text-primary cursor-pointer transition-colors">Contact Support</p>
                 </div>
              </div>
           </div>
           <div className="max-w-7xl mx-auto pt-20 mt-20 border-t border-white/5 flex justify-between items-center text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">
              <span>© 2026 CONFERA CLOUD LTD.</span>
              <span>EST. SILICON VALLEY, CA</span>
           </div>
        </footer>
      </main>
    </div>
  );
}
