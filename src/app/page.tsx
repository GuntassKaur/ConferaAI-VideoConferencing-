'use client';

import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Video, Sparkles, Layout, Clock, ArrowRight, ShieldCheck, Zap, Users, Star, BarChart3, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'Smart AI Recaps', desc: 'Get automatic summaries, action items, and key points precisely five minutes after every meeting concludes.' },
    { icon: <Layout className="w-6 h-6" />, title: 'Pristine Interface', desc: 'Zero clutter. Crafted for absolute focus, allowing your team to connect deeply without UI distractions.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Real-time Translation', desc: 'Break global barriers with instantaneous speech-to-text translation across 50+ languages.' },
    { icon: <BarChart3 className="w-6 h-6" />, title: 'Speaker Analytics', desc: 'Measure engagement and talk-time distribution perfectly with beautiful post-meeting charts.' },
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Enterprise Security', desc: 'Bank-grade E2EE encryption ensures your corporate conversations never leak outside your space.' },
    { icon: <Globe2 className="w-6 h-6" />, title: 'Global Edge Network', desc: 'Sub-50ms latency worldwide via our highly optimized WebRTC edge relay infrastructure.' },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '50M+', label: 'Meeting Minutes' },
    { value: '<50ms', label: 'Global Latency' },
    { value: '10k+', label: 'Teams Worldwide' },
  ];

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans hero-gradient selection:bg-indigo-500/30 overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--bg-accent-1)] rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-70" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--bg-accent-2)] rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3 opacity-70" />

      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 py-6"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center premium-shadow">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight font-outfit text-[var(--foreground)]">Confera AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-[var(--muted-fg)] hover:text-[var(--primary)] transition-colors hidden sm:block">
              Log in
            </Link>
            <ThemeToggle />
            <Link href="/dashboard">
              <button className="btn-primary py-2.5 px-6 text-sm font-bold tracking-wide">
                Start Free
              </button>
            </Link>
          </div>
        </nav>
      </motion.header>

      <main className="relative z-10 pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-32 relative">
             <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card text-xs font-bold text-[var(--primary)] mb-10 tracking-widest uppercase relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20" />
              <Sparkles className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">The Next Generation of Conferencing</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[80px] font-extrabold font-outfit mb-8 max-w-5xl tracking-tight leading-[1.05] text-[var(--foreground)]"
            >
              Smart <span className="text-gradient">AI Meetings</span> <br /> designed for clarity.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl text-[var(--muted-fg)] mb-12 max-w-2xl leading-relaxed font-medium"
            >
              A stunning, zero-clutter conversational experience. Auto-generating insights, summaries, transcriptions, and tracking speaker analytics effortlessly while you focus on the connection.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="btn-primary w-full text-base py-4 px-8 justify-center gap-3 font-bold tracking-wide">
                  Start an Instant Meeting
                  <ArrowRight className="w-4 h-4 transition-transform" />
                </button>
              </Link>
              <button className="btn-secondary w-full sm:w-auto text-base py-4 px-8 justify-center font-bold tracking-wide">
                Join Meeting
              </button>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div 
             initial={{ opacity: 0, y: 40 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="glass-card mb-32 p-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[var(--border)] border-[var(--border)] text-center"
          >
             {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                   <h4 className="text-4xl md:text-5xl font-extrabold font-outfit text-gradient mb-2">{stat.value}</h4>
                   <span className="text-sm font-semibold text-[var(--muted-fg)] uppercase tracking-wider">{stat.label}</span>
                </div>
             ))}
          </motion.div>

          {/* Feature Grid */}
          <div className="mb-32">
            <h2 className="text-3xl md:text-5xl font-extrabold font-outfit text-center mb-16 text-[var(--foreground)]">Enterprise Intelligence, <br/>Beautifully Delivered.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="h-full glass-card p-10 hover:-translate-y-2 transition-transform duration-500 border border-[var(--border)] group">
                    <div className="w-16 h-16 rounded-[22px] bg-[var(--background)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] mb-8 premium-shadow group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-extrabold mb-4 font-outfit text-[var(--foreground)]">{feature.title}</h3>
                    <p className="text-[var(--muted-fg)] leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        {/* Testimonial Removed for Launch */}
        </div>
      </main>
    </div>
  );
}
