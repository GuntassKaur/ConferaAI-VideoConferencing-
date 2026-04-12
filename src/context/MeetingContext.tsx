'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  sender: string;
  senderId: string;
  content: string;
  timestamp: Date;
}

interface Participant {
  id: string;
  name: string;
  socketId: string;
  stream?: MediaStream;
}

interface MeetingContextType {
  socket: Socket | null;
  localStream: MediaStream | null;
  remoteParticipants: Participant[];
  messages: Message[];
  isMicOn: boolean;
  isCamOn: boolean;
  isScreenSharing: boolean;
  recap: string;
  isRecapLoading: boolean;
  toggleMic: () => void;
  toggleCam: () => void;
  toggleScreenShare: () => void;
  sendMessage: (content: string) => void;
  requestRecap: () => void;
  joinRoom: (roomId: string, userName: string) => void;
  leaveRoom: () => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

// WebRTC STUN servers for NAT Traversal
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
  ]
};

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [recap, setRecap] = useState('');
  const [isRecapLoading, setIsRecapLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const localStreamRef = useRef<MediaStream | null>(null);

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      localStreamRef.current = stream;
      return stream;
    } catch (err) {
      console.error('Error accessing media:', err);
      return null;
    }
  }, []);

  const createPeerConnection = useCallback((userSocketId: string, stream: MediaStream) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    
    stream.getTracks().forEach(track => {
      peer.addTrack(track, stream);
    });

    peer.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          targetId: userSocketId,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteParticipants(prev => {
        const p = prev.find(p => p.socketId === userSocketId);
        if (p && p.stream !== event.streams[0]) {
          return prev.map(pt => pt.socketId === userSocketId ? { ...pt, stream: event.streams[0] } : pt);
        }
        if (!p) {
           return [...prev, { id: userSocketId, name: 'Participant', socketId: userSocketId, stream: event.streams[0] }];
        }
        return prev;
      });
    };

    return peer;
  }, []);

  const joinRoom = useCallback(async (id: string, userName: string) => {
    setRoomId(id);
    const stream = await initializeMedia();
    
    // Connect explicitly and handle Vercel proxy restrictions
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const newSocket = io(backendUrl, {
      transports: ['websocket', 'polling'], // Fallback needed for deployment
      reconnectionAttempts: 5,
    });
    
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('socket connected ✅');
      newSocket.emit('join-room', { roomId: id, userId: newSocket.id, userName });
    });

    // Handle initial mesh of users
    newSocket.on('all-users', (users: string[]) => {
      users.forEach(userSocketId => {
        const peer = createPeerConnection(userSocketId, stream!);
        peersRef.current[userSocketId] = peer;
        
        peer.createOffer().then(offer => {
          peer.setLocalDescription(offer);
          newSocket.emit('offer', {
            userToSignal: userSocketId,
            callerId: newSocket.id,
            signal: offer
          });
        });
      });
    });

    newSocket.on('user-connected', (data: { userId: string, userName: string, socketId: string }) => {
      console.log('peer joined ✅', data);
      setRemoteParticipants(prev => [...prev, { id: data.userId, name: data.userName, socketId: data.socketId }]);
    });

    newSocket.on('offer', async (payload: { signal: RTCSessionDescriptionInit, callerId: string }) => {
      const peer = createPeerConnection(payload.callerId, stream!);
      peersRef.current[payload.callerId] = peer;
      
      await peer.setRemoteDescription(new RTCSessionDescription(payload.signal));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      
      newSocket.emit('answer', { signal: answer, callerId: payload.callerId });
    });

    newSocket.on('answer', async (payload: { signal: RTCSessionDescriptionInit, id: string }) => {
      const peer = peersRef.current[payload.id];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(payload.signal));
        console.log('WebRTC handshake successful ✅');
      }
    });

    newSocket.on('ice-candidate', async (payload: { candidate: RTCIceCandidateInit, senderId: string }) => {
      const peer = peersRef.current[payload.senderId];
      if (peer) {
        await peer.addIceCandidate(new RTCIceCandidate(payload.candidate)).catch(e => console.error(e));
      }
    });

    newSocket.on('user-disconnected', (socketId: string) => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }
      setRemoteParticipants(prev => prev.filter(p => p.socketId !== socketId));
    });

    newSocket.on('receive-message', (msg) => {
       setMessages(prev => [...prev, { ...msg, id: Math.random().toString(36) }]);
    });

  }, [initializeMedia, createPeerConnection]);

  const leaveRoom = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    localStreamRef.current = null;
    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    Object.values(peersRef.current).forEach(peer => peer.close());
    peersRef.current = {};
    
    setRemoteParticipants([]);
    setMessages([]);
    setRoomId(null);
  }, []);

  const toggleMic = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, []);

  const toggleCam = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      await initializeMedia();
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setLocalStream(stream);
        localStreamRef.current = stream;
        
        // Update Video tracks on peers
        const videoTrack = stream.getVideoTracks()[0];
        Object.values(peersRef.current).forEach(peer => {
          const sender = peer.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(videoTrack);
        });

        setIsScreenSharing(true);
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    }
  }, [isScreenSharing, initializeMedia]);

  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && roomId) {
      socketRef.current.emit('send-message', { roomId, message: content, userName: 'You' });
    }
  }, [roomId]);

  const requestRecap = useCallback(() => {}, []); // Removed mock block

  return (
    <MeetingContext.Provider value={{
      socket, localStream, remoteParticipants, messages, isMicOn, isCamOn,
      isScreenSharing, recap, isRecapLoading, toggleMic, toggleCam,
      toggleScreenShare, sendMessage, requestRecap, joinRoom, leaveRoom,
    }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
