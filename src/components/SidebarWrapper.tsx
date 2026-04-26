'use client';
import { 
  LayoutGrid, Video, Calendar, Users, Globe, Settings, 
  Menu, X, Bell, LogOut, ChevronRight, User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '@/store/productStore';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useProductStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', href: '/dashboard' },
    { icon: Video, label: 'Sessions', href: '/meetings' },
    { icon: Calendar, label: 'Schedule', href: '/schedule' },
    { icon: Users, label: 'Team Space', href: '/team' },
    { icon: Globe, label: 'Archives', href: '/recordings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!currentUser) return <div className="min-h-screen bg-[#050507]">{children}</div>;

  return (
    <div className="flex min-h-screen bg-[#050507] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Premium Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#0a0a0c] border-r border-white/5 z-50 hidden lg:flex flex-col">
        {/* Brand Section */}
        <div className="p-10 pb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-indigo-600/40">
            <Video size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white uppercase">Confera</span>
        </div>

        {/* Workspace Label */}
        <div className="px-10 mb-6">
           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
             <div className="w-1 h-1 rounded-full bg-indigo-500" />
             Personal Workspace
           </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all group ${
                  isActive 
                    ? 'bg-white/5 text-white' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? 'text-indigo-400' : 'group-hover:text-slate-300 transition-colors'} />
                  {item.label}
                </div>
                {isActive && (
                  <motion.div layoutId="nav-dot" className="w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto p-6">
           <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 group hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                    {getInitials(currentUser.name)}
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-tighter">Pro Member</span>
                 </div>
              </div>
              <div className="h-px bg-white/5 w-full mb-4" />
              <div className="flex flex-col gap-1">
                 <Link href="/settings" className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                   <div className="flex items-center gap-2"><Settings size={14} /> Settings</div>
                   <ChevronRight size={12} />
                 </Link>
                 <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-500/60 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/5"
                 >
                   <LogOut size={14} /> Log Out
                 </button>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen relative">
        {/* Mobile Navbar */}
        <header className="lg:hidden h-20 bg-[#0a0a0c] border-b border-white/5 px-6 flex items-center justify-between sticky top-0 z-[60]">
           <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-400"><Menu size={24} /></button>
           <span className="font-bold text-lg tracking-tight text-white uppercase">Confera</span>
           <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] font-bold">
              {getInitials(currentUser.name)}
           </div>
        </header>

        {/* Dynamic Background Mesh */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-30">
           <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
        </div>

        {/* Content Injector */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] lg:hidden" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] bg-[#0a0a0c] z-[110] p-8 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                   <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-600/20"><Video size={20} className="text-white" /></div>
                   <span className="font-bold text-xl tracking-tight text-white uppercase">Confera</span>
                 </div>
                 <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400"><X size={28} /></button>
              </div>
              
              <nav className="space-y-2 flex-1">
                 {navItems.map((item) => (
                   <Link 
                     key={item.href} 
                     href={item.href}
                     onClick={() => setIsMobileOpen(false)}
                     className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-bold transition-all ${pathname === item.href ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                   >
                     <item.icon size={22} />
                     {item.label}
                   </Link>
                 ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-white/5">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white uppercase">
                       {getInitials(currentUser.name)}
                    </div>
                    <div className="flex flex-col">
                       <span className="font-bold text-white">{currentUser.name}</span>
                       <span className="text-xs text-slate-500">Pro Subscription</span>
                    </div>
                 </div>
                 <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-white/5 border border-white/5 text-rose-400 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                   <LogOut size={18} /> Sign Out
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}


