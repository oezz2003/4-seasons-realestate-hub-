import { getLocations } from '@/lib/api';
import { LocationsPageClient } from './locations-client';

export default async function LocationsPage() {
  const locationsData = await getLocations();

  return <LocationsPageClient initialLocations={locationsData.results} count={locationsData.count} />;
}
