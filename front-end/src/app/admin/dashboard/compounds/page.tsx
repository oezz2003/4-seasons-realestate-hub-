import { Suspense } from 'react';
import { getAdminCompounds } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CompoundsTable } from './table';

interface CompoundsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CompoundsPage({ searchParams }: CompoundsPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const resolvedSearchParams = await searchParams;
  
  // Fetch data
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const pageSize = resolvedSearchParams.page_size ? parseInt(resolvedSearchParams.page_size as string) : 10;
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  
  const compoundsData = await getAdminCompounds({
    page,
    page_size: pageSize,
    search,
  });

  // Transform data for the table component
  const tableData = compoundsData.results.map((compound) => ({
    id: compound.id,
    name: compound.name,
    developer: compound.developer?.name || 'N/A',
    location: compound.location?.name || 'N/A',
    status_raw: compound.status,
    delivery_date: compound.delivery_date,
  }));

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>All Compounds ({compoundsData.count})</CardTitle>
            <div className="flex items-center space-x-2">
              <form action="/admin/dashboard/compounds" method="GET" className="flex items-center space-x-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search compounds..."
                  defaultValue={search}
                  className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit" variant="ghost" size="sm">Search</Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <CompoundsTable 
                data={tableData}
                page={page}
                totalPages={Math.ceil(compoundsData.count / pageSize)}
                totalCount={compoundsData.count}
                pageSize={pageSize}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
  );
}
