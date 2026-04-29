"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const createRoom = () => {
    const id = Math.random().toString(36).substring(2, 5).toUpperCase() + "-" +
               Math.random().toString(36).substring(2, 5).toUpperCase() + "-" +
               Math.random().toString(36).substring(2, 5).toUpperCase();
    router.push(`/room/${id}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) router.push(`/room/${roomId.trim()}`);
  };

  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center justify-center px-6">
      {/* Glow blobs */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[100px] pointer-events-none" />

      {/* Logo */}
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-black">C</div>
        <span className="text-2xl font-black tracking-tight">Confera <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI</span></span>
      </div>

      {/* Hero */}
      <h1 className="text-5xl md:text-7xl font-black text-center leading-[1.05] mb-6 max-w-3xl">
        Meetings that<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400">
          think with you
        </span>
      </h1>
      <p className="text-lg text-white/50 text-center max-w-lg mb-12 leading-relaxed">
        AI-powered video conferencing with live recaps, smart transcription, screen analysis, and real-time co-pilot.
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mb-6">
        <button
          onClick={createRoom}
          className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-lg hover:opacity-90 active:scale-95 transition-all"
        >
          Start Meeting
        </button>
        <div className="flex-1 flex gap-2">
          <input
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            onKeyDown={e => e.key === "Enter" && joinRoom()}
            placeholder="Room code"
            className="flex-1 py-4 px-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={joinRoom}
            className="py-4 px-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors font-bold"
          >
            Join
          </button>
        </div>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        {["🧠 AI Recap", "📝 Live Transcription", "🖥️ Screen AI", "⚡ Co-pilot", "🌐 Translation", "🤝 Breakout Rooms"].map(f => (
          <span key={f} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60">
            {f}
          </span>
        ))}
      </div>
    </main>
  );
}
