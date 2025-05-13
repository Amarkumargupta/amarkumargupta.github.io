"use client";

import { useState, useEffect } from 'react';

interface TerminalLoadingIndicatorProps {
  text?: string;
  delay?: number;
  dots?: number;
}

export function TerminalLoadingIndicator({ 
  text = "Loading", 
  delay = 300,
  dots = 3
}: TerminalLoadingIndicatorProps) {
  const [visible, setVisible] = useState(delay === 0);
  const [dotCount, setDotCount] = useState(0);
  
  // Show loading indicator after delay (prevents flashing for quick operations)
  useEffect(() => {
    if (delay === 0) return;
    
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  // Animate the dots
  useEffect(() => {
    if (!visible) return;
    
    const interval = setInterval(() => {
      setDotCount(prev => (prev + 1) % (dots + 1));
    }, 300);
    
    return () => clearInterval(interval);
  }, [dots, visible]);
  
  if (!visible) return null;
  
  return (
    <div className="terminal-loading py-2" role="status" aria-live="polite">
      <div className="flex items-center font-mono">
        <span className="text-[rgb(var(--terminal-green))]">
          $ {text}{'.'.repeat(dotCount)}{'\u00A0'.repeat(dots - dotCount)}
        </span>
        <span className="ml-1 h-4 w-2 bg-[rgb(var(--terminal-green))] animate-blink"></span>
      </div>
    </div>
  );
}
