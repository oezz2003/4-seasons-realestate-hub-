import { ColumnDef } from '@tanstack/react-table';
import { Suspense } from 'react';
import { getTestimonials } from '@/lib/api';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';

interface TestimonialsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

type TestimonialTableRow = {
  id: string;
  client_name: string;
  rating: number;
  quote: string;
  actions: React.ReactNode;
};

export default async function TestimonialsPage({ searchParams }: TestimonialsPageProps) {
  // Fetch data
  const page = searchParams.page ? parseInt(searchParams.page as string) : 1;
  const pageSize = searchParams.page_size ? parseInt(searchParams.page_size as string) : 10;

  const testimonialsData = await getTestimonials({
    page,
    page_size: pageSize,
  });

  // Transform data for the table
  const tableData: TestimonialTableRow[] = testimonialsData.results.map((testimonial) => ({
    id: testimonial.id.toString(),
    client_name: testimonial.client_name,
    rating: testimonial.rating,
    quote: testimonial.quote.substring(0, 100) + '...',
    actions: (
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }));

  const columns: ColumnDef<TestimonialTableRow>[] = [
    {
      accessorKey: 'client_name',
      header: 'Client Name',
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return (
          <Badge variant="outline">
            {value}/5 ⭐
          </Badge>
        );
      },
    },
    {
      accessorKey: 'quote',
      header: 'Quote',
      cell: ({ getValue }) => getValue(),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ getValue }) => getValue(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage customer testimonials
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Testimonial
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Testimonials ({testimonialsData.count})</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <DataTable
              data={tableData}
              columns={columns}
              pagination={{
                currentPage: page,
                totalPages: Math.ceil(testimonialsData.count / pageSize),
                totalCount: testimonialsData.count,
                pageSize,
                baseUrl: '/admin/dashboard/settings/testimonials',
                showPageSizeSelector: true,
              }}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}