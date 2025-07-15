import React from 'react';
import { Bell, Heart, MessageSquare, Signal } from 'lucide-react';

const mockActivities = [
  { id: 1, type: 'amplify', user: 'Code Conjurer', post: 'Explain recursion...', time: '2h ago', avatar: 'https://images.pexels.com/photos/5439471/pexels-photo-5439471.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 2, type: 'reply', user: 'Logic Lord', post: 'sentient coffee machine', time: '5h ago', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800' },
  { id: 3, type: 'follow', user: 'Synth Weaver', post: null, time: '1d ago', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=800' },
];

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'amplify': return <Signal className="text-primary" />;
    case 'reply': return <MessageSquare className="text-secondary" />;
    case 'follow': return <Heart className="text-pink-500" />;
    default: return <Bell />;
  }
};

const ActivityText = ({ type, user, post }: { type: string, user: string | null, post: string | null }) => {
  const userEl = <strong className="text-text">{user}</strong>;
  const postEl = post ? <span className="text-text-muted">"{post}"</span> : null;

  switch (type) {
    case 'amplify': return <p>{userEl} amplified your echo {postEl}.</p>;
    case 'reply': return <p>{userEl} replied to your echo {postEl}.</p>;
    case 'follow': return <p>{userEl} started following you.</p>;
    default: return <p>New activity.</p>;
  }
};

const Activity: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-8">Activity</h1>
      <div className="bg-surface rounded-xl border border-border">
        <ul className="divide-y divide-border">
          {mockActivities.map(activity => (
            <li key={activity.id} className="p-4 flex items-start space-x-4 hover:bg-surface/50 transition-colors">
              <div className="mt-1 w-6 text-center flex-shrink-0"><ActivityIcon type={activity.type} /></div>
              <img src={activity.avatar} alt={activity.user ?? 'User'} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-grow">
                <ActivityText type={activity.type} user={activity.user} post={activity.post} />
                <p className="text-sm text-text-muted mt-1">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Activity;
