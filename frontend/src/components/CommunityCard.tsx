import React from 'react';
import { Users } from 'lucide-react';
import Button from './ui/Button';
import { Link } from 'react-router-dom';

interface CommunityCardProps {
  community: {
    id: number;
    name: string;
    description: string;
    banner: string;
    members: number;
  };
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  return (
    <Link to={`/community/${community.id}`} className="bg-surface border border-border rounded-xl overflow-hidden flex flex-col group transform hover:-translate-y-1 transition-transform duration-300 shadow-lg">
      <img src={community.banner} alt={community.name} className="h-32 w-full object-cover" />
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-text mb-1">{community.name}</h3>
        <p className="text-sm text-text-muted mb-4 flex-grow">{community.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-text-muted">
            <Users size={16} className="mr-2" />
            {community.members.toLocaleString()} members
          </div>
          <Button size="sm" variant="secondary" onClick={(e) => e.preventDefault()}>Join</Button>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
