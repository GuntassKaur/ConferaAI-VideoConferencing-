'use client';
import SidebarWrapper from '@/components/SidebarWrapper';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsPage() {
  const { user } = useAuthStore();

  return (
    <SidebarWrapper>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-1">
            Settings
          </h1>
          <p className="text-sm text-text-secondary">
            Manage your account and preferences
          </p>
        </header>

        <div className="space-y-6">
          <section className="bg-[#111827] border border-[#1F2937] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium text-white mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  defaultValue={user?.name || ''} 
                  className="w-full bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#6366F1] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''} 
                  disabled
                  className="w-full bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              <button className="px-6 py-2.5 bg-[#6366F1] text-white rounded-xl text-sm font-bold hover:bg-[#4F46E5] transition-all shadow-lg active:scale-95">
                Save Changes
              </button>
            </div>
          </section>

          <section className="bg-[#111827] border border-[#1F2937] rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium text-white mb-4">Audio & Video</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Join with microphone muted</h3>
                  <p className="text-xs text-slate-400">Always join meetings with your microphone muted</p>
                </div>
                <div className="w-10 h-6 bg-[#6366F1] rounded-full flex items-center p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full translate-x-4 shadow-sm" />
                </div>
              </div>
              <div className="w-full h-px bg-[#1F2937]" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Join with camera off</h3>
                  <p className="text-xs text-slate-400">Always join meetings with your camera turned off</p>
                </div>
                <div className="w-10 h-6 bg-[#1F2937] rounded-full flex items-center p-1 cursor-pointer">
                  <div className="w-4 h-4 bg-slate-400 rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SidebarWrapper>
  );
}
