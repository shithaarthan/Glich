import React, { useState, useEffect } from 'react';
import { Search, X, Hash, User, FileText } from 'lucide-react';
import { useInteractionStore } from '@/store/interactionStore';
import { cn } from '@/lib/utils';

interface EnhancedSearchbarProps {
  placeholder?: string;
  className?: string;
}

const EnhancedSearchbar: React.FC<EnhancedSearchbarProps> = ({ 
  placeholder = "Search posts, users, or tags...", 
  className 
}) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const { searchResults, isSearching, searchContent, clearSearch } = useInteractionStore();

  useEffect(() => {
    if (query.trim()) {
      const debounceTimer = setTimeout(() => {
        searchContent(query);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      clearSearch();
    }
  }, [query, searchContent, clearSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    clearSearch();
    setIsExpanded(false);
  };

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleBlur = () => {
    // Delay to allow clicking on results
    setTimeout(() => {
      if (!query.trim()) {
        setIsExpanded(false);
      }
    }, 200);
  };

  const hasResults = searchResults.posts.length > 0 || searchResults.users.length > 0 || searchResults.tags.length > 0;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={20} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-surface border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-textSecondary hover:text-text"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isExpanded && (query.trim() || hasResults) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-textSecondary">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          ) : (
            <div className="p-2">
              {/* Users */}
              {searchResults.users.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider px-2 py-1 mb-2">
                    <User size={12} className="inline mr-1" />
                    Users
                  </h4>
                  {searchResults.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center space-x-3 p-2 hover:bg-background rounded-lg cursor-pointer"
                      onClick={() => {
                        // Navigate to user profile
                        window.location.href = `/profile/${user.id}`;
                      }}
                    >
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-text text-sm">{user.name}</p>
                        <p className="text-xs text-textSecondary">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Posts */}
              {searchResults.posts.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider px-2 py-1 mb-2">
                    <FileText size={12} className="inline mr-1" />
                    Posts
                  </h4>
                  {searchResults.posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-2 hover:bg-background rounded-lg cursor-pointer"
                      onClick={() => {
                        // Navigate to post or open modal
                        console.log('Navigate to post:', post.id);
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs text-textSecondary">@{post.author.username}</span>
                      </div>
                      <p className="text-sm text-text truncate">{post.prompt}</p>
                      {/*post.tags && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index} 
                              className="text-xs text-primary"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )*/}
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              {/*searchResults.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-textSecondary uppercase tracking-wider px-2 py-1 mb-2">
                    <Hash size={12} className="inline mr-1" />
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2 px-2">
                    {searchResults.tags.map((tag, index) => (
                      <button
                        key={index}
                        className="text-sm text-primary hover:text-primary/80 transition-colors"
                        onClick={() => {
                          setQuery(tag);
                          // Filter by tag
                          console.log('Filter by tag:', tag);
                        }}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )*/}

              {/* No Results */}
              {!hasResults && query.trim() && !isSearching && (
                <div className="p-4 text-center text-textSecondary">
                  <Search size={24} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try different keywords or check your spelling</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchbar;
