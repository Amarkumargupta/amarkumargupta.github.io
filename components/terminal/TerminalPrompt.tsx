'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TerminalPromptProps {
  onExecute?: (command: string) => void;
  command?: string;
  readOnly?: boolean;
}

// Maximum number of commands to store in history
const MAX_HISTORY_LENGTH = 50;

// Load command history from localStorage
const loadCommandHistory = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem('terminalCommandHistory');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error loading command history:', e);
    return [];
  }
};

// Save command history to localStorage
const saveCommandHistory = (history: string[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('terminalCommandHistory', JSON.stringify(history));
  } catch (e) {
    console.error('Error saving command history:', e);
  }
};

export function TerminalPrompt({ onExecute, command, readOnly = false }: TerminalPromptProps) {
  const [inputValue, setInputValue] = useState(command || '');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHistoryHint, setShowHistoryHint] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const currentInputRef = useRef(inputValue);
  
  // Keep track of the current input value in a ref to access it in event handlers
  useEffect(() => {
    currentInputRef.current = inputValue;
  }, [inputValue]);

  // Load command history from localStorage
  useEffect(() => {
    if (!readOnly) {
      const history = loadCommandHistory();
      setCommandHistory(history);
      // Show history hint if there are commands in history
      setShowHistoryHint(history.length > 0);
      // Hide hint after 3 seconds
      const timer = setTimeout(() => setShowHistoryHint(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [readOnly]);
  
  // Animation and focus effects
  useEffect(() => {
    if (!readOnly && inputRef.current) {
      inputRef.current.focus();
    }
    
    if (promptRef.current) {
      gsap.fromTo(
        promptRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [readOnly]);

  useEffect(() => {
    // Set initial focus only on component mount
    inputRef.current?.focus();

    // Instead of capturing all clicks, we'll only focus when clicking on the terminal area
    // but not on other input elements
    const handleClick = (e: MouseEvent) => {
      // Skip if clicking on an input, textarea, select or any interactive element
      const target = e.target as HTMLElement;
      const isFormElement = target.tagName === 'INPUT' || 
                           target.tagName === 'TEXTAREA' || 
                           target.tagName === 'SELECT' || 
                           target.tagName === 'BUTTON' ||
                           target.closest('button') ||
                           target.closest('a') ||
                           target.closest('input') ||
                           target.closest('textarea') ||
                           target.closest('select');

      // Don't steal focus from form elements
      if (isFormElement) {
        return;
      }

      // Only focus if clicking in the terminal container area
      const terminalContainer = document.querySelector('.terminal-container');
      if (terminalContainer && terminalContainer.contains(target)) {
        // Additional check to prevent focusing when clicking in project search or contact form
        const activeSection = document.querySelector('.terminal-sections > div[style*="display: block"]');
        if (activeSection) {
          const sectionId = activeSection.id || '';
          // Don't auto focus when in projects or contact section
          if (sectionId.includes('projects') || sectionId.includes('contact')) {
            return;
          }
        }
        
        inputRef.current?.focus();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Execute command on Enter
    if (e.key === 'Enter' && onExecute && inputValue.trim()) {
      // Save command to history if it's not a duplicate of the most recent command
      const trimmedCommand = inputValue.trim();
      const newHistory = [
        ...commandHistory.filter(cmd => cmd !== trimmedCommand), // Remove duplicates
        trimmedCommand // Add current command to the end
      ].slice(-MAX_HISTORY_LENGTH); // Keep only the most recent commands
      
      setCommandHistory(newHistory);
      saveCommandHistory(newHistory);
      onExecute(trimmedCommand);
      setInputValue('');
      setHistoryIndex(-1); // Reset history index
    }
    
    // Navigate command history with up/down arrows
    if (e.key === 'ArrowUp') {
      e.preventDefault(); // Prevent cursor from moving to the start of input
      
      if (commandHistory.length === 0) return;
      
      const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      if (newIndex >= 0 && newIndex < commandHistory.length) {
        // If this is the first arrow up, save the current input
        if (historyIndex === -1) {
          currentInputRef.current = inputValue;
        }
        
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
        // Move cursor to end of input after state update
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = inputRef.current.value.length;
            inputRef.current.selectionEnd = inputRef.current.value.length;
            updateCursorPosition();
          }
        }, 0);
      }
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault(); // Prevent cursor from moving to the end of input
      
      if (commandHistory.length === 0) return;
      
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        // Return to the original input when reaching the bottom of history
        setHistoryIndex(-1);
        setInputValue(currentInputRef.current);
      }
      
      // Move cursor to end of input after state update
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.value.length;
          inputRef.current.selectionEnd = inputRef.current.value.length;
          updateCursorPosition();
        }
      }, 0);
    }
  };

  // Update cursor position based on input caret position
  const updateCursorPosition = () => {
    if (inputRef.current && cursorRef.current) {
      const caretPosition = inputRef.current.selectionStart || 0;
      const textWidth = getTextWidth(inputValue.substring(0, caretPosition), getComputedStyle(inputRef.current).font);
      cursorRef.current.style.left = `${textWidth + 8}px`; // 8px for the left margin
    }
  };

  // Helper function to calculate text width
  const getTextWidth = (text: string, font: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width;
    }
    return 0;
  };
  
  return (
    <div ref={promptRef} className="terminal-prompt relative">
      <div className="flex items-center">
        <span className="terminal-prompt-user">amar@cloud</span>
        <span className="terminal-prompt-location">~/workspace</span>
        <span className="terminal-prompt-dollar">&gt;</span>
        {readOnly ? (
          <span className="ml-2">{command}</span>
        ) : (
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              className="command-input ml-2 w-full"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                updateCursorPosition();
              }}
              onKeyDown={handleKeyDown}
              onKeyUp={updateCursorPosition}
              onClick={updateCursorPosition}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal command input"
            />
            <span 
              ref={cursorRef}
              className="terminal-prompt-cursor absolute top-1/2 -translate-y-1/2"
              style={{ left: '8px' }}
              aria-hidden="true"
            />
            
            {/* History navigation indicators */}
            {commandHistory.length > 0 && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[rgba(var(--terminal-green),0.6)]">
                <button 
                  type="button"
                  onClick={() => handleKeyDown({ key: 'ArrowUp', preventDefault: () => {} } as any)}
                  className={`p-1 rounded hover:bg-[rgba(var(--terminal-green),0.1)] transition-colors ${historyIndex >= 0 ? 'text-[rgb(var(--terminal-green))]' : ''}`}
                  aria-label="Previous command"
                  tabIndex={-1} // Don't disrupt tab navigation
                >
                  <ArrowUp size={14} />
                </button>
                <button 
                  type="button"
                  onClick={() => handleKeyDown({ key: 'ArrowDown', preventDefault: () => {} } as any)}
                  className={`p-1 rounded hover:bg-[rgba(var(--terminal-green),0.1)] transition-colors ${historyIndex > 0 ? 'text-[rgb(var(--terminal-green))]' : ''}`}
                  aria-label="Next command"
                  tabIndex={-1} // Don't disrupt tab navigation
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Command history hint - shows briefly when component mounts */}
      {showHistoryHint && !readOnly && commandHistory.length > 0 && (
        <div className="mt-1 text-xs text-[rgba(var(--terminal-green),0.6)] animate-fade-in">
          <span>Tip: Use ↑↓ arrow keys to navigate command history ({commandHistory.length} command{commandHistory.length !== 1 ? 's' : ''})</span>
        </div>
      )}
    </div>
  );
}