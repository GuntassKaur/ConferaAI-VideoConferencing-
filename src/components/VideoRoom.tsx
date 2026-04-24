'use client';

import '@livekit/components-styles';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  useConnectionState,
} from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';
import { Activity, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DynamicVideoGrid from './DynamicVideoGrid';

interface VideoRoomProps {
  token: string;
  serverUrl: string;
}

export default function VideoRoom({ token, serverUrl }: VideoRoomProps) {
  const router = useRouter();

  if (!token || !serverUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Activity className="animate-spin text-blue-500 w-10 h-10" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Acquiring Secure Token...
        </p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      data-lk-theme="default"
      style={{ height: '100%', width: '100%' }}
      onDisconnected={() => {
        router.push('/dashboard');
      }}
    >
      <DynamicVideoGrid />
      <RoomAudioRenderer />
      <ConnectionStateOverlay />
    </LiveKitRoom>
  );
}

function ConnectionStateOverlay() {
  const state = useConnectionState();
  const router = useRouter();

  if (state === ConnectionState.Connected) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        {state === ConnectionState.Connecting && (
          <>
            <Activity className="animate-spin text-blue-500 w-12 h-12 mb-4" />
            <h3 className="text-white font-bold text-lg">Establishing Mesh</h3>
            <p className="text-slate-400 text-xs mt-2 font-medium uppercase tracking-widest">
              Connecting to secure nodes...
            </p>
          </>
        )}
        {state === ConnectionState.Disconnected && (
          <>
            <AlertCircle className="text-red-500 w-12 h-12 mb-4" />
            <h3 className="text-white font-bold text-lg text-center">Security Protocol Failed</h3>
            <p className="text-slate-400 text-xs mt-2 font-medium uppercase tracking-widest text-center">
              Unable to establish secure node connection.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
            >
              Retry Connection
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="mt-2 text-slate-500 hover:text-slate-300 text-[10px] font-bold uppercase tracking-widest transition-all"
            >
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
