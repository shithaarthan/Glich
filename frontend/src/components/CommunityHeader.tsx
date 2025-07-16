import React from 'react';
import Button from './ui/Button';

interface CommunityHeaderProps {
  community: {
    name: string;
    description: string;
    banner: string;
    members: number;
  };
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({ community }) => {
  return (
    <div className="relative">
      <img src={community.banner} alt={community.name} className="w-full h-48 object-cover rounded-lg" />
      <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent w-full rounded-b-lg">
        <h1 className="text-3xl font-bold text-white">{community.name}</h1>
        <p className="text-gray-300">{community.description}</p>
        <div className="flex items-center mt-2">
          <p className="text-white mr-4">{community.members.toLocaleString()} members</p>
          <Button variant="secondary">Join Community</Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
