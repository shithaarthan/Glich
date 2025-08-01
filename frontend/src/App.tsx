import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import Feed from './pages/Feed';
import Auth from './pages/Auth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Communities from './pages/Communities';
import Community from './pages/Community';
import TuneIn from './pages/TuneIn';
import Activity from './pages/Activity';
import AuthCallback from './pages/AuthCallback';
import CreateProfile from './pages/CreateProfile';

import MainLayout from './components/layout/MainLayout';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabaseClient';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isDemoMode, hasProfile, loading } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;

  // Show loading state while checking auth
  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>;
  }

  if (!isUserLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in but hasn't created a profile, redirect to create-profile
  if (isUserLoggedIn && !hasProfile) {
    return <Navigate to="/create-profile" replace />;
  }

  return <>{children}</>;
};

// Component to handle root path redirection
function RootRedirect() {
  const { isAuthenticated, isDemoMode, hasProfile, loading } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;

  // Show loading state while checking auth
  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>;
  }

  if (isUserLoggedIn) {
    if (!hasProfile) {
      return <Navigate to="/create-profile" replace />;
    }
    return <Navigate to="/feed" replace />;
  } else {
    return <Navigate to="/auth" replace />;
  }
}

function App() {
  const { setUser, setSession, setLoading, clearAuth, hasProfile } = useAuthStore();

  useEffect(() => {
    // Initial auth check
    const checkInitialAuth = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            clearAuth();
          } else if (profile) {
            setSession(session);
            setUser(profile);
          } else {
            setSession(session);
            useAuthStore.setState({ hasProfile: false });
          }
        } else {
          clearAuth();
        }
      } catch (error) {
        console.error('Error checking initial auth:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    checkInitialAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        if (event === 'SIGNED_IN' && session) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile:', error);
            clearAuth();
          } else if (profile) {
            setSession(session);
            setUser(profile);
          } else {
            setSession(session);
            useAuthStore.setState({ hasProfile: false });
          }
        } else if (event === 'SIGNED_OUT') {
          clearAuth();
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession, setUser, setLoading, clearAuth]);

  const { isAuthenticated, isDemoMode, loading } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;

  // Show loading state while checking auth
  if (loading) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Root path handling */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Routes */}
          <Route path="/auth" element={!isUserLoggedIn ? <Auth /> : <Navigate to="/feed" replace />} />
          <Route path="/login" element={!isUserLoggedIn ? <Login /> : <Navigate to="/feed" replace />} />
          <Route path="/signup" element={!isUserLoggedIn ? <SignUp /> : <Navigate to="/feed" replace />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Create Profile Route - accessible if logged in but no profile */}
          <Route 
            path="/create-profile" 
            element={isUserLoggedIn && !hasProfile ? <CreateProfile /> : <Navigate to="/feed" replace />} 
          />

          {/* Protected Routes wrapped in MainLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="feed" element={<Feed />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="communities" element={<Communities />} />
            <Route path="community/:id" element={<Community />} />
            <Route path="tune-in" element={<TuneIn />} />
            <Route path="activity" element={<Activity />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={isUserLoggedIn ? <Navigate to="/feed" replace /> : <Navigate to="/auth" replace />} />
        </Routes>
        
        <Toaster richColors position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
