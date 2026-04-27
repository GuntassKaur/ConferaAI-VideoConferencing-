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

interface ProductState {
  meetings: Meeting[];
  recordings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  saveRecording: (meetingId: string, recap: Meeting['aiRecap']) => void;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set) => ({
      meetings: [],
      recordings: [],
      addMeeting: (meeting) => set((state) => ({
        meetings: [meeting, ...state.meetings]
      })),
      saveRecording: (meetingId, recap) => set((state) => {
        const meeting = state.meetings.find(m => m.id === meetingId);
        if (!meeting) return state;
        const recordedMeeting = { ...meeting, aiRecap: recap };
        return {
          recordings: [recordedMeeting, ...state.recordings]
        };
      }),
    }),
    { name: 'confera-production-storage' }
  )
);
