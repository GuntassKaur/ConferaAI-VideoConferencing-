'use client';
import { 
  LayoutGrid, Video, Globe, Settings, 
  Bell, LogOut, Search, User, Menu, X,
  Shield, Zap, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: currentUser, logout: authLogout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'Sessions', href: '/dashboard' },
    { icon: Globe, label: 'Network', href: '/dashboard' },
    { icon: Settings, label: 'Config', href: '/dashboard' },
  ];

  const handleLogout = () => {
    authLogout();
    window.location.href = '/login';
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);

  if (!isHydrated) return null;
  if (isAuthPage) return <div className="min-h-screen bg-[#0F172A]">{children}</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-white font-inter selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 📱 MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111827] border-b border-white/5 z-50 px-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Video size={16} className="text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter">CONFERA AI</span>
         </div>
         <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-400"><Menu size={20} /></button>
      </div>

      <div className="flex h-screen overflow-hidden pt-16 lg:pt-0">
        
        {/* 📌 PREMIUM SIDEBAR */}
        <aside className="w-[280px] bg-[#111827] border-r border-white/5 hidden lg:flex flex-col flex-shrink-0 z-40">
          <div className="p-8">
             <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-all">
                  <Video size={20} className="text-white" />
                </div>
                <div className="flex flex-col">
                   <span className="font-black text-lg tracking-tighter leading-none">CONFERA AI</span>
                   <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">v2.4.0 • Enterprise</span>
                </div>
             </Link>
          </div>

          <div className="flex-1 px-4 space-y-2 mt-4">
            <div className="px-4 mb-4">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Platform</p>
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 shadow-lg shadow-black/20' 
                      : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-300 transition-colors'} />
                  {item.label}
                  {isActive && <motion.div layoutId="sidebar-active" className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
                </Link>
              );
            })}

            <div className="px-4 mt-10 mb-4 pt-10 border-t border-white/5">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Personal</p>
            </div>
            <Link 
              href="/dashboard"
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-bold text-slate-500 hover:text-white hover:bg-white/[0.02] transition-all group"
            >
               <User size={18} className="text-slate-600 group-hover:text-slate-300" />
               Account Settings
            </Link>
          </div>

          <div className="p-6">
             <div className="p-6 bg-[#0F172A] rounded-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                      <Sparkles size={14} className="text-indigo-400" />
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Pro Feature</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 leading-relaxed mb-4">Get AI-powered session recaps and strategic insights.</p>
                <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">Upgrade Plan</button>
             </div>
          </div>

          <div className="p-6 mt-auto border-t border-white/5">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3.5 text-[13px] font-bold text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all group"
            >
              <LogOut size={18} className="group-hover:text-rose-500 transition-colors" /> Sign Out
            </button>
          </div>
        </aside>

        {/* 🖥️ MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* 📱 MOBILE NAV DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] lg:hidden" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-[#111827] z-[210] p-8 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-12">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center"><Video size={20} className="text-white" /></div>
                   <span className="font-black text-xl tracking-tighter">CONFERA AI</span>
                 </div>
                 <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
              </div>
              
              <nav className="space-y-2 flex-1">
                 {navItems.map((item) => (
                   <Link 
                     key={item.label} 
                     href={item.href}
                     onClick={() => setIsMobileOpen(false)}
                     className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${pathname === item.href ? 'bg-[#0F172A] text-indigo-400 border border-white/5 shadow-xl' : 'text-slate-500 hover:text-white'}`}
                   >
                     <item.icon size={20} />
                     {item.label}
                   </Link>
                 ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-white/5">
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-4 px-5 py-4 text-sm font-bold text-slate-500 hover:text-rose-500 transition-all"
                 >
                   <LogOut size={20} /> Sign Out
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

