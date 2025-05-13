'use client';

import { useEffect } from 'react';
import Markdown from 'markdown-to-jsx';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import CodeBlock from '../ui/CodeBlock';

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="prose prose-invert prose-green max-w-none">
      <Markdown
        options={{
          overrides: {
            pre: {
              component: ({ children }) => {
                // Extract code content and language from the children
                const codeElement = Array.isArray(children) ? children[0] : children;
                let code = codeElement?.props?.children || '';
                // Extract language from className (format: language-xxx)
                const className = codeElement?.props?.className || '';
                const language = className.replace('lang-', '');
                
                // Extract filename if it exists in the first line as a comment
                let filename = null;
                const firstLine = code.split('\n')[0];
                const fileCommentPatterns = [
                  /^\/\/\s*([\w\.-]+)\s*$/,    // For // filename.js
                  /^#\s*([\w\.-]+)\s*$/,      // For # filename.py
                  /^<!--\s*([\w\.-]+)\s*-->$/, // For <!-- filename.html -->
                  /^--\s*([\w\.-]+)\s*$/,     // For -- filename.sql
                  /^filename:\s*([\w\.-]+)\s*$/i // For filename: filename.js
                ];
                
                for (const pattern of fileCommentPatterns) {
                  const match = firstLine.match(pattern);
                  if (match && match[1]) {
                    filename = match[1];
                    // Remove the filename line from the code
                    code = code.substring(firstLine.length).trim();
                    break;
                  }
                }
                
                return (
                  <CodeBlock 
                    code={code} 
                    language={language}
                    filename={filename} 
                  />
                );
              }
            }
          }
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}