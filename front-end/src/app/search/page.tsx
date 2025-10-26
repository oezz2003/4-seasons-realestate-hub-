import { Suspense } from 'react';
import { SearchPageClient } from "@/components/search-page-client";
import { Skeleton } from '@/components/ui/skeleton';
import { getProperties, getLocations, getDevelopers } from "@/lib/api";

function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </div>
      ))}
    </div>
  )
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const resolvedSearchParams = await searchParams;
  // Fetch initial data from Django with filters
  const [initialPropertiesData, locationsData, developersData] = await Promise.all([
    getProperties({
      location: resolvedSearchParams.location as string,
      property_type: resolvedSearchParams.type as string,
      bedrooms: resolvedSearchParams.beds ? Number(resolvedSearchParams.beds) : undefined,
      min_price: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
      max_price: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
      search: resolvedSearchParams.q as string,
    }),
    getLocations(),
    getDevelopers(),
  ]);

  // Extract unique property types from the API response
  const propertyTypes = [...new Set(initialPropertiesData.results.map(p => p.property_type))];

  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchPageClient
        initialProperties={initialPropertiesData.results}
        locations={locationsData.results}
        developers={developersData.results}
        propertyTypes={propertyTypes}
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  );
}