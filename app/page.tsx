import TerminalLayout from '@/components/layout/TerminalLayout';
import { getBlogPosts } from '@/lib/blog';
import { getProjects } from '@/lib/projects';
import { StructuredData } from '@/components/seo/StructuredData';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Amar Kumar Gupta | Cloud & DevOps Engineer',
  description: 'Cloud & DevOps Engineer with 2+ years of experience specializing in AWS LAMP stack migration, Kubernetes, and Infrastructure as Code',
  keywords: ['Cloud Engineer', 'DevOps', 'AWS', 'LAMP Stack', 'Kubernetes', 'Infrastructure as Code', 'Portfolio'],
};

export default async function Home() {
  const blogPosts = await getBlogPosts();
  const projects = await getProjects();
  
  return (
    <>
      {/* Add structured data for the person/portfolio owner */}
      <StructuredData 
        type="person"
        data={{
          name: "Amar Kumar Gupta",
          jobTitle: "Cloud & DevOps Engineer",
          image: "https://your-domain.com/images/profile.jpg",
          description: "Cloud & DevOps Engineer specializing in AWS LAMP stack development, Kubernetes, and Infrastructure as Code",
          sameAs: [
            "https://github.com/devops-expert",
            "https://linkedin.com/in/devops-expert",
            "https://twitter.com/devops_expert"
          ],
          url: "https://your-domain.com"
        }}
      />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-[rgb(var(--terminal-black))]">
          <LoadingSpinner size="lg" text="Initializing terminal..." />
        </div>
      }>
        <TerminalLayout blogPosts={blogPosts} projects={projects} />
      </Suspense>
    </>
  );
}