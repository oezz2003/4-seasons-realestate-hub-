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
  const [search, setSearch] = useState('');

  const normalizedFilters = useMemo(
    () => ({
      page: filters.page,
      page_size: filters.pageSize,
      status: filters.status,
      search: search || undefined,
    }),
    [filters.page, filters.pageSize, filters.status, search]
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>All Posts ({count})</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
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
