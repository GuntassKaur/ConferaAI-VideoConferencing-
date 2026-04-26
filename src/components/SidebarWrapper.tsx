'use client';
import { 
  LayoutGrid, Video, Calendar, Users, Globe, Settings, 
  Menu, X, Bell, LogOut, ChevronRight, User, Sparkles
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
    { icon: Video, label: 'Meetings', href: '/meetings' },
    { icon: Calendar, label: 'Schedule', href: '/schedule' },
    { icon: Users, label: 'Teams', href: '/team' },
    { icon: Globe, label: 'Recordings', href: '/recordings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (!currentUser) return <div className="min-h-screen bg-slate-50">{children}</div>;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Modern Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 z-50 hidden lg:flex flex-col">
        {/* Brand Section */}
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100">
            <Video size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">Confera</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 mt-4">
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

        {/* User Profile Section */}
        <div className="mt-auto p-4">
           <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shadow-sm">
                    {getInitials(currentUser.name)}
                 </div>
                 <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pro Account</span>
                 </div>
              </div>
              <div className="space-y-1">
                 <Link href="/settings" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors rounded-lg hover:bg-white">
                    <div className="flex items-center gap-2"><Settings size={14} /> Settings</div>
                    <ChevronRight size={12} />
                 </Link>
                 <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                 >
                    <LogOut size={14} /> Sign Out
                 </button>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen relative">
        {/* Mobile Navbar */}
        <header className="lg:hidden h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-[60]">
           <button onClick={() => setIsMobileOpen(true)} className="p-2 text-slate-500"><Menu size={24} /></button>
           <span className="font-bold text-lg tracking-tight text-slate-900">Confera</span>
           <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
              {getInitials(currentUser.name)}
           </div>
        </header>

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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] bg-white z-[110] p-8 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"><Video size={16} className="text-white" /></div>
                   <span className="font-bold text-lg tracking-tight text-slate-900">Confera</span>
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
                 <div className="flex items-center gap-4 mb-6 px-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                       {getInitials(currentUser.name)}
                    </div>
                    <div className="flex flex-col">
                       <span className="font-bold text-slate-900">{currentUser.name}</span>
                       <span className="text-xs text-slate-400 font-semibold">Pro Member</span>
                    </div>
                 </div>
                 <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-rose-50 text-rose-600 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
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


