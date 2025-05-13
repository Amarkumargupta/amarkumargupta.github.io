"use client";

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SimpleKeywordsBackground from '@/components/background/SimpleKeywordsBackground';

export default function Custom404() {
  return (
    <div className="min-h-screen bg-[rgb(var(--terminal-black))] text-[rgb(var(--terminal-green))] p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 3D Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <SimpleKeywordsBackground />
      </div>
      
      <div className="max-w-md text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <div className="terminal-text mb-6 bg-[rgba(10,10,10,0.7)] p-4 rounded border border-[rgba(var(--terminal-green),0.3)]">
          <p className="mb-2">$ find /requested/path</p>
          <p className="text-[rgb(var(--terminal-red))]">Error: No such file or directory</p>
          <p className="mt-2">$ echo "The page you're looking for doesn't exist."</p>
        </div>
        <p className="mb-8">The requested page could not be found. It may have been moved or deleted.</p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[rgb(var(--terminal-green))] hover:text-white transition-colors bg-[rgba(10,10,10,0.7)] px-4 py-2 rounded border border-[rgba(var(--terminal-green),0.3)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
