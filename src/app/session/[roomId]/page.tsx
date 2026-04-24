'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Clock, Share2, PhoneOff, Maximize2,
  CheckCircle2, Sparkles, ChevronRight, Video, Mic, MicOff, VideoOff
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import VideoRoom from '@/components/VideoRoom';
import Sidebar from '@/components/Sidebar';

interface Brief {
  greeting: string;
  agenda: string[];
  contextFromLastMeeting: string;
  suggestedPrep: string[];
}

export default function SessionPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'people' | 'ai'>('ai');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [token, setToken] = useState('');
  const [duration, setDuration] = useState(0);

  // Pre-brief states
  const [brief, setBrief] = useState<Brief | null>(null);
  const [briefLoading, setBriefLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  // Timer
  useEffect(() => {
    if (!hasJoined) return;
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [hasJoined]);

  const formatDuration = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // Auth guard
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  // Fetch pre-meeting brief
  useEffect(() => {
    if (!user || !roomId) return;
    const fetchBrief = async () => {
      setBriefLoading(true);
      try {
        const res = await fetch('/api/meeting/brief', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, participantName: user.name }),
        });
        const data = await res.json();
        if (!data.error) {
          setBrief(data);
          setCheckedItems(new Array(data.agenda?.length || 0).fill(false));
        }
      } catch (e) { console.error(e); } 
      finally { setBriefLoading(false); }
    };
    fetchBrief();
  }, [roomId, user]);

  // Fetch LiveKit token on join
  const handleJoin = async () => {
    try {
      const resp = await fetch('/api/livekit/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, participantName: user?.name }),
      });
      const data = await resp.json();
      if (data.token) setToken(data.token);
    } catch (e) { console.error(e); }
    setHasJoined(true);
  };

  // ── PRE-MEETING BRIEF SCREEN ──────────────────────────────────────────────
  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 font-inter overflow-hidden relative">
        {/* Background glow */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600/8 blur-[150px] rounded-full pointer-events-none" />

        {briefLoading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6">
            <div className="relative">
              <Brain className="text-indigo-500 w-16 h-16 animate-pulse" />
              <div className="absolute inset-0 bg-indigo-500/20 blur-2xl animate-ping rounded-full" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Generating Neural Brief...
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 22 }}
            className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10"
          >
            {/* LEFT: Brief Content (3/5) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Brain size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.3em]">Confera Neural Brief</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest truncate max-w-[200px]">
                    {String(roomId)}
                  </p>
                </div>
              </div>

              {/* Greeting Card */}
              <div className="p-6 bg-[#111113] border border-[#27272a] rounded-[24px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                <p className="text-2xl font-black text-white tracking-tight leading-snug">
                  {brief?.greeting || `Good day, ${user?.name}!`}
                </p>
              </div>

              {/* Agenda Checklist */}
              {brief?.agenda && brief.agenda.length > 0 && (
                <div className="p-6 bg-[#111113] border border-[#27272a] rounded-[24px] space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">Today's Agenda</h3>
                  </div>
                  {brief.agenda.map((item, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCheckedItems(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
                      className="w-full flex items-start gap-3 text-left group"
                    >
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${checkedItems[i] ? 'bg-indigo-600 border-indigo-500' : 'border-slate-700 group-hover:border-indigo-500/50'}`}>
                        {checkedItems[i] && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <p className={`text-sm font-medium transition-colors ${checkedItems[i] ? 'line-through text-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
                        {item}
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Last Meeting Context */}
              {brief?.contextFromLastMeeting && brief.contextFromLastMeeting !== 'null' && (
                <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 rounded-[24px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-3">Last Time You Discussed...</p>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                    "{brief.contextFromLastMeeting}"
                  </p>
                </div>
              )}

              {/* Suggested Prep */}
              {brief?.suggestedPrep && brief.suggestedPrep.length > 0 && (
                <div className="p-6 bg-[#111113] border border-[#27272a] rounded-[24px] space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white mb-3">Come Prepared With...</p>
                  {brief.suggestedPrep.map((s, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <ChevronRight size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400 font-medium">{s}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Camera/Mic Preview + Join (2/5) */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Camera Preview Placeholder */}
              <div className="flex-1 bg-[#111113] border border-[#27272a] rounded-[24px] flex flex-col items-center justify-center p-8 gap-4 relative overflow-hidden min-h-[280px]">
                <div className="absolute inset-0 bg-[radial-gradient(#1a1a2e_1px,transparent_1px)] [background-size:20px_20px] opacity-30" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center text-2xl font-black text-indigo-500">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <p className="text-xs font-bold text-white">{user?.name}</p>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Camera preview active</p>
                </div>
                <div className="absolute bottom-4 flex items-center gap-2">
                  <div className="px-2.5 py-1 bg-[#18181b] rounded-lg flex items-center gap-1.5 border border-[#27272a]">
                    <Mic size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Mic On</span>
                  </div>
                  <div className="px-2.5 py-1 bg-[#18181b] rounded-lg flex items-center gap-1.5 border border-[#27272a]">
                    <Video size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase">Cam On</span>
                  </div>
                </div>
              </div>

              {/* Room info */}
              <div className="p-4 bg-[#111113] border border-[#27272a] rounded-2xl">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Session ID</p>
                <p className="text-xs font-black text-white font-mono truncate">{String(roomId)}</p>
              </div>

              {/* Join Button */}
              <motion.button
                whileHover={{ scale: 0.99 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleJoin}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-3"
              >
                <Video size={18} />
                <span>Join Session Now</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // ── IN-CALL SCREEN ────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-slate-200 overflow-hidden font-inter selection:bg-indigo-500/30">
      {/* Top Bar */}
      <header className="h-16 border-b border-[#27272a]/50 px-6 flex items-center justify-between bg-[#09090b]/80 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              {roomId}
            </h1>
            <div className="flex items-center gap-2 text-[#71717a] mt-0.5">
              <Clock size={10} />
              <span className="text-[10px] font-bold tabular-nums tracking-tighter uppercase">{formatDuration(duration)} Live</span>
            </div>
          </div>
          <div className="h-6 w-[1px] bg-[#27272a]" />
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full">
            <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">Rec Active</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setIsSidebarOpen(true); setActiveTab('ai'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest ${isSidebarOpen && activeTab === 'ai' ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-[#111113] text-slate-400 border-[#27272a] hover:border-indigo-500/50'}`}
          >
            <Brain size={14} className={isSidebarOpen && activeTab === 'ai' ? 'animate-pulse' : ''} />
            <span>AI Brain</span>
          </button>
          <button className="p-2.5 rounded-xl bg-[#111113] border border-[#27272a] text-slate-400 hover:text-white hover:border-slate-700 transition-all">
            <Share2 size={18} />
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20"
          >
            <PhoneOff size={14} />
            <span>End Session</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative flex flex-col bg-[#09090b] overflow-hidden">
          <VideoRoom token={token} serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL || ''} />
        </main>

        {/* Sidebar Panel */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-[380px] border-l border-[#27272a] relative z-40 h-full bg-[#111113] flex flex-col shadow-2xl"
            >
              <div className="flex items-center border-b border-[#27272a] p-2 bg-[#09090b]/50 gap-1">
                {(['chat', 'people', 'ai'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative flex-1 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all group"
                  >
                    <span className={`relative z-10 transition-colors duration-300 ${activeTab === tab ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                      {tab}
                    </span>
                    <AnimatePresence>
                      {activeTab === tab && (
                        <motion.div
                          layoutId="sidebar-active-tab"
                          className="absolute inset-0 bg-indigo-600/10 border border-indigo-500/20 rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </AnimatePresence>
                  </button>
                ))}
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-500 hover:text-white">
                  <Maximize2 size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <Sidebar activeTab={activeTab} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
