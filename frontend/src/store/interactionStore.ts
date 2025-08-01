import { create } from 'zustand';
import { useAuthStore } from '@/store/authStore'; // Import useAuthStore to get JWT

interface Post {
  id: string;
  user_id: string; // Added user_id to match backend structure
  prompt: string; // Renamed from call to prompt for clarity
  created_at: string; // Added created_at
  amplifies: number;
  replies: number;
  isAmplified: boolean;
  isBookmarked: boolean;
  comments: Comment[];
}

interface Comment {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  replies: Comment[];
}

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
  followers: number;
  following: number;
}

interface InteractionState {
  posts: Record<string, Post>;
  users: Record<string, User>;
  searchResults: {
    posts: any[];
    users: any[];
    tags: string[];
  };
  isSearching: boolean;
  
  // Post interactions
  amplifyPost: (postId: string) => Promise<void>; // Make async for API calls
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'replies'>) => Promise<void>; // Make async
  bookmarkPost: (postId: string) => Promise<void>; // Make async
  createCall: (userId: string, prompt: string) => Promise<void>; // Added createCall
  createEcho: (callId: string, responseId: string, userId: string, echoText: string) => Promise<void>; // Added createEcho
  
  // User interactions
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  
  // Search
  searchContent: (query: string) => void;
  clearSearch: () => void;
  
  // Initialize post data
  initializePost: (postId: string, initialData: Partial<Post>) => Promise<void>;
  initializeUser: (userId: string, initialData: Partial<User>) => void;
}

// Helper function to get JWT token
const getToken = () => {
  const { isDemoMode } = useAuthStore.getState();
  if (isDemoMode) {
    // In demo mode, we don't use or store authentication tokens.
    return null;
  }
  // Assuming token is stored in localStorage or accessible via useAuthStore
  const token = localStorage.getItem('supabase.auth.token');
  if (token) return token;
  return null;
};

