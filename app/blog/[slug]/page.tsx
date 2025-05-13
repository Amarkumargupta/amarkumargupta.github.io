import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, Tag, ArrowLeft, ArrowRight, User } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { BlogContent } from '@/components/blog/BlogContent';
import { getBlogPosts, getRelatedPosts } from '@/lib/blog';
import Link from 'next/link';
import Image from 'next/image';
import SimpleKeywordsBackground from '@/components/background/SimpleKeywordsBackground';
import { StructuredData } from '@/components/seo/StructuredData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  
  // Add a list of known slugs that should be pre-rendered
  // This ensures that even if a post doesn't exist in the content folder,
  // it will still be pre-rendered and handled by notFound()
  const knownSlugs = [
    'another-post',  // Add the problematic slug
    // Add any other known slugs that might be accessed but don't exist
  ];
  
  // Combine actual posts with known slugs
  const allSlugs = [...posts.map(post => post.slug), ...knownSlugs];
  
  // Remove duplicates (using filter instead of Set for better TypeScript compatibility)
  const uniqueSlugs = allSlugs.filter((slug, index) => allSlugs.indexOf(slug) === index);
  
  return uniqueSlugs.map(slug => ({ slug }));
}

// Generate dynamic metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.'
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Amar Kumar Gupta'],
      images: post.image ? [{ url: post.image, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : [],
    }
  };
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, posts);
  const currentIndex = posts.findIndex(p => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Date unavailable';
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com';
  const postUrl = `${baseUrl}/blog/${post.slug}`;
  
  return (
    <div className="text-[rgb(var(--terminal-green))] p-4 relative min-h-screen overflow-hidden">
      {/* Add structured data for SEO */}
      <StructuredData 
        type="article"
        data={{
          title: post.title,
          description: post.excerpt,
          imageUrl: post.image,
          datePublished: post.date,
          authorName: post.author || 'Amar Kumar Gupta',
          authorUrl: `${baseUrl}/about`,
          publisherName: 'Amar Kumar Gupta',
          publisherLogo: `${baseUrl}/images/logo.png`,
          url: postUrl
        }}
      />
      
      {/* 3D Background */}
      <SimpleKeywordsBackground />
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-[rgb(var(--terminal-green))] hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to blog
        </Link>
        
        <Card className="p-8 bg-[rgba(var(--terminal-gray),0.1)] border-[rgba(var(--terminal-green),0.3)]">
          <article>
            <header className="mb-8">
              {post.image && (
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={post.image}
                    alt={`Featured image for ${post.title}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
              )}
              
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[rgba(var(--foreground-rgb),0.7)]">
                {post.author && (
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>By <span className="text-[rgb(var(--terminal-green))] font-medium">{post.author}</span></span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <time>{formatDate(post.date)}</time>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} read</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <div className="flex gap-2">
                    {post.tags.map(tag => (
                      <span 
                        key={tag}
                        className="bg-[rgba(var(--terminal-gray),0.2)] px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </header>
            
            <BlogContent content={post.content} />
          </article>
        </Card>
        
        {/* Post Navigation */}
        <div className="flex justify-between items-center my-8">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="flex items-center gap-2 text-[rgb(var(--terminal-green))] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Previous Post</span>
            </Link>
          ) : (
            <div />
          )}
          
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="flex items-center gap-2 text-[rgb(var(--terminal-green))] hover:text-white transition-colors"
            >
              <span className="text-sm">Next Post</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.slug} className="block">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <div className="relative h-32 overflow-hidden rounded-t-lg group">
                      <Link href={`/blog/${relatedPost.slug}`} className="block h-full">
                        <Image
                          src={relatedPost.image || '/images/default-blog-image.jpg'}
                          alt={`Thumbnail for ${relatedPost.title}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                    
                    <div className="p-4">
                      <Link href={`/blog/${relatedPost.slug}`} className="block">
                        <h3 className="font-semibold mb-2 text-[rgb(var(--terminal-green))]">
                          {relatedPost.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 text-xs text-[rgba(var(--foreground-rgb),0.7)] mb-2">
                        <Calendar className="w-3 h-3" />
                        <time>{formatDate(relatedPost.date)}</time>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {relatedPost.tags
                          .filter(tag => post.tags.includes(tag))
                          .map(tag => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 rounded bg-[rgba(var(--terminal-green),0.1)] text-[rgb(var(--terminal-green))]"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}