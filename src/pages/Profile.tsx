import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit, Rss, UserPlus } from 'lucide-react';
import Button from '@/components/ui/Button';
import EchoCard from '@/components/EchoCard';
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

  // For demo purposes, use the current user data
  const profileUser = user || {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@example.com',
    avatarUrl: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  const mockUserData = {
    ...profileUser,
    username: 'demo_user',
    banner: 'https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    bio: 'Curator of digital oddities and AI-generated chaos. Celebrating the ghosts in the machine.',
    stats: {
      echos: 24,
      amplifies: '12.k',
      followers: '5.8k',
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
      <div className="h-48 sm:h-64 rounded-xl bg-cover bg-center mb-[-60px] sm:mb-[-80px]" style={{ backgroundImage: `url(${mockUserData.banner})` }}></div>
      
      <div className="px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <img 
            src={mockUserData.avatarUrl || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} 
            alt={mockUserData.name || 'User'} 
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
              <Button variant="primary">
                <UserPlus size={16} className="mr-2" /> Follow
              </Button>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold">{mockUserData.name}</h1>
          <p className="text-text-muted">@{mockUserData.username}</p>
        </div>

        <p className="mt-4 max-w-2xl">{mockUserData.bio}</p>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-text-muted">
          <p><strong className="text-text">{mockUserData.stats.echos}</strong> Echos</p>
          <p><strong className="text-text">{mockUserData.stats.amplifies}</strong> Amplifies</p>
          <p><strong className="text-text">{mockUserData.stats.followers}</strong> Followers</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockPosts.map(post => <EchoCard key={post.id} post={post} />)}
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