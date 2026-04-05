'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Plus, 
  Video, 
  Calendar, 
  Clock, 
  Search, 
  Settings, 
  Bell, 
  User,
  MoreVertical,
  Play,
  FileText,
  Users as UserGroup
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const upcomingMeetings = [
    { title: 'Project Zenith Sync', time: '10:30 AM', duration: '45m', participants: 8, id: 'zenith-sync' },
    { title: 'Design Review', time: '1:00 PM', duration: '60m', participants: 4, id: 'design-review' },
    { title: 'Quarterly Planning', time: '4:15 PM', duration: '90m', participants: 12, id: 'q-planning' },
  ];

  const pastRecaps = [
    { title: 'Product Roadmap', date: 'Yesterday', summary: 'Agreed on Q3 milestones. AI integration prioritized.', id: 'roadmap' },
    { title: 'Client Workshop', date: '2 days ago', summary: 'Defined user personas and primary journey.', id: 'workshop' },
    { title: 'Weekly Standup', date: '3 days ago', summary: 'Frontend tasks 90% complete. Backend API ready.', id: 'standup' },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mini Sidebar */}
      <aside className="w-20 border-r border-white/5 flex flex-col items-center py-8 gap-8 glass-morphism">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
          <Video className="w-6 h-6 text-white" />
        </div>
        <nav className="flex flex-col gap-6">
          <Button variant="ghost" size="icon" className="rounded-xl text-primary bg-primary/10">
            <Layout className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Calendar className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Clock className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-xl">
            <User className="w-5 h-5" />
          </Button>
        </nav>
        <div className="mt-auto flex flex-col gap-6">
          <Button variant="ghost" size="icon" className="rounded-xl">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-500" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 glass-morphism z-10">
          <h1 className="text-2xl font-bold outfit-font">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search meetings, recaps..." 
                className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 w-64 transition-all"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </Button>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Quick Actions */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href={`/meeting/${Math.random().toString(36).substr(2, 9)}`} className="block">
                  <GlassCard hover className="flex flex-col items-center text-center p-8 bg-primary/10 border-primary/20 hover:bg-primary/20 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/30">
                      <Plus className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg">New Meeting</h3>
                    <p className="text-xs text-secondary mt-1">Start an instant conference</p>
                  </GlassCard>
                </Link>

                <GlassCard hover className="flex flex-col items-center text-center p-8 hover:bg-white/5 transition-all cursor-pointer border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-4">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg">Schedule</h3>
                  <p className="text-xs text-secondary mt-1">Plan a future session</p>
                </GlassCard>

                <GlassCard hover className="flex flex-col items-center text-center p-8 hover:bg-white/5 transition-all cursor-pointer border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                    <Layout className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg">Join Call</h3>
                  <p className="text-xs text-secondary mt-1">Via invite link or code</p>
                </GlassCard>

                <GlassCard hover className="flex flex-col items-center text-center p-8 hover:bg-white/5 transition-all cursor-pointer border-white/5">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4">
                    <UserGroup className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg">Breakout</h3>
                  <p className="text-xs text-secondary mt-1">Manage AI moderators</p>
                </GlassCard>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upcoming Meetings */}
              <section className="lg:col-span-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary">Upcoming</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-primary">View Calendar</Button>
                </div>
                <div className="space-y-4">
                  {upcomingMeetings.map((mtg, i) => (
                    <GlassCard key={i} className="p-4 border-white/5 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden group">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{mtg.time}</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreVertical className="w-4 h-4" /></Button>
                      </div>
                      <h4 className="font-bold mb-1">{mtg.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-secondary">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {mtg.duration}</span>
                        <span className="flex items-center gap-1"><UserGroup className="w-3 h-3" /> {mtg.participants}</span>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>

              {/* Past Recaps */}
              <section className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-secondary">Recent Intelligence</h2>
                  <Button variant="ghost" size="sm" className="text-xs text-primary">All Recaps</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastRecaps.map((recap, i) => (
                    <GlassCard key={i} className="p-5 border-white/5 hover:bg-white/5 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Play className="w-4 h-4 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{recap.title}</h4>
                          <span className="text-[10px] text-secondary font-medium">{recap.date}</span>
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-xs text-secondary leading-relaxed border border-white/5 mb-4 group-hover:border-primary/20 transition-colors">
                        <span className="text-primary font-bold mr-1">AI recap:</span>
                        {recap.summary}
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex -space-x-2">
                           {[1,2,3].map(n => (
                             <div key={n} className={`w-6 h-6 rounded-full border-2 border-[#020617] bg-zinc-800 flex items-center justify-center text-[8px]`}>JD</div>
                           ))}
                         </div>
                         <Button variant="ghost" className="h-7 text-[10px] gap-1 px-2">
                           <FileText className="w-3 h-3" /> Full Transcript
                         </Button>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </section>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Icons
function Layout(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  )
}
