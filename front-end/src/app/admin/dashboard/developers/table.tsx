'use client';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Developer } from '@/lib/types';

interface DevelopersTableProps {
  data: Developer[];
}

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
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/dashboard/developers/${developer.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/dashboard/developers/${developer.id}/edit`}>
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export function DevelopersTable({ data }: DevelopersTableProps) {
  return <DataTable columns={columns} data={data} />;
}
