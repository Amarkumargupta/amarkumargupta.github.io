"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface TerminalOutputProps {
  output: string;
}

export function TerminalOutput({ output }: TerminalOutputProps) {
  const outputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (outputRef.current) {
      const chars = outputRef.current.innerText.split('');
      outputRef.current.innerHTML = '';
      
      chars.forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        charSpan.style.opacity = '0';
        outputRef.current?.appendChild(charSpan);
        
        gsap.to(charSpan, {
          opacity: 1,
          duration: 0.01,
          delay: index * 0.01, // Typing effect delay
        });
      });
    }
  }, [output]);
  
  return (
    <div ref={outputRef} className="terminal-output ml-6 text-[rgb(var(--terminal-green))]">
      {output}
    </div>
  );
}