"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, Calendar as CalendarIcon, Settings as SettingsIcon, PieChart, 
  Bell, Search, Plus, Clock, FileText, ArrowRight, Play, 
  MoreHorizontal, Users, Sparkles, Filter, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { SettingsSheet } from '@/components/SettingsSheet';

// MOCK DATA
const RECENT_MEETINGS = [
  { id: '1', title: 'Q3 Strategic Planning', date: 'Today, 10:00 AM', duration: '45m', participants: ['SJ', 'DC', 'ER'], recapStatus: 'ready' },
  { id: '2', title: 'Engineering Sync', date: 'Yesterday, 2:00 PM', duration: '60m', participants: ['DC', 'AK', 'MS', 'LJ'], recapStatus: 'ready' },
  { id: '3', title: 'Design Review', date: 'Mon, 11:30 AM', duration: '30m', participants: ['ER', 'GK'], recapStatus: 'processing' },
  { id: '4', title: 'Client Onboarding', date: 'Last Fri, 9:00 AM', duration: '45m', participants: ['JS', 'KL'], recapStatus: 'ready' }
];

const NOTIFICATIONS = [
  { id: 1, type: 'recap', text: "Your recap for 'Q3 Planning' is ready", time: '2h ago' },
  { id: 2, type: 'action', text: "Action item due: Send proposal (assigned 3 days ago)", time: '5h ago' },
];

const TALK_TIME_DATA = [
  { name: 'You', value: 35 },
  { name: 'Sarah', value: 45 },
  { name: 'David', value: 20 },
];
const COLORS = ['#818cf8', '#c084fc', '#34d399'];

