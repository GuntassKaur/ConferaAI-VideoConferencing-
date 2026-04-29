import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'failed';

export function useRoom(roomId: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [error, setError] = useState<string | null>(null);
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    if (!roomId) return;

    let mounted = true;
    let newSocket: Socket | null = null;
    
    const initRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${roomId}`);
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = await res.json();
        if (mounted) setRoomData(data);

        // Connect to Socket
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';
        newSocket = io(serverUrl, {
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        newSocket.on('connect', () => {
          if (mounted) setStatus('connected');
          // In real app, use an actual User ID instead of socket id
          newSocket?.emit('join-room', roomId, newSocket.id);
        });

        newSocket.on('connect_error', () => {
          if (mounted) setStatus('failed');
        });

        newSocket.on('reconnect_attempt', () => {
          if (mounted) setStatus('reconnecting');
        });

        newSocket.on('user-joined', (userId: string) => {
          if (mounted) {
            setParticipants(prev => {
              if (prev.includes(userId)) return prev;
              return [...prev, userId];
            });
          }
        });

        newSocket.on('user-left', (userId: string) => {
          if (mounted) {
            setParticipants(prev => prev.filter(id => id !== userId));
          }
        });

        newSocket.on('room-full', () => {
          if (mounted) {
            setError('Room is full');
            newSocket?.disconnect();
          }
        });

        if (mounted) setSocket(newSocket);
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to join room');
          setStatus('failed');
        }
      }
    };

    initRoom();

    return () => {
      mounted = false;
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [roomId]);

  return { socket, participants, status, error, roomData };
}
