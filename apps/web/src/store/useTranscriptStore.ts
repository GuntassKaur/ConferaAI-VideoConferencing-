import { create } from 'zustand';

interface TranscriptEntry {
  participant: string;
  text: string;
  timestamp: number;
}

interface TranscriptState {
  transcript: TranscriptEntry[];
  addEntry: (participant: string, text: string) => void;
  clearTranscript: () => void;
  getFullText: () => string;
}

export const useTranscriptStore = create<TranscriptState>((set, get) => ({
  transcript: [],
  addEntry: (participant, text) => set((state) => ({
    transcript: [...state.transcript, { participant, text, timestamp: Date.now() }]
  })),
  clearTranscript: () => set({ transcript: [] }),
  getFullText: () => {
    return get().transcript.map(entry => `[${entry.participant}]: ${entry.text}`).join('\n');
  }
}));
