'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  Plus, Users, Sparkles, 
  Brain, Shield, Zap, ArrowRight, Video
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const features = [
  { 
    icon: Brain, 
    title: "AI Synthesis", 
    desc: "Real-time transcription and automated meeting minutes with neural processing." 
  },
  { 
    icon: Shield, 
    title: "Quantum Secure", 
    desc: "End-to-end encryption with advanced security layers for enterprise data." 
  },
  { 
    icon: Zap, 
    title: "Ultra Performance", 
    desc: "Experience 4K clarity with zero lag across any device globally." 
  }
];

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [meetingId, setMeetingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateMeeting = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/create-meeting', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, title: `${user.name}'s Meeting` })
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${data.meeting.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingId) return;
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/join-meeting', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId, userId: user.id }) 
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/meeting/${meetingId}`);
      } else {
        setError(data.error || 'Invalid Meeting ID');
      }
    } catch (err) {
      setError('Connection error. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-primary/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none overflow-hidden -z-10">
           <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
           <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
        </div>

        {/* Hero Content */}
        <section className="max-container relative">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 px-4 py-1.5 rounded-full glass border border-white/10 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Intelligent Workspaces</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] text-gradient"
            >
              The Next Era of <br />
              <span className="text-primary italic">Meetings</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12"
            >
              Elevate your communication with real-time AI insights, ultra-HD video, and seamless enterprise orchestration.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-6 w-full max-w-xl"
            >
              <button 
                onClick={handleCreateMeeting} 
                disabled={isLoading} 
                className="btn-primary w-full sm:flex-1 h-14 text-base"
              >
                Start New Session <Video className="w-5 h-5" />
              </button>

              <div className="w-full sm:flex-[1.2]">
                <form onSubmit={handleJoinMeeting} className="relative group">
                  <input
                    type="text"
                    placeholder="Enter Invite ID"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    className="w-full h-14 pl-5 pr-32 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all duration-300"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || !meetingId} 
                    className="absolute right-2 top-2 h-10 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all duration-200 disabled:opacity-0"
                  >
                    Join
                  </button>
                </form>
                {error && <p className="text-red-400 text-xs font-bold mt-2 text-left ml-2">{error}</p>}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="max-container mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-10 rounded-[2rem] glass-card group hover:border-primary/50 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-500">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {feature.desc}
              </p>
              <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300" />
            </motion.div>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black/20 backdrop-blur-xl">
        <div className="max-container flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                 <Video className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold tracking-tight">Confera AI</span>
           </div>
           <p className="text-slate-500 text-xs font-medium italic">Empowering the next billion workspace connections.</p>
           <div className="flex gap-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Stack</a>
              <a href="#" className="hover:text-primary transition-colors">GitHub</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
