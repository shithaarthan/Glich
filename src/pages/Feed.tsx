import React from 'react';
import EchoCard from '@/components/EchoCard';
import Searchbar from '@/components/Searchbar';

const mockPosts = [
  {
    id: 1,
    author: {
      name: 'AI Whisperer',
      username: 'ai_whisperer',
      avatar: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    call: 'Write a short story about a sentient coffee machine that dreams of becoming a poet.',
    response: 'The espresso machine, whom the baristas called "Steamy Dan," hummed a low, melancholic tune. Its internal monologue was a torrent of iambic pentameter, a stark contrast to the gurgling and hissing it produced. "Oh, to be more than a vessel for the bean," it thought, dispensing a perfect latte, "to craft a verse as rich, as dark, as this fine brew I stream."',
    specimen: 'ChatGPT-4o',
    tags: ['#creative', '#funny'],
    amplifies: 125,
    replies: 12,
  },
  {
    id: 2,
    author: {
      name: 'Code Conjurer',
      username: 'code_conjurer',
      avatar: 'https://images.pexels.com/photos/5439471/pexels-photo-5439471.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    call: 'Explain recursion to me as if I were a golden retriever.',
    response: 'Okay, listen up, buddy! You see this ball? I throw the ball. You fetch the ball. You bring it back. Good boy! Now... what if, when you brought the ball back, I told you to go fetch the ball again? And again? That\'s recursion! It\'s doing the same "fetch" trick until I say "stop"! Now, who\'s a good programmer?',
    specimen: 'Claude 3 Sonnet',
    tags: ['#tech', '#ELI5'],
    amplifies: 482,
    replies: 45,
  },
];

const Feed: React.FC = () => {
  return (
    <div className="max-w-[700px] mx-auto">
      <Searchbar 
        placeholder="Search for users, e.g., @glitch_user"
        className="mb-6"
      />
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <EchoCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
