'use client';

import React from 'react';
import { 
  Home, Video, Calendar, Clock, Settings, 
  Users, BarChart3, HelpCircle, LogOut 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: Home, label: 'Overview', href: '/dashboard' },
  { icon: Video, label: 'Meetings', href: '/dashboard/meetings' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: Users, label: 'Teams', href: '/dashboard/teams' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 flex flex-col h-full overflow-y-auto">
      <div className="p-6">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200 dark:border-white/10 space-y-1.5">
        <Link 
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
