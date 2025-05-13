"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { User, Laptop, Code, Mail, FileText } from 'lucide-react';

interface TerminalNavigationProps {
  activeSection: string;
  onNavClick: (command: string) => void;
}

// Define the navigation items for easier management and consistency
const navItems = [
  { id: 'about', label: 'About', icon: User, command: 'about', ariaLabel: 'Navigate to About section' },
  { id: 'skills', label: 'Skills', icon: Laptop, command: 'skills', ariaLabel: 'Navigate to Skills section' },
  { id: 'projects', label: 'Projects', icon: Code, command: 'projects', ariaLabel: 'Navigate to Projects section' },
  { id: 'blog', label: 'Blog', icon: FileText, command: 'blog', ariaLabel: 'Navigate to Blog section' },
  { id: 'contact', label: 'Contact', icon: Mail, command: 'contact', ariaLabel: 'Navigate to Contact section' }
];

export default function TerminalNavigation({ activeSection, onNavClick }: TerminalNavigationProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(activeSection);

  useEffect(() => {
    setCurrentSection(activeSection);
  }, [activeSection]);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current.children,
        { opacity: 0, y: -10 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.5, 
          ease: "power2.out" 
        }
      );
    }
  }, []);
  
  useEffect(() => {
    if (navRef.current) {
      const allButtons = navRef.current.querySelectorAll('.nav-link');
      allButtons.forEach(button => {
        button.classList.remove('bg-[rgba(var(--terminal-green),0.1)]');
        button.classList.remove('border-[rgba(var(--terminal-green),0.5)]');
        button.classList.remove('text-white');
      });

      const activeButton = navRef.current.querySelector(`[data-section="${currentSection}"]`);
      if (activeButton) {
        gsap.to(activeButton, {
          backgroundColor: 'rgba(104, 255, 104, 0.1)',
          borderColor: 'rgba(104, 255, 104, 0.5)',
          color: 'rgb(255, 255, 255)',
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  }, [currentSection]);

  const handleNavClick = (section: string) => {
    setCurrentSection(section);
    onNavClick(section);
  };
  
  return (
    <div className="mb-6 sm:mb-8">
      <div className="line command mb-3 sm:mb-4 text-sm sm:text-base" aria-hidden="true">$ help</div>
      <div className="result mb-4 sm:mb-6 text-sm sm:text-base" role="region" aria-label="Available terminal commands">
        Available commands: about, skills, projects, blog, contact, clear, help
      </div>
      
      <nav 
        ref={navRef} 
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4"
        aria-label="Main navigation"
        role="navigation"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              data-section={item.id}
              aria-label={item.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              aria-pressed={isActive}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavClick(item.id);
                }
              }}
              className={`
                nav-link
                p-2 sm:p-3
                rounded-lg
                border
                transition-all
                duration-200
                flex
                items-center
                justify-center
                gap-1 sm:gap-2
                text-xs sm:text-sm
                focus:outline-none focus:ring-2 focus:ring-[rgba(var(--terminal-green),0.5)]
                ${isActive 
                  ? 'bg-[rgba(var(--terminal-green),0.2)] border-[rgba(var(--terminal-green),0.5)] text-white dark:bg-[rgba(var(--terminal-green),0.1)]' 
                  : 'border-[rgba(var(--terminal-gray),0.4)] hover:border-[rgba(var(--terminal-green),0.4)] hover:bg-[rgba(var(--terminal-green),0.1)] hover:text-[rgb(var(--foreground-rgb))]'
                }
              `}
            >
              <span className="inline-flex flex-shrink-0">
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              </span>
              <span className="font-medium">{item.label}</span>
              <span className="hidden lg:inline text-[rgba(var(--terminal-green),0.7)] text-xs">
                [{item.id}]
              </span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-[rgba(var(--terminal-green),0.8)] flex items-center gap-2">
        <User className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
        <span>Type a command or use <kbd>Tab</kbd> key to navigate</span>
      </div>
    </div>
  );
}