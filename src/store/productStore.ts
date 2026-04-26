import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Meeting {
  id: string;
  title: string;
  createdAt: string;
  duration?: string;
  aiRecap?: {
    title: string;
    tldr: string;
    keyPoints: string[];
    actionItems: { task: string; owner: string }[];
    decisions?: string[];
    sentiment?: string;
    engagementScore?: number;
  };
}

export interface User {
  id: string;
  name: string;
  meetings: Meeting[];
  recordings: Meeting[];
}

interface ProductState {
  currentUser: User | null;
  login: (name: string) => void;
  logout: () => void;
  addMeeting: (meeting: Meeting) => void;
  saveRecording: (meetingId: string, recap: Meeting['aiRecap']) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (name) => set({ 
        currentUser: { id: Math.random().toString(36).substring(7), name, meetings: [], recordings: [] } 
      }),
      logout: () => set({ currentUser: null }),
      addMeeting: (meeting) => set((state) => {
        if (!state.currentUser) return state;
        return {
          currentUser: {
            ...state.currentUser,
            meetings: [meeting, ...state.currentUser.meetings]
          }
        };
      }),
      saveRecording: (meetingId, recap) => set((state) => {
        if (!state.currentUser) return state;
        const meeting = state.currentUser.meetings.find(m => m.id === meetingId);
        if (!meeting) return state;
        const recordedMeeting = { ...meeting, aiRecap: recap };
        return {
          currentUser: {
            ...state.currentUser,
            recordings: [recordedMeeting, ...state.currentUser.recordings]
          }
        };
      }),
    }),
    { name: 'confera-production-storage' }
  )
);
