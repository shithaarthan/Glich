import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, setDemoMode } = useAuthStore();

  const handleGoogleLogin = async () => {
    console.log('Initiating Google Login...');
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
          <h1 className="text-3xl font-bold text-text">Welcome Back</h1>
          <p className="text-text-muted">Log in to continue to Glitchary.</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-2">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" size="lg">
            Log In
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
            onClick={handleGoogleLogin}
          >
            <FcGoogle size={24} />
            <span>Sign in with Google</span>
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
          Don't have an account?{' '}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
