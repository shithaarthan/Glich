import React from 'react';
import { Search } from 'lucide-react';

interface SearchbarProps {
  placeholder?: string;
  className?: string;
}

const Searchbar: React.FC<SearchbarProps> = ({ placeholder = "Search...", className }) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-surface border border-border rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow placeholder:text-text-muted"
      />
    </div>
  );
};

export default Searchbar;
