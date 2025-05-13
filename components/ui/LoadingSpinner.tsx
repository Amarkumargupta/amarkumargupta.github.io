"use client";

import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  delay?: number; // Delay in ms before showing spinner (prevents flash for quick loads)
}

export function LoadingSpinner({ 
  size = 'md', 
  text = 'Loading...', 
  delay = 300 
}: LoadingSpinnerProps) {
  const [visible, setVisible] = useState(delay === 0);
  
  useEffect(() => {
    if (delay === 0) return;
    
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!visible) return null;
  
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };
  
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-live="polite">
      <div 
        className={`${sizeClasses[size]} rounded-full border-t-[rgb(var(--terminal-green))] border-r-[rgba(var(--terminal-green),0.2)] border-b-[rgba(var(--terminal-green),0.2)] border-l-[rgba(var(--terminal-green),0.2)] animate-spin`}
        aria-hidden="true"
      />
      {text && (
        <p className={`${textSizeClasses[size]} text-[rgb(var(--terminal-green))]`}>
          {text}
        </p>
      )}
    </div>
  );
}
