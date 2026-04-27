'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/productStore';
import { useRouter } from 'next/navigation';
import { 
  Plus, LogIn, Video, ArrowRight,
  History, Settings, Shield, Clock,
  Calendar, Users, Share2, Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardContent() {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [meetingId, setMeetingId] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  // Fetch recent meetings
  useEffect(() => {
    const userId = currentUser?.id || 'guest_global';
    fetch(`/api/meetings?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMeetings(data.meetings);
        }
      })
      .catch(console.error);
  }, [currentUser]);

  const startMeeting = async () => {
    setIsStarting(true);
    
    const realId = `meet-${Math.random().toString(36).substring(7)}`;
    const userName = currentUser?.name || 'Guest User';
    const userId = currentUser?.id || `guest_${Math.random().toString(36).substring(2, 9)}`;
    
    try {
      const response = await fetch('/api/livekit/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: realId,
          name: `${userName}'s Meeting`,
          hostId: userId
        })
      });

      if (!response.ok) throw new Error('Failed to create meeting');

      const data = await response.json();
      
      const newMeeting = {
        id: realId,
        roomId: realId,
        name: data.meeting.name,
        createdAt: new Date().toLocaleString('en-US', { 
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
        }),
      };
      
      router.push(`/meeting/${realId}`);
    } catch (error) {
      console.error(error);
      setIsStarting(false);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingId.trim()) router.push(`/meeting/${meetingId.trim()}/join`);
  };

  // Guests are welcome!


  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* 🚀 PREMIUM HEADER */}
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}` : 'Welcome, Guest'}
        </h1>
        <p className="text-sm text-text-secondary">
          {currentUser ? 'Manage your meetings and sessions' : 'Sign in to access your meeting history and host meetings'}
        </p>
      </header>

      {/* 🧩 PRIMARY ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Start Meeting */}
        <div className="p-6 bg-background-elevated border border-background-border rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
               <Video size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Start Meeting</h3>
              <p className="text-sm text-text-secondary">Launch an instant video session</p>
            </div>
          </div>
          <button 
            onClick={startMeeting}
            disabled={isStarting}
            className="mt-auto w-full flex items-center justify-center gap-2 bg-[#6366F1] text-white font-medium py-2.5 rounded-lg hover:bg-[#4F46E5] transition-all disabled:opacity-50"
          >
            {isStarting ? 'Starting...' : 'Start Meeting'} 
          </button>
        </div>

        {/* Join Meeting */}
        <div className="p-6 bg-background-elevated border border-background-border rounded-xl shadow-sm flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-background-sub border border-background-border rounded-lg flex items-center justify-center text-text-primary">
               <Plus size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">Join Meeting</h3>
              <p className="text-sm text-text-secondary">Enter a code to join</p>
            </div>
          </div>
          <form onSubmit={handleJoin} className="mt-auto flex gap-3">
            <input 
              type="text" 
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter Meeting ID"
              className="flex-1 bg-background-base border border-background-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-all"
            />
            <button 
              type="submit"
              disabled={!meetingId}
              className="px-6 bg-background-sub border border-background-border text-text-primary font-medium text-sm rounded-lg hover:bg-background-border transition-all disabled:opacity-50"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      {/* 🕒 RECENT ACTIVITY SECTION */}
      <section>
        <div className="mb-4">
           <h4 className="text-base font-semibold text-text-primary">
             Recent Meetings
           </h4>
        </div>

        <div className="bg-background-elevated border border-background-border rounded-xl overflow-hidden">
          {meetings.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
               <div className="w-12 h-12 bg-background-sub rounded-full flex items-center justify-center mb-4 text-text-secondary">
                  <History size={24} />
               </div>
               <p className="text-sm text-text-secondary font-medium">No meetings yet</p>
            </div>
          ) : (
            <div className="divide-y divide-background-border">
              {meetings.slice(0, 3).map((m: any, i: number) => (
                <div key={m.id} className="flex items-center justify-between p-4 hover:bg-background-sub transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-background-base rounded flex items-center justify-center text-text-secondary border border-background-border">
                      <Video size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary mb-0.5">{m.roomId || m.id}</p>
                      <p className="text-xs text-text-secondary">
                        {new Date(m.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/meeting/${m.roomId || m.id}`)}
                    className="px-4 py-1.5 bg-background-base border border-background-border text-text-primary text-sm font-medium rounded-lg hover:bg-background-border transition-colors"
                  >
                    Join
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


    </div>
  );
}
