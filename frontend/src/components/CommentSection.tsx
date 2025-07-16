import React from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import Textarea from './ui/Textarea';

const mockComments = [
  {
    id: 1,
    author: {
      name: 'Logic Lord',
      username: 'logic_lord',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    text: 'Fascinating! It\'s like a digital ghostwriter with a penchant for the absurd.',
    time: '2h ago',
  },
  {
    id: 2,
    author: {
      name: 'Synth Weaver',
      username: 'synth_weaver',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    text: 'I tried this prompt and got a recipe for a sentient sandwich. 10/10.',
    time: '1h ago',
  },
];

const CommentSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="mt-4 pt-4 border-t border-border overflow-hidden"
    >
      <div className="space-y-4">
        {mockComments.map(comment => (
          <div key={comment.id} className="flex items-start space-x-3">
            <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover mt-1" />
            <div className="flex-1 bg-background p-3 rounded-lg">
              <div className="flex items-baseline space-x-2">
                <p className="font-semibold text-text">{comment.author.name}</p>
                <p className="text-sm text-text-muted">@{comment.author.username}</p>
                <p className="text-xs text-text-muted">· {comment.time}</p>
              </div>
              <p className="text-text-muted mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start space-x-3">
        <img src="https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Current user" className="w-8 h-8 rounded-full object-cover mt-1" />
        <div className="flex-1">
          <Textarea placeholder="Add a reply..." className="min-h-[80px]" />
          <div className="mt-2 flex justify-end">
            <Button size="sm">Reply</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommentSection;
