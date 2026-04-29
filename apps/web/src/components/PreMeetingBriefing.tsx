import { useState, useEffect } from 'react';
import { Bot, Calendar, FileText, CheckCircle2, Clock, Users, Play, Link as LinkIcon, Briefcase, ChevronRight, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreMeetingBriefingProps {
  roomId: string;
  onJoin: () => void;
}

export function PreMeetingBriefing({ roomId, onJoin }: PreMeetingBriefingProps) {
  const [meetingTitle, setMeetingTitle] = useState('Q3 Product Roadmap Sync');
  const [duration, setDuration] = useState(30);
  const [goals, setGoals] = useState(['Finalize Q3 Budget', 'Assign Feature Leads']);
  const [newGoal, setNewGoal] = useState('');
  
  const [agenda, setAgenda] = useState<any[]>([]);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAgendaLoading, setIsAgendaLoading] = useState(false);

  // Mocked Participants pulled from calendar
  const participants = [
    { id: '1', name: 'Sarah Jenkins', role: 'Director of Product', interaction: 'Met 2 weeks ago regarding Q2 metrics' },
    { id: '2', name: 'David Chen', role: 'Lead Engineer', interaction: 'Commented on your doc yesterday' },
    { id: '3', name: 'Elena Rodriguez', role: 'UX Researcher', interaction: 'First meeting together' }
  ];

  // Auto-generate briefing on load
  useEffect(() => {
    const fetchBriefing = async () => {
      setIsGenerating(true);
      try {
        const res = await fetch('/api/briefing/generate', {
          method: 'POST',
          body: JSON.stringify({
            action: 'generate_briefing',
            payload: { title: meetingTitle, participants, goals }
          })
        });
        const data = await res.json();
        if (data.briefing) setBriefing(data.briefing);
      } catch (e) {
        console.error(e);
      } finally {
        setIsGenerating(false);
      }
    };
    fetchBriefing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateAgenda = async () => {
    setIsAgendaLoading(true);
    try {
      const res = await fetch('/api/briefing/generate', {
        method: 'POST',
        body: JSON.stringify({
          action: 'generate_agenda',
          payload: { title: meetingTitle, durationMin: duration }
        })
      });
      const data = await res.json();
      if (data.agenda) setAgenda(data.agenda);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAgendaLoading(false);
    }
  };

  const addGoal = () => {
    if (newGoal.trim() && goals.length < 3) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const formatBriefing = (text: string) => {
    // Simple markdown to HTML for bullets and bold
    return text.split('\n').map((line, i) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300">$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em class="text-white/80">$1</em>');
      return (
        <p key={i} className="mb-2 flex items-start" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Left Column: Greeting & Participants */}
        <div className="col-span-1 lg:col-span-4 flex flex-col space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Good morning, Guntass! 👋</h1>
            <p className="text-indigo-300 flex items-center font-medium">
              <Clock className="w-4 h-4 mr-2" /> You have a meeting in 5 minutes
            </p>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center"><Users className="w-4 h-4 mr-2 text-indigo-400" /> Attendees (3)</h2>
              <button className="text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-500/20 transition-colors">Sync Calendar</button>
            </div>
            
            <div className="space-y-3">
              {participants.map(p => (
                <div key={p.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col group hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white">{p.name}</span>
                    <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded uppercase font-bold tracking-wider">{p.role}</span>
                  </div>
                  <div className="text-xs text-white/50 flex items-start leading-relaxed">
                    <Briefcase className="w-3.5 h-3.5 mr-1.5 shrink-0 mt-0.5" />
                    <span>{p.interaction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center"><FileText className="w-4 h-4 mr-2 text-indigo-400" /> Relevant Docs</h2>
            <div className="flex items-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl cursor-pointer hover:bg-blue-500/20 transition-colors">
              <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center mr-3"><FileText className="w-4 h-4 text-blue-400" /></div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Q3 Marketing Deck.pdf</p>
                <p className="text-xs text-white/50">Modified 2 hrs ago by Sarah</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Intelligence & Prep */}
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6">
          
          {/* AI Briefing Card */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-black/40 backdrop-blur-3xl border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-20">
              <Bot className="w-32 h-32 text-indigo-400" />
            </div>
            
            <h2 className="text-lg font-bold text-indigo-300 mb-6 flex items-center">
              <Bot className="w-5 h-5 mr-2" /> Claude's Meeting Briefing
            </h2>
            
            <div className="relative z-10 text-white/90 text-[15px] leading-relaxed space-y-4">
              {isGenerating ? (
                <div className="animate-pulse flex flex-col space-y-3">
                  <div className="h-4 bg-indigo-500/20 rounded w-3/4"></div>
                  <div className="h-4 bg-indigo-500/20 rounded w-5/6"></div>
                  <div className="h-4 bg-indigo-500/20 rounded w-2/3"></div>
                </div>
              ) : briefing ? (
                formatBriefing(briefing)
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Agenda Builder */}
            <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center"><Calendar className="w-4 h-4 mr-2 text-indigo-400" /> Smart Agenda</h2>
                <button 
                  onClick={generateAgenda}
                  disabled={isAgendaLoading}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isAgendaLoading ? 'Generating...' : 'Auto-Build'}
                </button>
              </div>

              {agenda.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-white/40 space-y-3">
                  <Calendar className="w-10 h-10 opacity-20" />
                  <p className="text-sm px-4">Click Auto-Build to let Claude generate a time-boxed agenda from your title.</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                  {agenda.map((item, idx) => (
                    <div key={item.id} className="flex items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                      <div className="w-8 h-8 rounded bg-black/50 border border-white/10 flex items-center justify-center text-white/60 font-mono text-xs mr-3">{idx + 1}</div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{item.title}</p>
                      </div>
                      <div className="text-xs text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded font-medium">{item.duration}m</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meeting Goals */}
            <div className="bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col">
              <div className="mb-6">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-indigo-400" /> Meeting Goals</h2>
                <p className="text-xs text-white/50 mt-1">AI will track progress toward these in real-time.</p>
              </div>

              <div className="space-y-3 flex-1">
                {goals.map((goal, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-sm text-emerald-100 font-medium">{goal}</span>
                  </div>
                ))}
                
                {goals.length < 3 && (
                  <div className="flex items-center mt-2">
                    <input 
                      type="text"
                      value={newGoal}
                      onChange={e => setNewGoal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addGoal()}
                      placeholder="Add a goal..."
                      className="flex-1 bg-transparent border-b border-white/20 px-2 py-2 text-sm text-white outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button onClick={addGoal} className="ml-2 p-1.5 text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end pt-4 space-x-4">
            <button className="flex items-center text-sm text-white/60 hover:text-white transition-colors">
              <Settings className="w-4 h-4 mr-2" /> A/V Settings
            </button>
            <button 
              onClick={onJoin}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-colors flex items-center shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 duration-300"
            >
              Join Meeting Now <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
