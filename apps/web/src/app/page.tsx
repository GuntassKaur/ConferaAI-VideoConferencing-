"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
        body: JSON.stringify({ host_id: "guest", room_name: "Confera Meeting" }),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/room/${data.id}`);
      } else {
        setError("Failed to create room. Please try again.");
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
    <main style={{ minHeight: "100vh", backgroundColor: "#0a0a1a", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "system-ui, -apple-system, sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Glow blobs */}
      <div style={{ position: "fixed", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #7c3aed, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 900, boxShadow: "0 0 32px rgba(124,58,237,0.5)" }}>C</div>
        <span style={{ fontSize: "24px", fontWeight: 900, letterSpacing: "-0.5px" }}>Confera <span style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span></span>
      </div>

      {/* Hero */}
      <h1 style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 900, textAlign: "center", lineHeight: 1.05, marginBottom: "20px", maxWidth: "700px" }}>
        Meetings that{" "}
        <span style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          think with you
        </span>
      </h1>
      <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", textAlign: "center", maxWidth: "480px", lineHeight: 1.7, marginBottom: "48px" }}>
        AI-powered video conferencing with live recaps, smart transcription, screen analysis, and real-time co-pilot.
      </p>

      {/* Error message */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "12px 20px", marginBottom: "20px", color: "#fca5a5", fontSize: "14px" }}>
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "460px", marginBottom: "16px" }}>
        <button
          onClick={createRoom}
          disabled={isCreating}
          style={{ width: "100%", padding: "18px 24px", borderRadius: "16px", background: isCreating ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #ec4899)", border: "none", color: "#fff", fontSize: "18px", fontWeight: 700, cursor: isCreating ? "not-allowed" : "pointer", transition: "all 0.2s", boxShadow: "0 0 40px rgba(124,58,237,0.3)" }}
        >
          {isCreating ? "Creating room..." : "🚀 Start Meeting"}
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            value={roomId}
            onChange={e => { setRoomId(e.target.value); setError(""); }}
            onKeyDown={e => e.key === "Enter" && joinRoom()}
            placeholder="Enter room code (e.g. ABC-DEF-GHI)"
            style={{ flex: 1, padding: "16px", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: "15px", outline: "none" }}
          />
          <button
            onClick={joinRoom}
            disabled={isJoining}
            style={{ padding: "16px 20px", borderRadius: "14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            {isJoining ? "..." : "Join"}
          </button>
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "32px", maxWidth: "600px" }}>
        {["🧠 AI Recap", "📝 Live Transcription", "🖥️ Screen AI", "⚡ Co-pilot", "🌐 Translation", "🤝 Breakout Rooms"].map(f => (
          <span key={f} style={{ padding: "8px 16px", borderRadius: "999px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
            {f}
          </span>
        ))}
      </div>

      {/* Footer */}
      <p style={{ marginTop: "48px", fontSize: "13px", color: "rgba(255,255,255,0.2)" }}>
        No account needed · WebRTC powered · End-to-end encrypted
      </p>
    </main>
  );
}
