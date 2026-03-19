'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { deleteCompound } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CompoundsTableProps {
  data: any[];
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export function CompoundsTable({ data, page, totalPages, totalCount, pageSize }: CompoundsTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this compound?')) return;
    
    try {
      await deleteCompound(id);
      toast({
        title: "Success",
        description: "Compound deleted successfully",
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting compound:', error);
      toast({
        title: "Error",
        description: "Failed to delete compound",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'developer',
      header: 'Developer',
    },
    {
      accessorKey: 'location',
      header: 'Location',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status_raw;
        return (
          <Badge variant={status === 'Active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'delivery_date',
      header: 'Delivery Date',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild title="View Details">
              <Link href={`/admin/dashboard/compounds/${id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild title="Edit">
              <Link href={`/admin/dashboard/compounds/${id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              title="Delete"
              onClick={() => handleDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      pagination={{
        currentPage: page,
        totalPages,
        totalCount,
        pageSize,
        baseUrl: '/admin/dashboard/compounds',
        showPageSizeSelector: true,
      }}
    />
  );
}
