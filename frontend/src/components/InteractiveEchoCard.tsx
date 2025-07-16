import React, { useState, useEffect } from 'react';
import { Signal, MessageSquare, Bookmark, Share2, Heart } from 'lucide-react';
import { useInteractionStore } from '@/store/interactionStore';
import { useAuthStore } from '@/store/authStore';
import Button from './ui/Button';
import { cn } from '@/lib/utils';

interface InteractiveEchoCardProps {
  post: {
    id: string | number;
    author: {
      name: string;
      username?: string;
      avatar: string;
    };
    call: string;
    response: string;
    specimen?: string;
    tags?: string[];
    amplifies: number;
    replies: number;
  };
  onOpenResponseModal?: (callId: string) => void; // Added onOpenResponseModal prop
  onOpenEchoModal?: (callId: string) => void; // Added onOpenEchoModal prop
}

const InteractiveEchoCard: React.FC<InteractiveEchoCardProps> = ({ post, onOpenResponseModal, onOpenEchoModal }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthStore();
  const { 
    posts, 
    amplifyPost, 
    addComment, 
    bookmarkPost, 
    initializePost 
  } = useInteractionStore();

  const postId = post.id.toString();
  const interactivePost = posts[postId];

  useEffect(() => {
    if (!interactivePost) {
      initializePost(postId, {
        amplifies: post.amplifies,
        replies: post.replies
      });
    }
  }, [postId, interactivePost, initializePost, post.amplifies, post.replies]);

  const handleAmplify = () => {
    amplifyPost(postId);
  };

  const handleAddComment = () => {
    if (newComment.trim() && user) {
      addComment(postId, {
        author: {
          name: user.name || 'Demo User',
          username: 'demo_user',
          avatar: user.avatarUrl || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg'
        },
        content: newComment
      });
      setNewComment('');
    }
  };

  const handleBookmark = () => {
    bookmarkPost(postId);
  };

  const handleShare = () => {
    // Mock share functionality
    navigator.clipboard.writeText(`Check out this Echo: ${post.call}`);
    alert('Link copied to clipboard!');
  };

  const currentAmplifies = interactivePost?.amplifies ?? post.amplifies;
  const currentReplies = interactivePost?.replies ?? post.replies;
  const isAmplified = interactivePost?.isAmplified ?? false;
  const isBookmarked = interactivePost?.isBookmarked ?? false;

  return (
    <div className="bg-surface border border-border rounded-xl p-6 hover:border-primary/20 transition-colors">
      {/* Author */}
      <div className="flex items-center space-x-3 mb-4">
        <img 
          src={post.author.avatar} 
          alt={post.author.name} 
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-text">{post.author.name}</h3>
          <p className="text-sm text-textSecondary">@{post.author.username || 'user'}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <div>
          <h4 className="text-primary font-bold text-sm uppercase tracking-wider mb-2">THE CALL</h4>
          <p className="text-text leading-relaxed">{post.call}</p>
        </div>
        
        <div>
          <h4 className="text-secondary font-bold text-sm uppercase tracking-wider mb-2">THE RETURN</h4>
          <p className="text-text leading-relaxed">{post.response}</p>
        </div>
        
        {post.specimen && (
          <div className="flex items-center space-x-2 text-sm text-textSecondary">
            <span>Specimen:</span>
            <span className="font-medium">{post.specimen}</span>
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span 
                key={index} 
                className="px-2 py-1 text-xs bg-background rounded-full text-primary cursor-pointer hover:bg-border transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleAmplify}
            className={cn(
              "flex items-center space-x-2 text-sm transition-colors",
              isAmplified ? "text-primary" : "text-textSecondary hover:text-primary"
            )}
          >
            <Signal size={16} className={isAmplified ? "fill-current" : ""} />
            <span>{currentAmplifies}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-2 text-sm text-textSecondary hover:text-primary transition-colors"
          >
            <MessageSquare size={16} />
            <span>{currentReplies}</span>
          </button>

          {/* Add Response Button */}
          <button
            onClick={() => onOpenResponseModal && onOpenResponseModal(postId)}
            className="flex items-center space-x-2 text-sm text-textSecondary hover:text-primary transition-colors"
          >
            Respond
          </button>

          {/* Create Echo Button */}
          <button
            onClick={() => onOpenEchoModal && onOpenEchoModal(postId)}
            className="flex items-center space-x-2 text-sm text-textSecondary hover:text-primary transition-colors"
          >
            Create Echo
          </button>
          
          <button
            onClick={handleBookmark}
            className={cn(
              "flex items-center space-x-2 text-sm transition-colors",
              isBookmarked ? "text-yellow-500" : "text-textSecondary hover:text-yellow-500"
            )}
          >
            <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 text-sm text-textSecondary hover:text-primary transition-colors"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border">
          <h5 className="font-semibold text-text mb-3">Comments</h5>
          
          {/* Add Comment */}
          <div className="mb-4">
            <div className="flex space-x-3">
              <img 
                src={user?.avatarUrl || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg'} 
                alt="You" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 bg-background border border-border rounded-lg text-text placeholder-textSecondary resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                  >
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-3">
            {interactivePost?.comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img 
                  src={comment.author.avatar} 
                  alt={comment.author.name} 
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-background rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-text text-sm">{comment.author.name}</span>
                      <span className="text-xs text-textSecondary">@{comment.author.username}</span>
                    </div>
                    <p className="text-text text-sm">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <button className="text-xs text-textSecondary hover:text-primary">
                      {comment.timestamp.toLocaleTimeString()}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveEchoCard;
