import React, { useState } from 'react';
import { Signal, MessageSquare } from 'lucide-react';
import Button from './ui/Button';
import { cn } from '@/lib/utils';
import CommentSection from './CommentSection';
import { AnimatePresence } from 'framer-motion';

interface EchoCardProps {
  post: {
    id: number;
    author: {
      name: string;
      username: string;
      avatar: string;
    };
    call: string;
    response: string;
    specimen: string;
    tags: string[];
    amplifies: number;
    replies: number;
  };
}

const EchoCard: React.FC<EchoCardProps> = ({ post }) => {
  const [isAmplified, setIsAmplified] = useState(false);
  const [amplifyCount, setAmplifyCount] = useState(post.amplifies);
  const [showComments, setShowComments] = useState(false);

  const handleAmplify = () => {
    setAmplifyCount(isAmplified ? amplifyCount - 1 : amplifyCount + 1);
    setIsAmplified(!isAmplified);
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 animate-fade-in shadow-lg">
      <div className="flex items-center mb-4">
        <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover mr-4" />
        <div>
          <p className="font-bold text-text">{post.author.name}</p>
          <p className="text-sm text-text-muted">@{post.author.username}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="font-mono text-sm bg-background p-4 rounded-lg border border-border">
          <p className="text-primary font-bold mb-2 uppercase tracking-wider">THE CALL</p>
          <p className="text-text-muted whitespace-pre-wrap">{post.call}</p>
        </div>
        <div className="font-mono text-sm bg-background p-4 rounded-lg border border-border">
          <p className="text-secondary font-bold mb-2 uppercase tracking-wider">THE RETURN</p>
          <p className="text-text whitespace-pre-wrap">{post.response}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" className="group" onClick={handleAmplify}>
              <Signal size={20} className={cn("mr-2 text-text-muted group-hover:text-primary transition-colors", isAmplified && "text-primary")} />
              <span className={cn("text-text-muted group-hover:text-primary transition-colors", isAmplified && "text-primary font-semibold")}>{amplifyCount}</span>
            </Button>
            <Button variant="ghost" className="group" onClick={() => setShowComments(!showComments)}>
              <MessageSquare size={20} className="mr-2 text-text-muted group-hover:text-secondary transition-colors" />
              <span className="text-text-muted group-hover:text-secondary transition-colors">{post.replies}</span>
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{post.specimen}</span>
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-surface border border-border text-text-muted px-2 py-1 rounded-full hidden sm:inline-block">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showComments && <CommentSection />}
      </AnimatePresence>
    </div>
  );
};

export default EchoCard;
