import { getDevelopers, getLocations, getAmenities } from '@/lib/api';
import { CompoundForm } from '@/components/dashboard/compound-form';

export default async function NewCompoundPage() {
  const [developers, locations, amenities] = await Promise.all([
    getDevelopers(),
    getLocations(),
    getAmenities(),
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
