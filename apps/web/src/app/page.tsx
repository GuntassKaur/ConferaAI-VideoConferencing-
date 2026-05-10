"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

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
    <main className="min-h-screen bg-[#0B1120] text-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Branding */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-white shadow-xl text-lg">
              C
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              Confera AI
            </span>
          </div>
          <h1 className="text-4xl font-bold leading-tight">
            Professional<br />
            AI-powered<br />
            conferencing.
          </h1>
          <p className="text-slate-400 text-sm max-w-sm">
            Built for modern engineering and product teams. Clean, minimal, and deeply integrated with Gemini intelligence.
          </p>
        </div>

        {/* Right Column: Auth Form */}
        <div className="bg-[#111827] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              {isLogin ? "Sign in" : "Create account"}
            </h2>
            <p className="text-slate-400 text-sm">
              {isLogin ? "Enter your details to access your dashboard." : "Join Confera AI to start collaborating."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-12 px-4 bg-[#0B1120] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 transition-colors text-sm text-white placeholder:text-slate-600"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full h-12 px-4 bg-[#0B1120] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 transition-colors text-sm text-white placeholder:text-slate-600"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 bg-[#0B1120] border border-white/10 rounded-xl outline-none focus:border-indigo-500/50 transition-colors text-sm text-white placeholder:text-slate-600"
              />
            </div>

            {error && (
              <p className={`text-sm ${error.includes('successful') ? 'text-emerald-400' : 'text-red-400'}`}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
        
      </div>
    </main>
  );
}
