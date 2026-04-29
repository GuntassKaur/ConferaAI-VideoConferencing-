import { create } from 'zustand';

export interface Highlight {
  id: string;
  type: 'decision' | 'action_item' | 'question' | 'key_moment';
  text: string;
  timestamp: number;
  importance: number; // 1-5
}

export interface TopicSegment {
  id: string;
  topic: string;
  startTime: number;
  endTime?: number;
  color: string;
}

export interface TranscriptSegment {
  id: string;
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: number;
  confidence: number;
  isFinal: boolean;
  translations?: Record<string, string>; // e.g. { 'es': 'Hola', 'fr': 'Bonjour' }
  culturalNotes?: string[];
}

interface TranscriptStore {
  meetingStartTime: number | null;
  preferredLanguage: string;
  segments: TranscriptSegment[];
  highlights: Highlight[];
  topics: TopicSegment[];
  
  setMeetingStartTime: (time: number) => void;
  setPreferredLanguage: (lang: string) => void;
  addSegment: (segment: Omit<TranscriptSegment, 'id'>) => void;
  updateLastSegment: (speakerId: string, text: string, isFinal: boolean, confidence: number) => void;
  updateSegmentTranslation: (id: string, lang: string, translation: string, notes?: string[]) => void;
  addHighlights: (newHighlights: Omit<Highlight, 'id'>[]) => void;
  addTopic: (topic: Omit<TopicSegment, 'id'>) => void;
  getFullTranscript: () => string;
  clearTranscript: () => void;
}

export const useTranscriptStore = create<TranscriptStore>((set, get) => ({
  meetingStartTime: null,
  preferredLanguage: 'en',
  segments: [],
  highlights: [],
  topics: [],
  
  setMeetingStartTime: (time) => set({ meetingStartTime: time }),
  setPreferredLanguage: (lang) => set({ preferredLanguage: lang }),
  
  addSegment: (segment) => set((state) => ({
    segments: [...state.segments, { ...segment, id: Math.random().toString(36).substring(7), translations: {}, culturalNotes: [] }]
  })),

  updateLastSegment: (speakerId, text, isFinal, confidence) => set((state) => {
    const segments = [...state.segments];
    // Find the last segment for this speaker that is not final yet
    for (let i = segments.length - 1; i >= 0; i--) {
      if (segments[i].speakerId === speakerId && !segments[i].isFinal) {
        segments[i] = { ...segments[i], text, isFinal, confidence };
        return { segments };
      }
    }
    
    // If no unfinalized segment exists, create a new one
    segments.push({
      id: Math.random().toString(36).substring(7),
      speakerId,
      speakerName: speakerId === 'local' ? 'You' : `Guest ${speakerId.substring(0,4)}`,
      text,
      timestamp: Date.now(),
      confidence,
      isFinal,
      translations: {},
      culturalNotes: []
    });
    return { segments };
  }),

  updateSegmentTranslation: (id, lang, translation, notes) => set((state) => ({
    segments: state.segments.map(s => 
      s.id === id ? { 
        ...s, 
        translations: { ...s.translations, [lang]: translation },
        culturalNotes: notes && notes.length > 0 ? [...(s.culturalNotes || []), ...notes] : s.culturalNotes
      } : s
    )
  })),

  getFullTranscript: () => {
    return get().segments.map(s => `[${new Date(s.timestamp).toLocaleTimeString()}] ${s.speakerName}: ${s.text}`).join('\n');
  },

  addHighlights: (newHighlights) => set((state) => ({
    highlights: [...state.highlights, ...newHighlights.map(h => ({ ...h, id: Math.random().toString(36).substring(7) }))]
  })),

  addTopic: (topic) => set((state) => ({
    topics: [...state.topics, { ...topic, id: Math.random().toString(36).substring(7) }]
  })),

  clearTranscript: () => set({ segments: [], highlights: [], topics: [], meetingStartTime: null })
}));
