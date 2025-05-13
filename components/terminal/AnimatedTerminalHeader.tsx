"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SearchBar } from '@/components/ui/SearchBar';

interface AnimatedTerminalHeaderProps {
  title?: string;
}

export function AnimatedTerminalHeader({ title = "Amar Kr. Gupta's Command Center" }: AnimatedTerminalHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (headerRef.current) {
      const buttons = headerRef.current.querySelectorAll('.terminal-button');
      const titleEl = headerRef.current.querySelector('.terminal-title');
      
      gsap.fromTo(
        buttons, 
        { scale: 0, opacity: 0 }, 
        { scale: 1, opacity: 1, stagger: 0.1, ease: "back.out(1.7)", duration: 0.5 }
      );
      
      gsap.fromTo(
        titleEl, 
        { opacity: 0, x: -10 }, 
        { opacity: 1, x: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
      );
    }
  }, []);
  
  return (
    <div ref={headerRef} className="terminal-header flex items-center bg-[rgba(40,40,40,0.95)] border-b border-[rgba(var(--terminal-green),0.3)]">
      <div className="flex items-center ml-2">
        <div className="terminal-button terminal-close bg-[#FF5F56] hover:bg-[#FF4146]" aria-hidden="true"></div>
        <div className="terminal-button terminal-minimize bg-[#FFBD2E] hover:bg-[#FFAD1E]" aria-hidden="true"></div>
        <div className="terminal-button terminal-maximize bg-[#27C93F] hover:bg-[#17B92F]" aria-hidden="true"></div>
      </div>
      <div className="terminal-title flex-1 text-center font-medium text-gray-100">{title}</div>
      <div className="mr-3 z-10 flex items-center gap-3">
        <SearchBar placeholder="Search blog & projects..." />
        <ThemeToggle />
      </div>
    </div>
  );
}