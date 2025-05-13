"use client";

import { ReactNode } from 'react';
import SimpleTerminalBackground from '../background/SimpleTerminalBackground';

interface BackgroundWrapperProps {
  children: ReactNode;
}

export default function BackgroundWrapper({ children }: BackgroundWrapperProps) {
  return (
    <div className="relative min-h-screen">
      {/* Background Animation - Fixed Position */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <SimpleTerminalBackground />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
