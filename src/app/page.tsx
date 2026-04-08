'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, Activity, ShieldCheck, 
  Globe2, Users, Plus, Cpu, Zap 
} from 'lucide-react';

const features = [
  { icon: BrainCircuit, title: "Neural Synthesis", desc: "Automated real-time summaries and action items extracted with 99% accuracy." },
  { icon: Activity, title: "Zero Latency 4K", desc: "Proprietary edge protocol ensures crystal clear video in any bandwidth environment." },
  { icon: ShieldCheck, title: "Military Encryption", desc: "E2EE signaling with custom hardware security module support for enterprise." },
  { icon: Globe2, title: "Universal Translation", desc: "Live transcription and AI voice cloning for seamless global communication." },
  { icon: Users, title: "Adaptive Spaces", desc: "Dynamic breakout rooms that intelligently group participants based on context." },
  { icon: Cpu, title: "Edge Processing", desc: "Video processing happens locally ensuring maximum privacy and speed." }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <Navbar />
      
      <main className="pt-16">
        <Hero />

        {/* Features Section */}
        <section className="max-container section-spacing">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 mb-4"
            >
              <Zap size={14} className="fill-blue-600 dark:fill-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Core Intelligence</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-black font-heading tracking-tight mb-4 text-slate-900 dark:text-white">
              Designed for the <span className="text-indigo-600">Future.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Professional tools that amplify your team's collective intelligence with enterprise-grade security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-3xl border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-500">
                  <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3 font-heading tracking-tight text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-container section-spacing pb-32">
           <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 p-12 md:p-20 text-center">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-6xl font-black text-white font-heading tracking-tight mb-8">
                    Ready to evolve your <br/> workspace?
                 </h2>
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="h-14 px-10 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-slate-50 transition-all text-xl">
                       Get Started Now
                    </button>
                    <button className="h-14 px-10 rounded-2xl bg-indigo-700 text-white font-bold border border-white/20 hover:bg-indigo-800 transition-all text-xl">
                       Contact Sales
                    </button>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 dark:border-white/10 py-12">
         <div className="max-container flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-sm font-medium text-slate-500">© 2026 Confera AI. All rights reserved.</span>
            <div className="flex gap-8 text-sm font-bold text-slate-400">
               <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a>
               <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</a>
               <a href="#" className="hover:text-slate-900 dark:hover:text-white">Security</a>
            </div>
         </div>
      </footer>
    </div>
  );
}
