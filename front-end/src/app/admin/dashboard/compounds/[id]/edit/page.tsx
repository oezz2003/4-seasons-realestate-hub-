import { notFound } from 'next/navigation';
import { getCompoundById, getDevelopers, getLocations, getAmenities } from '@/lib/api';
import { CompoundForm } from '@/components/dashboard/compound-form';

interface EditCompoundPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCompoundPage({ params }: EditCompoundPageProps) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  const compound = await getCompoundById(resolvedParams.id);

  if (!compound) {
    notFound();
  }

  const [developers, locations, amenities] = await Promise.all([
    getDevelopers({ page_size: 1000 }),
    getLocations({ page_size: 1000 } as any),
    getAmenities(false, { page_size: 1000 } as any),
  ]);

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit Compound</h1>
          <p className="text-muted-foreground">
            Update compound information
          </p>
        </div>

        <CompoundForm
          compound={compound}
          developers={developers.results}
          locations={locations.results}
          amenities={amenities.results}
        />
      </div>
  );
}
