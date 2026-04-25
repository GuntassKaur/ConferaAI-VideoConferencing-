'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { Plus, ChevronRight } from 'lucide-react';
import NewSessionModal from '@/components/dashboard/NewSessionModal';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
  const currentDate = new Date().toLocaleDateString('en-US', dateOptions);

  const metrics = [
    { label: "Active sessions", value: "3", delta: "+2 today", positive: true },
    { label: "Hours saved", value: "14.2h", delta: "this week", positive: true },
    { label: "AI recaps", value: "28", delta: "+5 this week", positive: true },
    { label: "Team members", value: "12", delta: "2 pending", positive: false },
  ];

  const recentSessions = [
    { id: 1, name: "Q3 Planning & Marketing Strategy", duration: "45m", date: "Today, 10:00 AM", status: "Live", statusColor: "bg-rose-500/10 text-rose-500 border-rose-500/20", avatars: ['S', 'M', 'K'], extraCount: 2 },
    { id: 2, name: "Engineering Sync", duration: "1h 15m", date: "Yesterday", status: "Ended", statusColor: "bg-slate-800 text-slate-300 border-slate-700", avatars: ['J', 'A', 'T'], extraCount: 0 },
    { id: 3, name: "Design Review: Mobile App", duration: "30m", date: "Yesterday", status: "Ended", statusColor: "bg-slate-800 text-slate-300 border-slate-700", avatars: ['D', 'C'], extraCount: 0 },
    { id: 4, name: "All Hands Meeting", duration: "1h", date: "Oct 24", status: "Ended", statusColor: "bg-slate-800 text-slate-300 border-slate-700", avatars: ['M', 'L', 'R'], extraCount: 15 },
    { id: 5, name: "Client Pitch: Apex Corp", duration: "--", date: "Tomorrow, 2:00 PM", status: "Scheduled", statusColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20", avatars: ['S', 'E'], extraCount: 0 },
  ];

  return (
    <>
      <div className="p-8 pb-24 min-h-full">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-white">Good morning, {user?.name?.split(' ')[0] || 'Commander'}</h1>
          <span className="text-slate-500 text-sm mt-1 md:mt-0">{currentDate}</span>
        </div>

        {/* Metric cards grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
        >
          {metrics.map((metric, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-[#0f0f13] border border-[#1e1e27] rounded-xl p-5 shadow-sm">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2 font-medium">{metric.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold text-white">{metric.value}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${metric.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  {metric.delta}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent sessions table */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-white">Recent sessions</h2>
            <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">View all</button>
          </div>
          
          <div className="border border-[#1e1e27] rounded-xl overflow-hidden bg-[#08080a]">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#1e1e27] text-slate-500 bg-[#0f0f13]/50">
                  <th className="px-5 py-4 font-medium w-1/3">Session Name</th>
                  <th className="px-5 py-4 font-medium">Participants</th>
                  <th className="px-5 py-4 font-medium">Duration</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr key={session.id} className="border-b border-[#1e1e27] last:border-0 hover:bg-[#0f0f13] transition-colors group cursor-pointer">
                    <td className="px-5 py-4 font-medium text-slate-200">{session.name}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center -space-x-2">
                        {session.avatars.map((initial, idx) => (
                          <div key={idx} className="w-6 h-6 rounded-full bg-[#17171d] border border-[#27272a] flex items-center justify-center text-[10px] font-bold text-slate-300 z-10 relative">
                            {initial}
                          </div>
                        ))}
                        {session.extraCount > 0 && (
                          <div className="w-6 h-6 rounded-full bg-[#1e1e27] border border-[#27272a] flex items-center justify-center text-[9px] font-bold text-slate-400 z-0 relative">
                            +{session.extraCount}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{session.duration}</td>
                    <td className="px-5 py-4 text-slate-400">{session.date}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded border ${session.statusColor}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button className="text-xs text-slate-500 group-hover:text-indigo-400 font-medium transition-colors inline-flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        View recap <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-8 right-8 w-12 h-12 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center text-white hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all z-20"
      >
        <Plus size={24} />
      </button>

      {/* Modal Component */}
      <NewSessionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
