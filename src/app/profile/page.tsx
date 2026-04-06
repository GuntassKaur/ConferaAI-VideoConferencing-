'use client';

import React from 'react';
import { User, Mail, Bell, Shield, Moon, Monitor, Camera, Lock, LogOut, ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-indigo-500/30 overflow-hidden relative pb-20">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--bg-accent-1)] rounded-full blur-[150px] -z-10 opacity-60 pointer-events-none translate-x-1/4 -translate-y-1/4" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[var(--bg-accent-2)] rounded-full blur-[150px] -z-10 opacity-40 pointer-events-none -translate-x-1/3" />

      <header className="px-10 py-8 flex items-center gap-6">
         <Link href="/dashboard">
             <button className="w-12 h-12 rounded-full glass-card hover:bg-[var(--muted)] flex items-center justify-center transition-colors">
                <ChevronLeft className="w-6 h-6" />
             </button>
         </Link>
         <h1 className="text-3xl font-extrabold font-outfit tracking-tight">Account Settings</h1>
      </header>

      <main className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mt-6">
         {/* Sidebar Navigation */}
         <div className="space-y-2">
            <button className="w-full text-left px-5 py-4 rounded-2xl bg-[var(--primary)] text-white font-bold tracking-wide flex items-center gap-4 premium-shadow">
               <User className="w-5 h-5" /> Profile Information
            </button>
            <button className="w-full text-left px-5 py-4 rounded-2xl text-[var(--muted-fg)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] font-medium transition-all flex items-center gap-4">
               <Monitor className="w-5 h-5" /> Appearance
            </button>
            <button className="w-full text-left px-5 py-4 rounded-2xl text-[var(--muted-fg)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] font-medium transition-all flex items-center gap-4">
               <Bell className="w-5 h-5" /> Notifications
            </button>
            <button className="w-full text-left px-5 py-4 rounded-2xl text-[var(--muted-fg)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] font-medium transition-all flex items-center gap-4">
               <Lock className="w-5 h-5" /> Privacy & Security
            </button>
         </div>

         {/* Content Area */}
         <div className="md:col-span-2 space-y-8">
            <div className="glass-card p-10 border border-[var(--border)]">
               <h2 className="text-2xl font-bold font-outfit mb-8">Public Profile</h2>
               
               <div className="flex items-center gap-8 mb-10">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 premium-shadow border-4 border-[var(--background)] flex items-center justify-center relative group cursor-pointer overflow-hidden">
                     <span className="text-2xl font-bold text-white">AM</span>
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <Camera className="w-8 h-8 text-white" />
                     </div>
                  </div>
                  <div>
                     <button className="btn-secondary py-2.5 px-6 rounded-xl text-sm font-bold">Change Avatar</button>
                     <p className="text-xs text-[var(--muted-fg)] mt-3">JPG, GIF or PNG. 1MB max.</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-[var(--muted-fg)] uppercase tracking-wider">First Name</label>
                     <input type="text" defaultValue="Alex" className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-bold text-[var(--muted-fg)] uppercase tracking-wider">Last Name</label>
                     <input type="text" defaultValue="Miller" className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium" />
                  </div>
               </div>
               
               <div className="space-y-2 mb-8">
                  <label className="text-sm font-bold text-[var(--muted-fg)] uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                     <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-fg)]" />
                     <input type="email" defaultValue="alex.miller@confera.ai" className="w-full bg-[var(--muted)] border border-[var(--border)] rounded-xl pl-12 pr-4 py-3 text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium" />
                  </div>
               </div>

               <button className="btn-primary py-3.5 px-8 rounded-xl font-bold w-full sm:w-auto">Save Changes</button>
            </div>

            <div className="glass-card p-10 border border-[var(--border)]">
               <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-bold font-outfit mb-1">Interface Theme</h2>
                    <p className="text-sm text-[var(--muted-fg)] font-medium mb-6">Customize your workspace appearance</p>
                  </div>
                  <ThemeToggle />
               </div>
            </div>

         </div>
      </main>
    </div>
  );
}
