import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isValid, parseISO } from 'date-fns';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  readingTime: string;
  excerpt: string;
  content: string;
  image?: string;
  views?: number;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const contentDir = path.join(process.cwd(), 'content', 'blog');
  const files = await fs.readdir(contentDir);
  
  const posts = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(contentDir, file), 'utf8');
      const { data, content: markdown } = matter(content);
      const excerpt = markdown.slice(0, 200).trim() + '...';
      
      // Validate and format date
      let date = data.date || new Date().toISOString();
      if (typeof date === 'string' && !isValid(parseISO(date))) {
        date = new Date().toISOString(); // Fallback to current date if invalid
      }
      
      return {
        slug: file.replace('.md', ''),
        title: data.title || '',
        date,
        author: data.author || 'DevOps Expert',
        tags: data.tags || [],
        readingTime: calculateReadingTime(markdown),
        excerpt,
        content: markdown,
        image: data.image || 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
        views: data.views || 0
      };
    })
  );
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min`;
}

export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[]): BlogPost[] {
  return allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => ({
      ...post,
      relevance: calculateRelevance(currentPost, post)
    }))
    .sort((a: any, b: any) => b.relevance - a.relevance)
    .slice(0, 3);
}

function calculateRelevance(currentPost: BlogPost, otherPost: BlogPost): number {
  let score = 0;
  
  // Score based on shared tags
  const sharedTags = currentPost.tags.filter(tag => otherPost.tags.includes(tag));
  score += sharedTags.length * 2;
  
  // Score based on date proximity
  const dateA = new Date(currentPost.date);
  const dateB = new Date(otherPost.date);
  const daysDiff = Math.abs(dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 5 - daysDiff / 30); // Higher score for posts within same month
  
  return score;
}