export const useInteractionStore = create<InteractionState>((set, get) => ({
  posts: {},
  users: {},
  searchResults: {
    posts: [],
    users: [],
    tags: []
  },
  isSearching: false,

  amplifyPost: async (postId: string) => {
    const token = getToken();
    if (!token) {
      console.error("No auth token found for amplifyPost");
      return;
    }

    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      
      // Optimistically update local state
      return {
        posts: {
          ...state.posts,
          [postId]: {
            ...post,
            isAmplified: !post.isAmplified,
            amplifies: post.amplifies ? post.amplifies - 1 : post.amplifies + 1
          }
        }
      };
    });

    try {
      const response = await fetch(`http://localhost:8000/api/calls/${postId}/amplify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Handle error: revert optimistic update or show error message
        console.error("Failed to amplify post:", response.statusText);
        // Revert optimistic update if necessary
        set((state) => {
          const post = state.posts[postId];
          if (!post) return state;
          return {
            posts: {
              ...state.posts,
              [postId]: {
                ...post,
                isAmplified: post.isAmplified, // Revert to original state
                amplifies: post.amplifies ? post.amplifies + 1 : post.amplifies - 1 // Revert count
              }
            }
          };
        });
        return;
      }
      
      const result = await response.json();
      // Optionally update state with backend result if it contains more accurate data
      // For now, optimistic update is sufficient if backend just confirms success
      console.log("Amplify successful:", result);

    } catch (error) {
      console.error("Error during amplifyPost API call:", error);
      // Revert optimistic update if necessary
      set((state) => {
        const post = state.posts[postId];
        if (!post) return state;
        return {
          posts: {
            ...state.posts,
            [postId]: {
              ...post,
              isAmplified: post.isAmplified, // Revert to original state
              amplifies: post.amplifies ? post.amplifies + 1 : post.amplifies - 1 // Revert count
            }
          }
        };
      });
    }
  },

  addComment: async (postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'replies'>) => {
    const token = getToken();
    const { user } = useAuthStore.getState(); // Get user from auth store

    if (!token || !user) {
      console.error("No auth token or user found for addComment");
      return;
    }

    const newCommentData = {
      call_id: postId, // postId is the call_id
      user_id: user.id,
      response_text: comment.content
    };

    try {
      const response = await fetch('http://localhost:8000/api/responses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCommentData)
      });

      if (!response.ok) {
        console.error("Failed to add comment:", response.statusText);
        // Handle error: show message to user
        return;
      }

      const result = await response.json();
      
      // Update local state with the new comment from backend
      set((state) => {
        const post = state.posts[postId];
        if (!post) return state;
        
        const addedComment: Comment = {
          id: result.response.id, // Use ID from backend
          author: {
            name: user.username || 'Demo User',
            username: user.username || 'demo_user', // Use username from authStore
            avatar: user.avatar_url || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg'
          },
          content: comment.content,
          timestamp: new Date(result.response.created_at), // Use timestamp from backend
          replies: []
        };
        
        return {
          posts: {
            ...state.posts,
            [postId]: {
              ...post,
              comments: [...post.comments, addedComment],
              replies: post.replies + 1
            }
          }
        };
      });

    } catch (error) {
      console.error("Error during addComment API call:", error);
      // Handle error: show message to user
    }
  },

  bookmarkPost: async (postId: string) => {
    const token = getToken();
    if (!token) {
      console.error("No auth token found for bookmarkPost");
      return;
    }

    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      
      // Optimistically update local state
      return {
        posts: {
          ...state.posts,
          [postId]: {
            ...post,
            isBookmarked: !post.isBookmarked
          }
        }
      };
    });

    try {
      const response = await fetch(`http://localhost:8000/api/calls/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Handle error: revert optimistic update or show error message
        console.error("Failed to bookmark post:", response.statusText);
        // Revert optimistic update if necessary
        set((state) => {
          const post = state.posts[postId];
          if (!post) return state;
          return {
            posts: {
              ...state.posts,
              [postId]: {
                ...post,
                isBookmarked: post.isBookmarked // Revert to original state
              }
            }
          };
        });
        return;
      }
      
      const result = await response.json();
      // Optionally update state with backend result if it contains more accurate data
      console.log("Bookmark successful:", result);

    } catch (error) {
      console.error("Error during bookmarkPost API call:", error);
      // Revert optimistic update if necessary
      set((state) => {
        const post = state.posts[postId];
        if (!post) return state;
        return {
          posts: {
            ...state.posts,
            [postId]: {
              ...post,
              isBookmarked: post.isBookmarked // Revert to original state
            }
          }
        };
      });
    }
  },

  createCall: async (userId: string, prompt: string) => {
    const token = getToken();
    if (!token || !userId) {
      console.error("No auth token or user ID found for createCall");
      return;
    }

    const newCallData = {
      user_id: userId,
      prompt: prompt
    };

    try {
      const response = await fetch('http://localhost:8000/api/calls', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCallData)
      });

      if (!response.ok) {
        console.error("Failed to create call:", response.statusText);
        // Handle error: show message to user
        return;
      }

      const result = await response.json();
      
      // Update local state with the new call from backend
      const createdCall: Post = {
        id: result.call.id,
        user_id: result.call.user_id,
        prompt: result.call.prompt,
        created_at: result.call.created_at,
        // Initialize interaction-related fields
        amplifies: 0,
        replies: 0,
        isAmplified: false,
        isBookmarked: false,
        comments: []
      };
      
      set((state) => ({
        posts: {
          ...state.posts,
          [createdCall.id]: createdCall
        }
      }));

    } catch (error) {
      console.error("Error during createCall API call:", error);
      // Handle error: show message to user
    }
  },

  createEcho: async (callId: string, responseId: string, userId: string, echoText: string) => {
    const token = getToken();
    if (!token || !userId) {
      console.error("No auth token or user ID found for createEcho");
      return;
    }

    const newEchoData = {
      call_id: callId,
      response_id: responseId,
      user_id: userId,
      // echoText is not directly sent to the backend's POST /echoes endpoint as per current backend definition.
      // If echoText needs to be stored, the backend schema/endpoint would need modification.
    };

    try {
      const response = await fetch('http://localhost:8000/api/echoes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEchoData)
      });

      if (!response.ok) {
        console.error("Failed to create echo:", response.statusText);
        // Handle error: show message to user
        return;
      }

      const result = await response.json();
      
      // Update local state with the new echo from backend
      // The backend returns an 'echo' object. We need to map this to the 'Post' structure.
      // This mapping might be problematic as 'Post' has 'prompt' and 'response', while 'echo' might just be a reference.
      // For now, I'll create a simplified 'Post' object for the store, using placeholders for prompt/response.
      const createdEcho: Post = {
        id: result.echo.id,
        user_id: result.echo.user_id,
        prompt: 'Echoed Call', // Placeholder, as echo doesn't have a direct prompt in backend
        created_at: result.echo.created_at,
        // Initialize interaction-related fields
        amplifies: 0,
        replies: 0,
        isAmplified: false,
        isBookmarked: false,
        comments: []
      };
      
      set((state) => ({
        posts: {
          ...state.posts,
          [createdEcho.id]: createdEcho
        }
      }));

    } catch (error) {
      console.error("Error during createEcho API call:", error);
      // Handle error: show message to user
    }
  },

  followUser: (userId: string) => {
    set((state) => {
      const user = state.users[userId];
      if (!user) return state;
      
      return {
        users: {
          ...state.users,
          [userId]: {
            ...user,
            isFollowing: true,
            followers: user.followers + 1
          }
        }
      };
    });
  },

  unfollowUser: (userId: string) => {
    set((state) => {
      const user = state.users[userId];
      if (!user) return state;
      
      return {
        users: {
          ...state.users,
          [userId]: {
            ...user,
            isFollowing: false,
            followers: user.followers - 1
          }
        }
      };
    });
  },

  searchContent: async (query: string) => {
    set({ isSearching: true });
    const token = getToken();
    if (!token) {
      console.error("No auth token found for searchContent");
      set({ isSearching: false });
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/search?query=${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
      });

      if (!response.ok) {
        console.error("Failed to search content:", response.statusText);
        set({ isSearching: false });
        return;
      }

      const result = await response.json();
      // Map the backend results to the searchResults state
      set({
        searchResults: {
          posts: result.posts || [], // Assuming the backend returns a 'posts' array
          users: result.users || [], // Assuming the backend returns a 'users' array
          tags: [] // No tag search implemented yet
        },
        isSearching: false
      });
    } catch (error) {
      console.error("Error during searchContent API call:", error);
      set({ isSearching: false });
    }
  },

  clearSearch: () => {
    set({
      searchResults: {
        posts: [],
        users: [],
        tags: []
      },
      isSearching: false
    });
  },

  initializePost: async (postId: string, initialData: Partial<Post>) => {
    const token = getToken();
    if (!token) {
      console.error("No auth token found for initializePost");
      set((state) => ({
        posts: {
          ...state.posts,
          [postId]: {
            id: postId,
            user_id: '', // Placeholder, will be fetched or set
            prompt: '', // Placeholder
            created_at: '', // Placeholder
            amplifies: 0,
            replies: 0,
            isAmplified: false,
            isBookmarked: false,
            comments: [],
            ...initialData
          }
        }
      }));
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/calls/${postId}/interactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error("Failed to fetch interaction data:", response.statusText);
        set((state) => ({
          posts: {
            ...state.posts,
            [postId]: {
              id: postId,
              user_id: '', // Placeholder, will be fetched or set
              prompt: '', // Placeholder
              created_at: '', // Placeholder
              amplifies: 0,
              replies: 0,
              isAmplified: false,
              isBookmarked: false,
              comments: [],
              ...initialData
            }
          }
        }));
        return;
      }

      const result = await response.json();

      set((state) => ({
        posts: {
          ...state.posts,
          [postId]: {
            id: postId,
            user_id: '', // Placeholder, will be fetched or set
            prompt: '', // Placeholder
            created_at: '', // Placeholder
            amplifies: result.amplifies || 0,
            replies: result.replies || 0,
            isAmplified: result.is_amplified || false,
            isBookmarked: result.is_bookmarked || false,
            comments: result.comments || [],
            ...initialData
          }
        }
      }));

    } catch (error) {
      console.error("Error during initializePost API call:", error);
      set((state) => ({
        posts: {
          ...state.posts,
          [postId]: {
            id: postId,
            user_id: '', // Placeholder, will be fetched or set
            prompt: '', // Placeholder
            created_at: '', // Placeholder
            amplifies: 0,
            replies: 0,
            isAmplified: false,
            isBookmarked: false,
            comments: [],
            ...initialData
          }
        }
      }));
    }
  },

  initializeUser: (userId: string, initialData: Partial<User>) => {
    set((state) => ({
      users: {
        ...state.users,
        [userId]: {
          id: userId,
          name: '',
          username: '',
          avatar: '',
          isFollowing: false,
          followers: 0,
          following: 0,
          ...initialData
        }
      }
    }));
  }
}));
