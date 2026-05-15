import { create } from 'zustand';

export interface TranscriptItem {
  id: string;
  speaker: string;
  text: string;
  timestamp: Date;
}

interface RoomState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  transcripts: TranscriptItem[];
  addTranscript: (t: TranscriptItem) => void;
  activeSpeaker: string | null;
  setActiveSpeaker: (speaker: string | null) => void;
  isSummarizing: boolean;
  setIsSummarizing: (isSummarizing: boolean) => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
  viewMode: 'grid' | 'together';
  setViewMode: (mode: 'grid' | 'together') => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  transcripts: [],
  addTranscript: (t) => set((state) => ({ transcripts: [...state.transcripts, t] })),
  activeSpeaker: null,
  setActiveSpeaker: (activeSpeaker) => set({ activeSpeaker }),
  isSummarizing: false,
  setIsSummarizing: (isSummarizing) => set({ isSummarizing }),
  focusMode: false,
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
  viewMode: 'grid',
  setViewMode: (viewMode) => set({ viewMode }),
}));
