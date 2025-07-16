import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const SignUp: React.FC = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto bg-surface p-8 rounded-2xl border border-border shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <FaBrain className="mx-auto text-primary mb-4" size={48} />
          <h1 className="text-3xl font-bold text-text">Welcome to Glitchary</h1>
          <p className="text-text-muted">A place to share and discover creative conversations with AI.</p>
        </div>
        
        <div className="mt-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-text-muted">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleDemoMode}
          >
            Try Demo Mode
          </Button>

          {/* Adding a distinct Sign Up button */}
          <Button
            variant="primary" // Using primary for emphasis
            size="lg"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleGoogleSignIn} // Changed handler to Google sign-in
          >
            <FcGoogle size={24} /> {/* Added Google icon */}
            <span>Sign up with Google</span> {/* Changed text */}
          </Button>
        </div>

        {/* Removed the redundant "New user? Sign up here" link as we now have a dedicated button */}
        {/* The original "Already have an account? Log In" link is also not present in the image, so I'm omitting it */}
      </div>
    </div>
  );
};

export default SignUp;
