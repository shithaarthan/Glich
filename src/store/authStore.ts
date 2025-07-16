import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  username?: string; // Added username to match interactionStore
  isDemoMode?: boolean;
  isAuthenticated?: boolean;
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
  username: 'demo_user', // Added mock username
  isDemoMode: true,
  isAuthenticated: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isDemoMode: false,

      loginWithGoogle: async () => {
        console.log('loginWithGoogle function called');
        try {
          console.log('Fetching http://localhost:8000/auth/google/login...');
          const response = await fetch('http://localhost:8000/auth/google/login');
          console.log('Fetch response:', response);
          if (!response.ok) {
            console.error('Error getting Google OAuth URL:', response.status, response.statusText);
            return;
          }
          const data = await response.json();
          console.log('Fetch data:', data);
          if (data.url) {
            console.log('Redirecting to:', data.url);
            window.location.href = data.url;
          } else {
            console.error('Error getting Google OAuth URL:', data);
          }
        } catch (error) {
          console.error('Error during Google login:', error);
        }
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
          user: {
            id: 'mock-user-id-123',
            name: 'Demo User',
            email: 'demo@example.com',
            avatarUrl: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Example placeholder
            username: 'demo_user', // Added mock username
            isDemoMode: true,
            isAuthenticated: true,
          },
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
