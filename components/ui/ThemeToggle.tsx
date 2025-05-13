"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Set to dark theme if system is detected (simplify to only light/dark)
  useEffect(() => {
    if (theme === 'system') {
      setTheme('dark');
    }
  }, [theme, setTheme]);
  
  // Avoid hydration mismatch by rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Create a visual feedback when theme changes
  const handleThemeChange = (newTheme: string) => {
    if (theme === newTheme) return;
    
    setIsChanging(true);
    setTimeout(() => {
      setTheme(newTheme);
      setTimeout(() => setIsChanging(false), 300);
    }, 150);
  };
  
  // If not mounted yet, show a placeholder of the same size to prevent layout shift
  if (!mounted) {
    return (
      <div className="h-9 px-1 rounded-md flex items-center justify-center bg-[rgba(var(--terminal-gray),0.2)]">
        <div className="animate-pulse h-4 w-4 rounded-full bg-[rgba(var(--terminal-green),0.3)]"></div>
      </div>
    );
  }
  
  return (
    <div className={`rounded-lg border p-1 backdrop-blur-sm transition-all duration-300 ${isChanging ? 'scale-95 opacity-70' : ''} ${
      theme === 'dark' 
        ? 'bg-[rgba(var(--terminal-black),0.9)] border-[rgba(var(--terminal-green),0.4)]' 
        : 'bg-white/95 border-[rgba(var(--terminal-green),0.3)] shadow-sm'
    }`}>
      <div className="flex items-center gap-1 p-px rounded-md relative">
        {/* Animated selection indicator */}
        <div
          className={`absolute h-7 w-7 rounded-md transition-all duration-300 ${isChanging ? 'scale-90 opacity-50' : ''} ${
            theme === 'dark' 
              ? 'bg-[rgba(var(--terminal-green),0.15)] border border-[rgba(var(--terminal-green),0.3)]' 
              : 'bg-[rgba(var(--terminal-green),0.12)] border border-[rgba(var(--terminal-green),0.3)]'
          } ${
            theme === 'light' ? 'left-0' : 'left-8'
          }`}
        ></div>
        
        {/* Light theme button */}
        <button
          onClick={() => handleThemeChange('light')}
          aria-label="Use light theme"
          className={`relative z-10 flex items-center justify-center h-7 w-7 rounded-md transition-all ${
            theme === 'light' 
              ? 'text-[rgb(var(--terminal-green))]' 
              : 'text-[rgba(var(--foreground-rgb),0.7)] hover:text-[rgba(var(--foreground-rgb),1)]'
          }`}
        >
          <Sun className="h-4 w-4" />
          <span className="sr-only">Light</span>
        </button>
        
        {/* Dark theme button */}
        <button
          onClick={() => handleThemeChange('dark')}
          aria-label="Use dark theme"
          className={`relative z-10 flex items-center justify-center h-7 w-7 rounded-md transition-all ${
            theme === 'dark' 
              ? 'text-[rgb(var(--terminal-green))]' 
              : 'text-[rgba(var(--foreground-rgb),0.7)] hover:text-[rgba(var(--foreground-rgb),1)]'
          }`}
        >
          <Moon className="h-4 w-4" />
          <span className="sr-only">Dark</span>
        </button>
      </div>
    </div>
  );
}
