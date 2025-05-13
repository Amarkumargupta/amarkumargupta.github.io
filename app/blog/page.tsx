import { getBlogPosts, type BlogPost } from '@/lib/blog';
import BlogList from '@/components/blog/BlogList';
import SimpleKeywordsBackground from '@/components/background/SimpleKeywordsBackground';

export default async function BlogIndex() {
  const posts = await getBlogPosts();
  
  return (
    <div className="min-h-screen relative">
      <SimpleKeywordsBackground />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <h1 className="text-4xl font-bold mb-8">Blog Posts</h1>
        <BlogList initialPosts={posts} />
      </main>
    </div>
  );
}