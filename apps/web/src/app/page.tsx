"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, Plus, ArrowRight, Shield, Zap, Globe } from "lucide-react";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const createRoom = async () => {
    setIsCreating(true);
    setError("");
    try {
      const res = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ host_id: "guest", room_name: "Strategic Sync" }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/room/${data.id}`);
      } else {
        setError("Failed to create session. Please try again.");
      }
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = () => {
    const id = roomId.trim().toUpperCase();
    if (!id) {
      setError("Please enter a room code.");
      return;
    }
    setIsJoining(true);
    router.push(`/room/${id}`);
  };

  return (
    <main className="min-h-screen bg-[#0B1120] text-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Subtle background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      {/* Navigation/Brand Header */}
      <div className="flex items-center gap-3 mb-16 z-10">
        <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-white shadow-xl shadow-indigo-500/20 text-lg">
          C
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#F9FAFB]">
          Confera <span className="text-indigo-400">AI</span>
        </span>
      </div>

      {/* Hero Section */}
      <div className="max-w-3xl w-full text-center mb-12 z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Professional conferencing <br />
          <span className="text-indigo-400">for modern teams</span>
        </h1>
        <p className="text-lg md:text-xl text-[#9CA3AF] max-w-xl mx-auto leading-relaxed mb-10">
          Clean professional collaboration with real-time AI productivity features built for engineering and product teams.
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
          <button
            onClick={createRoom}
            disabled={isCreating}
            className="w-full sm:w-auto px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
          >
            {isCreating ? "Preparing Session..." : (
              <>
                <Plus size={20} />
                Start Meeting
              </>
            )}
          </button>

          <div className="flex w-full sm:w-auto items-center bg-[#111827] border border-[#1F2937] rounded-2xl p-1 focus-within:border-indigo-500/50 transition-all">
            <input
              value={roomId}
              onChange={e => { setRoomId(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && joinRoom()}
              placeholder="Room ID"
              className="bg-transparent border-none outline-none text-sm px-4 py-3 w-full sm:w-32 placeholder:text-[#9CA3AF]"
            />
            <button
              onClick={joinRoom}
              disabled={isJoining}
              className="px-5 py-3 bg-[#1F2937] text-[#F9FAFB] font-bold rounded-xl hover:bg-[#2D3748] transition-all text-sm active:scale-95"
            >
              {isJoining ? "..." : "Join"}
            </button>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-12 z-10">
        {[
          { icon: Zap, title: "AI Powered", desc: "Automated recaps and insights" },
          { icon: Shield, title: "Secure Mesh", desc: "End-to-end encrypted sessions" },
          { icon: Globe, title: "Zero Setup", desc: "No downloads or accounts needed" }
        ].map((item, i) => (
          <div key={i} className="p-6 bg-[#111827]/50 border border-[#1F2937] rounded-2xl flex flex-col items-center text-center group hover:bg-[#111827] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1F2937] flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <item.icon size={20} />
            </div>
            <h3 className="font-bold text-[#F9FAFB] mb-1">{item.title}</h3>
            <p className="text-sm text-[#9CA3AF]">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-24 text-[11px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]/50 flex items-center gap-8 z-10">
        <span>WebRTC INFRASTRUCTURE</span>
        <div className="w-1 h-1 rounded-full bg-indigo-500/30" />
        <span>E2E ENCRYPTION</span>
        <div className="w-1 h-1 rounded-full bg-indigo-500/30" />
        <span>GEMINI 2.0 FLASH</span>
      </div>
    </main>
  );
}
