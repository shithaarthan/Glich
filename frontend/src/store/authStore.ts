import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string;
  bio: string;
  isDemoMode?: boolean;
}

interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  hasProfile: boolean; // New state to track if profile is created
  loading: boolean;
  isDemoMode: boolean;
  setUser: (user: UserProfile | null) => void;
  setHasProfile: (hasProfile: boolean) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuth: () => void;
  setDemoMode: () => void;
  clearDemoMode: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      hasProfile: false, // Initialize new state
      loading: true,
      isDemoMode: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setHasProfile: (hasProfile) => set({ hasProfile }),
      setSession: (session) => set({ session, isAuthenticated: !!session }),
      setLoading: (loading) => set({ loading }),

      loginWithGoogle: async () => {
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/auth/callback`,
            },
          });
          if (error) throw error;
        } catch (error) {
          console.error('Error with Google OAuth:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (error) {
          console.error('Error logging out:', error);
        } finally {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            hasProfile: false, // Clear hasProfile on logout
            isDemoMode: false,
          });
        }
      },

      clearAuth: () => {
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          hasProfile: false, // Clear hasProfile
          loading: false,
        });
      },

      setDemoMode: () => {
        set({
          user: {
            id: 'mock-user-id-123',
            username: 'Demo User',
            avatar_url: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
            bio: 'This is a demo account.',
          },
          isAuthenticated: true,
          isDemoMode: true,
        });
        window.location.href = '/feed';
      },

      clearDemoMode: () => {
        set({
          isDemoMode: false,
        });
      },
    }),
    {
      name: 'glitchary-auth-storage',
      partialize: (state) => {
        if (state.isDemoMode) {
          return { isDemoMode: true };
        }
        return { user: state.user, session: state.session, isAuthenticated: state.isAuthenticated, hasProfile: state.hasProfile, isDemoMode: state.isDemoMode };
      },
    }
  )
);
