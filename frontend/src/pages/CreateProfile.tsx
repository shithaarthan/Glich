import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode, hasProfile, isAuthenticated } = useAuthStore();
  
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is authenticated and already has a profile, redirect to feed
    if (isAuthenticated && hasProfile) {
      navigate('/feed', { replace: true });
    }
  }, [isAuthenticated, hasProfile, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    setLoading(true);
    setError('');

    // --- Demo Mode Flow ---
    if (isDemoMode) {
      setTimeout(() => {
        useAuthStore.setState(state => ({
          user: state.user ? { 
            ...state.user, 
            username,
            bio,
            avatar_url: avatarPreview 
          } : null,
          hasProfile: true // Set hasProfile to true after profile creation in demo mode
        }));
        navigate('/feed');
      }, 500);
      return;
    }

    // --- Real User Flow ---
    try {
      const userId = user?.id;
      if (!userId) throw new Error("User not authenticated");

      // In a real scenario, you'd upload the avatarFile to a storage service (like S3 or Supabase Storage)
      // and get back a URL. For this implementation, we'll just use the existing avatar_url or a placeholder.
      const finalAvatarUrl = user?.avatar_url; // This would be replaced with the uploaded URL

      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          username,
          bio,
          avatar_url: finalAvatarUrl,
        }),
      });

      if (response.ok) {
        useAuthStore.setState(state => ({
          user: state.user ? { ...state.user, username, bio, avatar_url: finalAvatarUrl } : null,
          hasProfile: true // Set hasProfile to true after successful profile creation
        }));
        navigate('/feed');
      } else {
        const data = await response.json();
        console.error("Backend error response:", data); // Re-add log
        setError(data.detail || 'Failed to create profile.');
      }
    } catch (err) {
      console.error("Frontend caught error:", err); // Re-add log
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center" 
      style={{ backgroundImage: 'url("https://source.unsplash.com/random/1600x900?abstract,nature")' }}
    >
      <div className="w-full max-w-md mx-auto bg-surface p-8 rounded-2xl border border-border shadow-2xl">
        <h1 className="text-3xl font-bold text-text text-center mb-2">Welcome to Glitchary!</h1>
        <p className="text-textSecondary text-center mb-8">Set up your profile to get started.</p>
        
        <form onSubmit={handleCreateProfile} className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <img src={avatarPreview || '/default-avatar.png'} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
            <input type="file" id="avatar-upload" className="hidden" onChange={handleAvatarChange} accept="image/*" />
            <label htmlFor="avatar-upload" className="cursor-pointer text-sm text-primary hover:underline">
              Change Photo
            </label>
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-textSecondary mb-1">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g., janedoe" />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-textSecondary mb-1">Bio</label>
            <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows={3} placeholder="Tell us a little about yourself..."></textarea>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
