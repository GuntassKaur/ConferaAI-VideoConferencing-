'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer from 'peerjs';

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

  const peerRef = useRef<Peer | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error accessing media:', err);
      return null;
    }
  }, []);

  const joinRoom = useCallback(async (id: string, userName: string) => {
    setRoomId(id);
    const stream = await initializeMedia();
    
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000');
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Initial PeerJS setup
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (peerId) => {
      newSocket.emit('join-room', { roomId: id, userId: peerId, userName });
    });

    peer.on('call', (call) => {
      if (stream) {
        call.answer(stream);
        call.on('stream', (remoteStream) => {
          console.log('Received remote stream:', remoteStream.id);
        });
      }
    });

    newSocket.on('receive-message', (msg) => {
      setMessages(prev => [...prev, { ...msg, id: Math.random().toString(36) }]);
    });

    newSocket.on('ai-insight', ({ insight }) => {
      setMessages(prev => [...prev, { 
        id: Math.random().toString(36), 
        sender: 'Confera AI', 
        senderId: 'ai', 
        content: insight, 
        timestamp: new Date() 
      }]);
    });

  }, [initializeMedia]);

  const leaveRoom = useCallback(() => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    setLocalStream(null);
    setRemoteParticipants([]);
    setMessages([]);
    setRoomId(null);
  }, [localStream]);

  const toggleMic = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleCam = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCamOn(videoTrack.enabled);
      }
    }
  }, [localStream]);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Logic to revert to camera
      await initializeMedia();
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setLocalStream(stream);
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

  const requestRecap = useCallback(async () => {
    setIsRecapLoading(true);
    // Mocking API call
    setTimeout(() => {
      setRecap('The meeting focused on the Q4 roadmap. We decided to prioritize the AI recap feature and the collaborative whiteboard. John will take the lead on the frontend overhaul.');
      setIsRecapLoading(false);
    }, 2000);
  }, []);

  return (
    <MeetingContext.Provider value={{
      socket,
      localStream,
      remoteParticipants,
      messages,
      isMicOn,
      isCamOn,
      isScreenSharing,
      recap,
      isRecapLoading,
      toggleMic,
      toggleCam,
      toggleScreenShare,
      sendMessage,
      requestRecap,
      joinRoom,
      leaveRoom,
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
