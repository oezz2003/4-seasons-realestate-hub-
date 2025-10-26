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
          <CardHeader>
            <CardTitle>All Properties ({propertiesData.count})</CardTitle>
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

