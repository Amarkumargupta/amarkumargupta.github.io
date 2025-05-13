'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeTransition() {
  const { theme, systemTheme } = useTheme();
  const [transitionActive, setTransitionActive] = useState(false);
  const [currentTheme, setPreviousTheme] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    // Only trigger transition if theme has changed and wasn't the initial load
    if (currentTheme && currentTheme !== theme) {
      setTransitionActive(true);
      const timer = setTimeout(() => {
        setTransitionActive(false);
      }, 600);
      return () => clearTimeout(timer);
    }
    
    setPreviousTheme(theme);
  }, [theme, currentTheme]);
  
  // Don't render on server
  if (typeof window === 'undefined') return null;
  
  // Don't render if no transition is active
  if (!transitionActive) return null;
  
  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        animation: 'theme-transition 600ms ease-in-out forwards',
      }}
    />
  );
}

// Requires this CSS added to global styles:
// @keyframes theme-transition {
//   0% { opacity: 0; }
//   20% { opacity: 1; }
//   80% { opacity: 1; }
//   100% { opacity: 0; }
// }
