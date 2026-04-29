import { useState, useEffect } from 'react';
import { useEngagementStore } from '@/store/useEngagementStore';
import { useTranscriptStore } from '@/store/useTranscriptStore';
import { Hand, BarChart3, Cloud, Smile, Bot, Plus, X, HandDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function EngagementSidebar({ onClose, socket, localParticipantId }: { onClose: () => void, socket: any, localParticipantId: string }) {
  const [activeTab, setActiveTab] = useState<'polls' | 'hands' | 'cloud' | 'mood'>('polls');
  
  const { polls, addPoll, votePoll, raisedHands, lowerHand, teamMood, submitMood, moodScores, wordCloud, updateWordCloud } = useEngagementStore();
  const { segments } = useTranscriptStore();

  const [pollPrompt, setPollPrompt] = useState('');
  const [isGeneratingPoll, setIsGeneratingPoll] = useState(false);
  const [moodValue, setMoodValue] = useState(50);

  // Auto-generate Word Cloud every 2 mins locally
  useEffect(() => {
    const interval = setInterval(() => {
      const text = segments.map(s => s.text).join(' ').toLowerCase();
      const words = text.split(/\W+/).filter(w => w.length > 4);
      const counts: Record<string, number> = {};
      words.forEach(w => counts[w] = (counts[w] || 0) + 1);
      
      const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([text, value]) => ({ text, value }));
      
      updateWordCloud(sorted);
    }, 120000); // 2 mins
    return () => clearInterval(interval);
  }, [segments, updateWordCloud]);

  const generateAIPoll = async () => {
    setIsGeneratingPoll(true);
    try {
      const recentContext = segments.slice(-20).map(s => s.text).join(' ');
      const res = await fetch('/api/engagement/poll', {
        method: 'POST',
        body: JSON.stringify({ transcriptContext: recentContext, prompt: pollPrompt })
      });
      const data = await res.json();
      
      if (data.question && data.options) {
        const newPoll = {
          id: Math.random().toString(36).substring(7),
          question: data.question,
          options: data.options.map((o: string) => ({ id: Math.random().toString(36).substring(7), text: o, votes: 0 })),
          active: true,
          votedBy: []
        };
        addPoll(newPoll);
        // Broadcast via socket
        socket?.emit('engagement-poll', newPoll);
      }
    } finally {
      setIsGeneratingPoll(false);
      setPollPrompt('');
    }
  };

  const handleVote = (pollId: string, optionId: string) => {
    votePoll(pollId, optionId, localParticipantId);
    socket?.emit('engagement-vote', { pollId, optionId, participantId: localParticipantId });
  };

  const handleMoodSubmit = () => {
    submitMood(moodValue);
    socket?.emit('engagement-mood', moodValue);
  };

  return (
    <motion.div 
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      className="absolute top-4 right-4 bottom-32 w-[350px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl flex flex-col shadow-2xl z-40 overflow-hidden"
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <h2 className="font-semibold text-white">Engagement Tools</h2>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button onClick={() => setActiveTab('polls')} className={`flex-1 p-3 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'polls' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:bg-white/5'}`}>
          <BarChart3 className="w-4 h-4 mr-2" /> Polls
        </button>
        <button onClick={() => setActiveTab('hands')} className={`flex-1 p-3 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'hands' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:bg-white/5'}`}>
          <Hand className="w-4 h-4 mr-2" /> Queue {raisedHands.length > 0 && `(${raisedHands.length})`}
        </button>
        <button onClick={() => setActiveTab('cloud')} className={`flex-1 p-3 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'cloud' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:bg-white/5'}`}>
          <Cloud className="w-4 h-4" />
        </button>
        <button onClick={() => setActiveTab('mood')} className={`flex-1 p-3 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'mood' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/10' : 'text-white/50 hover:bg-white/5'}`}>
          <Smile className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* POLLS TAB */}
        {activeTab === 'polls' && (
          <div className="space-y-6">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex flex-col space-y-3">
              <h3 className="text-sm font-semibold text-indigo-300 flex items-center"><Bot className="w-4 h-4 mr-2"/> Generate AI Poll</h3>
              <input 
                type="text" 
                placeholder="Topic (e.g. Q3 Pricing)..." 
                value={pollPrompt}
                onChange={e => setPollPrompt(e.target.value)}
                className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
              />
              <button 
                onClick={generateAIPoll}
                disabled={isGeneratingPoll}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {isGeneratingPoll ? 'Generating...' : 'Create Poll'}
              </button>
            </div>

            <div className="space-y-4">
              {polls.map(poll => {
                const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
                const hasVoted = poll.votedBy.includes(localParticipantId);
                
                return (
                  <div key={poll.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <h4 className="text-sm font-medium text-white mb-3 leading-snug">{poll.question}</h4>
                    <div className="space-y-2">
                      {poll.options.map(opt => {
                        const percent = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                        return (
                          <button 
                            key={opt.id}
                            disabled={hasVoted || !poll.active}
                            onClick={() => handleVote(poll.id, opt.id)}
                            className={`w-full relative overflow-hidden rounded-xl border text-left p-2.5 transition-all
                              ${hasVoted ? 'border-white/10 bg-black/40' : 'border-white/20 hover:border-indigo-500 hover:bg-white/10 bg-transparent'}
                            `}
                          >
                            <div 
                              className="absolute left-0 top-0 bottom-0 bg-indigo-500/20 transition-all duration-1000" 
                              style={{ width: `${hasVoted ? percent : 0}%` }}
                            />
                            <div className="relative z-10 flex justify-between items-center">
                              <span className="text-sm text-white/90">{opt.text}</span>
                              {hasVoted && <span className="text-xs font-semibold text-indigo-300">{percent}%</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-3 text-xs text-white/40 flex justify-between">
                      <span>{totalVotes} votes</span>
                      {!poll.active && <span className="text-red-400">Closed</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* HANDS TAB */}
        {activeTab === 'hands' && (
          <div className="space-y-4">
            {raisedHands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/40">
                <Hand className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">No hands raised</p>
              </div>
            ) : (
              raisedHands.map((h, i) => (
                <div key={h.participantId} className="flex items-center justify-between bg-white/5 border border-white/10 p-3 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">{i + 1}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{h.name}</p>
                      <p className="text-[10px] text-white/40">{new Date(h.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <button onClick={() => lowerHand(h.participantId)} className="p-2 text-white/40 hover:text-red-400 transition-colors">
                    <Hand className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* WORD CLOUD TAB */}
        {activeTab === 'cloud' && (
          <div className="flex flex-col h-full space-y-4">
            <p className="text-xs text-white/50 text-center">Auto-updates every 2 minutes</p>
            <div className="flex-1 min-h-[250px] flex flex-wrap content-center justify-center gap-2 p-2">
              {wordCloud.length === 0 ? (
                <p className="text-sm text-white/40">Gathering meeting context...</p>
              ) : (
                wordCloud.map((w, i) => (
                  <motion.span 
                    key={w.text}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-block text-indigo-400 font-medium px-2 py-1 bg-indigo-500/10 rounded-lg cursor-pointer hover:bg-indigo-500/20 transition-colors"
                    style={{ fontSize: `${Math.max(12, Math.min(24, 10 + (w.value * 2)))}px`, opacity: Math.max(0.4, 1 - (i * 0.05)) }}
                  >
                    {w.text}
                  </motion.span>
                ))
              )}
            </div>
          </div>
        )}

        {/* MOOD TAB */}
        {activeTab === 'mood' && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col items-center space-y-4 text-center">
              <h3 className="font-medium text-white">How is the pacing?</h3>
              
              <div className="flex w-full items-center justify-between text-2xl">
                <span>😔</span>
                <input 
                  type="range" min="0" max="100" 
                  value={moodValue} onChange={e => setMoodValue(parseInt(e.target.value))}
                  className="mx-4 flex-1 accent-emerald-500"
                />
                <span>😊</span>
              </div>
              
              <button onClick={handleMoodSubmit} className="w-full py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-xl text-sm font-semibold transition-colors">
                Submit Pulse Check
              </button>
            </div>

            {teamMood !== null && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl flex flex-col items-center space-y-2">
                <h3 className="text-xs uppercase text-emerald-400/80 font-bold tracking-wider">Team Energy Score</h3>
                <span className="text-4xl font-black text-emerald-400">{Math.round(teamMood)}/100</span>
                <p className="text-xs text-emerald-400/60 mt-2 text-center">
                  {teamMood > 70 ? 'Great energy! Keep pushing.' : teamMood > 40 ? 'Moderate pacing. Everyone is steady.' : 'Energy dropped — consider taking a 5 min break!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
