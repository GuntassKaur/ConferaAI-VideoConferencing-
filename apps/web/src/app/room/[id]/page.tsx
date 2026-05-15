"use client";

import { use, useEffect, useState } from 'react';
import { 
  LiveKitRoom, 
  VideoConference,
  RoomAudioRenderer,
  ConnectionStateToast,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { useAuthStore } from '@/store/useAuthStore';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isInitialized, initialize } = useAuthStore();
  const router = useRouter();
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!isInitialized) initialize();
  }, [isInitialized, initialize]);

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
      <div className="min-h-screen bg-[#0B1020] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#6366F1]/20 border-t-[#6366F1] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#6366F1]" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-white font-bold tracking-tight">Securing Connection</h2>
          <p className="text-slate-500 text-xs mt-1">Authenticating session {id}...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="h-screen bg-[#0B1020] flex flex-col overflow-hidden">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          onDisconnected={() => router.push('/dashboard')}
          data-lk-theme="default"
          className="flex-1"
        >
          <VideoConference 
            chat={false} 
            settings={true}
          />
          <RoomAudioRenderer />
          <ConnectionStateToast />
        </LiveKitRoom>

        {/* Custom Header Overlay */}
        <div className="absolute top-4 left-6 z-50 flex items-center gap-3 pointer-events-none">
           <div className="px-3 py-1.5 bg-[#111827]/80 backdrop-blur-md border border-[#1F2937] rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live: {id}</span>
           </div>
        </div>
      </div>

      <style jsx global>{`
        .lk-video-conference {
          background-color: #0B1020 !important;
        }
        .lk-control-bar {
          background-color: #111827 !important;
          border-top: 1px solid #1F2937 !important;
          padding: 1rem !important;
        }
        .lk-button {
          background-color: #1F2937 !important;
          border: 1px solid #374151 !important;
          border-radius: 0.75rem !important;
          color: #F9FAFB !important;
        }
        .lk-button:hover {
          background-color: #374151 !important;
        }
        .lk-button-active {
          background-color: #6366F1 !important;
          border-color: #6366F1 !important;
        }
        .lk-disconnect-button {
          background-color: #EF4444 !important;
          border-color: #EF4444 !important;
          color: white !important;
        }
        .lk-disconnect-button:hover {
          background-color: #DC2626 !important;
        }
        .lk-participant-tile {
          background-color: #111827 !important;
          border-radius: 1rem !important;
          border: 1px solid #1F2937 !important;
          overflow: hidden !important;
        }
      `}</style>
    </ProtectedRoute>
  );
}
