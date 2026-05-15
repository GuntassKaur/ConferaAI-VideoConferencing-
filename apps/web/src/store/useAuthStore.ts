import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isInitialized: false,
      setUser: (user) => set({ user }),
      
      initialize: () => {
        if (get().isInitialized) return;
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              set({ user: { id: firebaseUser.uid, name: userData.name, email: firebaseUser.email! }, isInitialized: true });
            } else {
              set({ user: { id: firebaseUser.uid, name: firebaseUser.displayName || 'User', email: firebaseUser.email! }, isInitialized: true });
            }
          } else {
            set({ user: null, isInitialized: true });
          }
        });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const name = userDoc.exists() ? userDoc.data().name : (firebaseUser.displayName || 'User');
          
          set({ user: { id: firebaseUser.uid, name, email: firebaseUser.email! }, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          let message = 'Login failed';
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            message = 'Invalid email or password';
          } else if (error.code === 'auth/too-many-requests') {
            message = 'Too many failed attempts. Please try again later.';
          }
          throw new Error(message);
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          await updateProfile(firebaseUser, { displayName: name });
          
          // Store user in Firestore
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            name,
            email,
            createdAt: new Date().toISOString(),
          });

          set({ user: { id: firebaseUser.uid, name, email: firebaseUser.email! }, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          let message = 'Signup failed';
          if (error.code === 'auth/email-already-in-use') {
            message = 'Email already in use';
          }
          throw new Error(message);
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ user: null });
      },
    }),
    {
      name: 'confera-auth-v2',
    }
  )
);
