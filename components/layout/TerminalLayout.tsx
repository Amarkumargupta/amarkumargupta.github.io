"use client";

import { useRef, useEffect, useState, useTransition } from 'react';
import { AnimatedTerminalHeader } from '../terminal/AnimatedTerminalHeader';
import { TerminalPrompt } from '../terminal/TerminalPrompt';
import { TerminalOutput } from '../terminal/TerminalOutput';
import { TerminalLoadingIndicator } from '../terminal/TerminalLoadingIndicator';
import SimpleTerminalBackground from '../background/SimpleTerminalBackground';
import TerminalNavigation from '../terminal/TerminalNavigation';
import HeroSection from '../sections/HeroSection';
import SkillsSection from '../sections/SkillsSection';
import ProjectsSection from '../sections/ProjectsSection';
import ContactSection from '../sections/ContactSection';
import BlogSection from '../sections/BlogSection';
import { gsap } from 'gsap';
import type { BlogPost } from '@/lib/blog';
import type { Project } from '@/lib/projects';

interface TerminalLayoutProps {
  blogPosts: BlogPost[];
  projects: Project[];
}

export default function TerminalLayout({ blogPosts, projects }: TerminalLayoutProps) {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [commandHistory, setCommandHistory] = useState<{command: string, output: string}[]>([]);
  const [isPending, startTransition] = useTransition();
  const [lastCommand, setLastCommand] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        terminalRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" },
          "-=0.4"
        );
      }
    }
    
    setCommandHistory([
      { 
        command: 'initialize', 
        output: 'Welcome to Amar Gupta\'s Command Center! Type \'help\' for available commands.' 
      }
    ]);
  }, []);
  
  const executeCommand = (command: string) => {
    let output = '';
    const trimmedCommand = command.toLowerCase().trim();
    setLastCommand(trimmedCommand);
    
    switch (trimmedCommand) {
      case 'help':
        output = 'Available commands: about, skills, projects, blog, contact, clear, help';
        break;
      case 'about':
      case 'skills':
      case 'projects':
      case 'blog':
      case 'contact':
        // Use React useTransition for a smoother experience when switching sections
        // This will allow React to keep the UI responsive during the transition
        startTransition(() => {
          setActiveSection(trimmedCommand);
        });
        output = '';
        break;
      case 'clear':
        setCommandHistory([]);
        return;
      case 'reload':
      case 'refresh':
        output = 'Refreshing terminal...';
        // Simulate a refresh with a short delay
        setTimeout(() => {
          window.location.reload();
        }, 500);
        break;
      default:
        output = `Command not found: ${command}. Type 'help' for available commands.`;
    }
    
    setCommandHistory(prev => [...prev, { command, output }]);
    
    setTimeout(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (terminalRef.current) {
        terminalRef.current.scrollTop += e.deltaY;
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    return () => window.removeEventListener('wheel', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      {/* Full screen background */}
      <SimpleTerminalBackground />
      
      <div 
        ref={terminalRef}
        className="terminal-container w-full max-w-5xl h-[85vh] sm:h-[90vh] overflow-y-auto relative z-10 backdrop-blur-sm"
        style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatedTerminalHeader />
        
        <div className="terminal-content" ref={contentRef}>
          <TerminalNavigation activeSection={activeSection} onNavClick={executeCommand} />
          
          <div className="terminal-history mt-4 sm:mt-6 mb-4">
            {commandHistory.map((entry, index) => (
              <div key={index} className="mb-4">
                {entry.command && (
                  <TerminalPrompt command={entry.command} readOnly />
                )}
                {entry.output && (
                  <TerminalOutput output={entry.output} />
                )}
              </div>
            ))}
          </div>
          
          <div className="terminal-sections space-y-6 sm:space-y-8">
            {/* Loading indicator shown during transitions */}
            {isPending && (
              <div className="mb-4">
                <TerminalLoadingIndicator text={`Loading ${lastCommand} section`} />
              </div>
            )}
            
            {/* Terminal sections */}
            <div style={{ display: activeSection === 'about' ? 'block' : 'none' }} id="terminal-about-section" aria-hidden={activeSection !== 'about'}>
              <HeroSection />
            </div>
            <div style={{ display: activeSection === 'skills' ? 'block' : 'none' }} id="terminal-skills-section" aria-hidden={activeSection !== 'skills'}>
              <SkillsSection />
            </div>
            <div style={{ display: activeSection === 'projects' ? 'block' : 'none' }} id="terminal-projects-wrapper" aria-hidden={activeSection !== 'projects'}>
              <ProjectsSection projects={projects} />
            </div>
            <div style={{ display: activeSection === 'blog' ? 'block' : 'none' }} id="terminal-blog-section" aria-hidden={activeSection !== 'blog'}>
              <BlogSection posts={blogPosts} />
            </div>
            <div style={{ display: activeSection === 'contact' ? 'block' : 'none' }} id="terminal-contact-wrapper" aria-hidden={activeSection !== 'contact'}>
              <ContactSection />
            </div>
          </div>
          
          <div className="mt-4 sm:mt-6">
            <TerminalPrompt onExecute={executeCommand} />
          </div>
        </div>
      </div>
    </div>
  );
}