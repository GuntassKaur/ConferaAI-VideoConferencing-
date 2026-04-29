import { useState, useEffect } from 'react';
import { useTranscriptStore } from '@/store/useTranscriptStore';
import { useLiveTranslation } from '@/hooks/useLiveTranslation';
import { Settings, Globe, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'zh', name: 'Chinese' }
];

export function LiveCaptions() {
  const { segments, preferredLanguage, setPreferredLanguage } = useTranscriptStore();
  const [showSettings, setShowSettings] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [opacity, setOpacity] = useState(80);
  const [active, setActive] = useState(false);
  
  // Run the translation worker hook
  useLiveTranslation();
  
  // Get the most recent 2 segments for the display bar
  const displaySegments = segments.slice(-2);

  // Auto clear captions if no one has spoken for 5 seconds
  useEffect(() => {
    if (segments.length === 0) return;
    setActive(true);
    const timeout = setTimeout(() => {
      setActive(false);
    }, 5000); 

    return () => clearTimeout(timeout);
  }, [segments]);

  // Color coding by speaker ID
  const getSpeakerColor = (speakerId: string) => {
    if (speakerId === 'local') return '#818cf8'; 
    const colors = ['#c084fc', '#f472b6', '#2dd4bf', '#fbbf24']; 
    let hash = 0;
    for (let i = 0; i < speakerId.length; i++) hash = speakerId.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  // If captions are disabled or inactive
  if (!active && !showSettings && segments.length > 0) {
     return (
        <div className="absolute bottom-6 right-6 z-50">
           <button onClick={() => setShowSettings(true)} className="p-3 bg-black/50 hover:bg-black/80 rounded-full text-white/60 hover:text-white backdrop-blur-md border border-white/10 shadow-xl transition-all">
             <Settings className="w-5 h-5" />
           </button>
        </div>
     );
  }

  if (segments.length === 0 && !showSettings) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 flex flex-col items-center">
      
      {/* Settings Popover */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-6 bg-black/95 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl w-80 shadow-2xl flex flex-col space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-white font-medium flex items-center"><Globe className="w-4 h-4 mr-2 text-indigo-400"/> Caption Settings</h3>
              <button onClick={() => setShowSettings(false)} className="text-white/50 hover:text-white bg-white/5 p-1.5 rounded-lg transition-colors"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Translate To</label>
              <select 
                value={preferredLanguage} 
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500/50 text-sm transition-colors cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l.code} value={l.code} className="bg-zinc-800">{l.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex justify-between">
                <span>Font Size</span>
                <span className="text-indigo-400">{fontSize}px</span>
              </label>
              <input type="range" min="16" max="48" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-wider flex justify-between">
                <span>Background Opacity</span>
                <span className="text-indigo-400">{opacity}%</span>
              </label>
              <input type="range" min="0" max="100" value={opacity} onChange={(e) => setOpacity(parseInt(e.target.value))} className="w-full accent-indigo-500 cursor-pointer" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Captions Display Area */}
      <div className="w-full flex flex-col items-center space-y-2 group relative transition-all px-4">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`absolute -right-2 md:-right-12 bottom-0 p-3 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-full transition-all border border-white/10 shadow-2xl ${showSettings ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} text-white/60 hover:text-white`}
          title="Caption Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <AnimatePresence mode="popLayout">
          {displaySegments.map((segment) => {
            const isTranslating = preferredLanguage !== 'en' && segment.isFinal && (!segment.translations || !segment.translations[preferredLanguage]);
            
            let displayText = segment.text;
            if (preferredLanguage !== 'en' && segment.translations && segment.translations[preferredLanguage]) {
               displayText = segment.translations[preferredLanguage];
            } else if (isTranslating) {
               displayText = `${segment.text} (Translating...)`;
            }

            const notes = segment.culturalNotes && segment.culturalNotes.length > 0 ? segment.culturalNotes : null;

            return (
              <motion.div
                key={segment.id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.95 }}
                className="flex flex-col items-center w-full"
              >
                <div 
                  className="px-6 py-4 rounded-3xl flex items-start space-x-4 max-w-4xl shadow-2xl border border-white/5 backdrop-blur-md w-fit"
                  style={{ backgroundColor: `rgba(0, 0, 0, ${opacity / 100})` }}
                >
                  <span 
                    className="font-bold shrink-0 mt-1.5 drop-shadow-md tracking-wide"
                    style={{ color: getSpeakerColor(segment.speakerId), fontSize: `${Math.max(12, fontSize * 0.6)}px` }}
                  >
                    {segment.speakerName}
                  </span>
                  
                  <div className="flex flex-col">
                    <span 
                      className="text-white font-medium drop-shadow-lg leading-snug tracking-wide"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {displayText}
                    </span>
                    
                    {notes && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 text-emerald-400 italic flex flex-col space-y-1.5 border-t border-white/10 pt-3"
                      >
                        {notes.map((note, idx) => (
                          <span key={idx} style={{ fontSize: `${Math.max(11, fontSize * 0.55)}px` }} className="flex items-start">
                            <span className="mr-2">💡</span> {note}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
