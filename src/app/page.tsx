'use client';
import { motion } from 'framer-motion';
import { Video, ChevronRight, Check, Shield, Zap, Layout, Users, Brain, MousePointer2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-indigo-100 overflow-x-hidden font-sans">
      {/* Soft Background Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-50 blur-[120px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-50 blur-[120px] rounded-full opacity-40" />
      </div>

      {/* Clean Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Video className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Confera <span className="text-indigo-600">AI</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {['Meetings', 'Intelligence', 'Security'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 transition-colors">Login</Link>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link href="/signup" className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                Start Free
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Zap size={14} className="fill-indigo-600" />
          <span>New in 2026: AI-Enhanced Video Mesh</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-slate-900 max-w-4xl leading-[1.1]"
        >
          Better Meetings. <br />
          <span className="text-indigo-600">Smarter Decisions.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl text-lg text-slate-500 font-medium leading-relaxed mb-10"
        >
          Connect with your team in high-definition. Confera AI captures notes, summarizes tasks, and keeps your meetings focused so you can do your best work.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <motion.div whileTap={{ scale: 0.96 }}>
            <Link 
              href="/dashboard" 
              className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base rounded-xl transition-all shadow-xl shadow-indigo-100 flex items-center gap-3"
            >
              <span>Start a Meeting</span>
              <ChevronRight size={18} />
            </Link>
          </motion.div>
          <Link href="/signup" className="px-8 py-4 bg-white border border-slate-200 text-slate-600 font-bold text-base rounded-xl hover:bg-slate-50 transition-all">
             Try for Free
          </Link>
        </motion.div>

        {/* Professional UI Preview */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-5xl relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/50 overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl z-20 cursor-pointer hover:scale-110 transition-transform">
             <Video size={32} fill="currentColor" />
          </div>
          <img 
            src="/video_conference_hero.png" 
            alt="Video Conferencing UI" 
            className="w-full h-auto rounded-2xl grayscale-[0.2] opacity-90"
          />
          <div className="absolute bottom-8 left-8 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             LIVE: PRODUCT SYNC (4 PARTICIPANTS)
          </div>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section id="meetings" className="py-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Host up to 100 participants with crystal clear 4K video and zero lag, regardless of location.</p>
          </div>

          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Meeting Recaps</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Let AI take the notes. Get a full summary and action items list sent to your inbox after every call.</p>
          </div>

          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Your data is yours. Every session is encrypted end-to-end with the highest security standards.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-8 text-center bg-indigo-50/30 border-y border-slate-100">
        <h2 className="text-sm font-bold text-indigo-600/60 uppercase tracking-[0.3em] mb-12">Trusted by 2000+ teams in 2026</h2>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-40">
           <Layout size={32} />
           <MousePointer2 size={32} />
           <Video size={32} />
           <Layout size={32} />
           <Users size={32} />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <Video className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">Confera AI</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">© 2026 Confera AI. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-400 hover:text-slate-900 text-sm font-semibold transition-colors">Privacy</Link>
            <Link href="#" className="text-slate-400 hover:text-slate-900 text-sm font-semibold transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
