import { create } from 'zustand';

interface Post {
  id: string;
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
  amplifyPost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'replies'>) => void;
  bookmarkPost: (postId: string) => void;
  
  // User interactions
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  
  // Search
  searchContent: (query: string) => void;
  clearSearch: () => void;
  
  // Initialize post data
  initializePost: (postId: string, initialData: Partial<Post>) => void;
  initializeUser: (userId: string, initialData: Partial<User>) => void;
}

export const useInteractionStore = create<InteractionState>((set, get) => ({
  posts: {},
  users: {},
  searchResults: {
    posts: [],
    users: [],
    tags: []
  },
  isSearching: false,

  amplifyPost: (postId: string) => {
    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      
      return {
        posts: {
          ...state.posts,
          [postId]: {
            ...post,
            isAmplified: !post.isAmplified,
            amplifies: post.isAmplified ? post.amplifies - 1 : post.amplifies + 1
          }
        }
      };
    });
  },

  addComment: (postId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'replies'>) => {
    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      
      const newComment: Comment = {
        ...comment,
        id: Date.now().toString(),
        timestamp: new Date(),
        replies: []
      };
      
      return {
        posts: {
          ...state.posts,
          [postId]: {
            ...post,
            comments: [...post.comments, newComment],
            replies: post.replies + 1
          }
        }
      };
    });
  },

  bookmarkPost: (postId: string) => {
    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      
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

  searchContent: (query: string) => {
    set({ isSearching: true });
    
    // Mock search - in real app, this would be an API call
    setTimeout(() => {
      const mockResults = {
        posts: [
          {
            id: '1',
            author: { name: 'AI Whisperer', username: 'ai_whisperer', avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg' },
            call: 'What is artificial intelligence?',
            response: 'AI is the simulation of human intelligence in machines...',
            tags: ['#AI', '#technology']
          }
        ],
        users: [
          {
            id: '1',
            name: 'AI Whisperer',
            username: 'ai_whisperer',
            avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg',
            bio: 'AI enthusiast and researcher'
          }
        ],
        tags: ['#AI', '#technology', '#machine-learning']
      };
      
      set({
        searchResults: mockResults,
        isSearching: false
      });
    }, 1000);
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

  initializePost: (postId: string, initialData: Partial<Post>) => {
    set((state) => ({
      posts: {
        ...state.posts,
        [postId]: {
          id: postId,
          amplifies: 0,
          replies: 0,
          isAmplified: false,
          isBookmarked: false,
          comments: [],
          ...initialData
        }
      }
    }));
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