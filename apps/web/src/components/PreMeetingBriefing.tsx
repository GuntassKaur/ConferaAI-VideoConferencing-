import { useState, useEffect } from 'react';
import { Bot, Calendar, FileText, CheckCircle2, Clock, Users, ChevronRight, Plus, Settings, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreMeetingBriefingProps {
  roomId: string;
  onJoin: () => void;
}

export function PreMeetingBriefing({ roomId, onJoin }: PreMeetingBriefingProps) {
  const [meetingTitle, setMeetingTitle] = useState('New Strategic Sync');
  const [duration, setDuration] = useState(30);
  const [goals, setGoals] = useState(['Define Objectives', 'Establish Timeline']);
  const [newGoal, setNewGoal] = useState('');
  
  const [agenda, setAgenda] = useState<any[]>([]);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAgendaLoading, setIsAgendaLoading] = useState(false);

  // Participants will be loaded from the session registry
  const participants: any[] = [];

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
    return text.split('\n').map((line, i) => {
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-400">$1</strong>')
                              .replace(/\*(.*?)\*/g, '<em class="text-[#9CA3AF]">$1</em>');
      return (
        <p key={i} className="mb-2 flex items-start leading-relaxed text-sm text-[#F9FAFB]/80" dangerouslySetInnerHTML={{ __html: formattedLine }} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 font-sans relative overflow-hidden text-[#F9FAFB]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-500/5 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left Column: Greeting & Context */}
        <div className="col-span-1 lg:col-span-4 flex flex-col space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Ready to sync? 👋</h1>
            <p className="text-[#9CA3AF] flex items-center text-sm font-medium">
              <Clock className="w-4 h-4 mr-2 text-indigo-400" /> Session ID: {roomId}
            </p>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-2xl">
            <h2 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center mb-6">
              <Users className="w-4 h-4 mr-2 text-indigo-400" /> Live Registry
            </h2>
            
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
               <div className="w-12 h-12 rounded-full bg-[#1F2937] flex items-center justify-center text-[#9CA3AF]">
                  <Users className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm font-bold">Waiting for attendees</p>
                 <p className="text-[11px] text-[#9CA3AF]">Share your link to invite team members</p>
               </div>
               <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-lg hover:bg-indigo-500/20 transition-all">
                 Copy Invite Link
               </button>
            </div>
          </div>

          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 shadow-2xl flex flex-col space-y-4">
            <h2 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center">
               <FileText className="w-4 h-4 mr-2 text-indigo-400" /> Assets & Context
            </h2>
            <div className="flex items-center p-4 bg-[#1F2937]/50 border border-[#1F2937] rounded-xl cursor-not-allowed opacity-50">
              <div className="w-8 h-8 rounded bg-[#1F2937] flex items-center justify-center mr-3">
                <FileText className="w-4 h-4 text-[#9CA3AF]" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#F9FAFB] font-bold tracking-tight">No documents linked</p>
                <p className="text-[10px] text-[#9CA3AF]">Sync calendar for context</p>
              </div>
            </div>
          </div>
        </div>

        {/* Middle/Right Column: Intelligence & Prep */}
        <div className="col-span-1 lg:col-span-8 flex flex-col space-y-6">
          
          {/* AI Briefing Card */}
          <div className="bg-gradient-to-br from-[#111827] to-[#0B1120] border border-[#1F2937] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
              <Bot className="w-40 h-40 text-indigo-400" />
            </div>
            
            <h2 className="text-xs font-bold text-indigo-400 mb-8 flex items-center uppercase tracking-[0.2em]">
              <Sparkles size={16} className="mr-2" /> Session Intelligence
            </h2>
            
            <div className="relative z-10 space-y-6">
              {isGenerating ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-2 bg-[#1F2937] rounded-full w-3/4"></div>
                  <div className="h-2 bg-[#1F2937] rounded-full w-5/6"></div>
                  <div className="h-2 bg-[#1F2937] rounded-full w-2/3"></div>
                </div>
              ) : briefing ? (
                <div className="bg-[#0B1120]/50 border border-[#1F2937] rounded-2xl p-6">
                  {formatBriefing(briefing)}
                </div>
              ) : (
                <div className="py-4 text-center">
                   <p className="text-[#9CA3AF] text-sm">Preparing intelligence briefing...</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Agenda Builder */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-400" /> Smart Agenda
                </h2>
                <button 
                  onClick={generateAgenda}
                  disabled={isAgendaLoading}
                  className="text-[10px] font-bold uppercase tracking-widest bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-indigo-500/10"
                >
                  {isAgendaLoading ? 'Thinking...' : 'Auto-Build'}
                </button>
              </div>

              {agenda.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-40">
                  <Calendar className="w-12 h-12 mb-4" />
                  <p className="text-xs px-4 font-medium">Build a time-boxed agenda automatically</p>
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {agenda.map((item, idx) => (
                    <div key={item.id} className="flex items-center bg-[#0B1120]/50 border border-[#1F2937] p-4 rounded-2xl hover:border-indigo-500/20 transition-all group">
                      <div className="w-8 h-8 rounded-lg bg-[#1F2937] flex items-center justify-center text-[#9CA3AF] font-bold text-[10px] mr-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors">{idx + 1}</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold tracking-tight">{item.title}</p>
                      </div>
                      <div className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg">{item.duration}m</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Meeting Goals */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 shadow-2xl flex flex-col">
              <div className="mb-8">
                <h2 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-indigo-400" /> Key Objectives
                </h2>
                <p className="text-[10px] text-[#9CA3AF] mt-1 uppercase tracking-widest font-bold opacity-50">AI Tracks progress live</p>
              </div>

              <div className="space-y-3 flex-1">
                {goals.map((goal, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl group hover:border-emerald-500/30 transition-all">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-[#F9FAFB] font-bold tracking-tight">{goal}</span>
                  </div>
                ))}
                
                {goals.length < 3 && (
                  <div className="flex items-center mt-4">
                    <input 
                      type="text"
                      value={newGoal}
                      onChange={e => setNewGoal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addGoal()}
                      placeholder="Add a goal..."
                      className="flex-1 bg-[#0B1120]/50 border border-[#1F2937] rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500/50 transition-all"
                    />
                    <button onClick={addGoal} className="ml-2 p-3 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end pt-8 space-x-6">
            <button className="flex items-center text-xs font-bold text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors uppercase tracking-widest group">
              <Settings className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" /> A/V Settings
            </button>
            <button 
              onClick={onJoin}
              className="bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all flex items-center shadow-2xl shadow-indigo-500/20 active:scale-95 group"
            >
              Enter Room <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
