'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutDashboard, Video, Users, Brain, Calendar, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Video, label: "Sessions", href: "/dashboard/sessions" },
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: Brain, label: "AI Insights", href: "/dashboard/insights" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-row h-screen overflow-hidden bg-[#08080a] text-white font-inter">
      {/* LEFT SIDEBAR */}
      <aside className="w-56 shrink-0 bg-[#08080a] border-r border-[#1e1e27] flex flex-col">
        {/* Top */}
        <div className="p-4 flex items-center gap-3 mt-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Video className="text-white w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-white tracking-tight">Confera AI</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-6 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-[#17171d] text-white border-l-2 border-indigo-500 rounded-l-none' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-[#0f0f13]'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[#1e1e27] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-7 h-7 rounded-full bg-[#17171d] border border-[#1e1e27] flex items-center justify-center text-xs font-bold text-slate-300 shrink-0">
              {getInitials(user?.name || 'User')}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-white truncate">{user?.name || 'Guest'}</span>
              <span className="text-[10px] text-slate-500 truncate">{user?.email || 'No email'}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors shrink-0"
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 overflow-y-auto relative bg-[#08080a]">
        {children}
      </main>
    </div>
  );
}
