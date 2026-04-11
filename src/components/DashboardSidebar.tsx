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
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
      <div className="flex-1 py-8 px-4 space-y-2">
        {menuItems.map((item, i) => (
          <Link 
            key={i} 
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
              item.active 
                ? 'bg-primary/10 text-primary' 
                : 'text-muted hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-foreground'
            } ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </div>
      
      <div className="p-6 border-t border-border">
         <div className="bg-primary rounded-xl p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Plan</p>
            <p className="text-sm font-bold">Free Workspace</p>
         </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
