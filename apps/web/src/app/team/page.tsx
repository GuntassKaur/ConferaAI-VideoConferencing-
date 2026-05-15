'use client';
import { useState, useEffect } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { 
  Users, Search, Shield, 
  Mail, Clock, ChevronRight,
  MoreVertical, Filter, Loader2,
  Globe, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await fetch('/api/meetings/participants'); // I'll reuse or create a participant endpoint
        const data = await res.json();
        if (data.success) {
          setMembers(data.participants);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <SidebarWrapper>
      <div className="max-w-6xl mx-auto px-6 py-12 font-inter">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Global Directory</h1>
            <p className="text-slate-400 text-sm font-medium">
              Manage your encrypted collaboration network and authorized nodes.
            </p>
          </motion.div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-[#111827] border border-[#1F2937] rounded-xl flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <Globe size={14} className="text-[#6366F1]" />
                {members.length} Nodes Online
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {isLoading ? (
             <div className="col-span-full py-32 flex flex-col items-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#6366F1] mb-4" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Scanning Network...</p>
             </div>
           ) : members.length === 0 ? (
             <div className="col-span-full py-32 text-center bg-[#111827] border border-[#1F2937] rounded-[2.5rem]">
                <Users size={48} className="text-slate-700 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-white mb-2">Network Isolated</h3>
                <p className="text-slate-500 text-sm">No other authorized users detected in the directory.</p>
             </div>
           ) : (
             members.map((member, i) => (
               <motion.div 
                 key={member.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-[#111827] border border-[#1F2937] rounded-[2.5rem] p-8 shadow-2xl hover:border-[#6366F1]/50 transition-all group"
               >
                 <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 rounded-full bg-[#0F172A] border border-[#1F2937] flex items-center justify-center text-xl font-bold text-white group-hover:border-[#6366F1]/30 transition-all shadow-inner">
                       {member.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-white group-hover:text-[#6366F1] transition-colors">{member.name}</h3>
                       <div className="flex items-center gap-2 mt-1">
                          <Shield size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Authorized</span>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 text-slate-400">
                       <Mail size={14} className="text-[#6366F1]" />
                       <span className="text-xs font-medium truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                       <Zap size={14} className="text-amber-500" />
                       <span className="text-xs font-medium">Platform Engineering</span>
                    </div>
                 </div>

                 <button className="w-full py-3 bg-[#0F172A] border border-[#1F2937] text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-[#111827] hover:border-[#6366F1]/50 transition-all flex items-center justify-center gap-2">
                    Start Session
                    <ChevronRight size={14} />
                 </button>
               </motion.div>
             ))
           )}
        </div>
      </div>
    </SidebarWrapper>
  );
}
