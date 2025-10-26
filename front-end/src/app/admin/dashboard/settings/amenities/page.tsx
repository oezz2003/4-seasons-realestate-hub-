import { getAmenities } from '@/lib/api';
import { AmenitiesPageClient } from './amenities-client';

export default async function AmenitiesPage() {
  const amenitiesData = await getAmenities();

  return <AmenitiesPageClient initialAmenities={amenitiesData.results} count={amenitiesData.count} />;
}
