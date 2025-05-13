"use client";

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  filename?: string;
}

export default function CodeBlock({ code, language = 'typescript', showLineNumbers = false, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="relative group">
      {filename && (
        <div className="flex items-center bg-[rgba(40,40,40,0.9)] text-[rgb(var(--terminal-green))] py-2 px-3 rounded-t-md font-mono text-xs border-b border-[rgba(var(--terminal-green),0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{filename}</span>
        </div>
      )}
      <pre 
        className={`${filename ? 'rounded-t-none' : ''} bg-[rgba(10,10,10,0.8)] rounded-md p-4 overflow-x-auto text-[rgb(var(--terminal-green))] font-mono text-sm ${
          showLineNumbers ? 'line-numbers' : ''
        }`}
      >
        <code className={`language-${language}`}>
          {code}
        </code>
      </pre>
      
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-md bg-[rgba(40,40,40,0.6)] text-[rgb(var(--terminal-green))] 
          hover:bg-[rgba(60,60,60,0.8)] transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
}
