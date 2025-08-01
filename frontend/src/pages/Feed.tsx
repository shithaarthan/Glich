import React, { useState, useEffect } from 'react';
import InteractiveEchoCard from '@/components/InteractiveEchoCard';
import EnhancedSearchbar from '@/components/EnhancedSearchbar';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useInteractionStore } from '@/store/interactionStore';

interface PostData {
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
}

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { initializePost } = useInteractionStore();

  // Mock demo posts
  const demoPosts: PostData[] = [
    {
      id: '1',
      author: {
        name: 'Demo User',
        username: 'demo_user',
        avatar: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      call: 'What is the meaning of life?',
      response: '42',
      specimen: 'Mock Specimen',
      tags: ['#AI', '#demo'],
      amplifies: 10,
      replies: 5,
    },
    {
      id: '2',
      author: {
        name: 'Demo User',
        username: 'demo_user',
        avatar: 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      },
      call: 'Is AI going to take over the world?',
      response: 'Probably not, but it might make some interesting art.',
      specimen: 'Mock Specimen',
      tags: ['#AI', '#demo'],
      amplifies: 20,
      replies: 10,
    },
  ];

  useEffect(() => {
    const fetchFeedData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Use demo data if in demo mode
        if (user?.isDemoMode) {
          setPosts(demoPosts);
          demoPosts.forEach(post => initializePost(post.id.toString(), {
            amplifies: post.amplifies,
            replies: post.replies,
            comments: []
          }));
          setLoading(false);
          return;
        }

        // Fetch real data if not in demo mode
        const token = localStorage.getItem('supabase.auth.token');
        if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return;
        }

        const headers: HeadersInit = {
          'Authorization': `Bearer ${token}`
        };

        const callsResponse = await fetch('http://localhost:8000/api/calls', { headers });
        if (!callsResponse.ok) throw new Error(`HTTP error! status: ${callsResponse.status}`);
        const callsData = await callsResponse.json();

        if (!callsData.calls || callsData.calls.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const postPromises = callsData.calls.map(async (call: any) => {
          // Fetch responses for each call
          const responseResponse = await fetch(`http://localhost:8000/api/responses?call_id=${call.id}`, { headers });
          const responseData = await responseResponse.json();
          const primaryResponse = responseData.responses?.[0] || { response_text: 'No response available.' };

          // Fetch profile for each call's author
          const profileResponse = await fetch(`http://localhost:8000/api/profiles/${call.user_id}`, { headers });
          let authorProfile = { name: 'Unknown User', username: 'unknown', avatar: 'https://via.placeholder.com/40' };
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            authorProfile = profileData.profile;
          } else {
            console.error("Failed to fetch profile:", profileResponse.statusText);
          }

          // Initialize post interactions in the store
          initializePost(call.id.toString(), {
            amplifies: call.amplifies || 0,
            replies: call.replies || 0,
            comments: []
          });

          return {
            id: call.id,
            author: {
              name: authorProfile.name,
              username: authorProfile.username,
              avatar: authorProfile.avatar || 'https://via.placeholder.com/40'
            },
            call: call.prompt,
            response: primaryResponse.response_text,
            specimen: 'Mock Specimen',
            tags: ['#AI', '#generated'],
            amplifies: call.amplifies || 0,
            replies: call.replies || 0
          };
        });

        const fetchedPosts = await Promise.all(postPromises);
        setPosts(fetchedPosts);
      } catch (err: any) {
        console.error("Failed to fetch feed data:", err);
        setError(err.message || "Failed to load feed.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFeedData();
    } else {
      // If no user, clear posts and stop loading
      setPosts([]);
      setLoading(false);
    }
  }, [user?.id, user?.isDemoMode, initializePost]);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <EnhancedSearchbar className="w-full" />
      </div>
      <div className="space-y-6">
        {loading && <p className="text-center text-textSecondary">Loading feed...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-textSecondary">No posts found. Be the first to create one!</p>
        )}
        {!loading && !error && posts.map(post => (
          <InteractiveEchoCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
