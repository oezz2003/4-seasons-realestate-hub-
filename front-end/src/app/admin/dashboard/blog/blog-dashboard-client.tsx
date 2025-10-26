'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogPostsTable } from './table';
import { getAdminBlogPosts, getAdminAuthors } from '@/lib/api';
import { BlogPost, Author } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface BlogDashboardClientProps {
  filters: {
    page: number;
    pageSize: number;
    status?: 'Published' | 'Draft';
  };
}

export function BlogDashboardClient({ filters }: BlogDashboardClientProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [count, setCount] = useState(0);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedFilters = useMemo(
    () => ({
      page: filters.page,
      page_size: filters.pageSize,
      status: filters.status,
    }),
    [filters.page, filters.pageSize, filters.status]
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [blogResponse, authorsResponse] = await Promise.all([
          getAdminBlogPosts(normalizedFilters),
          getAdminAuthors(),
        ]);
        if (!isMounted) return;
        setPosts(blogResponse.results);
        setCount(blogResponse.count);
        setAuthors(authorsResponse.results);
      } catch (err) {
        if (!isMounted) return;
        setError('Failed to load blog posts. Please ensure you are logged in.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [normalizedFilters]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Posts ({count})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading posts...
          </div>
        ) : error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : posts.length === 0 ? (
          <div className="text-sm text-muted-foreground">No posts found.</div>
        ) : (
          <BlogPostsTable data={posts} authors={authors} />
        )}
      </CardContent>
    </Card>
  );
}
