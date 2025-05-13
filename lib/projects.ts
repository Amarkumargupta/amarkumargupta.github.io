import { promises as fs } from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Project {
  slug: string;
  title: string;
  author?: string;
  date?: string;
  tags?: string[];
  image?: string;
  excerpt: string;
  content: string;
  github?: string;
  link?: string;
}

export async function getProjects(): Promise<Project[]> {
  const contentDir = path.join(process.cwd(), 'content', 'projects');
  const files = await fs.readdir(contentDir);
  
  const projects = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(path.join(contentDir, file), 'utf8');
      const { data, content: markdown } = matter(content);
      
      return {
        slug: file.replace('.md', ''),
        title: data.title || '',
        author: data.author || 'DevOps Expert',
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
        image: data.image,
        excerpt: data.excerpt || markdown.slice(0, 200).trim() + '...',
        content: markdown,
        github: data.github,
        link: data.link
      };
    })
  );
  
  return projects.sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
}

export async function getProject(slug: string): Promise<Project | null> {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'projects');
    const content = await fs.readFile(path.join(contentDir, `${slug}.md`), 'utf8');
    const { data, content: markdown } = matter(content);
    
    return {
      slug,
      title: data.title || '',
      author: data.author || 'DevOps Expert',
      date: data.date || new Date().toISOString(),
      tags: data.tags || [],
      image: data.image,
      excerpt: data.excerpt || markdown.slice(0, 200).trim() + '...',
      content: markdown,
      github: data.github,
      link: data.link
    };
  } catch (error) {
    return null;
  }
}

export function getRelatedProjects(currentProject: Project, allProjects: Project[]): Project[] {
  return allProjects
    .filter(project => project.slug !== currentProject.slug)
    .map(project => ({
      ...project,
      relevance: calculateRelevance(currentProject, project)
    }))
    .sort((a: any, b: any) => b.relevance - a.relevance)
    .slice(0, 3);
}

function calculateRelevance(currentProject: Project, otherProject: Project): number {
  let score = 0;
  
  // Score based on shared tags
  const sharedTags = (currentProject.tags || []).filter(
    tag => otherProject.tags?.includes(tag)
  );
  score += sharedTags.length * 2;
  
  // Score based on date proximity if dates exist
  if (currentProject.date && otherProject.date) {
    const dateA = new Date(currentProject.date);
    const dateB = new Date(otherProject.date);
    const daysDiff = Math.abs(dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24);
    score += Math.max(0, 5 - daysDiff / 30); // Higher score for projects within same month
  }
  
  return score;
}