'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParticipants, useLocalParticipant, useTracks, VideoTrack, useIsSpeaking } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { 
  Mic, MicOff, Video, VideoOff, Monitor, Smile, MessageSquare, 
  Brain, LogOut, Users, UserPlus, Circle, Plus, X, Send
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function VideoRoom({ roomId }: { roomId: string }) {
  const router = useRouter();
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const [time, setTime] = useState(0);
  const [sidebarTab, setSidebarTab] = useState<'chat'|'people'|'ai'|null>(null);
  
  const [micEnabled, setMicEnabled] = useState(localParticipant?.isMicrophoneEnabled || false);
  const [camEnabled, setCamEnabled] = useState(localParticipant?.isCameraEnabled || false);
  const [screenEnabled, setScreenEnabled] = useState(localParticipant?.isScreenShareEnabled || false);
  const [showReactions, setShowReactions] = useState(false);
  
  // Fake chat state
  const [messages, setMessages] = useState<{sender: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Fake AI state
  const [aiHistory, setAiHistory] = useState<{type: 'user'|'ai', text: string}[]>([]);
  
  useEffect(() => {
    const int = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(int);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleToggleMic = () => {
    if (localParticipant) {
      localParticipant.setMicrophoneEnabled(!micEnabled);
      setMicEnabled(!micEnabled);
    }
  };

  const handleToggleCam = () => {
    if (localParticipant) {
      localParticipant.setCameraEnabled(!camEnabled);
      setCamEnabled(!camEnabled);
    }
  };

  const handleToggleScreen = () => {
    if (localParticipant) {
      localParticipant.setScreenShareEnabled(!screenEnabled);
      setScreenEnabled(!screenEnabled);
    }
  };

  const toggleSidebar = (tab: 'chat'|'people'|'ai') => {
    if (sidebarTab === tab) setSidebarTab(null);
    else setSidebarTab(tab);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { sender: 'You', text: chatInput }]);
    setChatInput('');
  };

  const handleAskAI = (question: string) => {
    setAiHistory(prev => [...prev, { type: 'user', text: question }]);
    setTimeout(() => {
      setAiHistory(prev => [...prev, { type: 'ai', text: `Here is some AI insight regarding: "${question}"` }]);
    }, 1000);
  };

  const gridCols = participants.length <= 1 ? 'grid-cols-1' : participants.length <= 4 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="flex flex-col h-screen bg-[#08080a] text-white font-inter overflow-hidden relative">
      
      {/* TOP BAR */}
      <div className="h-14 bg-[#08080a]/90 backdrop-blur border-b border-[#1e1e27] px-6 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-medium text-sm">{roomId}</span>
          <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-xs font-bold text-rose-500 tracking-widest shadow-sm">
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            LIVE
          </div>
          <span className="font-mono text-slate-400 text-sm">{formatTime(time)}</span>
        </div>
        
        <div className="flex items-center gap-2 bg-[#17171d] border border-[#1e1e27] px-3 py-1 rounded-lg text-sm text-slate-300 shadow-inner">
          <Users size={16} />
          <span className="font-medium">{participants.length}</span>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-white transition-colors"><UserPlus size={18} /></button>
          <button className="text-slate-400 hover:text-rose-400 transition-colors"><Circle size={18} /></button>
          <div className="w-[1px] h-6 bg-[#1e1e27]" />
          <button onClick={() => router.push('/dashboard')} className="bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-900 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors shadow-sm">
            Leave
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* VIDEO GRID */}
        <div className={`flex-1 p-4 grid gap-3 ${gridCols} auto-rows-fr overflow-y-auto`}>
          {participants.map((p) => (
            <ParticipantTile key={p.identity} participant={p} />
          ))}
          {/* Fallback mock UI if empty/not connected yet */}
          {participants.length === 0 && (
             <div className="col-span-full h-full flex items-center justify-center text-slate-500 text-sm font-medium">Connecting to secure mesh...</div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <AnimatePresence>
          {sidebarTab && (
            <motion.div 
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="w-80 bg-[#08080a] border-l border-[#1e1e27] flex flex-col shrink-0 z-40 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]"
            >
              <div className="flex border-b border-[#1e1e27]">
                <button onClick={() => setSidebarTab('chat')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider relative ${sidebarTab === 'chat' ? 'text-[#6366f1]' : 'text-slate-500 hover:text-slate-300'}`}>
                  Chat
                  {sidebarTab === 'chat' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6366f1]" />}
                </button>
                <button onClick={() => setSidebarTab('people')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider relative ${sidebarTab === 'people' ? 'text-[#6366f1]' : 'text-slate-500 hover:text-slate-300'}`}>
                  People
                  {sidebarTab === 'people' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6366f1]" />}
                </button>
                <button onClick={() => setSidebarTab('ai')} className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider relative flex items-center justify-center gap-1 ${sidebarTab === 'ai' ? 'text-[#6366f1]' : 'text-slate-500 hover:text-slate-300'}`}>
                  <Brain size={12} /> AI Brain
                  {sidebarTab === 'ai' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6366f1]" />}
                </button>
              </div>

              {sidebarTab === 'chat' && (
                <div className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-slate-500 font-bold mb-1">{m.sender}</span>
                        <div className={`px-3 py-2 rounded-xl text-sm max-w-[90%] shadow-sm ${m.sender === 'You' ? 'bg-[#6366f1] text-white rounded-tr-sm' : 'bg-[#17171d] text-slate-200 rounded-tl-sm border border-[#1e1e27]'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendChat} className="p-3 bg-[#0f0f13] border-t border-[#1e1e27]">
                    <div className="relative">
                      <input 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)} 
                        placeholder="Send message to everyone..." 
                        className="w-full bg-[#08080a] border border-[#1e1e27] rounded-lg pl-3 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366f1] transition-colors shadow-inner"
                      />
                      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#6366f1] transition-colors">
                        <Send size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {sidebarTab === 'people' && (
                <div className="flex-1 overflow-y-auto p-2">
                  {participants.map(p => (
                    <div key={p.identity} className="flex items-center justify-between p-2 hover:bg-[#17171d] rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1e1e27] flex items-center justify-center text-xs font-bold text-slate-400">
                          {p.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-medium">{p.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.isMicrophoneEnabled ? <Mic size={14} className="text-slate-400" /> : <MicOff size={14} className="text-rose-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sidebarTab === 'ai' && (
                <div className="flex flex-col flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#08080a] to-[#08080a]">
                  <div className="p-4 flex flex-wrap gap-2">
                    {["Summarize so far", "Open questions?", "Action items", "Who spoke most?"].map(q => (
                      <button key={q} onClick={() => handleAskAI(q)} className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-full px-3 py-1.5 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {aiHistory.map((m, i) => (
                      <div key={i} className={`flex flex-col ${m.type === 'user' ? 'items-end' : 'items-start'}`}>
                        {m.type === 'ai' && <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold mb-1"><Brain size={10} /> CONFERA AI</div>}
                        <div className={`px-3 py-2 rounded-xl text-sm max-w-[90%] shadow-sm ${m.type === 'user' ? 'bg-[#17171d] text-white border border-[#1e1e27] rounded-tr-sm' : 'bg-indigo-600/10 text-indigo-100 border border-indigo-500/20 rounded-tl-sm'}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* BOTTOM CONTROL BAR */}
      <div className="shrink-0 flex justify-center pb-6 pt-4 absolute bottom-0 left-0 w-full pointer-events-none z-50">
        <div className="pointer-events-auto bg-[#0f0f13] border border-[#1e1e27] rounded-2xl px-4 py-3 flex items-center gap-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative">
          
          <div className="flex flex-col items-center">
            <button onClick={handleToggleMic} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${micEnabled ? 'bg-[#17171d] hover:bg-[#27272a] text-white' : 'bg-rose-500/20 border border-rose-500/50 text-rose-500'}`}>
              {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <div className="flex items-end justify-center gap-[2px] mt-1 h-1">
              {[1,2,3,4].map(i => (
                <motion.div 
                  key={i} 
                  animate={{ height: micEnabled ? [2, Math.random()*8+4, 2] : 2 }} 
                  transition={{ repeat: Infinity, duration: 0.2 + i*0.1 }}
                  className={`w-[3px] rounded-full ${micEnabled ? 'bg-indigo-400' : 'bg-rose-900/50'}`} 
                />
              ))}
            </div>
          </div>

          <button onClick={handleToggleCam} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all self-start ${camEnabled ? 'bg-[#17171d] hover:bg-[#27272a] text-white' : 'bg-rose-500/20 border border-rose-500/50 text-rose-500'}`}>
            {camEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          
          <button onClick={handleToggleScreen} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all self-start ${screenEnabled ? 'bg-indigo-900/50 border border-[#6366f1] text-[#6366f1]' : 'bg-[#17171d] hover:bg-[#27272a] text-white'}`}>
            <Monitor size={20} />
          </button>

          <div className="relative self-start">
            <button onClick={() => setShowReactions(!showReactions)} className="w-11 h-11 rounded-xl bg-[#17171d] hover:bg-[#27272a] flex items-center justify-center text-white transition-all">
              <Smile size={20} />
            </button>
            <AnimatePresence>
              {showReactions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-[#17171d] border border-[#27272a] rounded-full px-3 py-2 flex items-center gap-2 shadow-xl"
                >
                  {['👍','👏','❤️','😂','😲','🎉'].map(emoji => (
                    <button key={emoji} onClick={() => setShowReactions(false)} className="text-xl hover:scale-125 transition-transform origin-bottom">{emoji}</button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => toggleSidebar('chat')} className={`relative w-11 h-11 rounded-xl flex items-center justify-center transition-all self-start ${sidebarTab === 'chat' ? 'bg-[#27272a] text-white' : 'bg-[#17171d] hover:bg-[#27272a] text-white'}`}>
            <MessageSquare size={20} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#6366f1] rounded-full flex items-center justify-center text-[9px] font-bold border border-[#0f0f13] shadow-sm">3</div>
          </button>

          <button onClick={() => toggleSidebar('ai')} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all self-start ${sidebarTab === 'ai' ? 'bg-indigo-600/20 text-[#6366f1] border border-indigo-500/30' : 'bg-[#17171d] hover:bg-[#27272a] text-white'}`}>
            <Brain size={20} />
          </button>

          <div className="w-[1px] h-8 bg-[#1e1e27] mx-2 self-start mt-1.5" />

          <button onClick={() => router.push('/dashboard')} className="h-11 bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 rounded-xl px-4 flex items-center gap-2 font-bold text-sm transition-colors self-start shadow-sm">
            <LogOut size={16} /> Leave
          </button>
        </div>
      </div>

    </div>
  );
}

function ParticipantTile({ participant }: { participant: any }) {
  const tracks = useTracks([Track.Source.Camera], { participant });
  const isSpeaking = useIsSpeaking(participant);

  return (
    <div className={`bg-[#0f0f13] rounded-2xl overflow-hidden relative shadow-lg transition-all duration-300 ${isSpeaking ? 'border-2 border-[#6366f1] shadow-[0_0_15px_rgba(99,102,241,0.3)]' : 'border border-[#1e1e27]'}`}>
      {tracks.length > 0 ? (
        <VideoTrack trackRef={tracks[0]} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#09090b]">
          <div className="w-20 h-20 rounded-full bg-[#17171d] border border-[#27272a] flex items-center justify-center text-3xl font-bold text-slate-500 shadow-inner">
            {participant.name?.charAt(0) || 'U'}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur rounded-lg px-2.5 py-1 text-[11px] font-bold text-white border border-white/10 flex items-center gap-2 shadow-sm">
        {participant.name || 'Unknown'}
        {participant.isLocal && <span className="text-slate-400 font-medium">(You)</span>}
      </div>

      {!participant.isMicrophoneEnabled && (
        <div className="absolute top-3 right-3 bg-rose-500/80 backdrop-blur rounded-lg p-1.5 border border-rose-500/50 shadow-sm">
          <MicOff size={14} className="text-white" />
        </div>
      )}
    </div>
  );
}
