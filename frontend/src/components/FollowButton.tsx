import React from 'react';
import { UserPlus, UserMinus } from 'lucide-react';
import { useInteractionStore } from '@/store/interactionStore';
import Button from './ui/Button';

interface FollowButtonProps {
  userId: string;
  initialFollowing?: boolean;
  initialFollowers?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  initialFollowing = false,
  initialFollowers = 0,
  size = 'md',
  className
}) => {
  const { users, followUser, unfollowUser, initializeUser } = useInteractionStore();
  
  const user = users[userId];
  
  // Initialize user if not exists
  React.useEffect(() => {
    if (!user) {
      initializeUser(userId, {
        isFollowing: initialFollowing,
        followers: initialFollowers
      });
    }
  }, [userId, user, initializeUser, initialFollowing, initialFollowers]);

  const isFollowing = user?.isFollowing ?? initialFollowing;
  const followers = user?.followers ?? initialFollowers;

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  return (
    <div className={className}>
      <Button
        variant={isFollowing ? "secondary" : "primary"}
        size={size}
        onClick={handleFollow}
        className="flex items-center space-x-2"
      >
        {isFollowing ? (
          <>
            <UserMinus size={16} />
            <span>Following</span>
          </>
        ) : (
          <>
            <UserPlus size={16} />
            <span>Follow</span>
          </>
        )}
      </Button>
      
      {/* Follower count */}
      <div className="text-sm text-textSecondary mt-1 text-center">
        {followers.toLocaleString()} followers
      </div>
    </div>
  );
};

export default FollowButton;