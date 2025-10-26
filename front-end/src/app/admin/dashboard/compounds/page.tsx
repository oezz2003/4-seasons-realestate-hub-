import { ColumnDef } from '@tanstack/react-table';
import { Suspense } from 'react';
import { getAdminCompounds } from '@/lib/api';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CompoundsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

type CompoundTableRow = {
  id: string;
  name: string;
  developer: string;
  location: string;
  status: string;
  delivery_date: string;
  actions: React.ReactNode;
};

export default async function CompoundsPage({ searchParams }: CompoundsPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const resolvedSearchParams = await searchParams;
  
  // Fetch data
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const pageSize = resolvedSearchParams.page_size ? parseInt(resolvedSearchParams.page_size as string) : 10;
  
  const compoundsData = await getAdminCompounds({
    page,
    page_size: pageSize,
  });

  // Transform data for the table
  const tableData: CompoundTableRow[] = compoundsData.results.map((compound) => ({
    id: compound.id.toString(),
    name: compound.name,
    developer: compound.developer?.name || 'N/A',
    location: compound.location?.name || 'N/A',
    status: (
      <Badge variant={compound.status === 'Active' ? 'default' : 'secondary'}>
        {compound.status}
      </Badge>
    ) as any,
    delivery_date: compound.delivery_date,
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/dashboard/compounds/${compound.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/admin/dashboard/compounds/${compound.id}/edit`}>
            <Edit className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }));

  const columns: ColumnDef<CompoundTableRow>[] = [
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
    },
    {
      accessorKey: 'delivery_date',
      header: 'Delivery Date',
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
    },
  ];

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Compounds</h1>
            <p className="text-muted-foreground">
              Manage your property compounds
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/dashboard/compounds/new">
              Add New Compound
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Compounds ({compoundsData.count})</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <DataTable
                data={tableData}
                columns={columns}
                pagination={{
                  currentPage: page,
                  totalPages: Math.ceil(compoundsData.count / pageSize),
                  totalCount: compoundsData.count,
                  pageSize,
                  baseUrl: '/admin/dashboard/compounds',
                  showPageSizeSelector: true,
                }}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
  );
}
