"use client";

import React, { useEffect } from 'react';
import { useTheme } from 'next-themes';

// Terminal commands to display
const TERMINAL_COMMANDS = [
  'ls -la', 'cd /', 'pwd', 'grep -r', 'chmod +x',
  'docker ps', 'git push', 'kubectl get pods',
  'systemctl status', 'vim config.yml',
  'ssh root@server', 'curl -X POST',
  'npm install', 'yarn build', 'cargo run',
  'terraform apply', 'ansible-playbook',
  'docker-compose up', 'make install',
  'git clone', 'npm start', 'sudo apt update',
  'python3 manage.py', 'node server.js',
  'echo $PATH', 'tail -f logs.txt', 'mkdir -p',
  'cat /etc/hosts', 'ping google.com', 'top',
  'cd ../', 'mv file.txt dest/', 'find . -name "*.js"',
  'ssh-keygen', 'history | grep git', 'touch .env'
];

export default function SimpleTerminalBackground() {
  const { theme, systemTheme } = useTheme();
  
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    const container = document.getElementById('terminal-background-container');
    if (!container) return;
    
    // Determine if currently in dark mode
    const isDarkTheme = theme === 'dark' || 
      (theme === 'system' && systemTheme === 'dark') ||
      (theme === 'system' && !systemTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Clear existing commands
    container.innerHTML = '';
    
    // Add keyframe animation to document
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes command-float {
        0% {
          transform: translate(var(--startX), var(--startY)) scale(0.7);
          opacity: 0;
        }
        10% {
          opacity: var(--maxOpacity);
        }
        90% {
          opacity: var(--maxOpacity);
        }
        100% {
          transform: translate(var(--endX), var(--endY)) scale(1);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(styleEl);
    
    // Create commands
    const createCommand = () => {
      if (!container) return;
      
      // Get random command
      const command = TERMINAL_COMMANDS[Math.floor(Math.random() * TERMINAL_COMMANDS.length)];
      
      // Create element
      const element = document.createElement('div');
      
      // Random starting position (from edges)
      const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let startX, startY, endX, endY;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      switch (edge) {
        case 0: // top
          startX = Math.random() * width;
          startY = -50;
          endX = startX + (Math.random() * 400 - 200);
          endY = height + 50;
          break;
        case 1: // right
          startX = width + 50;
          startY = Math.random() * height;
          endX = -50;
          endY = startY + (Math.random() * 400 - 200);
          break;
        case 2: // bottom
          startX = Math.random() * width;
          startY = height + 50;
          endX = startX + (Math.random() * 400 - 200);
          endY = -50;
          break;
        case 3: // left
          startX = -50;
          startY = Math.random() * height;
          endX = width + 50;
          endY = startY + (Math.random() * 400 - 200);
          break;
      }
      
      // Random duration, size and opacity
      const duration = 15 + Math.random() * 20 + 's';
      const size = (0.7 + Math.random() * 0.5) + 'rem';
      
      // Adjust opacity and colors based on theme
      const maxOpacity = isDarkTheme 
        ? 0.2 + Math.random() * 0.3 // Higher opacity in dark mode
        : 0.08 + Math.random() * 0.12; // Lower opacity in light mode
      
      // Colors based on theme
      const textColor = isDarkTheme 
        ? `rgb(var(--terminal-green))` 
        : `rgb(var(--saffron-accent))`;
      
      const textShadow = isDarkTheme
        ? `0 0 10px rgba(0, 255, 0, 0.2)`
        : `0 0 8px rgba(243, 156, 18, 0.2)`;
      
      // Set styles
      element.textContent = '$ ' + command;
      element.className = 'command-floating';
      element.style.cssText = `
        position: absolute;
        color: ${textColor};
        font-family: var(--font-mono, monospace);
        white-space: nowrap;
        opacity: 0;
        font-size: ${size};
        --startX: ${startX}px;
        --startY: ${startY}px;
        --endX: ${endX}px;
        --endY: ${endY}px;
        --duration: ${duration};
        --maxOpacity: ${maxOpacity};
        animation: command-float ${duration} ease-in-out forwards;
        text-shadow: ${textShadow};
        top: 0;
        left: 0;
        transform: translate(var(--startX), var(--startY));
        z-index: 0;
      `;
      
      // Add to container
      container.appendChild(element);
      
      // Remove after animation
      setTimeout(() => {
        if (element.parentNode === container) {
          container.removeChild(element);
        }
      }, parseInt(duration) * 1000);
    };
    
    // Create initial commands
    for (let i = 0; i < 25; i++) {
      createCommand();
    }
    
    // Create new commands periodically
    const interval = setInterval(createCommand, 800);
    
    return () => {
      clearInterval(interval);
      if (styleEl.parentNode) {
        document.head.removeChild(styleEl);
      }
    };
  }, [theme, systemTheme]); // Re-run when theme changes
  
  // Determine opacity based on theme for the container
  const containerOpacity = theme === 'dark' || 
    (theme === 'system' && systemTheme === 'dark') ? 'opacity-40' : 'opacity-25';
  
  return (
    <div 
      id="terminal-background-container" 
      className={`fixed inset-0 w-full h-full overflow-hidden pointer-events-none ${containerOpacity} z-0 transition-opacity duration-500`}
    />
  );
}
