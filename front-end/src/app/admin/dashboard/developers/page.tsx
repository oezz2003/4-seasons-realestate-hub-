import { Suspense } from 'react';
import { getAdminDevelopers } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DevelopersTable } from './table';

interface DevelopersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DevelopersPage({ searchParams }: DevelopersPageProps) {
  // Await searchParams for Next.js 15 compatibility
  const resolvedSearchParams = await searchParams;
  
  // Fetch data
  const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : undefined;
  
  const developersData = await getAdminDevelopers({
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1,
    page_size: 10,
    search,
  });

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Developers</h1>
            <p className="text-muted-foreground">
              Manage property developers
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/dashboard/developers/new">
              Add New Developer
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>All Developers ({developersData.count})</CardTitle>
            <div className="flex items-center space-x-2">
              <form action="/admin/dashboard/developers" method="GET" className="flex items-center space-x-2">
                <input
                  type="text"
                  name="search"
                  placeholder="Search developers..."
                  defaultValue={search}
                  className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <Button type="submit" variant="ghost" size="sm">Search</Button>
              </form>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <DevelopersTable data={developersData.results} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
  );
}
