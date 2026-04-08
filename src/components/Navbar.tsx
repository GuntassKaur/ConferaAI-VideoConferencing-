'use client';

import React from 'react';
import Link from 'next/link';
import { Video, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 h-16 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 shadow-sm">
      <div className="max-container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-300">
            <Video className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold font-heading tracking-tight text-slate-900 dark:text-white">
            Confera<span className="text-indigo-600">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Dashboard', 'Pricing'].map((item) => (
            <Link 
              key={item} 
              href={item === 'Dashboard' ? '/dashboard' : '#'} 
              className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right Action */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <button className="h-9 px-5 rounded-lg border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95">
              Login
            </button>
          </Link>
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer">
              <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
