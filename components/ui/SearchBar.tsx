"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  initialQuery?: string;
  searchPath?: string;
}

export function SearchBar({ 
  placeholder = "Search...", 
  onSearch, 
  initialQuery = "",
  searchPath = "/search"
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  
  // Determine theme-specific colors
  const isLightTheme = theme === 'light';
  const primaryColor = isLightTheme ? '--saffron-accent' : '--terminal-green';
  const deepColor = isLightTheme ? '--saffron-deep' : '--terminal-green-dark';

  // Focus input when search bar opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        // Use Next.js routing with search parameter
        router.push(`${searchPath}?q=${encodeURIComponent(query)}`);
      }
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md bg-[rgba(var(--terminal-gray),0.2)] text-[rgb(var(${primaryColor}))] border border-[rgba(var(${primaryColor}),0.2)] hover:bg-[rgba(var(--terminal-gray),0.3)] transition-colors`}
          aria-label="Open search"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm hidden sm:inline">Search</span>
          <span className={`text-xs opacity-70 border border-[rgba(var(${primaryColor}),0.3)] px-1 rounded ml-1`}>Ctrl+K</span>
        </button>
      ) : (
        <div className={`fixed inset-0 ${isLightTheme ? 'bg-gray-400 bg-opacity-30' : 'bg-black bg-opacity-50'} z-50 flex items-start justify-center pt-20 px-4`}>
          <div className={`bg-[rgba(var(--terminal-gray),0.95)] border border-[rgba(var(${primaryColor}),0.3)] rounded-lg w-full max-w-xl overflow-hidden shadow-xl animate-in slide-in-from-top duration-300`}>
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center px-4 py-3">
                <Search className={`h-5 w-5 text-[rgb(var(${primaryColor}))]`} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={placeholder}
                  className={`flex-1 bg-transparent border-none outline-none px-3 py-1 ${isLightTheme ? 'text-gray-800' : 'text-white'} placeholder-[rgba(var(${primaryColor}),0.5)]`}
                  aria-label="Search query"
                />
                {query && (
                  <button 
                    type="button" 
                    onClick={handleClear}
                    className={`text-[rgba(var(${primaryColor}),0.7)] ${isLightTheme ? 'hover:text-gray-800' : 'hover:text-white'}`}
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              <div className={`p-2 flex justify-between border-t border-[rgba(var(${primaryColor}),0.2)]`}>
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-1.5 text-sm rounded ${isLightTheme ? 'hover:bg-gray-200' : 'hover:bg-[rgba(var(--terminal-gray),0.3)]'}`}
                >
                  Cancel (Esc)
                </button>
                <button 
                  type="submit"
                  disabled={!query.trim()}
                  className={`px-3 py-1.5 text-sm rounded ${
                    query.trim() 
                      ? `bg-[rgba(var(${primaryColor}),0.2)] hover:bg-[rgba(var(${primaryColor}),0.3)]` 
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
