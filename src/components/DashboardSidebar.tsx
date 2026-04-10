'use client';

import React from 'react';
import { 
  Home, Video, Calendar, 
  Settings, Users, BarChart3 
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { icon: Home, label: 'Overview', href: '/dashboard', active: true },
  { icon: Video, label: 'Meetings', href: '/dashboard' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard' },
  { icon: Users, label: 'Team', href: '/dashboard', disabled: true },
  { icon: BarChart3, label: 'Insights', href: '/dashboard', disabled: true },
  { icon: Settings, label: 'Settings', href: '/dashboard', disabled: true },
];

const DashboardSidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
      <div className="flex-1 py-8 px-4 space-y-2">
        {menuItems.map((item, i) => (
          <Link 
            key={i} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
              item.active 
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
            } ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
         <div className="bg-indigo-600 rounded-2xl p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Plan</p>
            <p className="text-sm font-bold">Free Workspace</p>
         </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
