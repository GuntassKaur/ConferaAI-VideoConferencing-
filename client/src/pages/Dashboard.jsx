import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Calendar, Clock, LayoutDashboard, 
  Plus, Settings, Users, Video, Search, Bell
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();

  const mockMeetings = [
    { id: 'dev-sync', title: 'Daily Engineering Sync', time: '10:00 AM', duration: '45m', participants: 8, color: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30' },
    { id: 'design-review', title: 'System Architecture Review', time: '02:00 PM', duration: '1h 30m', participants: 4, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { id: 'product-roadmap', title: 'Q3 Product Roadmap Planning', time: 'Tomorrow, 11:30 AM', duration: '1h', participants: 12, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
  ];

  const createMeeting = () => {
    const id = Math.random().toString(36).substring(2, 10);
    navigate(`/room/${id}`);
  };

  return (
    <div className="flex bg-[#030303] min-h-screen text-white/90 selection:bg-accent/40 selection:text-white">
      {/* Sidebar */}
      <div className="w-72 glass h-screen sticky top-0 flex flex-col border-r border-white/5 z-20">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center rotate-12 shadow-lg shadow-accent/40">
            <Video className="text-white -rotate-12" size={20} />
          </div>
          <span className="text-2xl font-black tracking-tight text-white group-hover:text-accent transition-colors">Confera<span className="text-accent underline decoration-accent/30 decoration-2">AI</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active />
          <NavItem icon={<Calendar size={18} />} label="Schedule" />
          <NavItem icon={<BarChart3 size={18} />} label="AI Logs" />
          <NavItem icon={<Users size={18} />} label="Contacts" />
          <div className="h-px bg-white/5 my-6 mx-4" />
          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-6">
          <div className="glass-card bg-accent/5 border-accent/20 p-4 rounded-2xl">
             <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                 <Plus size={16} className="text-accent" />
               </div>
               <span className="text-sm font-bold">Pro Trial</span>
             </div>
             <p className="text-[10px] text-white/40 mb-3">AI features are currently limited in the free tier.</p>
             <button className="w-full py-2 bg-accent hover:bg-accent-light text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">Upgrade Now</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-12">
           <div>
             <h1 className="text-4xl font-black tracking-tight mb-2">Hello, Sarah!</h1>
             <p className="text-white/40 font-medium">You have <span className="text-accent-light">3 meetings</span> scheduled for today.</p>
           </div>
           <div className="flex items-center gap-4">
             <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                <input type="text" placeholder="Search meetings..." className="bg-white/5 border border-white/5 rounded-xl px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 w-64 transition-all" />
             </div>
             <button className="w-11 h-11 glass border-white/10 rounded-xl flex items-center justify-center relative hover:bg-white/10 transition-all">
                <Bell size={18} className="text-white/40" />
                <span className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full border-2 border-background" />
             </button>
             <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-purple-600 p-px">
                <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center font-bold text-xs uppercase text-accent-light">SK</div>
             </div>
           </div>
        </header>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             onClick={createMeeting}
             className="glass-card bg-accent border-accent/20 hover:border-accent/40 transition-all group flex items-center gap-6 p-8 text-left"
           >
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Plus size={32} className="text-white" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-1">Instant Meeting</h3>
               <p className="text-white/60 text-sm">Start a room and invite others</p>
             </div>
           </motion.button>
           
           <motion.button 
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="glass-card border-white/5 hover:border-white/20 transition-all group flex items-center gap-6 p-8 text-left"
           >
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
                <Calendar size={32} className="text-white/40 group-hover:text-white transition-colors" />
             </div>
             <div>
               <h3 className="text-xl font-bold text-white mb-1">Schedule Call</h3>
               <p className="text-white/40 text-sm">Plan ahead for your team</p>
             </div>
           </motion.button>
        </div>

        {/* Meeting List */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-widest text-white/40">Today's Schedule</h2>
              <button className="text-accent-light text-xs font-bold hover:underline">View Calendar</button>
           </div>
           
           <div className="space-y-4">
              {mockMeetings.map((meeting) => (
                <div key={meeting.id} className="glass-card border-white/5 hover:border-white/10 flex items-center justify-between group transition-all">
                   <div className="flex items-center gap-6">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${meeting.color}`}>
                         <Clock size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors">{meeting.title}</h4>
                        <div className="flex items-center gap-4 text-xs text-white/40 font-medium">
                           <span className="flex items-center gap-1.5"><Clock size={14} /> {meeting.time} · {meeting.duration}</span>
                           <span className="flex items-center gap-1.5"><Users size={14} /> {meeting.participants} Participants</span>
                        </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => navigate(`/room/${meeting.id}`)}
                     className="px-6 py-2.5 glass border-white/10 hover:bg-accent hover:border-accent text-sm font-bold rounded-xl transition-all"
                   >
                     Join Room
                   </button>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active }) => (
  <button className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-bold group ${active ? 'bg-accent/10 text-accent border border-accent/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
    <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
      {icon}
    </div>
    <span className="text-sm tracking-tight">{label}</span>
  </button>
);

export default Dashboard;
