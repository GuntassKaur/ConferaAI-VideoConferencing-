import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Calendar, Clock, LayoutDashboard, 
  Plus, Settings, Users, Video, Search, Bell, Sparkles, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  const mockMeetings = [
    { 
      id: 'dev-sync', 
      title: 'Global Engineering Sync', 
      time: '10:00 AM', 
      duration: '45m', 
      participants: 12, 
      color: 'from-accent/30 to-purple-600/30', 
      tag: 'Critical' 
    },
    { 
      id: 'design-review', 
      title: 'Neural UI Architecture', 
      time: '02:00 PM', 
      duration: '1h 30m', 
      participants: 4, 
      color: 'from-cyan-400/30 to-blue-600/30', 
      tag: 'Review' 
    },
    { 
      id: 'product-roadmap', 
      title: 'Investor Pitch Prep Q3', 
      time: 'Tomorrow, 11:30 AM', 
      duration: '1h', 
      participants: 8, 
      color: 'from-emerald-400/30 to-teal-600/30', 
      tag: 'Upcoming' 
    }
  ];

  const createMeeting = () => {
    const id = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${id}`);
  };

  return (
    <div className="flex bg-[#020205] min-h-screen text-white/90 selection:bg-accent/40 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 opacity-5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35%] h-[35%] bg-accent opacity-5 blur-[100px] rounded-full" />

      {/* Sidebar */}
      <aside className="w-80 glass h-screen sticky top-0 flex flex-col border-r border-white/5 z-20 backdrop-blur-3xl">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-purple-600 rounded-2xl flex items-center justify-center rotate-12 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Video className="text-white -rotate-12" size={24} />
          </div>
          <span className="text-3xl font-black tracking-tighter text-white">CONFERA <span className="text-accent text-glow font-extrabold uppercase text-sm tracking-[0.3em] ml-1">AI</span></span>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          <NavItem icon={<LayoutDashboard size={20} />} label="Command Center" active />
          <NavItem icon={<Calendar size={20} />} label="Neural Schedule" />
          <NavItem icon={<BarChart3 size={20} />} label="AI Logs" />
          <NavItem icon={<Users size={20} />} label="Sync Group" />
          <div className="h-px bg-white/5 my-10 mx-6" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-8">
          <div className="glass-card bg-accent/5 border-accent/30 p-6 rounded-[2rem] relative overflow-hidden group">
             <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent opacity-20 blur-2xl group-hover:scale-150 transition-all duration-700" />
             <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/40">
                 <Sparkles size={20} className="text-accent" />
               </div>
               <span className="font-black text-xs uppercase tracking-widest text-accent-light">Neural Pro</span>
             </div>
             <p className="text-[11px] text-white/40 leading-relaxed font-bold mb-6 italic">Unlocking advanced transcription with 4K Neural Feed.</p>
             <button className="w-full py-3 bg-accent hover:bg-accent-light text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">Boost Link</button>
          </div>
        </div>
      </aside>

      {/* Main Command Center */}
      <main className="flex-1 p-16 px-24 overflow-y-auto max-w-7xl mx-auto z-10">
        <header className="flex items-center justify-between mb-20">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
           >
             <h1 className="text-6xl font-black tracking-tighter mb-4">System <span className="text-neon"> Sarah </span></h1>
             <div className="flex items-center gap-2 text-white/40 font-bold uppercase text-[10px] tracking-widest">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                Network Latency: 12ms · Neural Feed Active
             </div>
           </motion.div>
           
           <div className="flex items-center gap-6">
             <div className="relative group">
                <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-all" />
                <input type="text" placeholder="Scan modules..." className="bg-white/[0.03] border border-white/5 rounded-2xl px-14 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/40 w-80 shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all" />
             </div>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               className="w-14 h-14 glass border-white/10 rounded-2xl flex items-center justify-center relative shadow-[0_0_20px_rgba(0,0,0,0.5)] group"
             >
                <Bell size={24} className="text-white/40 group-hover:text-white transition-colors" />
                <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#020205] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
             </motion.button>
             <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-purple-600 p-px shadow-xl">
                <div className="w-full h-full bg-[#020205] rounded-[15px] flex items-center justify-center font-black text-sm text-accent-light uppercase tracking-tighter">SK</div>
             </div>
           </div>
        </header>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 font-bold">
           <motion.button 
             whileHover={{ scale: 1.02, y: -5 }}
             onClick={createMeeting}
             className="glass-card bg-gradient-to-br from-accent to-purple-800 border-accent/40 shadow-[0_20px_60px_-15px_rgba(99,102,241,0.5)] group flex items-center gap-10 p-12 text-left"
           >
             <div className="w-20 h-20 bg-white/20 rounded-[1.8rem] flex items-center justify-center shadow-2xl backdrop-blur-3xl group-hover:scale-110 transition-all duration-500 border border-white/30">
                <Plus size={42} className="text-white" />
             </div>
             <div>
               <h3 className="text-3xl font-black text-white mb-2 leading-none uppercase tracking-tighter">Instant Link</h3>
               <p className="text-white/70 text-lg font-medium tracking-tight">Generate a new neural module</p>
             </div>
           </motion.button>
           
           <motion.button 
             whileHover={{ scale: 1.02, y: -5 }}
             className="glass-card border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] group flex items-center gap-10 p-12 text-left bg-white/[0.01]"
           >
             <div className="w-20 h-20 bg-white/5 rounded-[1.8rem] flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all duration-500">
                <Calendar size={42} className="text-white/30 group-hover:text-white transition-all duration-500" />
             </div>
             <div>
               <h3 className="text-3xl font-black text-white/50 group-hover:text-white transition-all duration-500 mb-2 leading-none uppercase tracking-tighter">Schedule Sync</h3>
               <p className="text-white/30 group-hover:text-white/60 transition-all duration-500 text-lg font-medium tracking-tight">Plan future system operations</p>
             </div>
           </motion.button>
        </div>

        {/* Meeting Feed */}
        <div className="space-y-10">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-[0.3em] text-white/30">Neural Modules <span className="text-accent underline decoration-accent/20 decoration-4 ml-4">Scheduled</span></h2>
              <button className="flex items-center gap-2 text-accent-light text-sm font-black uppercase tracking-widest hover:text-white transition-all hover:scale-110">
                Full Log <Zap size={16} />
              </button>
           </div>
           
           <div className="grid gap-6">
              {mockMeetings.map((meeting, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={meeting.id} 
                  className="group"
                >
                  <div className="glass-card border-white/5 hover:border-accent/30 group-hover:bg-accent/[0.02] flex items-center justify-between p-10 transition-all duration-500 relative overflow-hidden">
                     {/* Background Gradient */}
                     <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${meeting.color}`} />
                     
                     <div className="flex items-center gap-10">
                        <div className={`w-18 h-18 rounded-[1.5rem] flex items-center justify-center border border-white/5 bg-white/[0.01] shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                           <Clock size={32} className="text-white/40 group-hover:text-accent transition-colors" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                             <h4 className="font-black text-3xl tracking-tighter group-hover:text-neon transition-all">{meeting.title}</h4>
                             <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 glass`}>{meeting.tag}</span>
                          </div>
                          <div className="flex items-center gap-8 text-sm text-white/40 font-bold uppercase tracking-widest">
                             <span className="flex items-center gap-2 group-hover:text-white transition-colors"><Clock size={16} /> {meeting.time} </span>
                             <span className="flex items-center gap-2 group-hover:text-white transition-colors"><Users size={16} /> {meeting.participants} Participants</span>
                          </div>
                        </div>
                     </div>
                     <button 
                       onClick={() => navigate(`/room/${meeting.id}`)}
                       className="px-10 py-5 glass border-white/10 hover:bg-accent hover:border-accent/50 text-base font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)]"
                     >
                       Join Neural Link
                     </button>
                  </div>
                </motion.div>
              ))}
           </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-6 px-6 py-5 rounded-2xl transition-all group relative overflow-hidden ${active ? '' : 'hover:bg-white/[0.03]'}`}>
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent border-l-4 border-accent"
      />
    )}
    <div className={`transition-all duration-500 ${active ? 'scale-125 text-accent' : 'text-white/20 group-hover:text-white group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className={`text-[13px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${active ? 'text-white' : 'text-white/30 group-hover:text-white'}`}>{label}</span>
  </button>
);

export default Dashboard;
