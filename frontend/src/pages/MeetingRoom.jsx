import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageSquare, Users, Cpu, Send, Share2, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MeetingRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [aiInsights, setAiInsights] = useState([]);
  const [userName] = useState(`User_${Math.floor(Math.random() * 1000)}`);
  
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = io('http://localhost:5000'); // Update to production URL later

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
      setStream(currentStream);
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }

      socketRef.current.emit('join-room', { roomId, userId: socketRef.current.id, userName });

      socketRef.current.on('all-users', (users) => {
        const peers = [];
        users.forEach((userId) => {
          const peer = createPeer(userId, socketRef.current.id, currentStream);
          peersRef.current.push({
            peerId: userId,
            peer,
          });
          peers.push(peer);
        });
        setPeers(peers);
      });

      socketRef.current.on('user-joined', (payload) => {
        const peer = addPeer(payload.signal, payload.callerId, currentStream);
        peersRef.current.push({
          peerId: payload.callerId,
          peer,
        });
        setPeers((prevPeers) => [...prevPeers, peer]);
      });

      socketRef.current.on('receiving-returned-signal', (payload) => {
        const item = peersRef.current.find((p) => p.peerId === payload.id);
        item.peer.signal(payload.signal);
      });

      socketRef.current.on('receive-message', (msg) => {
        setMessages(prev => [...prev, msg]);
      });

      socketRef.current.on('ai-insight', (insight) => {
        setAiInsights(prev => [insight, ...prev]);
      });

      // Hackathon Feature: AI Assistant Joins
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          userName: 'Confera AI', 
          message: 'Hello! I am your AI assistant. I will be taking notes and providing insights in real-time.', 
          timestamp: new Date() 
        }]);
      }, 3000);
    });

    return () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        socketRef.current.disconnect();
    };
  }, [roomId]);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('sending-signal', { userToSignal, callerId, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returning-signal', { signal, callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
      setIsCameraOff(!isCameraOff);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage.trim()) {
      socketRef.current.emit('send-message', { roomId, message: currentMessage, userName });
      setCurrentMessage('');
    }
  };

  return (
    <div className="h-screen bg-neutral-950 flex flex-col overflow-hidden text-white">
      {/* Top Header */}
      <div className="h-14 glass flex items-center justify-between px-6 border-b border-white/5 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Video size={18} />
          </div>
          <span className="font-bold tracking-tight">Confera<span className="text-accent underline decoration-accent/30 decoration-2">AI</span></span>
          <div className="h-4 w-px bg-white/10 mx-2" />
          <span className="text-xs text-white/40 font-mono tracking-widest">{roomId}</span>
          <div className="flex items-center gap-2 ml-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase text-white/60 tracking-wider">LIVE</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 text-white/60">
             <Users size={16} />
             <span className="text-sm font-medium">{peers.length + 1}</span>
           </div>
           <button onClick={() => navigate('/')} className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all">
             Leave
           </button>
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Remote/Main Grid */}
        <div className={`flex-1 p-4 grid gap-4 transition-all duration-500 ${showChat ? 'mr-96' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
            {/* User Personal Video */}
            <div className="relative group rounded-3xl overflow-hidden glass-card p-0 h-full min-h-[300px]">
              <video 
                ref={userVideo} 
                className="w-full h-full object-cover grayscale-[0.2] contrast-125" 
                autoPlay 
                muted 
                playsInline 
              />
              <div className="absolute top-4 right-4 h-8 px-3 glass rounded-full flex items-center gap-2 text-[10px] font-bold text-white/40 group-hover:text-white transition-colors">
                <Mic size={10} className={isMuted ? 'text-red-400' : 'text-green-400'} />
                {userName} (You)
              </div>
              {isCameraOff && (
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                    <VideoOff size={48} className="text-white/20" />
                  </div>
              )}
            </div>
            
            {/* Peer Mock Placeholders */}
            {[...Array(2)].map((_, i) => (
                <div key={i} className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/5 h-full min-h-[300px] flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 border border-accent/20">
                            <span className="text-xl font-bold text-accent">P{i+1}</span>
                        </div>
                        <span className="text-xs text-white/40 uppercase tracking-widest font-black">Participant {i+1}</span>
                    </div>
                    <div className="absolute bottom-4 left-4 h-6 px-3 glass rounded-full flex items-center gap-2 text-[8px] font-black text-white/60">
                        <div className="w-1 h-1 bg-green-500 rounded-full" />
                         STABLE CONNECTION
                    </div>
                </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <motion.div 
          initial={false}
          animate={{ x: showChat ? 0 : '100%' }}
          className="absolute right-0 top-0 bottom-0 w-96 glass-card rounded-none border-l border-white/10 z-10 flex flex-col p-0"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <MessageSquare size={18} className="text-accent" />
              </div>
              <h3 className="font-bold text-lg">Meeting Hub</h3>
            </div>
            <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
               <MoreHorizontal size={18} className="text-white/40" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* AI Insights Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-accent uppercase">
                <Cpu size={12} />
                AI Observations
              </div>
              <AnimatePresence>
                {aiInsights.length > 0 ? aiInsights.map((insight, idx) => (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     key={idx} 
                     className="p-3 bg-accent/10 border border-accent/20 rounded-xl text-sm italic text-accent-light"
                   >
                     {insight.insight}
                   </motion.div>
                )) : (
                  <div className="py-8 text-center text-white/20">
                     <span className="text-[10px] uppercase font-black tracking-widest">Listening for insights...</span>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-px bg-white/5" />

            {/* Chat Section */}
            <div className="space-y-4">
              <div className="text-[10px] font-black tracking-widest text-white/40 uppercase">Group Chat</div>
              <div className="space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.userName === userName ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-white/40 mb-1">{m.userName}</span>
                    <div className={`px-4 py-2 rounded-2xl text-sm ${m.userName === userName ? 'bg-accent text-white rounded-tr-none' : 'glass border-white/10 rounded-tl-none'}`}>
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 pt-2">
            <form onSubmit={sendMessage} className="relative group">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="input-field pr-12 text-sm bg-neutral-900 border-none ring-1 ring-white/10"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-accent rounded-lg text-white group-focus-within:scale-105 transition-transform">
                <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Modern Control Bar */}
      <div className="h-24 glass flex items-center justify-between px-8 border-t border-white/5 z-20">
        <div className="hidden md:flex flex-col">
          <span className="text-white/40 text-[10px] font-black tracking-widest uppercase">Meeting Topic</span>
          <span className="font-bold text-sm">Product Strategy Sync Q4</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMute}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'glass border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          <button 
            onClick={toggleCamera}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'glass border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-2" />
          
          <button className="w-14 h-14 glass border-white/10 rounded-2xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Share2 size={24} />
          </button>
          
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${showChat ? 'bg-accent/20 text-accent border border-accent/40' : 'glass border-white/10 text-white/60 hover:text-white hover:bg-white/10'}`}
          >
            <MessageSquare size={24} />
          </button>
        </div>

        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-red-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <PhoneOff size={20} />
          <span className="hidden lg:block text-sm uppercase tracking-tighter">End Meeting</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingRoom;
