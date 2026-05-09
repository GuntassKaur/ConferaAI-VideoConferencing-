"use client";

import { use, useEffect, useState } from 'react';
import { 
  LiveKitRoom, 
  VideoConference, 
  ControlBar, 
  ParticipantTile,
  GridLayout,
  useTracks,
  RoomAudioRenderer,
  TrackLoop
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Loader2, Shield, Users, Clock, PhoneOff, Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, FileText, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("Strategic Sync");

  useEffect(() => {
    if (user?.name && id) {
      (async () => {
        try {
          const resp = await fetch(`/api/livekit/token?room=${id}&username=${user.name}`);
          const data = await resp.json();
          setToken(data.token);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [user?.name, id]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-slate-500 font-medium text-sm">Initializing secure session...</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          onDisconnected={() => router.push('/dashboard')}
          data-lk-theme="default"
          className="flex-1 flex flex-col"
        >
          {/* Top Bar */}
          <header className="h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between z-20">
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">C</div>
               <div>
                  <h1 className="text-sm font-bold text-slate-900">{roomName}</h1>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-wider">{id}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-300" />
                     <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                        <Clock size={10} /> 12:45
                     </span>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Live Engine</span>
               </div>
            </div>
          </header>

          {/* Main Video Area */}
          <main className="flex-1 flex overflow-hidden bg-slate-50 relative">
             <div className="flex-1 p-6 flex flex-col relative">
                <VideoConference 
                   chat={false} 
                   settingsBar={false}
                   className="flex-1"
                />
             </div>

             {/* Right Sidebar Placeholder (Notes/AI) */}
             <div className="w-80 border-l border-slate-200 bg-white flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                   <Sparkles size={16} className="text-indigo-600" />
                   <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">Session Intelligence</h2>
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                   <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Objectives</h3>
                      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                         <div className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                            <span>Align on Q3 Roadmap</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs text-slate-600">
                            <div className="w-1 h-1 rounded-full bg-indigo-500" />
                            <span>Review API Infrastructure</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Strategic Briefing</h3>
                      <p className="text-xs leading-relaxed text-slate-500">
                         The AI is currently analyzing the conversation for key insights and action items. Recap will be available at the end of the session.
                      </p>
                   </div>
                </div>
             </div>
          </main>

          <RoomAudioRenderer />
        </LiveKitRoom>
      </div>
    </ProtectedRoute>
  );
}
