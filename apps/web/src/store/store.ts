import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (name, email) => set({ 
        user: { id: Math.random().toString(36).substring(7), name, email } 
      }),
      logout: () => set({ user: null }),
    }),
    { name: 'confera-auth' }
  )
);

interface Meeting {
  id: string;
  userId: string;
  title: string;
  date: string;
  recap?: {
    summary: string;
    points: string[];
    actions: string[];
  };
}

interface DataState {
  meetings: Meeting[];
  recordings: Meeting[];
  addMeeting: (meeting: Meeting) => void;
  saveRecording: (meeting: Meeting) => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      meetings: [],
      recordings: [],
      addMeeting: (meeting) => set((state) => ({ 
        meetings: [meeting, ...state.meetings] 
      })),
      saveRecording: (meeting) => set((state) => ({ 
        recordings: [meeting, ...state.recordings] 
      })),
    }),
    { name: 'confera-data' }
  )
);
