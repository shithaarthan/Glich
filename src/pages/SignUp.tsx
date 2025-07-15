import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const SignUp: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto bg-surface p-8 rounded-2xl border border-border shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <BrainCircuit className="mx-auto text-primary mb-4" size={48} />
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
