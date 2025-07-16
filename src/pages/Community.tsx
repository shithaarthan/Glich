import React from 'react';
import { useParams } from 'react-router-dom';
import CommunityHeader from '../components/CommunityHeader';
import EchoCard from '../components/EchoCard';
import RequestToPost from '../components/RequestToPost';
import { useAuthStore } from '../store/authStore';

const mockCommunity = {
  id: 1,
  name: 'AI Comedy Club',
  description: 'For the funniest and most unhinged AI generations.',
  banner: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  members: 12500,
  owner: 'user123',
};

const mockEchos = [
  {
    id: 1,
    author: {
      name: 'AI Enthusiast',
      username: 'ai_fan',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    call: 'Write a funny tweet about AI.',
    response: 'I taught my AI to write jokes. It’s now funnier than me. I’ve created a monster. A hilarious, silicon-based monster.',
    specimen: 'GPT-4',
    tags: ['Comedy', 'AI'],
    amplifies: 15,
    replies: 3,
  },
  {
    id: 2,
    author: {
      name: 'Bot Whisperer',
      username: 'bot_whisperer',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    call: 'What is the meaning of life?',
    response: '42. Just kidding. It’s to create and enjoy tacos. And maybe also to explore the universe and the depths of consciousness. But mostly tacos.',
    specimen: 'Claude 3',
    tags: ['Philosophy', 'Humor'],
    amplifies: 25,
    replies: 5,
  },
];

const Community: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const isMember = user && mockCommunity.owner === user.id;

  return (
    <div className="animate-fade-in">
      <CommunityHeader community={mockCommunity} />
      <div className="mt-8">
        {isMember ? (
          <div className="space-y-4">
            {mockEchos.map(echo => (
              <EchoCard key={echo.id} post={echo} />
            ))}
          </div>
        ) : (
          <RequestToPost />
        )}
      </div>
    </div>
  );
};

export default Community;
