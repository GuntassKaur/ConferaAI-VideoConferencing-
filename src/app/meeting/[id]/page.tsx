'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, LogOut, MessageSquare, Users, Video, Mic, Camera, Shield } from 'lucide-react';

export default function MeetingPage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [messages, setMessages] = useState<{user: string, text: string, time: string}[]>([]);
  const [inputText, setInputText] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(savedUser));
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(s => setStream(s))
      .catch(err => console.error("Media access denied:", err));
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages([...messages, { 
      user: user.name, 
      text: inputText, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setInputText('');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden">
      {/* Header */}
      <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between bg-slate-900/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Shield className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight">Secure Link: {id}</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">End-to-End Encrypted</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-slate-300">Identity: {user.name}</span>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all duration-300 font-bold text-sm border border-red-500/20"
          >
            <LogOut size={18} />
            Leave
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main Video Stage */}
        <main className="flex-1 p-6 flex flex-col items-center justify-center relative">
          <div className="w-full h-full max-w-5xl glass-card overflow-hidden relative shadow-2xl">
            {stream ? (
              <video 
                autoPlay 
                playsInline 
                muted 
                ref={el => { if(el) el.srcObject = stream; }} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center animate-pulse">
                  <Camera size={40} className="text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium">Calibrating optics...</p>
              </div>
            )}
            
            {/* Overlay User Name */}
            <div className="absolute bottom-6 left-6 px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-bold text-white">
              {user.name} (Host)
            </div>

            {/* Media Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white transition-all shadow-xl">
                 <Mic size={20} />
              </button>
              <button className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 text-white transition-all shadow-xl">
                 <Video size={20} />
              </button>
              <button 
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`w-12 h-12 ${isChatOpen ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-400'} hover:opacity-90 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 transition-all shadow-xl`}
              >
                 <MessageSquare size={20} />
              </button>
            </div>
          </div>
        </main>

        {/* Chat Sidebar */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.aside 
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              className="w-96 border-l border-white/5 flex flex-col bg-slate-900/40 backdrop-blur-xl"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-500" />
                  <h3 className="font-black text-white uppercase tracking-widest text-xs">Neural Feed</h3>
                </div>
                <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold text-slate-500">
                  {messages.length} MSG
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <MessageSquare size={48} className="mb-4" />
                    <p className="text-xs font-bold uppercase tracking-[.2em]">System Standby</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-indigo-400">{msg.user}</span>
                        <span className="text-[10px] text-slate-600">{msg.time}</span>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5 text-sm leading-relaxed text-slate-300">
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={sendMessage} className="p-6 border-t border-white/5">
                <div className="relative">
                  <input 
                    type="text" 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)} 
                    placeholder="Transmit message..." 
                    className="input-field w-full pr-12 text-sm"
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
