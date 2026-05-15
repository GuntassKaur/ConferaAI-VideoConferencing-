"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Box, 
  UtensilsCrossed, 
  ChefHat,
  Package
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Steps Configuration
  const steps = [
    { title: "Welcome", id: "welcome" },
    { title: "Profile", id: "profile" },
    { title: "AI Core", id: "ai" },
    { title: "Connect", id: "integrations" },
    { title: "Ready", id: "finish" },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) setStep(prev => prev + 1);
    else finishOnboarding();
  };

  const finishOnboarding = () => {
    if (typeof window !== 'undefined') localStorage.setItem('dineva_onboarded', 'true');
    router.push('/dashboard');
  };

  const variants = {
    enter: { x: '100%', opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  };

  return (
    <div className="fixed inset-0 bg-[#070b14] text-white flex flex-col font-sans overflow-hidden selection:bg-dineva-blue/30 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(65,105,225,0.1),transparent_50%)] pointer-events-none z-0" />
      
      {/* Top Header */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-50">
        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-dineva-blue to-dineva-violet rounded-lg flex items-center justify-center text-white">
            <Sparkles size={18} />
          </div>
          DinevaAI <span className="text-dineva-blue">OS</span>
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
              <div className="w-24 h-24 bg-dineva-blue/20 rounded-3xl border border-dineva-blue/30 flex items-center justify-center mb-8 shadow-premium">
                <ChefHat className="w-10 h-10 text-dineva-blue" />
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">Welcome to the future of hospitality.</h1>
              <p className="text-xl text-white/60 mb-12 max-w-xl">Configure your intelligent operating system and start managing your restaurant with AI-driven precision.</p>
              <button onClick={handleNext} className="bg-white text-black px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-colors flex items-center shadow-2xl">
                Initialize System <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          )}

          {/* STEP 1: Restaurant Profile */}
          {step === 1 && (
            <motion.div key="profile" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl w-full flex flex-col items-center px-8">
              <h2 className="text-3xl font-bold mb-2">Tell us about your restaurant</h2>
              <p className="text-white/50 mb-8 text-center">We'll customize the dashboard based on your cuisine and scale.</p>
              
              <div className="w-full space-y-6 mb-10">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Restaurant Name</label>
                  <input type="text" placeholder="e.g. The Golden Platter" className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-dineva-blue outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Cuisine Type</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-white focus:border-dineva-blue outline-none transition-all appearance-none">
                    <option>Fine Dining</option>
                    <option>Quick Service (QSR)</option>
                    <option>Cafe / Bistro</option>
                    <option>Bar & Lounge</option>
                  </select>
                </div>
              </div>
              
              <button onClick={handleNext} className="w-full bg-dineva-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg shadow-dineva-blue/20">
                Confirm Profile
              </button>
            </motion.div>
          )}

          {/* STEP 2: AI Setup */}
          {step === 2 && (
            <motion.div key="ai" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl w-full flex flex-col items-center px-8">
              <div className="w-16 h-16 bg-dineva-violet/20 rounded-2xl border border-dineva-violet/30 flex items-center justify-center mb-6 shadow-premium">
                <Sparkles className="w-8 h-8 text-dineva-violet" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-center">Neural Core Calibration</h2>
              <p className="text-white/50 mb-10 text-center max-w-md">Tune how DinevaAI monitors your kitchen and inventory.</p>

              <div className="w-full space-y-4 mb-10">
                <div className="glass rounded-2xl p-5 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer border border-white/5">
                  <div>
                    <h3 className="font-bold text-white">Prediction Sensitivity</h3>
                    <p className="text-xs text-white/50">Aggressiveness of demand forecasting</p>
                  </div>
                  <select className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-xs outline-none">
                    <option>Conservative</option>
                    <option>Balanced</option>
                    <option>High Growth</option>
                  </select>
                </div>
                
                <div className="glass rounded-2xl p-5 flex justify-between items-center hover:bg-white/5 transition-colors cursor-pointer border border-white/5">
                  <div>
                    <h3 className="font-bold text-white">Auto-Inventory</h3>
                    <p className="text-xs text-white/50">Allow AI to auto-reorder critical stock</p>
                  </div>
                  <div className="w-12 h-6 bg-dineva-blue rounded-full flex items-center p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform" />
                  </div>
                </div>
              </div>

              <button onClick={handleNext} className="w-full bg-dineva-violet text-white py-4 rounded-xl font-bold text-lg hover:bg-violet-600 transition-colors">
                Calibrate AI
              </button>
            </motion.div>
          )}

          {/* STEP 3: Integrations */}
          {step === 3 && (
            <motion.div key="integrations" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl w-full flex flex-col items-center px-8">
              <div className="w-16 h-16 bg-dineva-blue/20 rounded-2xl border border-dineva-blue/30 flex items-center justify-center mb-6 shadow-premium">
                <Box className="w-8 h-8 text-dineva-blue" />
              </div>
              <h2 className="text-3xl font-bold mb-2 text-center">Sync your ecosystem</h2>
              <p className="text-white/50 mb-10 text-center max-w-md">Connect your POS, inventory management, and staffing tools.</p>

              <div className="grid grid-cols-1 gap-4 w-full mb-10">
                {['Toast POS', 'MarketMan', 'Planday'].map(app => (
                  <div key={app} className="glass rounded-2xl p-5 flex justify-between items-center border border-white/5">
                    <span className="font-bold text-white">{app}</span>
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">Connect</button>
                  </div>
                ))}
              </div>

              <button onClick={handleNext} className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors">
                Finalize Setup
              </button>
            </motion.div>
          )}

          {/* STEP 4: Finish */}
          {step === 4 && (
            <motion.div key="finish" variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", damping: 25, stiffness: 200 }} className="max-w-2xl text-center flex flex-col items-center">
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-32 h-32 bg-emerald-500/20 rounded-full border-4 border-emerald-500/30 flex items-center justify-center mb-8 shadow-[0_0_80px_rgba(16,185,129,0.3)]"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
              </motion.div>
              <h1 className="text-5xl font-extrabold tracking-tight mb-6">System Online.</h1>
              <p className="text-xl text-white/60 mb-12 max-w-md">DinevaAI OS is now synchronized with your restaurant operations. Ready for launch.</p>
              <button onClick={finishOnboarding} className="bg-dineva-blue text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-blue-600 transition-colors shadow-2xl shadow-dineva-blue/20">
                Launch Command Center
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Floating Progress Dots */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex space-x-3 z-50">
        {steps.map((s, i) => (
          <div key={s.id} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step === i ? 'bg-dineva-blue w-8' : step > i ? 'bg-white/40' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  );
}
