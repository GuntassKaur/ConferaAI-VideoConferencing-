import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface PendingSession {
  roomId: string;
  timestamp: number;
}

interface AuthState {
  user: User | null;
  pendingSession: PendingSession | null;
  setUser: (user: User | null) => void;
  setPendingSession: (session: PendingSession | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pendingSession: null,
      setUser: (user) => set({ user }),
      setPendingSession: (pendingSession) => set({ pendingSession }),
      logout: () => {
        set({ user: null, pendingSession: null });
      },
    }),
    {
      name: 'confera-auth',
    }
  )
);
