import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, 
  MessageSquare, Users, Cpu, Send, Share2, 
  MoreHorizontal, Sparkles, Zap, Brain, Activity, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MeetingRoom = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [peers, setPeers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [aiInsights, setAiInsights] = useState([]);
  const [productivity, setProductivity] = useState(85);
  const [isAIAssistantJoined, setIsAIAssistantJoined] = useState(false);
  const [userName] = useState(`Agent_${Math.floor(Math.random() * 9999)}`);
  
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    socketRef.current = io(BACKEND_URL);

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
          peersRef.current.push({ peerId: userId, peer });
          peers.push(peer);
        });
        setPeers(peers);
      });

      socketRef.current.on('user-joined', (payload) => {
        const peer = addPeer(payload.signal, payload.callerId, currentStream);
        peersRef.current.push({ peerId: payload.callerId, peer });
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
        setProductivity(prev => Math.min(100, prev + 2));
      });

      // Special Hackathon Effect: AI Assistant Entry
      setTimeout(() => {
        setIsAIAssistantJoined(true);
        setTimeout(() => setIsAIAssistantJoined(false), 5000);
        setMessages(prev => [...prev, { 
          userName: 'CONFERA CORE', 
          message: 'Neural Uplink Stable. AI Assistant monitoring module activity. How can I help today?', 
          timestamp: new Date() 
        }]);
      }, 4000);
    });

    return () => {
        if (stream) stream.getTracks().forEach(track => track.stop());
        socketRef.current.disconnect();
    };
  }, [roomId]);

  function createPeer(userToSignal, callerId, stream) {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on('signal', (signal) => {
      socketRef.current.emit('sending-signal', { userToSignal, callerId, signal });
    });
    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({ initiator: false, trickle: false, stream });
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
    <div className="h-screen bg-[#020205] flex flex-col overflow-hidden text-white font-bold select-none">
      {/* AI Joined Notification Backdrop */}
      <AnimatePresence>
        {isAIAssistantJoined && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="glass-card border-accent shadow-[0_0_100px_rgba(99,102,241,0.6)] p-12 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-mesh animate-mesh opacity-20" />
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 className="w-24 h-24 rounded-full border-4 border-accent border-t-transparent mx-auto mb-8 shadow-inner"
               />
               <h2 className="text-4xl font-black tracking-[0.3em] uppercase mb-4 animate-pulse">Neural AI <span className="text-accent underline decoration-accent/20 decoration-8">Joined</span></h2>
               <p className="text-accent-light text-sm font-black uppercase tracking-widest">System Link Established · Monitoring Active</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Futuristic Header Bar */}
      <div className="h-20 glass flex items-center justify-between px-10 border-b border-white/5 z-20 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-purple-600 rounded-xl flex items-center justify-center animate-mesh shadow-lg">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tighter">CONFERA <span className="text-accent text-glow text-sm">PRO</span></span>
            <div className="flex items-center gap-2 text-[10px] text-white/30 font-black uppercase tracking-widest leading-none">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              Secure Link: {roomId}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-12">
           <div className="flex items-center gap-6">
             <div className="flex flex-col items-center">
                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Productivity</span>
                <div className="flex items-center gap-2">
                   <Activity size={14} className="text-accent animate-pulse" />
                   <span className="text-lg font-black text-accent-light font-mono">{productivity}%</span>
                </div>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="flex items-center gap-2 group cursor-help">
               <Shield size={18} className="text-emerald-400" />
               <span className="text-xs text-white/40 font-bold uppercase tracking-widest group-hover:text-white transition-colors">E2E Sync</span>
             </div>
           </div>
           
           <button onClick={() => navigate('/dashboard')} className="flex items-center gap-3 px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg">
              Terminate Link
           </button>
        </div>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Main Grid View */}
        <div className={`flex-1 p-8 grid gap-6 transition-all duration-700 ease-in-out ${showChat ? 'mr-[28rem]' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 auto-rows-fr h-full">
            {/* User Personal Video - The Star */}
            <motion.div 
              layoutId="main-video"
              className="relative group rounded-[3rem] overflow-hidden glass-card p-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] border-white/5 h-full min-h-[400px]"
            >
              <video ref={userVideo} className="w-full h-full object-cover grayscale-[0.1] contrast-125" autoPlay muted playsInline />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
              
              <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center border-accent/40 shadow-xl overflow-hidden backdrop-blur-3xl">
                    {isMuted ? <MicOff className="text-red-400" size={20} /> : <div className="flex items-center gap-0.5"><div className="w-1 h-3 bg-accent animate-pulse" /><div className="w-1 h-5 bg-accent animate-pulse" style={{animationDelay: '0.2s'}} /><div className="w-1 h-3 bg-accent animate-pulse" style={{animationDelay: '0.4s'}} /></div>}
                  </div>
                  <div>
                    <h4 className="font-black text-2xl tracking-tighter">{userName}</h4>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40 italic">System Architect (You)</span>
                  </div>
                </div>
                {isCameraOff && (
                  <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-red-400 animate-pulse">
                    <VideoOff size={20} />
                  </div>
                )}
              </div>
              
              {/* UI Overlays */}
              <div className="absolute top-8 left-8 flex items-center gap-3">
                 <div className="px-5 py-2 glass rounded-2xl border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-blink" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-white/60">4K FEED · {Math.floor(Math.random() * 50) + 10}FPS</span>
                 </div>
              </div>

              {isCameraOff && (
                  <div className="absolute inset-0 bg-[#020205] flex flex-col items-center justify-center gap-8">
                    <div className="w-32 h-32 rounded-full border-4 border-white/5 flex items-center justify-center bg-white/5 relative">
                       <VideoOff size={64} className="text-white/10" />
                       <div className="absolute -inset-8 bg-accent/20 blur-[60px] rounded-full animate-pulse" />
                    </div>
                    <span className="text-xs uppercase font-black tracking-[0.5em] text-white/20">Video Sensor Offline</span>
                  </div>
              )}
            </motion.div>
            
            {/* Peer Mock Placeholders - Complex Designs */}
            <div className="relative rounded-[3rem] overflow-hidden bg-white/[0.01] border-2 border-dashed border-white/10 h-full min-h-[400px] flex items-center justify-center group hover:border-accent/30 transition-all duration-500">
                <div className="text-center">
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center mx-auto mb-10 border border-white/10 shadow-2xl relative group-hover:scale-110 transition-all duration-700">
                        <Users size={52} className="text-white/10 group-hover:text-accent/40 transition-all duration-700" />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent rounded-xl flex items-center justify-center border-4 border-[#020205] shadow-lg">
                           <MoreHorizontal className="text-white" size={20} />
                        </div>
                    </div>
                    <span className="text-[14px] text-white/20 uppercase tracking-[0.6em] font-black group-hover:text-accent-light transition-all transition-all">Awaiting Uplink</span>
                    <div className="mt-4 flex items-center justify-center gap-1.5">
                      <div className="w-1 h-1 bg-accent/30 rounded-full animate-bounce" />
                      <div className="w-1 h-1 bg-accent/30 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                      <div className="w-1 h-1 bg-accent/30 rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* AI Insight Side Panel - The "Jarvis" Sidebar */}
        <motion.div 
          initial={false}
          animate={{ x: showChat ? 0 : '100%' }}
          className="absolute right-0 top-0 bottom-0 w-[28rem] glass backdrop-blur-4xl border-l border-white/10 z-30 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.8)]"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-2xl border border-accent/40">
                <Brain size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tighter">NEURAL CO-PILOT</h3>
                <span className="text-[10px] text-accent/60 font-black tracking-widest uppercase">System Core Version 4.2</span>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="w-10 h-10 hover:bg-white/10 rounded-xl flex items-center justify-center transition-all bg-white/5">
               <Share2 size={18} className="text-white/40" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
            {/* Live Transcription Logic */}
            <div className="space-y-6">
              <div className="flex items-center justify-between text-[11px] font-black tracking-[0.3em] text-white/30 uppercase">
                <span className="flex items-center gap-2"><Zap size={14} className="text-amber-400" /> Real-time Feed</span>
                <span className="text-white/20">LIVE CAPTIONING</span>
              </div>
              <div className="p-6 glass shadow-inner rounded-[2rem] border-white/5 italic text-white/40 text-sm leading-relaxed relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 group-hover:bg-accent transition-all" />
                "Initializing meeting summaries and analyzing speaker sentiment patterns for the final roadmap review... 
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-4 bg-accent ml-1 align-middle"
                />"
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* AI Observations / Insights */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[11px] font-black tracking-[0.3em] text-accent uppercase">
                <Sparkles size={14} />
                Strategic Insights
              </div>
              <div className="space-y-4">
                {aiInsights.length > 0 ? aiInsights.map((insight, idx) => (
                   <motion.div 
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     key={idx} 
                     className="p-5 glass-card !rounded-2xl border-accent/20 !p-5 relative overflow-hidden group hover:bg-accent/[0.03]"
                   >
                     <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                        <Zap size={14} className="text-accent" />
                     </div>
                     <p className="text-sm font-bold text-accent-light leading-relaxed">
                       {insight.insight}
                     </p>
                   </motion.div>
                )) : (
                  <div className="py-12 text-center rounded-[2rem] border-2 border-dashed border-white/5">
                     <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity size={24} className="text-white/10" />
                     </div>
                     <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/10">Neural Scanner Active...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Smart Highlights Panel */}
            <div className="space-y-6">
               <div className="text-[11px] font-black tracking-[0.3em] text-white/30 uppercase">Module Timeline</div>
               <div className="space-y-6">
                  {messages.map((m, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={i} 
                      className={`flex flex-col ${m.userName === userName ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${m.userName === 'CONFERA CORE' ? 'text-accent' : 'text-white/40'}`}>
                           {m.userName === userName ? 'AUTHENTICATED AGENT' : m.userName}
                         </span>
                         {m.userName === 'CONFERA CORE' && <Zap size={10} className="text-accent animate-pulse" />}
                      </div>
                      <div className={`px-6 py-4 rounded-[1.8rem] text-sm leading-relaxed border ${m.userName === userName ? 'bg-accent/10 border-accent/20 text-white rounded-tr-none' : m.userName === 'CONFERA CORE' ? 'bg-accent/20 border-accent/40 text-accent-light italic' : 'glass border-white/10 rounded-tl-none text-white/80'}`}>
                        {m.message}
                      </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </div>

          {/* Integrated AI Tooling in Chat */}
          <div className="p-10 pt-4 bg-white/[0.02] border-t border-white/5">
            <form onSubmit={sendMessage} className="relative group">
              <input 
                type="text" 
                placeholder="Direct link to AI core..." 
                className="input-field pr-16 text-lg bg-[#050510] border-none ring-1 ring-white/10 focus:ring-accent/50 shadow-2xl transition-all h-20 placeholder:text-white/10"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
              />
              <button type="submit" className="absolute right-3 top-3 bottom-3 aspect-square flex items-center justify-center bg-accent text-white rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)] active:scale-95 hover:scale-105 transition-all">
                <Send size={28} />
              </button>
            </form>
            <div className="flex items-center justify-between mt-6">
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">
                  <MoreHorizontal size={14} /> Advanced Commands
               </button>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-light hover:scale-105 transition-all">
                  Generate Intel <Sparkles size={14} />
               </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Zoom-Style Control Bar (GLASS DOCK) */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-10 h-28 glass !rounded-[2.5rem] flex items-center gap-8 border-white/10 z-40 shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-5xl border-t border-white/20">
        
        <div className="flex items-center gap-6">
          <ControlButton 
            icon={isMuted ? <MicOff size={28} /> : <Mic size={28} />} 
            onClick={toggleMute} 
            active={!isMuted} 
            color="indigo" 
          />
          <ControlButton 
            icon={isCameraOff ? <VideoOff size={28} /> : <Video size={28} />} 
            onClick={toggleCamera} 
            active={!isCameraOff} 
            color="indigo" 
          />
        </div>

        <div className="w-px h-12 bg-white/10" />

        <div className="flex items-center gap-6">
          <ControlButton icon={<Share2 size={28} />} />
          <ControlButton 
             icon={<MessageSquare size={28} />} 
             onClick={() => setShowChat(!showChat)} 
             active={showChat}
             color="accent" 
          />
          <ControlButton icon={<MoreHorizontal size={28} />} />
        </div>

        <div className="w-px h-12 bg-white/10" />

        <motion.button 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-4 px-10 py-5 bg-red-600 hover:bg-red-700 text-white font-black rounded-[2rem] transition-all shadow-[0_15px_40px_-5px_rgba(220,38,38,0.5)] active:translate-y-1"
        >
          <PhoneOff size={24} />
          <span className="text-sm uppercase tracking-[0.2em]">Terminate</span>
        </motion.button>
      </div>

      {/* Background Ambience Controls */}
      <div className="fixed bottom-12 left-12 z-40 hidden xl:flex items-center gap-5">
         <div className="glass px-6 py-4 rounded-[2rem] border-white/5 flex items-center gap-4">
            <div className="flex -space-x-3">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-10 h-10 rounded-full border-4 border-[#020205] bg-gradient-to-br from-white/10 to-transparent shadow-xl" />
               ))}
               <div className="w-10 h-10 rounded-full border-4 border-[#020205] bg-accent flex items-center justify-center text-[10px] font-black shadow-xl">+9</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-xs text-white/40 font-bold uppercase tracking-widest leading-none">Modules Linked</span>
         </div>
      </div>
    </div>
  );
};

const ControlButton = ({ icon, onClick, active, color }) => (
  <motion.button 
    whileHover={{ scale: 1.1, y: -5 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`w-18 h-18 rounded-[1.8rem] flex items-center justify-center transition-all duration-300 relative border ${active 
        ? color === 'accent' ? 'bg-accent/20 border-accent text-accent shadow-[0_0_30px_rgba(99,102,241,0.4)]' : 'bg-white/10 border-white/20 text-white'
        : 'bg-white/5 border-white/5 text-white/30 hover:border-white/20 hover:text-white'
    }`}
  >
    {icon}
    {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]" />}
  </motion.button>
);

export default MeetingRoom;
