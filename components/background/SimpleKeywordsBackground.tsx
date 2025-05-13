"use client";

import React, { useEffect } from 'react';

// Tech keywords to display
const TECH_KEYWORDS = [
  'DevOps', 'Cloud', 'AWS', 'Docker', 'Kubernetes',
  'CI/CD', 'Terraform', 'Ansible', 'Automation', 'Microservices',
  'NodeJS', 'React', 'TypeScript', 'Python', 'Go',
  'Serverless', 'Infrastructure', 'Monitoring', 'NextJS', 'Redux',
  'YAML', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Auth',
  'Performance', 'Security', 'Scalability', 'Networking', 'Testing'
];

export default function SimpleKeywordsBackground() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    const container = document.getElementById('keywords-background-container');
    if (!container) return;
    
    // Clear existing keywords
    container.innerHTML = '';
    
    // Add keyframe animation to document
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @keyframes keyword-float {
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
    
    // Create keywords
    const createKeyword = () => {
      if (!container) return;
      
      // Get random keyword
      const keyword = TECH_KEYWORDS[Math.floor(Math.random() * TECH_KEYWORDS.length)];
      
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
      const size = (0.8 + Math.random() * 0.6) + 'rem';
      const maxOpacity = 0.1 + Math.random() * 0.3;
      
      // Set styles
      element.textContent = keyword;
      element.className = 'keyword-floating';
      element.style.cssText = `
        position: absolute;
        color: rgb(var(--terminal-green));
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
        animation: keyword-float ${duration} ease-in-out forwards;
        text-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
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
    
    // Create initial keywords
    for (let i = 0; i < 20; i++) {
      createKeyword();
    }
    
    // Create new keywords periodically
    const interval = setInterval(createKeyword, 1000);
    
    return () => {
      clearInterval(interval);
      if (styleEl.parentNode) {
        document.head.removeChild(styleEl);
      }
    };
  }, []);
  
  return (
    <div 
      id="keywords-background-container" 
      className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none opacity-40 z-0"
    />
  );
}
