'use client';
import { 
  LayoutGrid, Video, Globe, Settings, 
  Bell, LogOut, Search, User, Menu, X
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
    { icon: Video, label: 'Meetings', href: '/meetings' },
    { icon: Globe, label: 'AI Recaps', href: '/recordings' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const handleLogout = () => {
    authLogout();
    router.push('/login');
  };

  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);

  if (!isHydrated) return null;
  if (isAuthPage) return <div className="min-h-screen bg-[#0F172A]">{children}</div>;

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#E5E7EB] font-sans selection:bg-[#6366F1]/20 selection:text-[#6366F1]">
      
      {/* 🧩 NAVBAR (64px) */}
      <nav className="fixed top-0 left-0 right-0 h-16 z-[100] bg-[#111827]/80 backdrop-blur-md border-b border-[#1F2937]">
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center shadow-lg shadow-[#6366F1]/20">
              <Video size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Confera AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#6366F1] transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-[#0F172A] border border-[#1F2937] rounded-xl pl-9 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:border-[#6366F1] transition-all w-48 placeholder:text-slate-600"
              />
            </div>
            
            <button className="p-2 text-slate-400 hover:text-white hover:bg-[#1F2937] rounded-xl transition-all relative">
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#6366F1] rounded-full" />
            </button>

            <div className="h-4 w-px bg-[#1F2937] mx-1" />

            {currentUser ? (
              <div className="flex items-center gap-3 pl-2 cursor-pointer group" onClick={() => router.push('/settings')}>
                 <div className="w-8 h-8 rounded-full bg-[#1F2937] border border-[#1F2937] flex items-center justify-center text-[10px] font-bold text-white shadow-sm group-hover:border-[#6366F1]/50 transition-all uppercase">
                    {currentUser.name.charAt(0)}
                 </div>
              </div>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="px-4 py-1.5 bg-[#6366F1] text-white text-xs font-bold rounded-lg hover:bg-[#4F46E5] transition-all shadow-lg shadow-[#6366F1]/20"
              >
                Sign In
              </button>
            )}

            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 h-screen overflow-hidden">
        
        {/* 📌 SIDEBAR (220px) */}
        <aside className="w-[220px] bg-[#0F172A] border-r border-[#1F2937] hidden lg:flex flex-col flex-shrink-0">
          <div className="flex-1 px-4 py-8 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold transition-all group ${
                    isActive 
                      ? 'bg-[#111827] text-[#6366F1] border border-[#1F2937]' 
                      : 'text-slate-400 hover:text-white hover:bg-[#111827]/50'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-[#6366F1]' : 'text-slate-500 group-hover:text-white transition-colors'} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-[#1F2937]">
            <button 
              onClick={currentUser ? handleLogout : () => router.push('/login')}
              className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-slate-500 hover:text-white hover:bg-[#111827] rounded-xl transition-all"
            >
              <LogOut size={16} /> {currentUser ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </aside>

        {/* 🖥️ MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar bg-[#0F172A]">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* 📱 MOBILE NAV */}
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
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#111827] z-[210] p-6 lg:hidden flex flex-col border-r border-[#1F2937]"
            >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center"><Video size={16} className="text-white" /></div>
                   <span className="font-bold text-lg text-white">Confera AI</span>
                 </div>
                 <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
              </div>
              
              <nav className="space-y-1 flex-1">
                 {navItems.map((item) => (
                   <Link 
                     key={item.href} 
                     href={item.href}
                     onClick={() => setIsMobileOpen(false)}
                     className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${pathname === item.href ? 'bg-[#0F172A] text-[#6366F1]' : 'text-slate-400 hover:text-white'}`}
                   >
                     <item.icon size={20} />
                     {item.label}
                   </Link>
                 ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
