"use client";

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { format } from 'date-fns';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { BlogPost } from '@/lib/blog';

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);
  
  return (
    <div ref={sectionRef} className="mb-10">
      <div className="line command">$ cat /blog/latest.md</div>
      
      <div className="result mt-6">
        <div className="space-y-6">
          {posts.slice(0, 3).map((post) => (
            <Link 
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block"
            >
              <article className="bg-[rgba(var(--terminal-gray),0.1)] rounded-lg p-6 border border-[rgba(var(--terminal-green),0.3)] hover:border-[rgba(var(--terminal-green),0.5)] transition-all duration-200">
                <h3 className="text-xl font-bold mb-2 text-[rgb(var(--terminal-green))]">
                  {post.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-[rgba(var(--foreground-rgb),0.7)] mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(post.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime} read</span>
                  </div>
                </div>
                
                <p className="mb-4 text-[rgba(var(--foreground-rgb),0.9)]">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded bg-[rgba(var(--terminal-gray),0.2)] text-[rgba(var(--foreground-rgb),0.8)]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-[rgb(var(--terminal-green))] group-hover:text-white transition-colors">
                    Read more
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
        
        <Link
          href="/blog"
          className="inline-block mt-6 text-[rgb(var(--terminal-green))] hover:text-white transition-colors"
        >
          View all posts <ChevronRight className="inline w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}