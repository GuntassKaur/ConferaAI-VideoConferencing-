'use client';

import React from 'react';
import Link from 'next/link';
import { Video, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 inset-x-0 h-20 z-[100] bg-black/40 backdrop-blur-2xl border-b border-white/5">
      <div className="max-container h-full flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:scale-105 transition-all duration-300">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">
            Confera<span className="text-primary italic">AI</span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-6">
          {!user ? (
            <Link href="/login">
              <button className="h-11 px-8 rounded-2xl bg-white text-black font-bold text-sm hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl">
                Access Workspace
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest hidden md:block">
                Dashboard
              </Link>
              
              <div className="h-6 w-[1px] bg-white/10 hidden md:block" />

              <div className="flex items-center gap-4 pl-2 group cursor-pointer relative">
                <div className="flex flex-col items-end hidden sm:flex">
                   <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{user.name}</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Enterprise User</span>
                </div>
                
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center group-hover:border-primary/50 transition-all duration-300 overflow-hidden">
                    <User className="w-6 h-6 text-slate-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-black" />
                </div>

                {/* Simple Dropdown Simulator */}
                <button 
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
