"use client";

import { ReactNode } from 'react';
import SimpleTerminalBackground from '../background/SimpleTerminalBackground';
import SimpleKeywordsBackground from '../background/SimpleKeywordsBackground';

interface BackgroundLayoutProps {
  children: ReactNode;
  type?: 'terminal' | 'blog' | 'none';
}

export default function BackgroundLayout({ 
  children, 
  type = 'terminal' 
}: BackgroundLayoutProps) {
  return (
    <div className="min-h-screen bg-[rgb(var(--terminal-black))] relative overflow-hidden">
      {/* Background Animation */}
      {type !== 'none' && (
        <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-40">
          {type === 'terminal' ? (
            <SimpleTerminalBackground />
          ) : (
            <SimpleKeywordsBackground />
          )}
        </div>
      )}
      
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
