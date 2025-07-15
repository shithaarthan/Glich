import React from 'react';
import CommunityCard from '@/components/CommunityCard';
import Input from '@/components/ui/Input';
import { Search } from 'lucide-react';

const mockCommunities = [
  { id: 1, name: 'AI Comedy Club', description: 'For the funniest and most unhinged AI generations.', banner: 'https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', members: 12500 },
  { id: 2, name: 'Poetic Processors', description: 'Sharing beautiful and surprisingly deep AI-written poetry.', banner: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', members: 8300 },
  { id: 3, name: 'Code Ghosts', description: 'When the AI writes code that feels haunted... or just plain weird.', banner: 'https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', members: 21000 },
  { id: 4, name: 'Philosophical Fails', description: 'When you ask for the meaning of life and get a recipe for pancakes.', banner: 'https://images.pexels.com/photos/158827/field-corn-air-frisch-158827.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', members: 5400 },
];

const Communities: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Communities</h1>
        <p className="text-text-muted">Find your niche and connect with fellow AI enthusiasts.</p>
      </div>
      <div className="relative mb-8">
        <Input placeholder="Search for communities..." className="pl-10" />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCommunities.map(community => (
          <CommunityCard key={community.id} community={community} />
        ))}
      </div>
    </div>
  );
};

export default Communities;
