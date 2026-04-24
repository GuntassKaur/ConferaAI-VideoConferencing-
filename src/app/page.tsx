'use client';
import { motion } from 'framer-motion';
import { Video, ChevronRight, Shield, Brain, Zap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-indigo-500/30 overflow-hidden font-inter">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1e1e1e_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 h-20 flex items-center justify-between px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Video className="text-white w-4 h-4" />
          </div>
          <span className="text-xl font-black tracking-tighter">Confera <span className="text-indigo-500">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all active:scale-95 shadow-lg">Start Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-40 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <Zap size={10} className="fill-indigo-400" />
          <span>Next-Generation Neural Mesh Active</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]"
        >
          Meetings Reimagined. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-500 bg-[length:200%_auto] animate-pulse">Intelligence Built-in.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-12"
        >
          Confera AI utilizes decentralized WebRTC and neural processing to deliver 4K crystal-clear sessions with real-time AI insights, recaps, and tactical support.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/signup" 
            className="group px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95"
          >
            <span>Initialize Session</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-10 py-5 bg-[#111113] border border-[#27272a] hover:border-slate-700 text-slate-300 font-black text-[12px] uppercase tracking-[0.2em] rounded-2xl transition-all hover:bg-[#18181b] active:scale-95 shadow-xl">
             View Protocol
          </button>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
           {[
             { icon: Shield, title: 'Neural Encryption', desc: 'End-to-end decentralized security protocol for every byte.' },
             { icon: Brain, title: 'Tactical AI', desc: 'Real-time session insights powered by Gemini 1.5 Pro.' },
             { icon: Globe, title: 'Global Mesh', desc: 'Low-latency connectivity via decentralized edge nodes.' }
           ].map((feature, i) => (
             <div key={i} className="p-8 bg-[#111113] border border-[#27272a] rounded-[32px] text-left hover:border-indigo-500/50 transition-all group shadow-xl">
                <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
                   <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
             </div>
           ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-20 border-t border-[#27272a] bg-[#09090b]/50 backdrop-blur-xl">
         <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Video className="text-white w-3 h-3" />
              </div>
              <span className="text-lg font-black tracking-tighter">Confera <span className="text-indigo-500 text-sm">AI</span></span>
            </div>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">© 2024 Confera Neural Network • Secure Protocol v4.1</p>
         </div>
      </footer>
    </div>
  );
}
