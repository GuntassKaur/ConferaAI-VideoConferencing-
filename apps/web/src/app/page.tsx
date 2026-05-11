"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Mic,
  MonitorUp,
  ShieldCheck,
  Sparkles,
  User,
  Video,
  WandSparkles,
  Loader2,
} from "lucide-react";

const trustSignals = [
  { label: "AI recap ready", icon: Sparkles },
  { label: "Encrypted rooms", icon: ShieldCheck },
  { label: "Smart notes", icon: WandSparkles },
];

export default function Home() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const { login: setAuthUser } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotice("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin
      ? { email, password }
      : { name, email, password };

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
          return;
        }

        setIsLogin(true);
        setPassword("");
        setNotice("Account created. Sign in to open your workspace.");
      } else {
        setNotice(data.error || "Authentication failed. Please try again.");
      }
    } catch {
      setNotice("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#071018] text-white overflow-hidden">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative flex min-h-[46rem] items-center border-b border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.16),transparent_32%),linear-gradient(135deg,#071018_0%,#101927_48%,#111827_100%)] px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:px-12">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px]" />

          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14B8A6] text-[#021314] shadow-lg shadow-teal-950/40">
                <Video size={22} />
              </div>
              <div>
                <p className="text-xl font-semibold tracking-tight">Confera AI</p>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-100/65">secure meeting OS</p>
              </div>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold leading-[1.05] tracking-normal text-white sm:text-5xl lg:text-6xl">
                Video meetings with the intelligence layer already inside.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
                Sign in to launch secure rooms, live notes, instant recaps, recordings, and team-ready meeting history from one workspace.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {trustSignals.map(({ label, icon: Icon }) => (
                <div key={label} className="flex min-h-16 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.045] px-4">
                  <Icon className="h-5 w-5 text-[#F59E0B]" />
                  <span className="text-sm font-medium text-slate-200">{label}</span>
                </div>
              ))}
            </div>

            <div className="relative aspect-[16/9] min-h-64 overflow-hidden rounded-xl border border-white/10 bg-[#0B1220] shadow-2xl shadow-black/35">
              <Image
                src="/dashboard-mock.png"
                alt="Confera AI dashboard preview"
                fill
                sizes="(min-width: 1024px) 54vw, 92vw"
                className="object-cover"
                priority
              />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-white/10 bg-[#071018]/85 px-3 py-2 backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-slate-100">Live secure room</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2 sm:right-auto sm:w-[25rem]">
                {[Mic, MonitorUp, Sparkles].map((Icon, index) => (
                  <div key={index} className="flex h-12 items-center justify-center rounded-lg border border-white/10 bg-[#071018]/88 text-slate-100 backdrop-blur">
                    <Icon size={18} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#F7FAFC] px-5 py-10 text-[#0F172A] sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setNotice("");
                }}
                className={`h-10 flex-1 rounded-md text-sm font-semibold transition ${isLogin ? "bg-[#0F172A] text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setNotice("");
                }}
                className={`h-10 flex-1 rounded-md text-sm font-semibold transition ${!isLogin ? "bg-[#0F172A] text-white" : "text-slate-500 hover:text-slate-900"}`}
              >
                Create account
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold text-[#0D9488]">{isLogin ? "Welcome back" : "Start your workspace"}</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
                  {isLogin ? "Open your command center" : "Create your Confera account"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
                    <span className="relative block">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Guntass Kaur"
                        className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-teal-100"
                      />
                    </span>
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
                  <span className="relative block">
                    <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                  <span className="relative block">
                    <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="h-12 w-full rounded-lg border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#14B8A6] focus:bg-white focus:ring-4 focus:ring-teal-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </span>
                </label>

                {notice && (
                  <div className={`rounded-lg border px-4 py-3 text-sm font-medium ${notice.includes("created") ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {notice}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] text-sm font-semibold text-white shadow-lg shadow-slate-300/70 transition hover:bg-[#111827] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {isLogin ? "Sign in" : "Create account"}
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {isLogin && (
                <button
                  type="button"
                  onClick={() => setNotice("Password reset will be connected next.")}
                  className="mt-5 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
                >
                  Forgot password?
                </button>
              )}
            </div>

            <p className="mt-6 text-center text-sm font-medium text-slate-500">
              {isLogin ? "New to Confera AI?" : "Already registered?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin((value) => !value);
                  setNotice("");
                }}
                className="font-semibold text-[#0D9488] hover:text-[#0F766E]"
              >
                {isLogin ? "Create an account" : "Sign in"}
              </button>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
