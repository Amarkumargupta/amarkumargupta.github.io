"use client";

import { ReactNode } from 'react';
import SimpleKeywordsBackground from '../background/SimpleKeywordsBackground';

interface BlogBackgroundWrapperProps {
  children: ReactNode;
}

export default function BlogBackgroundWrapper({ children }: BlogBackgroundWrapperProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background Animation - Fixed Position */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none opacity-40">
        <SimpleKeywordsBackground />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
