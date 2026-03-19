import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminProperties } from '@/lib/api';
import { PropertiesTable } from './table';

interface PropertiesPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedSearchParams = await searchParams;

  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
  const pageSize = resolvedSearchParams.page_size ? parseInt(resolvedSearchParams.page_size as string) : 10;

  const propertiesData = await getAdminProperties({
    page,
    page_size: pageSize,
    search: typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined,
  });

  return (
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
            <p className="text-sm text-gray-500">
              Manage your property listings ({propertiesData.count} total)
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/dashboard/properties/new">
              Add Property
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>All Properties ({propertiesData.count})</CardTitle>
            <div className="flex items-center space-x-2">
              <form action="/admin/dashboard/properties" method="GET" className="flex items-center space-x-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search properties..."
                  defaultValue={resolvedSearchParams.search as string}
                  className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit" variant="ghost" size="sm">Search</Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <PropertiesTable
                data={propertiesData.results}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
  );
}

