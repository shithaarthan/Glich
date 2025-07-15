import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  setDemoMode: () => void;
  clearDemoMode: () => void;
}

// Mock user data for demo mode and initial state
const mockUser = {
  id: 'mock-user-id-123',
  name: 'Demo User',
  email: 'demo@example.com',
  avatarUrl: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Example placeholder
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDemoMode: false,

      loginWithGoogle: async () => {
        // In a real app, this would involve integrating with a Google OAuth provider (e.g., using Supabase Auth, Firebase Auth, or a custom backend)
        // For this example, we'll simulate a successful login with mock data.
        console.log('Simulating Google Login...');
        set({
          user: mockUser,
          isAuthenticated: true,
          isDemoMode: false,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isDemoMode: false,
        });
        // In a real app, you would also clear tokens from local storage/cookies and redirect to the login page.
        window.location.href = '/auth'; // Redirect to auth page
      },

      setDemoMode: () => {
        set({
          user: mockUser, // Use mock user for demo mode
          isAuthenticated: true, // Treat demo mode as authenticated for app access
          isDemoMode: true,
        });
      },

      clearDemoMode: () => {
        set({
          isDemoMode: false,
        });
      },
    }),
    {
      name: 'glitchary-auth-storage', // name of slice-specific storage (default is 'state')
      // Optionally, you can specify a storage mechanism like localStorage or sessionStorage
      // getStorage: () => sessionStorage, // uncomment to use sessionStorage
    }
  )
);
