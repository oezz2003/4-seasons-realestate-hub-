import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getImageUrl, getPlaceholderImage } from '@/lib/image-helpers';
import { formatDate } from '@/lib/utils';
import { getBlogPosts, getAuthorById } from '@/lib/api';
import type { BlogPost, Author } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PostCardProps {
  post: BlogPost;
  author: Author;
}

function PostCard({ post, author }: PostCardProps) {
  const authorNameFallback = author.name.split(' ').map(n => n[0]).join('');
  const imageUrl = getImageUrl(post.image, getPlaceholderImage('blog'));
  const authorImageUrl = getImageUrl(author.picture, getPlaceholderImage('author'));

  return (
    <Card className="card-premium overflow-hidden flex flex-col animate-fade-in-up group h-full">
      <CardHeader className="p-0 relative overflow-hidden">
          <Link href={`/blog/${post.slug}`} className="block overflow-hidden h-64">
              <Image
                  src={imageUrl}
                  alt={post.title}
                  data-ai-hint="blog post"
                  width={800}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
          <div className="absolute top-4 left-4">
            <Badge className="glass-premium border-none text-white font-bold tracking-widest text-[10px] uppercase">
              {formatDate(post.publish_date)}
            </Badge>
          </div>
      </CardHeader>
      <CardContent className="p-8 flex-grow space-y-4">
        <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">Editorial</span>
        <CardTitle className="font-display text-2xl leading-tight">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors line-clamp-2">{post.title}</Link>
        </CardTitle>
        <p className="text-muted-foreground/80 text-sm leading-relaxed line-clamp-3 font-serif">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-8 pt-0 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-primary/10">
            {authorImageUrl && <AvatarImage src={authorImageUrl} alt={author.name} data-ai-hint="professional photo" />}
            <AvatarFallback className="text-[10px]">{authorNameFallback}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{author.name}</span>
        </div>
        <Link href={`/blog/${post.slug}`} className="text-primary hover:text-secondary p-0 h-auto group/link flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
            READ <ArrowRight className="h-3 w-3 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  
  const postsData = await getBlogPosts({ search: query });
  
  if (!postsData) {
    return <div className="container mx-auto px-4 py-8">Error loading blog posts.</div>;
  }

  const posts = postsData.results;

  return (
    <div className="container mx-auto py-24 px-4 md:py-32">
      <div className="flex flex-col mb-16">
        <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Insights & Intelligence</span>
        <h1 className="text-editorial-title">The Curator&apos;s Journal</h1>
        <p className="mt-6 text-xl text-muted-foreground/80 max-w-2xl font-serif italic">
          Deep dives into the Egyptian property landscape, curated for those who seek the extraordinary.
        </p>
        
        {/* Search Bar */}
        <div className="mt-12 max-w-xl">
          <form action="/blog" method="GET" className="relative group">
            <input
              type="text"
              name="q"
              placeholder="Search the archives..."
              defaultValue={query}
              className="w-full px-8 py-4 bg-surface-low/30 backdrop-blur-xl border border-primary/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 shadow-xl shadow-primary/5 group-hover:border-primary/20"
            />
            <Button type="submit" size="icon" variant="ghost" className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl text-secondary hover:text-primary transition-colors">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: BlogPost, index: number) => (
            <div key={post.id} style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
              <PostCard post={post} author={post.author as unknown as Author} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">No results found</h2>
          <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>
          <Button asChild variant="link" className="mt-4">
            <Link href="/blog">Clear search</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
