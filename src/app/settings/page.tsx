'use client';
import { useState } from 'react';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useAuthStore } from '@/store/useAuthStore';
import { motion } from 'framer-motion';
import { 
  User, Shield, Bell, Video, 
  Mic, Monitor, Globe, ChevronRight,
  Check, AlertCircle
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1000);
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <SidebarWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12 font-inter">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Settings</h1>
          <p className="text-slate-400 text-sm font-medium">Manage your security, profile and audio/video preferences.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-3 space-y-1">
             {[
               { icon: User, label: 'Profile', active: true },
               { icon: Video, label: 'Audio & Video' },
               { icon: Shield, label: 'Security' },
               { icon: Bell, label: 'Notifications' },
               { icon: Globe, label: 'Workspace' },
             ].map((item) => (
               <button 
                 key={item.label}
                 className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20' : 'text-slate-400 hover:text-white hover:bg-[#111827]'}`}
               >
                 <item.icon size={18} />
                 {item.label}
               </button>
             ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Profile Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111827] border border-[#1F2937] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                 <User size={20} className="text-[#6366F1]" />
                 Account Identity
              </h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name || ''} 
                      className="w-full bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366F1] transition-all placeholder:text-slate-600 shadow-inner"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Identifier</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email || ''} 
                      disabled
                      className="w-full bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed opacity-60"
                    />
                  </div>
                </div>
                <div className="pt-4 border-t border-[#1F2937] flex items-center justify-between">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Update your public persona</p>
                   <button 
                    onClick={handleSave}
                    disabled={saveStatus !== 'idle'}
                    className="px-8 py-3 bg-[#6366F1] text-white rounded-xl text-xs font-bold hover:bg-[#4F46E5] transition-all shadow-xl shadow-[#6366F1]/10 flex items-center gap-2 min-w-[140px] justify-center"
                   >
                     {saveStatus === 'saving' ? (
                       <Loader2 size={16} className="animate-spin" />
                     ) : saveStatus === 'saved' ? (
                       <><Check size={16} /> Saved</>
                     ) : (
                       'Secure Profile'
                     )}
                   </button>
                </div>
              </div>
            </motion.section>

            {/* AV Section */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#111827] border border-[#1F2937] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
            >
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                 <Video size={20} className="text-[#6366F1]" />
                 Session Preferences
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Mic, title: 'Microphone Silence', desc: 'Always join meetings with audio muted', active: true },
                  { icon: Video, title: 'Privacy Shield', desc: 'Always join meetings with camera disabled', active: false },
                  { icon: Monitor, title: 'HD Transmission', desc: 'Stream video at maximum 1080p resolution', active: true },
                ].map((pref) => (
                  <div key={pref.title} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-2xl border border-[#1F2937] hover:border-[#6366F1]/30 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${pref.active ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'bg-[#1F2937] text-slate-500'}`}>
                          <pref.icon size={20} />
                       </div>
                       <div>
                          <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-[#6366F1] transition-colors">{pref.title}</h3>
                          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">{pref.desc}</p>
                       </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-all ${pref.active ? 'bg-[#6366F1]' : 'bg-[#1F2937]'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all ${pref.active ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Danger Zone */}
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-rose-500/5 border border-rose-500/10 rounded-3xl p-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 shrink-0">
                       <AlertCircle size={24} />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-rose-500">Deactivate Session Account</h3>
                       <p className="text-sm text-slate-400 font-medium">Permanently purge your account data and meeting history.</p>
                    </div>
                 </div>
                 <button className="px-6 py-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition-all">
                    Purge Account
                 </button>
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </SidebarWrapper>
  );
}
