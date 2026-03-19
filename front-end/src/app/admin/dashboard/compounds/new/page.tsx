import { getDevelopers, getLocations, getAmenities } from '@/lib/api';
import { CompoundForm } from '@/components/dashboard/compound-form';

export default async function NewCompoundPage() {
  const [developers, locations, amenities] = await Promise.all([
    getDevelopers({ page_size: 1000 }),
    getLocations({ page_size: 1000 } as any),
    getAmenities(false, { page_size: 1000 } as any),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Compound</h1>
        <p className="text-muted-foreground">
          Create a new property compound
        </p>
      </div>

      <CompoundForm
        developers={developers.results}
        locations={locations.results}
        amenities={amenities.results}
      />
    </div>
  );
}
