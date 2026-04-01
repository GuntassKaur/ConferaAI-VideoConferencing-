'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { Video, Sparkles, Shield, Zap, Layout, Clock, Globe, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: <Sparkles className="w-5 h-5" />, title: 'AI Recaps', desc: 'Instant 5-minute summaries of every meeting segment.' },
    { icon: <Shield className="w-5 h-5" />, title: 'Enterprise Secure', desc: 'Military-grade end-to-end encryption for every session.' },
    { icon: <Layout className="w-5 h-5" />, title: 'Collaborative Space', desc: 'Real-time whiteboard and document co-editing.' },
    { icon: <Clock className="w-5 h-5" />, title: 'Time Machine', desc: 'Searchable highlights timeline with keyword indexing.' },
    { icon: <Globe className="w-5 h-5" />, title: 'Live Translate', desc: 'Real-time transcription and instant translation.' },
    { icon: <Zap className="w-5 h-5" />, title: 'Smart Low Bandwidth', desc: 'Adaptive AI video quality and noise cancellation.' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />

      <header className="fixed top-0 w-full z-50 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between glass-morphism rounded-2xl px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight outfit-font">Confera AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-secondary">
            <a href="#" className="hover:text-foreground transition-colors">Platform</a>
            <a href="#" className="hover:text-foreground transition-colors">Enterprise</a>
            <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="text-sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-morphism text-xs font-semibold text-primary mb-8 border border-primary/20"
            >
              <Sparkles className="w-3 h-3" />
              <span>NEXT GENERATION VIDEO CONFERENCING</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold outfit-font mb-8 max-w-4xl tracking-tight leading-[1.1]"
            >
              The <span className="text-gradient">Intelligent</span> Hub for Modern Collaboration.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-secondary mb-12 max-w-2xl leading-relaxed"
            >
              Experience the power of AI-driven meetings. Auto-recaps, real-time translations, and collaborative workspaces designed for the elite enterprise.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/dashboard">
                <Button className="text-lg py-7 px-10">Start your meeting</Button>
              </Link>
              <Button variant="secondary" className="text-lg py-7 px-10">Watch Demo</Button>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <GlassCard hover className="h-full border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-secondary leading-relaxed">{feature.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold">Confera AI</span>
          </div>
          <p className="text-secondary text-sm">© 2026 Confera AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
