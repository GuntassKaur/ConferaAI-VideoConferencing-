'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Video, Sparkles, Layout, Clock, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: <Sparkles className="w-6 h-6" />, title: 'Smart AI Recaps', desc: 'Get automatic summaries, action items, and key points precisely five minutes after every meeting concludes.' },
    { icon: <Layout className="w-6 h-6" />, title: 'Pristine Interface', desc: 'Zero clutter. Crafted for absolute focus, allowing your team to connect deeply without UI distractions.' },
    { icon: <Clock className="w-6 h-6" />, title: 'Time Machine', desc: 'Stop taking manual notes. Let the built-in ChatGPT assistant handle knowledge retention perfectly.' },
  ];

  return (
    <div className="relative min-h-screen bg-[#fafafc] text-slate-900 font-sans hero-gradient selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      
      {/* Background Decorators for WOW effect */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[150px] -z-10 translate-x-1/3 -translate-y-1/3 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-100 rounded-full blur-[150px] -z-10 -translate-x-1/3 translate-y-1/3 opacity-50" />

      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 px-6 py-6"
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 rounded-2xl border-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center premium-shadow">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight font-outfit text-slate-900">Confera AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              Log in
            </Link>
            <Link href="/dashboard">
              <button className="btn-primary py-2.5 px-6 text-sm rounded-xl font-bold tracking-wide">
                Start Free
              </button>
            </Link>
          </div>
        </nav>
      </motion.header>

      <main className="relative z-10 pt-48 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-32 relative">
             <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md text-xs font-bold text-indigo-600 mb-10 border border-white shadow-[0_4px_20px_rgba(79,70,229,0.1)] tracking-widest uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Next Generation of Conferencing</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-6xl md:text-[80px] font-extrabold font-outfit mb-8 max-w-4xl tracking-tight leading-[1.05] text-slate-900"
            >
              Smart <span className="text-gradient">AI Meetings</span> <br /> designed for clarity.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl text-slate-500/90 mb-12 max-w-2xl leading-relaxed font-medium"
            >
              A stunning, zero-clutter conversational experience. Auto-generating insights, summaries, and action items effortlessly while you focus on the connection.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="btn-primary w-full text-base py-4 px-10 rounded-[20px] flex items-center justify-center gap-3 group font-bold tracking-wide">
                  Start an Instant Meeting
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="h-full glass-card p-10 group hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-16 h-16 rounded-[22px] bg-indigo-50 flex items-center justify-center text-indigo-600 mb-8 border border-white shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4 font-outfit text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
