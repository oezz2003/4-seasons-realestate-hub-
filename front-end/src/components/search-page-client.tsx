'use client';

import { useState, useMemo } from 'react';
import { PropertyCard } from "@/components/property-card";
import { Property } from "@/lib/types";

interface SearchPageClientProps {
  initialProperties: Property[];
  locations: { id: number; name: string }[];
  developers: { id: number; name: string }[];
  propertyTypes: string[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export function SearchPageClient({ 
  initialProperties, 
  locations, 
  developers, 
  propertyTypes, 
  searchParams 
}: SearchPageClientProps) {
  const [properties] = useState(initialProperties);
  const [filters, setFilters] = useState({
    location: searchParams.location as string || '',
    developer: searchParams.developer as string || '',
    type: searchParams.type as string || '',
    beds: searchParams.beds as string || '',
    minPrice: searchParams.minPrice as string || '',
    maxPrice: searchParams.maxPrice as string || '',
    search: searchParams.q as string || '',
  });

  // Client-side filtering for better UX
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Search term filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchTerm) ||
          (property.location?.name && property.location.name.toLowerCase().includes(searchTerm)) ||
          (property.developer?.name && property.developer.name.toLowerCase().includes(searchTerm)) ||
          (property.compound?.name && property.compound.name.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Location filter
      if (filters.location && filters.location !== 'all-locations') {
        if (property.location?.name !== filters.location) return false;
      }

      // Developer filter
      if (filters.developer && filters.developer !== 'all-developers') {
        if (property.developer?.name !== filters.developer) return false;
      }

      // Property type filter
      if (filters.type && filters.type !== 'all-types') {
        if (property.property_type !== filters.type) return false;
      }

      // Bedrooms filter
      if (filters.beds && filters.beds !== 'all-beds') {
        if (property.bedrooms < Number(filters.beds)) return false;
      }

      // Price filters
      if (filters.minPrice) {
        if (parseFloat(property.price) < Number(filters.minPrice)) return false;
      }

      if (filters.maxPrice) {
        if (parseFloat(property.price) > Number(filters.maxPrice)) return false;
      }

      return true;
    });
  }, [properties, filters]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <div className="sticky top-28">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <select
                  value={filters.location}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-locations">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Developer */}
              <div>
                <label className="block text-sm font-medium mb-2">Developer</label>
                <select
                  value={filters.developer}
                  onChange={(e) => updateFilter('developer', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-developers">All Developers</option>
                  {developers.map(developer => (
                    <option key={developer.id} value={developer.name}>
                      {developer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilter('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-types">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium mb-2">Bedrooms</label>
                <select
                  value={filters.beds}
                  onChange={(e) => updateFilter('beds', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all-beds">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Price Range (EGP)</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-3">
          <p className="text-muted-foreground mb-8">
            Showing {filteredProperties.length} of {properties.length} properties.
          </p>
          
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  title={property.title}
                  main_image={property.main_image}
                  price={property.price}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area}
                  location={property.location}
                  property_type={property.property_type}
                  is_featured={property.is_featured}
                  is_new_launch={property.is_new_launch}
                  compound={property.compound}
                  developer={property.developer}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <h2 className="text-2xl font-bold font-headline">No Properties Found</h2>
              <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

