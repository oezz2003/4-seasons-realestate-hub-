'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, User, Edit, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { BlogPost } from '@/lib/types';
import { getBlogPostById } from '@/lib/api';
import { getImageUrl } from '@/lib/image-helpers';

interface BlogPostDetailsClientProps {
  id: string;
}

export function BlogPostDetailsClient({ id }: BlogPostDetailsClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getBlogPostById(id, true);
        if (!isMounted) return;
        if (!result) {
          setError('Blog post not found or you do not have access.');
        }
        setPost(result);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load blog post. Please ensure you are logged in.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPost();

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
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/dashboard/blog">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog Posts
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/dashboard/blog/${post.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{post.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">Blog Post Details</p>
                </div>
                <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                  {post.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {post.image && (
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(post.image)}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Author:</strong> {post.author?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Published:</strong> {post.publish_date || 'N/A'}
                  </span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Excerpt</h3>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Content</h3>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                  {post.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Author</p>
                <p className="font-medium">{post.author?.name || 'N/A'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Publish Date</p>
                <p className="font-medium">{post.publish_date || 'Not set'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Slug</p>
                <p className="font-mono text-sm">{post.slug}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
