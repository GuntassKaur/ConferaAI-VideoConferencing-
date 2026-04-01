import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Video, Plus, Key, ArrowRight, Zap, Shield, Cpu, Globe, Sparkles, MessageSquare } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const handleJoin = (e) => {
    e.preventDefault();
    if (roomId.trim()) navigate(`/room/${roomId}`);
  };

  const createMeeting = () => {
    const id = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${id}`);
  };

  return (
    <div className="relative min-h-screen z-10 overflow-hidden bg-mesh">
      {/* Animated Particles Background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, -1000],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass h-24 px-12 flex items-center justify-between border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-2xl flex items-center justify-center rotate-12 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Video className="text-white -rotate-12" size={24} />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white">CONFERA <span className="text-accent text-glow font-extrabold uppercase text-sm tracking-[0.3em] ml-1">AI</span></span>
        </motion.div>
        
        <div className="hidden md:flex items-center gap-10">
          {['Solutions', 'Technology', 'Pricing'].map((item) => (
            <a key={item} href="#" className="text-sm font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest">{item}</a>
          ))}
          <button onClick={createMeeting} className="btn-primary py-3 px-8 text-sm uppercase tracking-widest font-black">Launch Neural Link</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-52 pb-32 relative">
        <div className="grid lg:grid-cols-2 gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-accent/30 mb-10 glow-pulse"
            >
              <Sparkles size={18} className="text-accent" />
              <span className="text-xs font-black tracking-[0.2em] uppercase text-accent-light">AI Neural Meetings v2.0</span>
            </motion.div>
            
            <h1 className="text-7xl lg:text-[7rem] font-black leading-[0.9] mb-10 tracking-tighter">
              Meet <br />
              <span className="text-neon">Smarter</span> <br />
              <span className="text-white/20">with AI</span>
            </h1>
            
            <p className="text-2xl text-white/50 font-medium leading-relaxed max-w-xl mb-14">
              The first video platform that doesn't just record - it thinks. 
              Real-time intelligence for the next generation of builders.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={createMeeting} 
                className="btn-primary group flex items-center gap-3 px-10 py-5 text-xl font-black"
              >
                <Plus size={24} />
                Create Module
                <Globe size={20} className="ml-2 animate-spin-slow" />
              </motion.button>
              
              <form onSubmit={handleJoin} className="relative group flex-1 max-w-md">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent transition-all">
                  <Key size={22} />
                </div>
                <input 
                  type="text" 
                  placeholder="Module Access Code" 
                  className="input-field pl-16 pr-36 py-5 text-xl bg-white/5"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
                <button type="submit" className="absolute right-3 top-2 bottom-2 px-8 glass border-white/10 hover:border-accent/40 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                  Sync
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: y1 }}
            className="relative lg:block hidden"
          >
             {/* Floating UI Mockup */}
             <div className="glass-card p-2 rounded-[3rem] border-accent/20 rotate-3 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden group">
                <div className="aspect-video bg-neutral-900 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-950/40 mix-blend-overlay" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center animate-pulse">
                       <Video className="text-white/20" size={48} />
                     </div>
                   </div>
                   {/* Floating AI Elements */}
                   <motion.div 
                     animate={{ y: [0, -10, 0] }}
                     transition={{ repeat: Infinity, duration: 4 }}
                     className="absolute top-8 left-8 glass p-4 rounded-2xl border-accent/40 flex items-center gap-3"
                   >
                     <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                       <Sparkles size={20} className="text-white" />
                     </div>
                     <div>
                       <div className="text-[10px] font-black text-accent-light uppercase tracking-widest">Live Analysis</div>
                       <div className="text-[12px] font-bold">Optimizing Stream...</div>
                     </div>
                   </motion.div>
                </div>
             </div>
             
             {/* Backing Glows */}
             <div className="absolute -top-20 -right-20 w-96 h-96 bg-accent opacity-20 blur-[150px] rounded-full animate-pulse" />
             <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 opacity-20 blur-[150px] rounded-full animate-float" />
          </motion.div>
        </div>
      </div>

      {/* Feature Section */}
      <section className="relative z-10 px-6 py-32 border-t border-white/5 bg-black/20 backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <h2 className="text-5xl font-black mb-6 tracking-tight">The <span className="text-neon">Intelligence</span> Layer</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <FeatureCard 
              icon={<Cpu size={32} />} 
              title="Neural Transcription" 
              desc="Instant, accurate transcriptions with speaker identification and sentiment analysis." 
            />
            <FeatureCard 
              icon={<Sparkles size={32} />} 
              title="Smart Highlights" 
              desc="AI detects action items, decisions, and key moments so you never miss a beat." 
            />
            <FeatureCard 
              icon={<Shield size={32} />} 
              title="Encrypted Channels" 
              desc="Enterprise-grade security on a decentralized, high-performance infrastructure." 
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="glass-card hover:bg-white/5 group border-white/5"
  >
    <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-8 border border-white/10 group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500 shadow-xl">
      <div className="text-accent group-hover:scale-110 transition-transform">{icon}</div>
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tight group-hover:text-accent transition-colors">{title}</h3>
    <p className="text-white/40 text-lg leading-relaxed font-medium">
      {desc}
    </p>
  </motion.div>
);

export default Home;
