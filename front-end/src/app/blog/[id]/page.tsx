import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { getPost, getSuggestedPosts, getAuthorById } from '@/lib/api';
import { getImageUrl, getPlaceholderImage } from '@/lib/image-helpers';
import type { BlogPost, Author } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface SuggestedPostCardProps {
  post: BlogPost;
  author: Author;
}

function SuggestedPostCard({ post, author }: SuggestedPostCardProps) {
  const imageUrl = getImageUrl(post.image, getPlaceholderImage('blog'));
  const authorImageUrl = getImageUrl(author.picture, getPlaceholderImage('author'));
  const authorNameFallback = author.name.split(' ').map(n => n[0]).join('');

  return (
    <Card className="overflow-hidden flex flex-col h-full group animate-fade-in-up">
      <CardHeader className="p-0">
          <Link href={`/blog/${post.slug}`} className="block overflow-hidden">
              <Image
                  src={imageUrl}
                  alt={post.title}
                  data-ai-hint="blog post"
                  width={800}
                  height={600}
                  className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"
              />
          </Link>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="font-headline text-xl mb-3">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">{post.title}</Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="p-6 bg-primary/5 flex flex-col items-start gap-4 mt-auto">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            {authorImageUrl && <AvatarImage src={authorImageUrl} alt={author.name} data-ai-hint="professional photo" />}
            <AvatarFallback>{authorNameFallback}</AvatarFallback>
          </Avatar>
          <div>
              <p className="font-semibold">{author.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(post.publish_date)}</span>
              </div>
          </div>
        </div>
        <Link href={`/blog/${post.slug}`} className="w-full">
         <Button variant="outline" className="w-full">
             Read More <ArrowRight className="ml-2 h-4 w-4"/>
         </Button>
       </Link>
      </CardFooter>
    </Card>
  );
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  if (!post) {
    notFound();
  }

  const author = await getAuthorById(post.author?.toString() || '');

  if (!author) {
    notFound();
  }

  const suggestedPosts = await getSuggestedPosts(post.slug);

  const imageUrl = getImageUrl(post.image, getPlaceholderImage('blog'));
  const authorImageUrl = getImageUrl(author.picture, getPlaceholderImage('author'));
  const authorNameFallback = author.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="animate-fade-in">
        <section className="relative h-[40vh] min-h-[250px] md:h-[50vh] w-full">
            <Image
                src={imageUrl}
                alt={post.title}
                data-ai-hint="blog hero image"
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="relative z-10 flex h-full flex-col items-start justify-end text-white p-4 md:p-12">
                <div className="container mx-auto">
                    <div className="overflow-hidden py-1">
                        <h1 className="text-3xl md:text-5xl font-bold font-headline max-w-4xl animate-title-reveal">{post.title}</h1>
                    </div>
                </div>
            </div>
        </section>

        <div className="container mx-auto py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-wrap items-center gap-6 mb-8 text-muted-foreground animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                            {authorImageUrl && <AvatarImage src={authorImageUrl} alt={author.name} data-ai-hint="author photo" />}
                            <AvatarFallback>{authorNameFallback}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-foreground">{author.name}</p>
                            <p className="text-sm">Blog Author</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-8 hidden sm:block" />
                     <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        <span className="text-sm">{formatDate(post.publish_date)}</span>
                    </div>
                </div>

                <article 
                    className="max-w-none text-lg leading-relaxed space-y-6 animate-fade-in-up" 
                    style={{animationDelay: '0.2s'}}
                >
                   {post.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                   ))}
                </article>

                <Separator className="my-12 md:my-16" />

                <section className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <div className="overflow-hidden py-1">
                        <h2 className="text-3xl font-bold mb-8 font-headline text-center animate-title-reveal">Continue Reading</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {suggestedPosts.map((suggestedPost) => (
                           <SuggestedPostCard key={suggestedPost.id} post={suggestedPost} author={author} />
                        ))}
                    </div>
                     <div className="text-center mt-12">
                        <Link href="/blog" passHref>
                           <Button variant="outline" size="lg">
                                <ArrowLeft className="mr-2 h-4 w-4"/>
                                Back to All Articles
                           </Button>
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    </div>
  );
}
