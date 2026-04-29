import { useState, useEffect } from 'react';
import { Bot, Users, Play, Clock, MessageSquare, Radio, ShieldAlert, Sparkles, X, Shuffle, LayoutGrid, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Socket } from 'socket.io-client';

interface BreakoutManagerProps {
  socket: Socket | null;
  participants: any[]; // The room's full participant list
  isHost: boolean;
  onClose: () => void;
  roomId: string;
}

export function BreakoutManager({ socket, participants, isHost, onClose, roomId }: BreakoutManagerProps) {
  const [step, setStep] = useState<'setup' | 'adjusting' | 'active'>('setup');
  const [numRooms, setNumRooms] = useState(2);
  const [goal, setGoal] = useState('');
  
  // Array of groups
  const [groups, setGroups] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [activeDuration, setActiveDuration] = useState(15); // in minutes
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Auto assign logic (Random)
  const handleAutoAssign = () => {
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const newGroups = Array.from({ length: numRooms }, (_, i) => ({
      id: `room_${i + 1}`,
      name: `Breakout Room ${i + 1}`,
      reasoning: 'Randomly assigned',
      participants: [] as any[]
    }));
    
    shuffled.forEach((p, i) => {
      newGroups[i % numRooms].participants.push(p);
    });
    setGroups(newGroups);
    setStep('adjusting');
  };

  // AI Assign logic
  const handleAiAssign = async () => {
    setIsAiLoading(true);
    try {
      const pPayload = participants.map(p => ({ id: p.id || p, name: p.name || 'User', role: p.role || 'Member' }));
      const res = await fetch('/api/breakout', {
        method: 'POST',
        body: JSON.stringify({
          action: 'ai-assign',
          payload: { participants: pPayload, numRooms }
        })
      });
      const data = await res.json();
      
      if (data.groups) {
        const newGroups = data.groups.map((g: any, i: number) => ({
          id: g.roomId || `room_${i + 1}`,
          name: `AI Group ${i + 1}`,
          reasoning: g.reasoning,
          participants: g.participants.map((pid: string) => participants.find(p => p.id === pid || p === pid)).filter(Boolean)
        }));
        setGroups(newGroups);
        setStep('adjusting');
      }
    } catch (e) {
      console.error(e);
      handleAutoAssign();
    } finally {
      setIsAiLoading(false);
    }
  };

  const launchBreakout = () => {
    socket?.emit('breakout-start', {
      mainRoomId: roomId,
      groups,
      duration: activeDuration * 60,
      goal
    });
    setStep('active');
    setTimeRemaining(activeDuration * 60);
  };

  const endBreakout = () => {
    socket?.emit('breakout-end', { mainRoomId: roomId });
    setStep('setup');
    setTimeRemaining(null);
  };

  const sendBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    socket?.emit('breakout-broadcast', { mainRoomId: roomId, message: broadcastMessage });
    setBroadcastMessage('');
  };

  const moveParticipant = (pId: string, fromGroupIdx: number, toGroupIdx: number) => {
    const newGroups = [...groups];
    const pIdx = newGroups[fromGroupIdx].participants.findIndex((p: any) => p.id === pId || p === pId);
    if (pIdx > -1) {
      const [p] = newGroups[fromGroupIdx].participants.splice(pIdx, 1);
      newGroups[toGroupIdx].participants.push(p);
      setGroups(newGroups);
    }
  };

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining(prev => prev! - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!isHost) {
    return (
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl text-white font-semibold">Host is organizing Breakout Rooms...</h2>
        <p className="text-white/50 text-sm mt-2">You will be teleported shortly.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex items-center space-x-3">
          <LayoutGrid className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Breakout Rooms</h2>
        </div>
        <button onClick={onClose} className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex-1 max-h-[60vh] overflow-y-auto scrollbar-hide">
        {step === 'setup' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Number of Rooms</label>
                <input type="number" min={2} max={10} value={numRooms} onChange={e => setNumRooms(parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Duration (minutes)</label>
                <input type="number" min={1} max={60} value={activeDuration} onChange={e => setActiveDuration(parseInt(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Room Goal (For AI Moderator)</label>
              <textarea placeholder="e.g. Brainstorm Q3 priorities and output 3 action items..." value={goal} onChange={e => setGoal(e.target.value)} rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500/50 transition-colors resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <button onClick={handleAutoAssign} className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all group">
                <Shuffle className="w-6 h-6 text-white/60 group-hover:text-white mb-2" />
                <span className="text-sm font-medium text-white">Random Assign</span>
              </button>
              <button onClick={handleAiAssign} disabled={isAiLoading} className="flex flex-col items-center justify-center p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all group relative overflow-hidden">
                {isAiLoading ? (
                  <Bot className="w-6 h-6 text-indigo-400 mb-2 animate-bounce" />
                ) : (
                  <Sparkles className="w-6 h-6 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm font-medium text-indigo-100">{isAiLoading ? 'Analyzing expertise...' : 'AI Smart Assign'}</span>
              </button>
            </div>
          </div>
        )}

        {step === 'adjusting' && (
          <div className="space-y-4">
            <div className="text-sm text-indigo-200 bg-indigo-500/20 border border-indigo-500/30 p-4 rounded-xl mb-6 flex items-start space-x-3 shadow-lg shadow-indigo-500/10">
              <Bot className="w-5 h-5 shrink-0 mt-0.5 text-indigo-400" />
              <p className="leading-relaxed">Claude mapped these groups by optimizing for diverse skillsets and roles. Adjust them manually below if needed.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((g, i) => (
                <div key={g.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex flex-col shadow-inner">
                  <div className="flex flex-col mb-3 pb-3 border-b border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white">{g.name}</h3>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">{g.participants.length} Users</span>
                    </div>
                    {g.reasoning !== 'Randomly assigned' && (
                      <p className="text-[11px] text-emerald-400/80 leading-snug">
                        "{g.reasoning}"
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2 flex-1">
                    {g.participants.length === 0 && <p className="text-xs text-white/30 italic text-center py-4">Empty Room</p>}
                    {g.participants.map((p: any) => (
                       <div key={p.id || p} className="flex items-center justify-between bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors group">
                          <span className="text-sm text-white/80 font-medium truncate pr-2">{p.name || p}</span>
                          <select 
                            className="bg-transparent border border-white/20 rounded px-2 py-1 text-xs text-white/60 outline-none focus:border-indigo-500/50 appearance-none opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            value={i}
                            onChange={(e) => moveParticipant(p.id || p, i, parseInt(e.target.value))}
                          >
                            {groups.map((_, idx) => <option key={idx} value={idx} className="bg-zinc-800">Move to Room {idx + 1}</option>)}
                          </select>
                       </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'active' && (
          <div className="space-y-8 flex flex-col items-center py-6">
            <div className="relative group cursor-pointer">
              <div className="w-40 h-40 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin absolute inset-0"></div>
              <div className="w-40 h-40 rounded-full bg-indigo-500/10 flex items-center justify-center flex-col relative z-10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                <Clock className="w-6 h-6 text-indigo-400 mb-2" />
                <span className="text-4xl font-mono font-bold text-white tracking-wider">{timeRemaining ? formatTime(timeRemaining) : '0:00'}</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-white flex items-center justify-center"><Bot className="w-5 h-5 mr-2 text-indigo-400"/> AI Moderators Active</h3>
              <p className="text-white/50 text-sm max-w-sm">
                Each room is being monitored. Summaries will generate automatically upon return.
              </p>
            </div>

            <div className="w-full pt-6 border-t border-white/10 space-y-5">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold uppercase text-white/40 tracking-wider">Host Broadcast</label>
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                    placeholder="Message all breakout rooms..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 text-sm transition-colors"
                  />
                  <button onClick={sendBroadcast} className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all flex items-center"><Radio className="w-4 h-4 mr-2"/> Send</button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold uppercase text-white/40 tracking-wider">Float Between Rooms</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {groups.map((g, i) => (
                    <button key={g.id} className="flex flex-col items-start p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-left">
                      <span className="text-sm font-semibold text-white mb-1">{g.name}</span>
                      <span className="text-xs text-emerald-400 flex items-center"><Users className="w-3 h-3 mr-1"/> {g.participants.length} Active</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end space-x-3">
        {step === 'setup' && (
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold">Cancel</button>
        )}
        {step === 'adjusting' && (
          <>
            <button onClick={() => setStep('setup')} className="px-5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold">Back</button>
            <button onClick={launchBreakout} className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all text-sm font-semibold flex items-center space-x-2">
              <Play className="w-4 h-4" fill="currentColor" />
              <span>Launch Breakout Rooms</span>
            </button>
          </>
        )}
        {step === 'active' && (
          <button onClick={endBreakout} className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all text-sm font-semibold flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Force Close Rooms</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
