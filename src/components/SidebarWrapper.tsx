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
  const { logout: productLogout } = useProductStore();
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
    { icon: Calendar, label: 'Schedule', href: '/schedule' },
    { icon: Users, label: 'Teams', href: '/team' },
  ];

  const handleLogout = () => {
    authLogout();
    productLogout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const Spinner = () => (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200">
          <Video size={22} className="text-white" />
        </div>
        <div className="w-6 h-6 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Loading...</p>
      </div>
    </div>
  );

  // Show spinner while store rehydrates from localStorage (prevents blank screen flash)
  if (!isHydrated) return <Spinner />;

  // Auth pages render without sidebar
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(pathname);
  if (isAuthPage) return <div className="min-h-screen bg-white">{children}</div>;

  // Redirect unauthenticated users — show spinner, not blank screen
  if (!currentUser) {
    router.push('/login');
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* 🧩 PREMIUM TOP NAVBAR (64px) */}
      <nav className={`fixed top-0 left-0 right-0 h-16 z-[100] transition-all duration-300 border-b ${
        scrolled ? 'bg-white/80 backdrop-blur-md border-slate-200' : 'bg-white border-transparent'
      }`}>
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                <Video size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900">Confera AI</span>
            </Link>

            {/* Desktop Quick Nav */}
            <div className="hidden lg:flex items-center gap-1 ml-4">
              {navItems.slice(0, 3).map((item) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    pathname === item.href ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search + Tools + Profile */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search meetings..." 
                className="bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all w-48 focus:w-64"
              />
            </div>
            
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-3 pl-2 cursor-pointer group" onClick={() => router.push('/settings')}>
               <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none mb-1">{currentUser.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Free Plan</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm group-hover:border-indigo-200 transition-all">
                  {getInitials(currentUser.name)}
               </div>
            </div>

            <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-slate-500"><Menu size={24} /></button>
          </div>
        </div>
      </nav>

      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        
        {/* 🧩 MODERN SIDEBAR (Linear Style) */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col flex-shrink-0">
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
                          ? 'bg-indigo-50 text-indigo-600' 
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Support</p>
              <nav className="space-y-1">
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  <Settings size={18} className="text-slate-400" />
                  Settings
                </Link>
                <Link href="/help" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">
                  <HelpCircle size={18} className="text-slate-400" />
                  Help Center
                </Link>
              </nav>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="p-4">
            <div className="bg-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-100 overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-xs font-bold text-indigo-100 uppercase tracking-widest mb-1">Upgrade to Pro</p>
                <p className="text-sm font-bold mb-3 leading-tight">Get AI transcripts & cloud storage.</p>
                <button className="px-4 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-md">
                  View Plans
                </button>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-20 h-20 text-white/10 group-hover:scale-110 transition-transform" />
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
            >
              <LogOut size={16} /> Sign Out Session
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] lg:hidden" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] bg-white z-[210] p-8 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Video size={16} className="text-white" /></div>
                   <span className="font-bold text-lg tracking-tight text-slate-900">Confera AI</span>
                 </div>
                 <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400"><X size={28} /></button>
              </div>
              
              <nav className="space-y-1 flex-1">
                 {navItems.map((item) => (
                   <Link 
                     key={item.href} 
                     href={item.href}
                     onClick={() => setIsMobileOpen(false)}
                     className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${pathname === item.href ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}
                   >
                     <item.icon size={22} />
                     {item.label}
                   </Link>
                 ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-slate-100">
                 <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
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
