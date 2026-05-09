"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Video, ArrowRight, Shield, Zap, Globe, Loader2 } from "lucide-react";

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          setAuthUser(data.user);
        } else {
          setIsLogin(true);
          setError("Registration successful! Please login.");
        }
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col md:flex-row items-stretch font-sans">
      
      {/* Left Column: Marketing */}
      <div className="hidden md:flex flex-1 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-bold text-indigo-600 shadow-xl text-lg">
            C
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Confera AI
          </span>
        </div>

        <div className="z-10 space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight">
            Professional conferencing <br />
            for modern teams.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            Clean, professional collaboration with real-time AI productivity features built for engineering and product teams.
          </p>
        </div>

        <div className="z-10 flex gap-10">
           <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-white">99.9%</span>
              <span className="text-indigo-200 text-sm font-medium">Uptime SLA</span>
           </div>
           <div className="flex flex-col gap-2">
              <span className="text-3xl font-bold text-white">2.0</span>
              <span className="text-indigo-200 text-sm font-medium">Gemini Intelligence</span>
           </div>
        </div>
      </div>

      {/* Right Column: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              {isLogin ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-slate-500 text-sm">
              {isLogin ? "Enter your credentials to access your dashboard" : "Join Confera AI and start productive meetings"}
            </p>
          </div>

          {error && (
            <div className={`p-4 rounded-xl text-sm font-medium border ${error.includes('successful') ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'} animate-in fade-in slide-in-from-top-2`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
                />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
            </button>
          </form>

          <div className="pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
