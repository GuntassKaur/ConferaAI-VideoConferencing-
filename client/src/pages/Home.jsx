import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Video, Plus, Key, ArrowRight, Zap, Shield, Cpu } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId.trim()) navigate(`/room/${roomId}`);
  };

  const createMeeting = () => {
    const id = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${id}`);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass h-20 px-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center rotate-12 shadow-lg shadow-accent/40">
            <Video className="text-white -rotate-12" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white/90">Confera <span className="text-accent text-glow">AI</span></span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#" className="text-white/60 hover:text-white transition-colors font-medium">Features</a>
          <a href="#" className="text-white/60 hover:text-white transition-colors font-medium">Enterprise</a>
          <button onClick={createMeeting} className="btn-primary py-2 px-6">Launch App</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/20 mb-8">
            <Zap size={16} className="text-accent" />
            <span className="text-xs font-semibold tracking-widest uppercase text-accent-light">Next-Gen Video Interaction</span>
          </div>
          <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] mb-8 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
            Meetings <br />
            Redefined by <span className="text-accent">AI</span>
          </h1>
          <p className="text-xl text-white/60 leading-relaxed max-w-lg mb-12">
            Professional-grade video conferencing with real-time AI transcription, 
            automated summaries, and smart insights. High performance, beautifully designed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={createMeeting} className="btn-primary group flex items-center gap-2 px-8 py-4 text-lg">
              <Plus size={20} />
              Start New Meeting
              <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
            </button>
            <form onSubmit={handleJoin} className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-accent transition-colors">
                <Key size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Enter Room Code" 
                className="input-field pl-12 pr-32 py-4 text-lg min-w-[320px]"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 glass border-white/20 hover:bg-white/10 rounded-lg text-sm font-bold transition-all">
                Join
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:block hidden"
        >
          <div className="glass-card p-0 overflow-hidden border-accent/30 shadow-[0_0_50px_rgba(99,102,241,0.2)]">
             <div className="h-[400px] w-full bg-slate-900/50 relative">
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="grid grid-cols-2 gap-4 p-8 w-full max-w-md">
                    <div className="h-40 glass border-accent/20 rounded-xl relative overflow-hidden group">
                      <div className="absolute inset-0 bg-accent/20 animate-pulse" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/40 px-2 py-1 rounded text-[10px]">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        AI Sarah (Host)
                      </div>
                    </div>
                    <div className="h-40 glass border-white/5 rounded-xl flex items-center justify-center text-white/20">
                      <Video size={32} />
                    </div>
                    <div className="h-40 glass border-white/5 rounded-xl flex items-center justify-center text-white/20">
                      <Video size={32} />
                    </div>
                    <div className="h-40 glass border-white/5 rounded-xl flex items-center justify-center text-white/20">
                      <Video size={32} />
                    </div>
                 </div>
               </div>
               {/* Mock AI Panel Overlay */}
               <div className="absolute top-6 right[-20px] w-48 glass-card p-3 border-accent/50 scale-90">
                 <div className="flex items-center gap-2 mb-2 text-[10px] text-accent-light font-bold">
                   <Cpu size={12} />
                   AI INSIGHTS
                 </div>
                 <div className="space-y-1.5">
                   <div className="h-1.5 w-full bg-accent/30 rounded-full" />
                   <div className="h-1.5 w-3/4 bg-white/20 rounded-full" />
                   <div className="h-1.5 w-1/2 bg-white/10 rounded-full" />
                 </div>
               </div>
             </div>
          </div>
          {/* Decorative Glow */}
          <div className="absolute -inset-4 bg-accent/20 blur-3xl opacity-30 -z-10 rounded-full" />
        </motion.div>
      </div>

      {/* Features Social Proof */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-32 grid md:grid-cols-3 gap-8"
      >
        <div className="glass-card hover:bg-white/10 transition-colors cursor-default border-white/5">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all">
            <Cpu className="text-accent" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">AI Intelligence</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Real-time meeting notes, action items, and topic tracking powered by advanced LLMs.
          </p>
        </div>
        <div className="glass-card hover:bg-white/10 transition-colors cursor-default border-white/5">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all">
            <Shield className="text-accent" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">E2E Encryption</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Your conversations are private. We use industry-standard encryption for all data streams.
          </p>
        </div>
        <div className="glass-card hover:bg-white/10 transition-colors cursor-default border-white/5">
          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all">
            <Video className="text-accent" size={24} />
          </div>
          <h3 className="text-xl font-bold mb-3">4K Quality</h3>
          <p className="text-white/50 text-sm leading-relaxed">
            Crystal clear video and spatial audio for an immersive meeting experience.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
