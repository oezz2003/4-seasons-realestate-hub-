'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogPost, Author } from '@/lib/types';
import { getBlogPostById, getAdminAuthors } from '@/lib/api';
import { BlogForm } from '@/components/dashboard/blog-form';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPostEditClientProps {
  id: string;
}

export function BlogPostEditClient({ id }: BlogPostEditClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [postResponse, authorsResponse] = await Promise.all([
          getBlogPostById(id, true),
          getAdminAuthors(),
        ]);
        if (!isMounted) return;

        if (!postResponse) {
          setError('Blog post not found or you do not have access.');
          setPost(null);
        } else {
          setPost(postResponse);
        }
        setAuthors(authorsResponse.results);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load blog post for editing. Please ensure you are logged in.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading blog post...
      </div>
    );
  }

  if (error || !post) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p>{error || 'Unable to load blog post.'}</p>
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard/blog">Back to Blog Posts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground">Update blog post details</p>
      </div>

      <BlogForm post={post} authors={authors} />
    </div>
  );
}
