'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { Card } from '@/components/ui/card';
import { SearchBar } from '@/components/ui/SearchBar';
import SimpleKeywordsBackground from '@/components/background/SimpleKeywordsBackground';

// Types for our data
interface BlogPost {
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content: string;
  image?: string;
  tags: string[];
  type: 'blog';
  score?: number;
}

interface Project {
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  tags: string[];
  type: 'project';
  score?: number;
}

type SearchResult = BlogPost | Project;

// Fuzzy search function that gives a score to how well the query matches the text
function fuzzyScore(text: string, query: string): number {
  if (!query) return 0;
  
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  // Exact match gets highest score
  if (lowerText.includes(lowerQuery)) return 100;
  
  let score = 0;
  let lastIndex = -1;
  
  // Check if all characters in query appear in order in the text
  for (const char of lowerQuery) {
    const index = lowerText.indexOf(char, lastIndex + 1);
    if (index === -1) return 0; // Character not found
    
    // Characters that appear closer together get higher scores
    score += 1 / (index - lastIndex);
    lastIndex = index;
  }
  
  return score * 10; // Scale the score
}

// Helper function to format date for display
function formatDate(dateString: string) {
  if (!dateString) return '';
  const date = parseISO(dateString);
  if (!isValid(date)) return '';
  return format(date, 'MMMM d, yyyy');
}

// This is a wrapper component that doesn't use useSearchParams
export default function SearchPage() {
  return (
    <div className="text-[rgb(var(--terminal-green))] p-4 relative min-h-screen overflow-hidden">
      <SimpleKeywordsBackground />
      <Suspense fallback={<SearchLoading />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}

// Loading state component
function SearchLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-[rgb(var(--terminal-green))] hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Search</h1>
      
      <div className="mb-8">
        <SearchBar initialQuery="" />
      </div>
      
      <div className="text-center py-12">
        <p className="text-[rgba(var(--terminal-green),0.7)]">
          Loading...
        </p>
      </div>
    </div>
  );
}

// Content component that uses useSearchParams
function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch blog posts
        const blogResponse = await fetch('/api/blog-posts.json');
        const blogData = await blogResponse.json();
        
        // Fetch projects
        const projectsResponse = await fetch('/api/projects.json');
        const projectsData = await projectsResponse.json();
        
        setBlogPosts(blogData.map((post: any) => ({
          ...post,
          type: 'blog' as const
        })));
        
        setProjects(projectsData.map((project: any) => ({
          ...project,
          type: 'project' as const
        })));
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  // Perform search whenever query or data changes
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    
    // Score and filter blog posts
    const matchedPosts = blogPosts
      .map(post => {
        // Calculate a combined score from title, description, tags, and content
        const titleScore = fuzzyScore(post.title, query) * 2; // Title matches are more important
        const descriptionScore = fuzzyScore(post.excerpt || '', query);
        const tagsScore = post.tags.some(tag => 
          fuzzyScore(tag, query) > 0
        ) ? 50 : 0;
        const contentScore = fuzzyScore(post.content.slice(0, 1000), query) * 0.5; // Content is less important
        
        return {
          ...post,
          score: titleScore + descriptionScore + tagsScore + contentScore,
        };
      })
      .filter(post => post.score > 0);
      
    // Score and filter projects
    const matchedProjects = projects
      .map(project => {
        // Calculate a combined score
        const titleScore = fuzzyScore(project.title, query) * 2;
        const descriptionScore = fuzzyScore(project.excerpt || '', query);
        const tagsScore = project.tags.some(tag => 
          fuzzyScore(tag, query) > 0
        ) ? 50 : 0;
        
        return {
          ...project,
          score: titleScore + descriptionScore + tagsScore,
        };
      })
      .filter(project => project.score > 0);
    
    // Combine and sort all results by score
    const allResults = [...matchedPosts, ...matchedProjects].sort((a, b) => (b.score || 0) - (a.score || 0));
    
    setResults(allResults);
  }, [query, blogPosts, projects]);
  
  // Render content based on loading state and query
  return (
    <div className="max-w-4xl mx-auto">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-[rgb(var(--terminal-green))] hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Search Results: "${query}"` : 'Search'}
      </h1>
      
      <div className="mb-8">
        <SearchBar initialQuery={query} />
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-[rgba(var(--terminal-green),0.7)]">
            Loading...
          </p>
        </div>
      ) : !query ? (
        <div className="text-center py-12">
          <p className="text-[rgba(var(--terminal-green),0.7)]">
            Enter a search term to find blog posts and projects.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[rgba(var(--terminal-green),0.7)]">
            No results found for "{query}". Try a different search term.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-[rgba(var(--terminal-green),0.7)]">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          
          <div className="space-y-6">
            {results.map(result => (
              <Card 
                key={`${result.type}-${result.slug}`}
                className="p-5 bg-[rgba(var(--terminal-gray),0.1)] border-[rgba(var(--terminal-green),0.3)] hover:bg-[rgba(var(--terminal-gray),0.2)] transition-all group"
              >
                <Link 
                  href={result.type === 'blog' ? `/blog/${result.slug}` : `/projects/${result.slug}`}
                  className="block"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {result.image && (
                      <div className="relative h-36 md:w-36 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={result.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 150px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase font-semibold bg-[rgba(var(--terminal-green),0.2)] text-[rgb(var(--terminal-green))] px-2 py-0.5 rounded">
                          {result.type === 'blog' ? 'Blog Post' : 'Project'}
                        </span>
                        
                        {result.type === 'blog' && (result as BlogPost).date && (
                          <div className="flex items-center gap-1 text-xs text-[rgba(var(--foreground-rgb),0.7)]">
                            <Calendar className="w-3 h-3" />
                            <time>{formatDate((result as BlogPost).date)}</time>
                          </div>
                        )}
                      </div>
                      
                      <h2 className="text-xl font-semibold mb-2 text-white group-hover:text-[rgb(var(--terminal-green))] transition-colors">
                        {result.title}
                      </h2>
                      
                      <p className="text-sm text-[rgba(var(--foreground-rgb),0.7)] mb-3 line-clamp-2">
                        {result.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-1">
                        {result.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-[rgba(var(--terminal-green),0.1)] text-[rgb(var(--terminal-green))]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
