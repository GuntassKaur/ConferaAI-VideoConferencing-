'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useParams, useRouter } from 'next/navigation';
import PreCallLobby from '@/components/video/PreCallLobby';
import VideoRoom from '@/components/video/VideoRoom';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';

export default function SessionPage() {
  const { roomId } = useParams() as { roomId: string };
  const { user } = useAuthStore();
  const [token, setToken] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    const fetchToken = async () => {
      try {
        const res = await fetch(`/api/livekit/token?roomId=${roomId}&name=${encodeURIComponent(user.name)}`);
        const data = await res.json();
        if (data.token) {
          setToken(data.token);
        }
      } catch (e) {
        console.error('Failed to fetch token', e);
      }
    };
    fetchToken();
  }, [roomId, user]);

  if (!user) {
    return <div className="h-screen bg-[#08080a] flex items-center justify-center text-slate-500 font-mono text-sm">Initializing connection to Secure Mesh...</div>;
  }

  // Fallback dev url if not provided by env
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://your-livekit-server.com';

  if (!hasJoined) {
    return (
      <PreCallLobby 
        roomId={roomId}
        userName={user.name}
        onJoin={(cam, mic) => {
          setCameraEnabled(cam);
          setMicEnabled(mic);
          setHasJoined(true);
        }}
      />
    );
  }

  return (
    <LiveKitRoom
      video={cameraEnabled}
      audio={micEnabled}
      token={token}
      serverUrl={livekitUrl}
      data-lk-theme="default"
      className="h-screen w-full bg-[#08080a]"
      onDisconnected={() => router.push('/dashboard')}
    >
      <VideoRoom roomId={roomId} />
    </LiveKitRoom>
  );
}
