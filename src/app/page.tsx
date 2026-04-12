'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Shield, Video, Sparkles, Brain, 
  MessageSquare, Users, Zap, CheckCircle2,
  Lock, Globe, Activity
} from 'lucide-react';
import Link from 'next/link';

export default function RootPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // Optional: Auto-redirect if already logged in
    // if (user) router.push('/dashboard');
  }, [user, router]);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 selection:bg-blue-500/30 font-inter overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Video className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">Confera <span className="text-blue-500">AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/dashboard" className="btn-primary h-9 px-5 text-[10px] uppercase tracking-widest font-bold">Launch Dashboard</Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div 
              custom={0} initial="hidden" animate="visible" variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 mb-8"
            >
              <Sparkles size={14} className="text-blue-400" />
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-[0.2em]">The Future of Professional Sync</span>
            </motion.div>

            <motion.h1 
              custom={1} initial="hidden" animate="visible" variants={fadeUp}
              className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
            >
              Intelligence in <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-600 bg-clip-text text-transparent">Every Interaction.</span>
            </motion.h1>

            <motion.p 
              custom={2} initial="hidden" animate="visible" variants={fadeUp}
              className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 font-medium mb-12 leading-relaxed"
            >
              Confera AI orchestrates executive-level video sessions with integrated 
              neural recap, secure protocols, and real-time collaboration.
            </motion.p>

            <motion.div 
              custom={3} initial="hidden" animate="visible" variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="btn-primary w-full sm:w-auto px-10 py-5 text-sm uppercase tracking-widest shadow-2xl shadow-blue-600/20">
                  Join Free Session <ArrowRight size={18} />
                </button>
              </Link>
              <div className="flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Shield size={14} className="text-emerald-500" /> SOC2 Ready</span>
                <span className="flex items-center gap-1.5"><Lock size={14} className="text-emerald-500" /> AES-256</span>
                <span className="flex items-center gap-1.5"><Globe size={14} className="text-emerald-500" /> Edge Sync</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6 border-t border-slate-800/50 bg-slate-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "Neural Recap", 
                  desc: "Automated session summaries with action-item extraction powered by Confera Brain.", 
                  icon: Brain, 
                  color: "text-blue-400" 
                },
                { 
                  title: "Encryption Matrix", 
                  desc: "Deep-layer security for executive communications and sensitive corporate assets.", 
                  icon: Shield, 
                  color: "text-indigo-400" 
                },
                { 
                  title: "Adaptive HD", 
                  desc: "Global mesh transmission ensures crystal clear visuals even on variable bandwidth.", 
                  icon: Zap, 
                  color: "text-emerald-400" 
                }
              ].map((f, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="enterprise-card p-10 group hover:border-blue-500/30"
                >
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-8 border border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
                    <f.icon size={28} className={f.color + " group-hover:text-white"} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Stats */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Sessions", val: "24.8k+" },
              { label: "Global Nodes", val: "142" },
              { label: "Uptime SLA", val: "99.99%" },
              { label: "Trust Score", val: "10.0" }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-5xl font-black text-white mb-2">{s.val}</p>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-slate-800 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Video className="text-blue-500 w-5 h-5" />
            <span className="text-lg font-bold">Confera <span className="text-blue-500">AI</span></span>
          </div>
          <p className="text-xs text-slate-500 font-medium">© 2026 Confera Enterprise Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
