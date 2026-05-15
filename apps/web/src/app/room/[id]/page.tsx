"use client";

import { use, useEffect, useState } from 'react';
import { 
  LiveKitRoom, 
  ControlBar, 
  ParticipantTile,
  GridLayout,
  useTracks,
  RoomAudioRenderer,
  ConnectionStateToast,
  Chat,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import '@livekit/components-styles';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
  Clock, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  Users,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [roomName, setRoomName] = useState("Command Session");
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  useEffect(() => {
    if (user?.name && id) {
      (async () => {
        try {
          const resp = await fetch(`/api/livekit/token?room=${id}&username=${user.name}`);
          const data = await resp.json();
          setToken(data.token);
        } catch (e) {
          console.error("Token fetch failed", e);
        }
      })();
    }
  }, [user?.name, id]);

  if (!token) {
    return (
      <div className="min-h-screen bg-[#07090E] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-white font-semibold text-lg">Establishing Secure Link</h2>
          <p className="text-slate-500 text-sm mt-1">Authenticating encrypted session {id}...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#07090E] flex flex-col font-sans overflow-hidden text-slate-200">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          onDisconnected={() => router.push('/dashboard')}
          data-lk-theme="default"
          className="flex-1 flex flex-col"
        >
          {/* Top Navigation */}
          <header className="h-14 border-b border-white/5 bg-[#0A0D14] px-6 flex items-center justify-between z-30 shadow-2xl">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-indigo-500/20">C</div>
                  <div>
                    <h1 className="text-sm font-bold text-white tracking-tight">{roomName}</h1>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{id}</span>
                       <div className="w-1 h-1 rounded-full bg-slate-700" />
                       <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                          <Clock size={10} /> Live
                       </span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Secure Core</span>
               </div>

               <div className="h-8 w-[1px] bg-white/5" />
               <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Users size={18} />
               </button>
            </div>
          </header>

          <main className="flex-1 flex overflow-hidden bg-[#07090E] relative">
             {/* Dynamic Video Grid */}
             <div className="flex-1 p-4 flex flex-col relative overflow-hidden">
                <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/5 bg-[#0F1219]">
                   <VideoConferenceContent />
                </div>
                
                {/* Custom Integrated Control Bar */}
                <div className="mt-4 flex items-center justify-center">
                  <div className="bg-[#0A0D14]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 px-4 flex items-center gap-2 shadow-2xl">
                    <ControlBar 
                      variation="minimal" 
                      controls={{ 
                        microphone: true, 
                        camera: true, 
                        screenShare: true, 
                        leave: true,
                        chat: false,
                        settings: true
                      }} 
                    />
                    <div className="w-[1px] h-6 bg-white/10 mx-2" />
                    <button 
                      onClick={() => { setShowChat(!showChat); setShowNotes(false); }}
                      className={`p-2.5 rounded-xl transition-all ${showChat ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      <MessageSquare size={18} />
                    </button>
                    <button 
                      onClick={() => { setShowNotes(!showNotes); setShowChat(false); }}
                      className={`p-2.5 rounded-xl transition-all ${showNotes ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                    >
                      <FileText size={18} />
                    </button>
                  </div>
                </div>
             </div>

             {/* Intelligent Sidebar */}
             {(showChat || showNotes) && (
               <div className="w-80 border-l border-white/5 bg-[#0A0D14] flex flex-col z-20 animate-in slide-in-from-right duration-300">
                  {showNotes ? (
                    <>
                      <div className="p-4 border-b border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <Sparkles size={16} className="text-indigo-400" />
                           <h2 className="text-[11px] font-bold uppercase tracking-widest text-white">Strategic Intelligence</h2>
                         </div>
                         <button onClick={() => setShowNotes(false)} className="text-slate-500 hover:text-white">
                           <ChevronRight size={16} />
                         </button>
                      </div>
                      <div className="flex-1 p-5 space-y-8 overflow-y-auto custom-scrollbar">
                         <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Objectives</h3>
                            <div className="space-y-3">
                               {[
                                 "Align on Platform Architecture",
                                 "Review Firebase Migration Progress",
                                 "Identify High-Priority UI Blockers"
                               ].map((obj, i) => (
                                 <div key={i} className="group p-3 bg-white/[0.03] border border-white/5 rounded-xl flex items-start gap-3 hover:border-indigo-500/30 transition-all">
                                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                    <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{obj}</span>
                                 </div>
                               ))}
                            </div>
                         </div>

                         <div className="p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Live AI Analysis</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-slate-400 italic">
                               "The AI is monitoring the stream for decision points and action items. A complete briefing will be synthesized upon session completion."
                            </p>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      <div className="p-4 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MessageSquare size={16} className="text-indigo-400" />
                          <h2 className="text-[11px] font-bold uppercase tracking-widest text-white">Session Chat</h2>
                        </div>
                        <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white">
                           <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="flex-1">
                        <Chat />
                      </div>
                    </div>
                  )}
               </div>
             )}

          </main>

          <RoomAudioRenderer />
          <ConnectionStateToast />
        </LiveKitRoom>
      </div>
    </ProtectedRoute>
  );
}

function VideoConferenceContent() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, name: 'participant' },
      { source: Track.Source.ScreenShare, name: 'screen_share' },
    ],
    { onlyShowingFacets: true, useDeviceOrientation: true },
  );

  return (
    <GridLayout tracks={tracks} className="flex-1">
      <ParticipantTile />
    </GridLayout>
  );
}
