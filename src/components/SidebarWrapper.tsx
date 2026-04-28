'use client';
import { 
  LayoutGrid, Video, Settings, 
  Bell, LogOut, User, Menu, X,
  Shield, Zap, Sparkles, Globe
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user: currentUser, logout: authLogout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => { setIsHydrated(true); }, []);

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'Sessions', href: '/dashboard' },
    { icon: Globe, label: 'Network', href: '/dashboard' },
  ];

  const handleLogout = () => {
    authLogout();
    window.location.href = '/login';
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password', '/register'].includes(pathname);

  if (!isHydrated) return null;
  if (isAuthPage) return <div className="min-h-screen bg-[#0F172A]">{children}</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans">
      
      {/* 📱 MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#111827] border-b border-[#1F2937] z-50 px-6 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Video size={16} className="text-indigo-500" />
            <span className="font-bold text-sm tracking-tight text-white">CONFERA</span>
         </div>
         <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-400"><Menu size={18} /></button>
      </div>

      <div className="flex h-screen overflow-hidden pt-14 lg:pt-0">
        
        {/* 📌 COMPACT SIDEBAR */}
        <aside className="w-[240px] bg-[#111827] border-r border-[#1F2937] hidden lg:flex flex-col flex-shrink-0 z-40">
          <div className="p-6">
             <Link href="/dashboard" className="flex items-center gap-2 group">
                <Video size={18} className="text-indigo-500" />
                <span className="font-bold text-sm tracking-tight text-white">CONFERA AI</span>
             </Link>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                    isActive 
                      ? 'bg-indigo-500/10 text-indigo-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  <item.icon size={14} className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto">
             <div className="p-4 bg-[#0F172A] rounded-xl border border-[#1F2937] mb-4">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">PRO PLAN</p>
                <p className="text-[10px] text-slate-500 leading-relaxed mb-3">Neural recaps enabled.</p>
                <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold transition-all border border-white/5">Settings</button>
             </div>
             
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all"
             >
               <LogOut size={14} /> Sign Out
             </button>
          </div>
        </aside>

        {/* 🖥️ MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto scroll-smooth">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] lg:hidden" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-[260px] bg-[#111827] z-[210] p-6 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-2">
                   <Video size={18} className="text-indigo-500" />
                   <span className="font-bold text-sm tracking-tight text-white">CONFERA AI</span>
                 </div>
                 <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400"><X size={20} /></button>
              </div>
              
              <nav className="space-y-1 flex-1">
                 {navItems.map((item) => (
                   <Link 
                     key={item.label} 
                     href={item.href}
                     onClick={() => setIsMobileOpen(false)}
                     className={`flex items-center gap-3 px-3 py-3 rounded-lg text-xs font-medium transition-all ${pathname === item.href ? 'bg-[#0F172A] text-indigo-400 border border-[#1F2937]' : 'text-slate-400 hover:text-white'}`}
                   >
                     <item.icon size={16} />
                     {item.label}
                   </Link>
                 ))}
              </nav>

              <div className="mt-auto pt-4 border-t border-[#1F2937]">
                 <button 
                   onClick={handleLogout}
                   className="w-full flex items-center gap-3 px-3 py-3 text-xs font-medium text-slate-400 hover:text-rose-500 transition-all"
                 >
                   <LogOut size={16} /> Sign Out
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
