import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { getProjects, getProject } from '@/lib/projects';
import { BlogContent } from '@/components/blog/BlogContent';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Metadata } from 'next';
import { StructuredData } from '@/components/seo/StructuredData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProject(params.slug);
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    };
  }
  
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      type: 'article',
      authors: [project.author || 'DevOps Expert'],
      images: project.image ? [
        {
          url: project.image,
          width: 1200,
          height: 630,
          alt: project.title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.excerpt,
      images: project.image ? [project.image] : []
    }
  };
}

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(project => ({ 
    slug: project.slug 
  }));
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  
  if (!project) {
    notFound();
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
  const projectUrl = `${baseUrl}/projects/${project.slug}`;
  
  return (
    <div className="min-h-screen bg-[rgb(var(--terminal-black))] text-[rgb(var(--terminal-green))] p-4">
      {/* Add structured data for SEO */}
      <StructuredData 
        type="article"
        data={{
          title: project.title,
          description: project.excerpt,
          imageUrl: project.image,
          datePublished: project.date || new Date().toISOString(),
          authorName: project.author || 'Amar Kumar Gupta',
          authorUrl: `${baseUrl}/about`,
          publisherName: 'Amar Kumar Gupta',
          publisherLogo: `${baseUrl}/images/logo.png`,
          url: projectUrl
        }}
      />
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[rgb(var(--terminal-green))] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to projects
        </Link>
        
        <Card className="p-8 bg-[rgba(var(--terminal-gray),0.1)] border-[rgba(var(--terminal-green),0.3)]">
          <article>
            <header className="mb-8">
              {project.image && (
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[rgba(var(--foreground-rgb),0.7)]">
                {project.author && (
                  <div className="flex items-center gap-1">
                    By <span className="text-[rgb(var(--terminal-green))]">{project.author}</span>
                  </div>
                )}
                
                {project.date && (
                  <div className="flex items-center gap-1">
                    {format(new Date(project.date), 'MMMM d, yyyy')}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    {project.tags?.map(tag => (
                      <Link 
                        key={tag}
                        href={`/?tag=${tag}`}
                        className="bg-[rgba(var(--terminal-gray),0.2)] px-2 py-1 rounded text-xs hover:bg-[rgba(var(--terminal-green),0.2)] transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </header>
            
            <BlogContent content={project.content} />
          </article>
        </Card>
      </div>
    </div>
  );
}