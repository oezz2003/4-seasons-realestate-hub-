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
  const developersData = await getAdminDevelopers({
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1,
    page_size: 10,
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
          <CardHeader>
            <CardTitle>All Developers ({developersData.count})</CardTitle>
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
