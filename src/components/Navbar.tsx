'use client';

import React from 'react';
import Link from 'next/link';
import { Video, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 h-16 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="max-container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-indigo-600/20 group-hover:scale-105 transition-all">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Confera<span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <button className="h-10 px-5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
              Login
            </button>
          </Link>
          <Link href="/dashboard" className="hidden sm:block">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer">
              <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
