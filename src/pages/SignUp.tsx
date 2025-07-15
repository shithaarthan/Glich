import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, setDemoMode } = useAuthStore();

  const handleGoogleSignUp = async () => {
    console.log('Initiating Google Sign-Up...');
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
          <h1 className="text-3xl font-bold text-text">Create Your Account</h1>
          <p className="text-text-muted">Join Glitchary and start sharing.</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Username</label>
            <Input type="text" placeholder="your_username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Sign Up
          </Button>
        </form>

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
            variant="secondary"
            size="lg"
            className="w-full flex items-center justify-center space-x-2"
            onClick={handleGoogleSignUp}
          >
            <FcGoogle size={24} />
            <span>Sign up with Google</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleDemoMode}
          >
            Try Demo Mode
          </Button>
        </div>

        <p className="text-center text-sm text-text-muted mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
