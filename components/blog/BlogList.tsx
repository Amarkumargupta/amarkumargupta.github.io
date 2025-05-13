'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Tag, Search, SortAsc, SortDesc } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import type { BlogPost } from '@/lib/blog';

interface BlogListProps {
  initialPosts: BlogPost[];
}

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'reading-asc' | 'reading-desc' | 'popularity';

export default function BlogList({ initialPosts }: BlogListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  
  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [initialPosts]);
  
  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let posts = [...initialPosts];
    
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      posts = posts.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.content.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Tag filter
    if (selectedTags.length > 0) {
      posts = posts.filter(post =>
        selectedTags.every(tag => post.tags.includes(tag))
      );
    }
    
    // Sort
    switch (sortBy) {
      case 'date-desc':
        posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'date-asc':
        posts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'title-asc':
        posts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        posts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'reading-asc':
        posts.sort((a, b) => parseInt(a.readingTime) - parseInt(b.readingTime));
        break;
      case 'reading-desc':
        posts.sort((a, b) => parseInt(b.readingTime) - parseInt(a.readingTime));
        break;
      case 'popularity':
        posts.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
    }
    
    return posts;
  }, [initialPosts, searchTerm, selectedTags, sortBy]);
  
  return (
    <div>
      <div className="mb-8 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search posts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filters and sorting */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTags(prev => 
                    prev.includes(tag) 
                      ? prev.filter(t => t !== tag)
                      : [...prev, tag]
                  )}
                  className={`
                    px-3 py-1 rounded-full text-sm
                    transition-all duration-300 ease-in-out transform hover:scale-105
                    ${selectedTags.includes(tag)
                      ? 'bg-[rgba(var(--terminal-green),0.2)] text-[rgb(var(--terminal-green))] border-[rgb(var(--terminal-green))]'
                      : 'bg-[rgba(var(--terminal-gray),0.1)] text-[rgba(var(--foreground-rgb),0.8)] hover:bg-[rgba(var(--terminal-green),0.1)]'
                    }
                  `}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
          
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort posts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="reading-asc">Reading Time (Short to Long)</SelectItem>
              <SelectItem value="reading-desc">Reading Time (Long to Short)</SelectItem>
              <SelectItem value="popularity">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Blog posts grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => (
            <Card key={post.slug} className="overflow-hidden hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] group">
              <div className="relative h-48">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <Image
                    src={post.image || '/images/default-blog-image.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                </Link>
              </div>
              
              <div className="p-6">
                <Link href={`/blog/${post.slug}`} className="block">
                  <h2 className="text-xl font-semibold mb-2 text-[rgb(var(--terminal-green))] group-hover:text-[rgb(var(--terminal-green))] relative">
                    <span className="relative inline-block">
                      {post.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[rgb(var(--terminal-green))] transition-all duration-300 group-hover:w-full"></span>
                    </span>
                  </h2>
                </Link>
                  
                  <div className="flex items-center gap-4 text-sm text-[rgba(var(--foreground-rgb),0.7)] mb-3 transition-all duration-300 group-hover:text-[rgba(var(--foreground-rgb),0.9)]">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <time>{format(new Date(post.date), 'MMM d, yyyy')}</time>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime} read</span>
                    </div>
                  </div>
                  
                  <Link href={`/blog/${post.slug}`} className="block">
                    <p className="text-[rgba(var(--foreground-rgb),0.9)] mb-4 transition-all duration-300 group-hover:text-[rgba(var(--foreground-rgb),1)]">
                      {post.excerpt}
                    </p>
                  </Link>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded bg-[rgba(var(--terminal-gray),0.2)] text-[rgba(var(--foreground-rgb),0.8)] transition-all duration-300 ease-in-out group-hover:bg-[rgba(var(--terminal-green),0.1)] group-hover:text-[rgb(var(--terminal-green))]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-[rgba(var(--foreground-rgb),0.7)]">
            No posts found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}