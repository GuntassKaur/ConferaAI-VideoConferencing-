'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  Plus, Users, Sparkles, 
  Brain, Shield, Zap 
} from 'lucide-react';
import Link from 'next/link';

const features = [
  { 
    icon: Brain, 
    title: "AI Synthesis", 
    desc: "Real-time transcription and automated meeting minutes with high accuracy." 
  },
  { 
    icon: Shield, 
    title: "Secure by Design", 
    desc: "Enterprise-grade end-to-end encryption for all your conversations." 
  },
  { 
    icon: Zap, 
    title: "Zero Latency", 
    desc: "Crystal clear 4K video and audio processing at the edge." 
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-container text-center py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">The Future of Meetings</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900 dark:text-white"
          >
            AI-Powered <br />
            <span className="text-indigo-600">Smart Meetings</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-12"
          >
            Experience the next generation of video conferencing. Confera AI transforms your meetings into actionable intelligence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="btn-primary w-full sm:w-auto text-lg h-14 px-10">
                Start Meeting <Plus className="w-5 h-5" />
              </button>
            </Link>
            <button className="btn-secondary w-full sm:w-auto text-lg h-14 px-10">
              Join Meeting <Users className="w-5 h-5" />
            </button>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section className="max-container py-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:shadow-xl transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-all">
                <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-all" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-container flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-slate-500">
          <span>© 2026 Confera AI. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
