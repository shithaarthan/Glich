import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion'; // Import motion for overlay

import Feed from './pages/Feed';
// import Login from './pages/Login'; // Removed
// import SignUp from './pages/SignUp'; // Removed
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Communities from './pages/Communities';
import TuneIn from './pages/TuneIn';

import Layout from './components/layout/Layout'; // Keep if used elsewhere, but not directly in App.tsx for main layout
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore'; // Import useUIStore

const queryClient = new QueryClient();

// Component to handle root path redirection
function RootRedirect() {
  const { isAuthenticated, isDemoMode } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;
  const location = useLocation();

  // If the user is logged in, redirect to feed. Otherwise, redirect to auth.
  // This component will only be rendered for the root path '/'.
  if (isUserLoggedIn) {
    return <Navigate to="/feed" replace />;
  } else {
    // If the current location is already '/auth', don't redirect again to avoid loops.
    // Otherwise, redirect to '/auth'.
    return location.pathname === '/auth' ? <Auth /> : <Navigate to="/auth" replace />;
  }
}

function App() {
  const { isAuthenticated, isDemoMode } = useAuthStore();
  const isUserLoggedIn = isAuthenticated || isDemoMode;
  const { isSidebarOpen, closeSidebar } = useUIStore(); // Get sidebar state and close function

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex min-h-screen bg-background text-text">
          {isUserLoggedIn && <Sidebar />}

          <div className="flex-1 flex flex-col overflow-hidden">
            {isUserLoggedIn && <Header />}

            <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-8">
              <Routes>
                {/* Root path handling */}
                <Route path="/" element={<RootRedirect />} />

                {/* Authentication Routes */}
                <Route path="/auth" element={!isUserLoggedIn ? <Auth /> : <Navigate to="/feed" replace />} />
                {/* Removed Login and SignUp routes */}
                {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/signup" element={<SignUp />} /> */}

                {/* Protected Routes */}
                <Route
                  path="/feed"
                  element={isUserLoggedIn ? <Feed /> : <Navigate to="/auth" replace />}
                />
                <Route
                  path="/profile/:userId"
                  element={isUserLoggedIn ? <Profile /> : <Navigate to="/auth" replace />}
                />
                <Route
                  path="/communities"
                  element={isUserLoggedIn ? <Communities /> : <Navigate to="/auth" replace />}
                />
                <Route
                  path="/tune-in"
                  element={isUserLoggedIn ? <TuneIn /> : <Navigate to="/auth" replace />}
                />

                {/* Fallback Route: For any other paths, redirect based on auth status */}
                <Route
                  path="*"
                  element={isUserLoggedIn ? <Navigate to="/feed" replace /> : <Navigate to="/auth" replace />}
                />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster richColors position="top-right" />
        <ReactQueryDevtools initialIsOpen={false} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
