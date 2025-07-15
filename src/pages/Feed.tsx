import React from 'react';
import InteractiveEchoCard from '@/components/InteractiveEchoCard';
import EnhancedSearchbar from '@/components/EnhancedSearchbar';

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'AI Whisperer',
      username: 'ai_whisperer',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    },
    call: 'Write a short story about a sentient coffee machine that dreams of becoming a poet.',
    response: 'The espresso machine, whom the baristas called "Steamy Dan," hummed a low, melancholic tune. Its internal monologue was a torrent of iambic pentameter, a stark contrast to the gurgling and hissing it produced. "Oh, to be more than a vessel for the bean," it thought, dispensing a perfect latte. "To craft a verse as rich, as dark, as this fine brew I stream."',
    specimen: 'ChatGPT-4o',
    tags: ['#creative', '#funny'],
    amplifies: 125,
    replies: 12
  },
  {
    id: 2,
    author: {
      name: 'Code Conjurer',
      username: 'code_conjurer',
      avatar: 'https://images.pexels.com/photos/5439471/pexels-photo-5439471.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    call: 'Explain recursion to me as if I were a golden retriever.',
    response: 'Okay, listen up, buddy! You see this ball? I throw the ball. You fetch the ball. You bring it back. Good boy! Now... what if, when you brought the ball back, I told you to go fetch the ball again? And again? That\'s recursion! It\'s doing the same "fetch" trick until I say "stop!" Now, who\'s a good programmer?',
    specimen: 'Claude 3 Sonnet',
    tags: ['#tech', '#ELI5'],
    amplifies: 482,
    replies: 45
  },
  {
    id: 3,
    author: {
      name: 'Pixel Prophet',
      username: 'pixel_prophet',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    call: 'Create a haiku about debugging code at 3 AM.',
    response: 'Red error messages\nFlicker in the darkness deep\nSemicolon hides',
    specimen: 'GPT-3.5',
    tags: ['#programming', '#poetry', '#debugging'],
    amplifies: 298,
    replies: 33
  }
];

const Feed: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Enhanced Search */}
      <div className="mb-8">
        <EnhancedSearchbar className="w-full" />
      </div>

      {/* Feed Content */}
      <div className="space-y-6">
        {mockPosts.map(post => (
          <InteractiveEchoCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;