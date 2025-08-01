import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, Rss } from 'lucide-react';
import Button from '@/components/ui/Button';
import InteractiveEchoCard from '@/components/InteractiveEchoCard';
import FollowButton from '@/components/FollowButton';
import { cn } from '@/lib/utils';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';

// Mock posts data (should come from API in real app)
const mockPosts = [
  { 
    id: 1, 
    author: { name: 'Demo User', username: 'demo_user', avatar: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }, 
    call: 'What is the sound of one hand clapping?', 
    response: 'It sounds like a high-five with a ghost.', 
    specimen: 'GPT-3.5', 
    tags: ['#zen', '#spooky'], 
    amplifies: 301, 
    replies: 22 
  },
  { 
    id: 2, 
    author: { name: 'Demo User', username: 'demo_user', avatar: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }, 
    call: 'Generate a corporate slogan for a company that sells black holes.', 
    response: '"Black Holes Inc: We\'re not just a company, we\'re a singularity."', 
    specimen: 'LLaMA 3', 
    tags: ['#corporate', '#darkhumor'], 
    amplifies: 876, 
    replies: 54 
  },
];

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState('echos');
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuthStore();
  const { openEditProfileModal } = useModalStore();

  // Check if this is the current user's profile
  const isOwnProfile = userId === user?.id;

  // Use the user from the auth store as the source of truth.
  // Provide sensible defaults for a consistent experience.
  const profileUser = {
    id: user?.id || 'demo-user',
    username: user?.username || 'anonymous',
    avatar_url: user?.avatar_url || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    bio: user?.bio || 'No bio yet.',
    banner: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', // Banner can remain mock for now
    stats: { // Stats can also be mock for this phase
      echos: 10,
      amplifies: '1.k',
      followers: 1200,
    },
  };

  const tabClass = (tabName: string) => cn(
    'px-4 py-2 font-semibold transition-colors border-b-2',
    activeTab === tabName
      ? 'text-primary border-primary'
      : 'text-text-muted border-transparent hover:text-text hover:border-border'
  );

  return (
    <div className="animate-fade-in">
      <div className="h-48 sm:h-64 rounded-xl bg-cover bg-center mb-[-60px] sm:mb-[-80px]" style={{ backgroundImage: `url(${profileUser.banner})` }}></div>
      
      <div className="px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <img 
            src={profileUser.avatar_url} 
            alt={profileUser.username} 
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-background" 
          />
          <div className="flex space-x-2 mt-4 sm:mt-0">
            {isOwnProfile ? (
              <>
                <Button variant="secondary" onClick={openEditProfileModal}>
                  <Edit size={16} className="mr-2" /> Edit Profile
                </Button>
                <Button variant="secondary" className="!p-2.5">
                  <Rss size={16} />
                </Button>
              </>
            ) : (
              <FollowButton 
                userId={userId || 'demo-user'} 
                initialFollowing={false}
                initialFollowers={profileUser.stats.followers}
              />
            )}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{profileUser.username}</h1>
          <p className="text-text-muted">@{profileUser.username}</p>
        </div>

        <p className="mt-4 max-w-2xl">{profileUser.bio}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-text-muted">
          <p><strong className="text-text">{profileUser.stats.echos}</strong> Echos</p>
          <p><strong className="text-text">{profileUser.stats.amplifies}</strong> Amplifies</p>
          <p><strong className="text-text">{profileUser.stats.followers.toLocaleString()}</strong> Followers</p>
        </div>
      </div>

      <div className="mt-8 border-b border-border">
        <nav className="flex">
          <button onClick={() => setActiveTab('echos')} className={tabClass('echos')}>Echos</button>
          <button onClick={() => setActiveTab('amplified')} className={tabClass('amplified')}>Amplified</button>
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'echos' && (
          <div className="space-y-6">
            {mockPosts.map(post => <InteractiveEchoCard key={post.id} post={post} />)}
          </div>
        )}
        {activeTab === 'amplified' && (
          <div className="text-center py-16 text-text-muted">
            <p>Echos you amplify will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
