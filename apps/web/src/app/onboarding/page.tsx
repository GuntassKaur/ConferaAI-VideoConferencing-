"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Mic, Sparkles, CheckCircle2, ChevronRight, Sliders, Box, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Steps Configuration
  const steps = [
    { title: "Welcome", id: "welcome" },
    { title: "A/V Setup", id: "av" },
    { title: "AI Setup", id: "ai" },
    { title: "Connect", id: "integrations" },
    { title: "Ready", id: "finish" },
  ];

  // Camera preview logic for Step 2
  useEffect(() => {
    if (step === 1) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(s => setStream(s))
        .catch(console.error);
    } else {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [step]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(prev => prev + 1);
    else finishOnboarding();
  };

  const finishOnboarding = () => {
    if (typeof window !== 'undefined') localStorage.setItem('confera_onboarded', 'true');
    router.push('/');
  };

  const variants = {
    enter: { x: '100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a1a] text-white flex flex-col font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none z-0" />
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <div className="font-bold text-xl tracking-tight flex items-center">
          Confera<span className="text-indigo-400">AI</span>
        </div>
        {step < steps.length - 1 && (
          <button onClick={finishOnboarding} className="text-white/40 hover:text-white transition-colors text-sm font-semibold">
            Skip Setup
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: Welcome */}
          {step === 0 && (
            <motion.div key="welcome" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-indigo-500/20 rounded-3xl border border-indigo-500/30 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(99,102,241,0.3)]">
                <Video className="w-10 h-10 text-indigo-400" />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Welcome to the future of meetings.</h1>
              <p className="text-xl text-white/60 mb-12 max-w-xl">Supercharge your collaboration with real-time translation, AI auto-recaps, and predictive meeting analytics.</p>
              <button onClick={handleNext} className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors flex items-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                Get Started <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          )}

          {/* STEP 1: A/V Test */}
          {step === 1 && (
            <motion.div key="av" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-4xl w-full flex flex-col items-center px-8">
              <h2 className="text-3xl font-bold mb-2">Check your camera & mic</h2>
              <p className="text-white/50 mb-8">Make sure you look and sound great before joining.</p>
              
              <div className="w-full max-w-2xl aspect-video bg-black rounded-[32px] border border-white/10 overflow-hidden relative shadow-2xl mb-8">
                {stream ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><p className="text-white/40">Requesting camera access...</p></div>
                )}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-full flex items-center space-x-4 border border-white/10">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-emerald-400 animate-pulse" />
                  </div>
                </div>
              </div>
              
              <button onClick={handleNext} className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-500 transition-colors shadow-[0_0_30px_rgba(79,70,229,0.4)]">
                Looks good!
              </button>
            </motion.div>
          )}

          {/* STEP 2: AI Preferences */}
          {step === 2 && (
            <motion.div key="ai" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl w-full flex flex-col items-center px-8">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl border border-purple-500/30 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-center">Tune your AI Assistant</h2>
              <p className="text-white/50 mb-10 text-center max-w-md">How would you like Confera to help you during meetings?</p>

              <div className="w-full space-y-4 mb-10">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer">
                  <div>
                    <h3 className="font-semibold text-white text-lg">Recap Style</h3>
                    <p className="text-sm text-white/50">Length and detail of auto-summaries</p>
                  </div>
                  <select className="bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-white outline-none">
                    <option>Standard (Balanced)</option>
                    <option>Brief (Bullet points)</option>
                    <option>Deep Dive (Highly detailed)</option>
                  </select>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer">
                  <div>
                    <h3 className="font-semibold text-white text-lg">Live Auto-Translate</h3>
                    <p className="text-sm text-white/50">Instantly translate others to your language</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform" />
                  </div>
                </div>
              </div>

              <button onClick={handleNext} className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-500 transition-colors">
                Continue
              </button>
            </motion.div>
          )}

          {/* STEP 3: Integrations */}
          {step === 3 && (
            <motion.div key="integrations" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl w-full flex flex-col items-center px-8">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl border border-blue-500/30 flex items-center justify-center mb-6">
                <Box className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-center">Connect your stack</h2>
              <p className="text-white/50 mb-10 text-center max-w-md">Allow Confera to auto-sync meeting notes and fetch context from your favorite tools.</p>

              <div className="grid grid-cols-1 gap-4 w-full mb-10">
                {['Slack', 'Notion', 'Google Calendar'].map(app => (
                  <div key={app} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center">
                    <span className="font-semibold text-white text-lg">{app}</span>
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors">Connect</button>
                  </div>
                ))}
              </div>

              <button onClick={handleNext} className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors">
                Almost Done
              </button>
            </motion.div>
          )}

          {/* STEP 4: Finish */}
          {step === 4 && (
            <motion.div key="finish" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl text-center flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-32 h-32 bg-emerald-500/20 rounded-full border-4 border-emerald-500/30 flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(16,185,129,0.4)]"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              </motion.div>
              <h1 className="text-5xl font-extrabold tracking-tight mb-6">You're all set!</h1>
              <p className="text-xl text-white/60 mb-12 max-w-md">Your workspace is configured and the AI is primed. Let's start your first meeting.</p>
              <button onClick={finishOnboarding} className="bg-indigo-600 text-white px-12 py-5 rounded-full font-bold text-xl hover:bg-indigo-500 transition-colors shadow-[0_0_40px_rgba(79,70,229,0.5)]">
                Go to Dashboard
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Floating Progress Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-3 z-50">
        {steps.map((s, i) => (
          <div key={s.id} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === i ? 'bg-indigo-500 w-8' : step > i ? 'bg-white/40' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}
