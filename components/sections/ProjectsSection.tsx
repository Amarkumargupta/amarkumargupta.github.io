"use client";

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ExternalLink, Github, Code, Search, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/projects';
import { Input } from '@/components/ui/input';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags || [])));
  
  // Filter projects based on search and tags
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchTerm === '' || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => project.tags?.includes(tag));
      
    return matchesSearch && matchesTags;
  });
  
  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      // Animate project cards
      const cards = sectionRef.current.querySelectorAll('.project-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 15 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.1, 
          duration: 0.6, 
          ease: "power2.out",
          delay: 0.3
        }
      );
    }
  }, []);
  
  return (
    <div ref={sectionRef} className="section projects-section" id="terminal-projects-section">
      <div className="line command">$ find /projects -type f -name "*.md" | sort -r</div>
      
      <div className="mb-6 mt-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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
                transition-colors duration-200
                ${selectedTags.includes(tag)
                  ? 'bg-[rgba(var(--terminal-green),0.2)] text-[rgb(var(--terminal-green))] border-[rgb(var(--terminal-green))]'
                  : 'bg-[rgba(var(--terminal-gray),0.1)] text-[rgba(var(--foreground-rgb),0.8)] hover:bg-[rgba(var(--terminal-green),0.1)]'
                }
              `}
            >
              <Tag className="w-4 h-4 inline-block mr-1" />
              {tag}
            </button>
          ))}
        </div>
      </div>
      
      <div className="result">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.slug} className="project-card flex flex-col h-full">
              {project.image && (
                <div className="relative h-48 mb-4">
                  <Link href={`/projects/${project.slug}`} className="block h-full">
                    <Image
                      src={project.image || '/images/default-project-image.jpg'}
                      alt={project.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </Link>
                </div>
              )}
              
              <Link href={`/projects/${project.slug}`} className="block">
                <h3 className="text-lg font-bold mb-2 text-[rgb(var(--terminal-green))]">
                  {project.title}
                </h3>
              </Link>
              
              {project.author && (
                <p className="text-sm text-[rgba(var(--foreground-rgb),0.7)] mb-2">
                  By {project.author}
                </p>
              )}
              
              <Link href={`/projects/${project.slug}`} className="block">
                <p className="mb-4 flex-grow text-[rgba(var(--foreground-rgb),0.9)]">
                  {project.excerpt}
                </p>
              </Link>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs px-2 py-1 rounded bg-[rgba(var(--terminal-gray),0.2)] text-[rgba(var(--foreground-rgb),0.8)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-3">
                  {project.github && (
                    <a href={project.github} className="text-[rgb(var(--terminal-green))] hover:text-white flex items-center">
                      <Github className="w-4 h-4 mr-1" />
                      <span className="text-sm">Code</span>
                    </a>
                  )}
                  
                  {project.link && (
                    <a href={project.link} className="text-[rgb(var(--terminal-green))] hover:text-white flex items-center">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      <span className="text-sm">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}