import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BlogDashboardClient } from './blog-dashboard-client';

interface BlogPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const pageSize = resolvedSearchParams.page_size ? parseInt(resolvedSearchParams.page_size as string) : 10;
  const status = resolvedSearchParams.status as 'Published' | 'Draft' | undefined;

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted-foreground">
              Manage your blog content
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/dashboard/blog/new">
              Add New Post
            </Link>
          </Button>
        </div>

        <BlogDashboardClient
          filters={{
            page,
            pageSize,
            status,
          }}
        />
      </div>
  );
}

