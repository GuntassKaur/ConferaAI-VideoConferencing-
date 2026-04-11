'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  Plus, Users, Sparkles, 
  Brain, Shield, Zap 
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [meetingId, setMeetingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMeeting = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/create-meeting', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${data.meetingId}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/join-meeting', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId }) 
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${meetingId}`);
      } else {
        alert('Meeting not found or invalid.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="max-container text-center py-12 lg:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">The Future of Meetings</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground"
          >
            Smarter Meetings <br />
            <span className="text-primary">Powered by AI</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10"
          >
            Experience the next generation of video conferencing. Confera AI transforms your meetings into actionable intelligence.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button onClick={handleCreateMeeting} disabled={isLoading} className="btn-primary w-full sm:w-auto text-lg h-14 px-10">
              Start Meeting <Plus className="w-5 h-5" />
            </button>
            <form onSubmit={handleJoinMeeting} className="flex gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Meeting ID"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="h-14 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-40"
              />
              <button type="submit" disabled={isLoading} className="btn-secondary w-full sm:w-auto text-lg h-14 px-6 md:px-10">
                Join <Users className="w-5 h-5 ml-2" />
              </button>
            </form>
          </motion.div>
        </section>

        {/* Feature Cards */}
        <section className="max-container py-12 lg:py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-xl border border-border bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-all duration-300 shadow-sm">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-white transition-all duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </section>
      </main>

      <footer className="border-t border-border py-12 bg-slate-50 dark:bg-slate-900/30">
        <div className="max-container flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-muted">
          <span>© 2026 Confera AI. All rights reserved.</span>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
