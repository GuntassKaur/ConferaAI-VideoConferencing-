'use client';

import React from 'react';
import Link from 'next/link';
import { Video, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="fixed top-0 inset-x-0 h-16 z-[100] bg-background/80 backdrop-blur-md border-b border-border shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="max-container h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:scale-[1.02] transition-all duration-200">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Confera<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login">
            <button className="h-10 px-5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]">
              Login
            </button>
          </Link>
          <Link href="/dashboard" className="hidden sm:block hover:scale-[1.02] transition-all duration-200 active:scale-[0.98]">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-border flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 cursor-pointer">
              <User className="w-5 h-5 text-muted" />
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
