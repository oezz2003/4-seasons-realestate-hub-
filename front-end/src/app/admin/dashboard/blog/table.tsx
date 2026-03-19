'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost, Author } from '@/lib/types';
import { blogApi } from '@/lib/admin-api';
import { useToast } from '@/hooks/use-toast';

interface BlogPostsTableRow {
  id: string;
  title: string;
  author: string;
  status: JSX.Element;
  publish_date: string;
  actions: JSX.Element;
}

interface BlogPostsTableProps {
  data: BlogPost[];
  authors?: Author[];
}

const columns: ColumnDef<BlogPostsTableRow>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'author',
    header: 'Author',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'publish_date',
    header: 'Published',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
  },
];

export function BlogPostsTable({ data }: BlogPostsTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      await blogApi.delete(id);
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      router.refresh();
      // If we are in a client component that manages its own state (like BlogDashboardClient), 
      // we might need a callback to update let the parent know.
      // But since BlogDashboardClient uses a refresh mechanism or effect, router.refresh() might not be enough if it's purely client-side without URL change.
      // However, BlogDashboardClient will re-fetch if normalizedFilters changes.
      // For now, let's assume router.refresh() or the parent's state management handles it.
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    }
  };

  const tableData: BlogPostsTableRow[] = data.map((post) => ({
    id: post.id.toString(),
    title: post.title,
    author: post.author?.name || 'N/A',
    status: (
      <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
        {post.status}
      </Badge>
    ),
    publish_date: post.publish_date,
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild title="View Details">
          <Link href={`/admin/dashboard/blog/${post.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild title="Edit">
          <Link href={`/admin/dashboard/blog/${post.id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          title="Delete"
          onClick={() => handleDelete(post.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }));

  return <DataTable columns={columns} data={tableData} />;
}
