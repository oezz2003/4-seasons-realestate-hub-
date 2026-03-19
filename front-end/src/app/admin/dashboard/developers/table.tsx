'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Developer } from '@/lib/types';
import { deleteDeveloper } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface DevelopersTableProps {
  data: Developer[];
}

export function DevelopersTable({ data }: DevelopersTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this developer?')) return;
    
    try {
      await deleteDeveloper(id);
      toast({
        title: "Success",
        description: "Developer deleted successfully",
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting developer:', error);
      toast({
        title: "Error",
        description: "Failed to delete developer",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Developer>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'projects_count',
      header: 'Projects',
      cell: ({ getValue }) => {
        const value = getValue<number>();
        return value?.toString() ?? '0';
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const developer = row.original;
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild title="View Details">
              <Link href={`/admin/dashboard/developers/${developer.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild title="Edit">
              <Link href={`/admin/dashboard/developers/${developer.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              title="Delete"
              onClick={() => handleDelete(developer.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
