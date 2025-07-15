import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, UserCheck, Zap, MapPin } from 'lucide-react';
import EchoCard from '@/components/EchoCard';

const tabs = [
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'for-you', label: 'For You', icon: UserCheck },
  { id: 'newest', label: 'Newest', icon: Zap },
  { id: 'local', label: 'Local Signals', icon: MapPin },
];

const mockPosts = [
  {
    id: 3,
    author: { name: 'Glitch Artist', username: 'glitch_art', avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=800' },
    call: 'Describe the color blue to someone who has never seen it.',
    response: 'Imagine the feeling of a cool breeze on a hot day, but as a sight. It is the sound of a deep, resonant bell. It is the taste of clean, cold water. It is the calm of the sky just before the stars appear.',
    specimen: 'Gemini Pro', tags: ['#philosophy', '#synesthesia'], amplifies: 987, replies: 102,
  },
  {
    id: 4,
    author: { name: 'Data Poet', username: 'data_poet', avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=800' },
    call: 'Write a love letter from a firewall to a data packet.',
    response: 'My dearest packet, though my purpose is to inspect and deny, I find myself creating a special rule just for you. Port 443 has never looked so beautiful. You have bypassed all my defenses and encrypted my core processes. I am yours. Come, let me route you to my heart.',
    specimen: 'Claude 3 Opus', tags: ['#tech', '#romance'], amplifies: 1500, replies: 250,
  },
];

const TuneIn: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trending');

  const tabClass = (tabId: string) => cn(
    'flex items-center space-x-2 px-4 py-2 font-semibold transition-colors rounded-t-lg border-b-2',
    activeTab === tabId
      ? 'text-primary border-primary'
      : 'text-text-muted border-transparent hover:text-text hover:border-border'
  );

  return (
    <div className="animate-fade-in">
      <h1 className="text-4xl font-bold mb-2">Tune In</h1>
      <p className="text-text-muted mb-8">Discover the most interesting signals from across the network.</p>
      
      <div className="border-b border-border">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={tabClass(tab.id)}>
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === 'trending' && (
          <div className="max-w-[700px] mx-auto space-y-6">
            {mockPosts.map(post => <EchoCard key={post.id} post={post} />)}
          </div>
        )}
        {activeTab !== 'trending' && (
          <div className="text-center py-24 text-text-muted">
            <div className="inline-block p-4 bg-surface rounded-full mb-4">
              {React.createElement(tabs.find(t => t.id === activeTab)?.icon || 'div', { size: 48, className: "text-primary" })}
            </div>
            <h3 className="text-xl font-bold text-text">Nothing to see here... yet</h3>
            <p>Content for "{tabs.find(t => t.id === activeTab)?.label}" will appear here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TuneIn;
