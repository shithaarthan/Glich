import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import Feed from './pages/Feed';
import Auth from './pages/Auth';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Communities from './pages/Communities';
import TuneIn from './pages/TuneIn';
import Activity from './pages/Activity';

import MainLayout from './components/layout/MainLayout';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isDemoMode } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;

  if (!isUserLoggedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Component to handle root path redirection
function RootRedirect() {
  const { isAuthenticated, isDemoMode } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;

  if (isUserLoggedIn) {
    return <Navigate to="/feed" replace />;
  } else {
    return <Navigate to="/auth" replace />;
  }
}

function App() {
  const { isAuthenticated, isDemoMode } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;

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

          {/* Protected Routes wrapped in MainLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="feed" element={<Feed />} />
            <Route path="profile/:userId" element={<Profile />} />
            <Route path="communities" element={<Communities />} />
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