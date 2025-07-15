import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa'; // Replaced BrainCircuit with FaBrain
import { FcGoogle } from 'react-icons/fc';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, setDemoMode } = useAuthStore();

  const handleGoogleSignIn = async () => {
    console.log('Initiating Google Sign-In...');
    await loginWithGoogle();
    navigate('/feed');
  };

  const handleDemoMode = () => {
    console.log('Entering Demo Mode...');
    setDemoMode();
    navigate('/feed');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto bg-surface p-8 rounded-2xl border border-border shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <FaBrain className="mx-auto text-primary mb-4" size={48} /> {/* Used FaBrain */}
          <h1 className="text-3xl font-bold text-text">Welcome to Glitchary</h1>
          <p className="text-textSecondary">Share and discover AI conversations.</p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="mr-2" size={24} />
            <span>Sign in with Google</span>
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={handleDemoMode}
          >
            Use Demo Mode
          </Button>
        </div>

        <p className="text-center text-sm text-textSecondary mt-8">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="font-semibold text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-semibold text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Auth;