const WEEKLY_MEETINGS_DATA = [
  { week: 'W1', meetings: 12 }, { week: 'W2', meetings: 15 },
  { week: 'W3', meetings: 10 }, { week: 'W4', meetings: 18 },
  { week: 'W5', meetings: 14 }, { week: 'W6', meetings: 22 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'home' | 'analytics'>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleStartInstant = async () => {
    const res = await fetch('/api/rooms/create', { method: 'POST' });
    const data = await res.json();
    if (data.roomId) {
      router.push(`/room/${data.roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex overflow-hidden font-sans relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none z-0" />
      
      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/5 bg-white/[0.02] backdrop-blur-3xl flex flex-col relative z-10">
        <div className="p-6 flex items-center space-x-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
            <Video className="w-5 h-5 text-indigo-400" />
          </div>
          <span className="font-bold text-lg tracking-tight">Confera<span className="text-indigo-400">AI</span></span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveTab('home')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'home' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <Video className="w-4 h-4 mr-3" /> Home
          </button>
          <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'analytics' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <PieChart className="w-4 h-4 mr-3" /> Analytics
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className={`w-full flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${isSettingsOpen ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            <SettingsIcon className="w-4 h-4 mr-3" /> Settings
          </button>
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">GK</div>
            <div>
              <p className="text-sm font-semibold">Guntass Kaur</p>
              <p className="text-[10px] text-white/50">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-20 px-10 flex items-center justify-between border-b border-white/5 bg-white/[0.01] backdrop-blur-md sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search past meetings, decisions, or action items..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notification Dropdown Trigger */}
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <Bell className="w-4 h-4 text-white/70 group-hover:text-white" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              
              <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none group-hover:pointer-events-auto">
                <div className="p-4 border-b border-white/10 font-medium">Notifications</div>
                <div className="p-2">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className="p-3 hover:bg-white/5 rounded-xl cursor-pointer transition-colors flex items-start space-x-3">
                      {n.type === 'recap' ? <FileText className="w-4 h-4 text-indigo-400 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5" />}
                      <div>
                        <p className="text-sm text-white/90">{n.text}</p>
                        <p className="text-[10px] text-white/40 mt-1">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
              Feedback
            </button>
          </div>
        </header>

        {/* TAB CONTENTS */}
        <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
          <AnimatePresence mode="wait">
            
            {/* HOME TAB */}
            {activeTab === 'home' && (
              <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                
                {/* HERO SECTION */}
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">{getGreeting()}, Guntass.</h1>
                    <p className="text-indigo-300 font-medium flex items-center text-lg">
                      <Clock className="w-5 h-5 mr-2" /> Next meeting in <span className="font-bold text-white ml-2">14 mins</span>
                    </p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold flex items-center hover:bg-white/10 transition-all text-white/80 hover:text-white">
                      <CalendarIcon className="w-5 h-5 mr-3" /> Schedule Meeting
                    </button>
                    <button onClick={handleStartInstant} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold flex items-center transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] hover:-translate-y-0.5">
                      <Video className="w-5 h-5 mr-3" /> Start Instant Meeting
                    </button>
                  </div>
                </div>

                {/* TODAY TIMELINE */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white/90">Today's Schedule</h2>
                  <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="min-w-[300px] bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/[0.08] transition-colors cursor-pointer group relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                        <div className="flex justify-between items-start mb-4">
                          <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">10:00 AM</span>
                          <span className="text-xs text-white/50 font-medium flex items-center"><Clock className="w-3 h-3 mr-1" /> 45m</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Product Sync</h3>
                        <p className="text-sm text-white/50 mb-4">Discuss Q3 Roadmap and OKRs</p>
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#0a0a1a] flex items-center justify-center text-xs font-bold">SJ</div>
                            <div className="w-8 h-8 rounded-full bg-zinc-700 border-2 border-[#0a0a1a] flex items-center justify-center text-xs font-bold">DC</div>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 ml-0.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RECENT MEETINGS */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white/90">Recent Meetings</h2>
                    <div className="flex space-x-2">
                      <button className="text-xs px-3 py-1.5 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center"><Filter className="w-3 h-3 mr-1" /> This Week</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {RECENT_MEETINGS.map(m => (
                      <div key={m.id} className="bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 rounded-2xl p-5 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg text-white group-hover:text-indigo-300 transition-colors">{m.title}</h3>
                            <p className="text-sm text-white/40 mt-1">{m.date} • {m.duration}</p>
                          </div>
                          {m.recapStatus === 'ready' ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-semibold flex items-center">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Recap Ready
                            </div>
                          ) : (
                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-semibold flex items-center">
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Processing AI
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex -space-x-2">
                            {m.participants.map((p, i) => (
                              <div key={i} className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-[#0a0a1a] flex items-center justify-center text-xs font-bold text-white/80">{p}</div>
                            ))}
                          </div>
                          <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                            View Recap <ArrowRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS TAB */}
            {activeTab === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold tracking-tight">Your Meeting Health</h1>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">Last 30 Days</button>
                </div>

                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 flex items-start space-x-4">
                  <div className="p-3 bg-indigo-500/20 rounded-xl"><Sparkles className="w-6 h-6 text-indigo-400" /></div>
                  <div>
                    <h3 className="font-semibold text-lg text-indigo-100">AI Insight</h3>
                    <p className="text-indigo-300 mt-1">You've had 40% more meetings this month. Your talk time is heavily skewed in status updates. <strong className="text-white">Recommend:</strong> Move engineering syncs to async formats using Confera AI Video Notes.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Talk Time Chart */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 col-span-1 flex flex-col">
                    <h3 className="font-semibold text-white/80 mb-6 flex items-center"><PieChart className="w-4 h-4 mr-2" /> Talk Time Distribution</h3>
                    <div className="flex-1 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie
                          data={TALK_TIME_DATA}
                          cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                          paddingAngle={5} dataKey="value" stroke="none"
                        >
                          {TALK_TIME_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </RechartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                      {TALK_TIME_DATA.map((entry, idx) => (
                        <div key={idx} className="flex items-center text-xs text-white/60">
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: COLORS[idx] }} /> {entry.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meetings Trend Chart */}
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 col-span-2 flex flex-col">
                    <h3 className="font-semibold text-white/80 mb-6 flex items-center"><BarChart className="w-4 h-4 mr-2" /> Meetings per Week</h3>
                    <div className="flex-1 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={WEEKLY_MEETINGS_DATA}>
                          <defs>
                            <linearGradient id="colorMeetings" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="week" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="meetings" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorMeetings)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6">
                    <h3 className="font-semibold text-white/80 mb-2">Action Item Completion Rate</h3>
                    <div className="flex items-end space-x-3 mb-4">
                      <span className="text-4xl font-bold text-emerald-400">82%</span>
                      <span className="text-sm text-emerald-400/50 mb-1">+5% from last month</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full w-[82%]" />
                    </div>
                  </div>
                  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6">
                    <h3 className="font-semibold text-white/80 mb-4">Top Topics</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-lg text-sm border border-indigo-500/20">Q3 Roadmap (12)</span>
                      <span className="px-3 py-1.5 bg-white/5 text-white/70 rounded-lg text-sm border border-white/10">Pricing Strategy (8)</span>
                      <span className="px-3 py-1.5 bg-white/5 text-white/70 rounded-lg text-sm border border-white/10">Hiring (5)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <SettingsSheet isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
