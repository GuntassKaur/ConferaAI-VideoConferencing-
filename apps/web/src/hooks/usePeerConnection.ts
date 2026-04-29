import { useState, useEffect, useRef } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { Socket } from 'socket.io-client';

export interface PeerNetworkState {
  peers: Record<string, MediaStream>;
  quality: Record<string, { rtt: number, packetLoss: number }>;
}

export function usePeerConnection(
  userId: string | null,
  localStream: MediaStream | null,
  socket: Socket | null
) {
  const [peers, setPeers] = useState<Record<string, MediaStream>>({});
  const [quality, setQuality] = useState<Record<string, { rtt: number, packetLoss: number }>>({});
  
  const peerInstance = useRef<Peer | null>(null);
  const connections = useRef<Map<string, MediaConnection>>(new Map());

  // Initialize PeerJS mesh node
  useEffect(() => {
    if (!userId || !localStream) return;

    // ConferaAI scales mesh natively up to 6 peers before delegating to SFU mode
    const peer = new Peer(userId, {
      path: '/peerjs',
      host: process.env.NEXT_PUBLIC_PEER_HOST || window.location.hostname,
      port: parseInt(process.env.NEXT_PUBLIC_PEER_PORT || '3001'),
      secure: window.location.protocol === 'https:'
    });

    peer.on('open', (id) => {
      console.log('My WebRTC peer ID is: ' + id);
    });

    // Handle incoming mesh calls
    peer.on('call', (call) => {
      if (connections.current.size >= 6) {
        console.warn('Max 6 peers reached. In production, this shifts to SFU mode.');
      }
      
      call.answer(localStream);
      
      call.on('stream', (userVideoStream) => {
        setPeers(prev => ({ ...prev, [call.peer]: userVideoStream }));
      });

      call.on('error', (err) => {
        console.error('Peer connection error', err);
      });

      connections.current.set(call.peer, call);
    });

    peerInstance.current = peer;

    return () => {
      peer.disconnect();
      peer.destroy();
    };
  }, [userId, localStream]);

  // Handle Socket signaling to call new users
  useEffect(() => {
    if (!socket || !peerInstance.current || !localStream) return;

    const handleUserJoined = (newUserId: string) => {
      const call = peerInstance.current!.call(newUserId, localStream);
      
      call.on('stream', (userVideoStream) => {
        setPeers(prev => ({ ...prev, [newUserId]: userVideoStream }));
      });
      
      connections.current.set(newUserId, call);
    };

    const handleUserLeft = (leftUserId: string) => {
      if (connections.current.has(leftUserId)) {
        connections.current.get(leftUserId)!.close();
        connections.current.delete(leftUserId);
      }
      setPeers(prev => {
        const next = { ...prev };
        delete next[leftUserId];
        return next;
      });
    };

    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
    };
  }, [socket, localStream]);

  // Network Quality & Bandwidth Adaptation
  useEffect(() => {
    const interval = setInterval(async () => {
      const newQuality: Record<string, { rtt: number, packetLoss: number }> = {};
      
      for (const [peerId, connection] of connections.current.entries()) {
        if (!connection.peerConnection) continue;
        
        try {
          const stats = await connection.peerConnection.getStats();
          let rtt = 0;
          let packetLoss = 0;
          
          stats.forEach(report => {
            if (report.type === 'candidate-pair' && report.state === 'succeeded') {
              rtt = report.currentRoundTripTime || 0;
            }
            if (report.type === 'inbound-rtp' && report.kind === 'video') {
              packetLoss = report.packetsLost || 0;
            }
          });
          
          newQuality[peerId] = { rtt, packetLoss };

          // Bandwidth Adaptation: Reduce video bitrate on poor network
          if (rtt > 0.5 || packetLoss > 100) {
            const senders = connection.peerConnection.getSenders();
            const videoSender = senders.find(s => s.track?.kind === 'video');
            if (videoSender) {
              const params = videoSender.getParameters();
              if (!params.encodings) params.encodings = [{}];
              // Throttle to 500kbps max when connection is struggling
              params.encodings[0].maxBitrate = 500000; 
              videoSender.setParameters(params);
            }
          }
        } catch (e) {
          console.warn('Failed to get network stats for peer', peerId);
        }
      }
      
      setQuality(newQuality);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return { peers, quality };
}
