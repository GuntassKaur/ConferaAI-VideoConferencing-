'use client';
import { 
  LayoutGrid, Video, Calendar, Users, Globe, Settings, 
  Menu, X, Bell, LogOut, ChevronRight, User, Sparkles,
  HelpCircle, Search
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/productStore';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user: currentUser, logout: authLogout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // ✅ Hydration guard — Zustand persist needs a tick to rehydrate from localStorage
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => { setIsHydrated(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'Meetings', href: '/meetings' },
    { icon: Globe, label: 'Recordings', href: '/recordings' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  const handleLogout = () => {
    authLogout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const Spinner = () => (
    <div className="min-h-screen bg-background-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20">
          <Video size={22} className="text-white" />
        </div>
        <div className="w-6 h-6 border-[3px] border-accent/30 border-t-accent rounded-full animate-spin" />
        <p className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.2em]">Loading...</p>
      </div>
    </div>
  );

  // Show spinner while store rehydrates from localStorage (prevents blank screen flash)
  if (!isHydrated) return <Spinner />;

  // Auth pages render without sidebar
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);
  if (isAuthPage) return <div className="min-h-screen bg-background-base">{children}</div>;

  // Redirect unauthenticated users — show spinner, not blank screen
  if (!currentUser) {
    router.push('/login');
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-background-base text-text-primary font-sans selection:bg-accent/20 selection:text-accent">
      
      {/* 🧩 PREMIUM TOP NAVBAR (64px) */}
      <nav className={`fixed top-0 left-0 right-0 h-16 z-[100] transition-all duration-300 border-b ${
        scrolled ? 'bg-background-sub/80 backdrop-blur-md border-background-border' : 'bg-background-base border-transparent'
      }`}>
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform">
                <Video size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">Confera</span>
            </Link>
          </div>

          {/* Right: Search + Tools + Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-background-elevated border border-background-border rounded-xl pl-10 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all w-48 text-text-primary placeholder:text-text-secondary"
              />
            </div>
            
            <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background-elevated rounded-xl transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-background-base rounded-full" />
            </button>

            <div className="h-6 w-px bg-background-border mx-1" />

            <div className="flex items-center gap-3 pl-2 cursor-pointer group" onClick={() => router.push('/settings')}>
               <div className="w-9 h-9 rounded-full bg-background-elevated border border-background-border flex items-center justify-center text-xs font-bold text-text-primary shadow-sm group-hover:border-accent/50 transition-all">
                  {getInitials(currentUser.name)}
               </div>
            </div>

            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-text-secondary"><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden max-w-[1200px] mx-auto">
        
        {/* 🧩 MODERN SIDEBAR (Linear Style) */}
        <aside className="w-[220px] bg-background-base border-r border-background-border hidden lg:flex flex-col flex-shrink-0">
          <div className="flex-1 px-4 py-6 space-y-6">
            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Main Menu</p>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href} 
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                        isActive 
                          ? 'bg-background-elevated text-accent' 
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated/50'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-accent' : 'text-text-secondary group-hover:text-text-primary transition-colors'} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

          </div>

          {/* Bottom Card */}
          <div className="p-4">
            <button 
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-rose-500 hover:bg-background-elevated rounded-xl transition-all border border-transparent"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* 🖥️ MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* 📱 MOBILE NAVIGATION OVERLAY */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background-base/80 backdrop-blur-sm z-[200] lg:hidden" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] bg-background-sub z-[210] p-8 lg:hidden flex flex-col border-r border-background-border"
            >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center"><Video size={16} className="text-white" /></div>
                   <span className="font-bold text-lg tracking-tight text-text-primary">Confera</span>
                 </div>
                 <button onClick={() => setIsMobileOpen(false)} className="p-2 text-text-secondary"><X size={28} /></button>
              </div>
              
              <nav className="space-y-1 flex-1">
                 {navItems.map((item) => (
                   <Link 
                     key={item.href} 
                     href={item.href}
                     onClick={() => setIsMobileOpen(false)}
                     className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-semibold transition-all ${pathname === item.href ? 'bg-background-elevated text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated/50'}`}
                   >
                     <item.icon size={20} />
                     {item.label}
                   </Link>
                 ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-background-border">
                 <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-rose-500/10 text-rose-500 text-sm font-semibold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                    <LogOut size={18} /> Logout
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
