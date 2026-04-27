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
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setPendingSession: (session: PendingSession | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      pendingSession: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setPendingSession: (pendingSession) => set({ pendingSession }),
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Login failed');
          if (data.token) localStorage.setItem('token', data.token);
          set({ user: { id: data.user.id, name: data.user.name, email: data.user.email }, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      signup: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Signup failed');
          set({ user: { id: data.user.id, name: data.user.name, email: data.user.email }, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        set({ user: null, pendingSession: null });
      },
    }),
    {
      name: 'confera-auth',
    }
  )
);
