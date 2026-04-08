'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Sparkles, ShieldCheck, Globe2, 
  Plus, ChevronRight, Play, Users, BrainCircuit, Activity,
  Menu, X, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 overflow-x-hidden font-inter">
      
      {/* Premium Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        scrolled ? 'py-4' : 'py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`glass-panel rounded-3xl h-16 flex items-center justify-between px-6 transition-all duration-500 ${
            scrolled ? 'bg-black/60 translate-y-2' : 'bg-transparent border-transparent'
          }`}>
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:rotate-12 transition-transform duration-300">
                <Video className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black font-outfit uppercase tracking-tighter">
                Confera<span className="text-blue-500">AI</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Intelligence', 'Security', 'Enterprise'].map((item) => (
                <Link key={item} href="#" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
            
            <div className="hidden md:flex items-center gap-4">
               <Link href="/login">
                  <button className="text-sm font-bold text-slate-400 hover:text-white px-4 transition-colors">Login</button>
               </Link>
               <Link href="/login">
                  <button className="h-10 px-6 bg-white text-black hover:bg-slate-200 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-white/5 text-sm active:scale-95">
                     Start Now <ArrowUpRight className="w-4 h-4" />
                  </button>
               </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] md:hidden bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 p-10"
          >
             {['Features', 'Intelligence', 'Security', 'Enterprise', 'Login'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Login' ? '/login' : '#'} 
                  className="text-3xl font-black text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link href="/login" className="w-full">
                <button className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-xl">
                  Get Started for Free
                </button>
              </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Absolute Background with generated image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.png" 
            alt="Hero Background" 
            fill 
            className="object-cover opacity-40 scale-110 blur-sm"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/0 via-[#020617]/20 to-[#020617]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Next-Generation Enterprise Sync</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.9] tracking-tighter mb-8"
          >
            Meetings that <br />
            <span className="text-gradient">think for you.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
          >
            The global standard for AI-orchestrated video collaboration. Real-time context, neural summaries, and zero-latency performance.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login" className="w-full sm:w-auto">
              <button className="btn-primary w-full sm:w-auto text-lg h-16 group">
                Try ConferaAI Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="btn-secondary w-full sm:w-auto text-lg h-16">
              <Play className="w-5 h-5 text-blue-500 fill-blue-500" /> Book Demo
            </button>
          </motion.div>
        </div>

        {/* Dashboard Mockup - 3D Perspective */}
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 15 }}
          whileInView={{ opacity: 1, y: 40, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-20 md:mt-32 w-full max-w-6xl mx-auto px-4 perspective-1000"
        >
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] bg-black">
            <Image 
              src="/dashboard-mock.png" 
              alt="Dashboard Preview" 
              width={1400} 
              height={800} 
              className="w-full h-auto opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Trusted By / Stats */}
      <section className="section-padding bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-10 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
           {['Microsoft', 'Google', 'Meta', 'Amazon', 'OpenAI'].map((brand) => (
             <span key={brand} className="text-2xl md:text-3xl font-black font-outfit tracking-tighter cursor-default">{brand}</span>
           ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding relative">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Designed for the <span className="text-blue-500">Elite.</span></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">Professional tools that amplify your team's collective intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BrainCircuit, title: "Neural Synthesis", desc: "Automated real-time summaries and action items extracted with 99% accuracy." },
              { icon: Activity, title: "Zero Latency 4K", desc: "Proprietary edge protocol ensures crystal clear video in any bandwidth environment." },
              { icon: ShieldCheck, title: "Military Encryption", desc: "E2EE signaling with custom hardware security module support for enterprise." },
              { icon: Globe2, title: "Universal Translation", desc: "Live transcription and AI voice cloning for seamless global communication." },
              { icon: Users, title: "Adaptive Spaces", desc: "Dynamic breakout rooms that intelligently group participants based on context." },
              { icon: Plus, title: "Infinite Flow", desc: "Integrated whiteboarding and spatial collaboration tools for deep work sessions." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-3xl hover-glow group h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
                <p className="text-slate-400 font-medium leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto glass-panel p-10 md:p-20 rounded-[3rem] text-center relative overflow-hidden group">
           <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
           <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">Ready to evolve your <br className="hidden md:block"/> workspace?</h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                 <Link href="/login">
                   <button className="btn-primary px-12 h-16 text-xl">Get Started Now</button>
                 </Link>
                 <button className="btn-secondary px-12 h-16 text-xl">Contact Sales</button>
              </div>
           </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <span className="text-2xl font-black font-outfit uppercase tracking-tighter">
                Confera<span className="text-blue-500">AI</span>
              </span>
            </div>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
              Architecting the future of human connectivity through deep artificial intelligence.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li>Documentation</li>
              <li>API Status</li>
              <li>Security Whitepaper</li>
              <li>Community</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500 font-bold text-sm">
              <li>About Careers</li>
              <li>Press Kit</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <span className="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">© 2026 Confera AI. A Google + Microsoft Engineered Product Concept.</span>
           <div className="flex gap-6">
              {/* Fake social icon placeholders */}
              {[1,2,3].map(i => <div key={i} className="w-5 h-5 bg-slate-800 rounded shadow-inner" />)}
           </div>
        </div>
      </footer>
    </div>
  );
}
