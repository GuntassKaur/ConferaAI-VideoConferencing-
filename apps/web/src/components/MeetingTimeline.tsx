import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranscriptStore } from '@/store/useTranscriptStore';
import { Search, ChevronLeft, ChevronRight, Wand2, Circle, HelpCircle, Star, Diamond } from 'lucide-react';

export function MeetingTimeline() {
  const { segments, highlights, meetingStartTime, topics } = useTranscriptStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]); 
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  
  const [isMagicClipMode, setIsMagicClipMode] = useState(false);
  const [clipStart, setClipStart] = useState<number | null>(null);
  const [clipEnd, setClipEnd] = useState<number | null>(null);
  const [clipSummary, setClipSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(Date.now());
  
  useEffect(() => {
    const int = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(int);
  }, []);

  const duration = Math.max(1000, now - (meetingStartTime || now));

  // Search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const results = segments
      .filter(s => s.text.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(s => s.timestamp);
    setSearchResults(results);
    setCurrentSearchIndex(0);
  }, [searchQuery, segments]);

  const getPosition = (timestamp: number) => {
    if (!meetingStartTime) return 0;
    const pos = ((timestamp - meetingStartTime) / duration) * 100;
    return Math.max(0, Math.min(100, pos));
  };

  const getMarkerIcon = (type: string) => {
    switch(type) {
      case 'decision': return <Diamond className="w-3 h-3 text-emerald-400" fill="currentColor" />;
      case 'action_item': return <Circle className="w-3 h-3 text-blue-400" fill="currentColor" />;
      case 'question': return <HelpCircle className="w-3 h-3 text-orange-400" />;
      case 'key_moment': return <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />;
      default: return <Circle className="w-2 h-2 text-white" />;
    }
  };

  const generateMagicClip = async () => {
    if (!clipStart || !clipEnd) return;
    setIsSummarizing(true);
    setClipSummary("Analyzing clip with Claude AI...");
    try {
      const selectedSegments = segments.filter(s => s.timestamp >= Math.min(clipStart, clipEnd) && s.timestamp <= Math.max(clipStart, clipEnd));
      const transcriptStr = selectedSegments.map(s => `${s.speakerName}: ${s.text}`).join('\n');
      
      const res = await fetch('/api/timeline/analyze', {
        method: 'POST',
        body: JSON.stringify({ action: 'magic_clip', transcript: transcriptStr })
      });
      const data = await res.json();
      setClipSummary(data.summary || "Summary generated successfully.");
    } catch (e) {
      setClipSummary("Failed to generate summary.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !meetingStartTime) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const clickTime = meetingStartTime + (percent * duration);

    if (isMagicClipMode) {
      if (clipStart === null) {
        setClipStart(clickTime);
      } else if (clipEnd === null) {
        setClipEnd(clickTime);
      } else {
        setClipStart(clickTime);
        setClipEnd(null);
        setClipSummary(null);
      }
    } else {
      // Jump to transcript moment logic
      console.log('Jump to:', new Date(clickTime));
    }
  };

  if (!meetingStartTime) return null;

  return (
    <div className="w-full bg-black/40 backdrop-blur-xl border-t border-white/10 p-4 flex flex-col space-y-4 relative z-40">
      {/* Top Bar: Search & Magic Clip */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 bg-white/5 rounded-xl px-3 py-1.5 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
          <Search className="w-4 h-4 text-white/40" />
          <input 
            type="text" 
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-white w-48 placeholder-white/40"
          />
          {searchResults.length > 0 && (
            <div className="flex items-center space-x-1 text-xs text-white/50 border-l border-white/10 pl-2">
              <span>{currentSearchIndex + 1}/{searchResults.length}</span>
              <button onClick={() => setCurrentSearchIndex(prev => Math.max(0, prev - 1))} className="hover:text-white transition-colors"><ChevronLeft className="w-4 h-4"/></button>
              <button onClick={() => setCurrentSearchIndex(prev => Math.min(searchResults.length - 1, prev + 1))} className="hover:text-white transition-colors"><ChevronRight className="w-4 h-4"/></button>
            </div>
          )}
        </div>

        <button 
          onClick={() => { setIsMagicClipMode(!isMagicClipMode); setClipStart(null); setClipEnd(null); setClipSummary(null); }}
          className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${isMagicClipMode ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'}`}
        >
          <Wand2 className="w-4 h-4" />
          <span>Magic Clip</span>
        </button>
      </div>

      {/* Timeline Scrubber */}
      <div className="relative w-full h-8 cursor-pointer group" onClick={handleTimelineClick} ref={containerRef}>
        {/* Base Track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-white/10 rounded-full overflow-hidden">
           {/* Progress Fill */}
           <div className="absolute top-0 bottom-0 left-0 bg-white/20 transition-all duration-1000" style={{ width: '100%' }} />
           
           {/* Topics Backgrounds */}
           {topics?.map(topic => {
             const startPos = getPosition(topic.startTime);
             const endPos = topic.endTime ? getPosition(topic.endTime) : 100;
             return (
               <div 
                 key={topic.id}
                 className="absolute top-0 bottom-0 opacity-40 mix-blend-screen"
                 style={{ left: `${startPos}%`, width: `${endPos - startPos}%`, backgroundColor: topic.color }}
               />
             );
           })}
        </div>

        {/* Search Results Matches */}
        {searchResults.map((time, i) => (
          <div 
            key={`search-${i}`}
            className={`absolute top-1/2 -translate-y-1/2 w-1.5 rounded-full transition-all ${i === currentSearchIndex ? 'bg-indigo-400 h-5 z-10 shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'bg-white/40 h-3'}`}
            style={{ left: `${getPosition(time)}%`, transform: 'translate(-50%, -50%)' }}
          />
        ))}

        {/* Highlight Markers */}
        {highlights?.map(hl => (
          <div 
            key={hl.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 group/marker z-20"
            style={{ left: `${getPosition(hl.timestamp)}%` }}
          >
            <div className={`p-1 rounded-full bg-black border border-white/20 shadow-lg transition-transform group-hover/marker:scale-125 ${hl.importance === 5 ? 'ring-2 ring-yellow-400/50' : ''}`}>
              {getMarkerIcon(hl.type)}
            </div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 p-3 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none shadow-2xl">
              <div className="flex items-center space-x-1.5 mb-1.5">
                {getMarkerIcon(hl.type)}
                <span className="text-xs text-white/60 capitalize font-medium">{hl.type.replace('_', ' ')}</span>
              </div>
              <p className="text-sm text-white line-clamp-3 leading-snug">{hl.text}</p>
              <div className="mt-2 text-[10px] text-white/40 font-mono">
                {new Date(hl.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {/* Magic Clip Selection */}
        {isMagicClipMode && clipStart && (
          <div 
            className="absolute top-1/2 -translate-y-1/2 h-full bg-indigo-500/30 border-x-2 border-indigo-400 pointer-events-none rounded-sm transition-all"
            style={{
              left: `${getPosition(Math.min(clipStart, clipEnd || now))}%`,
              width: `${clipEnd ? getPosition(Math.max(clipStart, clipEnd)) - getPosition(Math.min(clipStart, clipEnd)) : getPosition(now) - getPosition(clipStart)}%`
            }}
          />
        )}
      </div>

      {/* Magic Clip Action Panel */}
      <AnimatePresence>
        {isMagicClipMode && (clipStart || clipSummary) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between backdrop-blur-md">
              <div className="flex-1">
                {clipSummary ? (
                  <p className="text-sm text-indigo-100 leading-relaxed"><span className="font-semibold text-indigo-300">AI Summary:</span> {clipSummary}</p>
                ) : (
                  <p className="text-sm text-indigo-300 flex items-center">
                    <Wand2 className="w-4 h-4 mr-2" />
                    {clipEnd ? "Clip bounded. Ready to generate magic summary." : "Select the end point of your clip on the timeline."}
                  </p>
                )}
              </div>
              {clipEnd && !clipSummary && (
                <button 
                  onClick={generateMagicClip}
                  disabled={isSummarizing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors ml-4 flex items-center whitespace-nowrap"
                >
                  {isSummarizing ? "Analyzing..." : "Generate Summary"}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
