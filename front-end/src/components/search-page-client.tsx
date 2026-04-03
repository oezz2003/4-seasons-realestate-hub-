'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Search, ChevronDown } from 'lucide-react';
import { PropertyCard } from "@/components/property-card";
import { Property } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update URL to sync with filters (Search Engine optimization)
    const params = new URLSearchParams();
    const currentFilters = { ...filters, [key]: value };
    
    if (currentFilters.search) params.set('q', currentFilters.search);
    if (currentFilters.location && currentFilters.location !== 'all-locations') params.set('location', currentFilters.location);
    if (currentFilters.developer && currentFilters.developer !== 'all-developers') params.set('developer', currentFilters.developer);
    if (currentFilters.type && currentFilters.type !== 'all-types') params.set('type', currentFilters.type);
    if (currentFilters.beds && currentFilters.beds !== 'all-beds') params.set('beds', currentFilters.beds);
    if (currentFilters.minPrice) params.set('minPrice', currentFilters.minPrice);
    if (currentFilters.maxPrice) params.set('maxPrice', currentFilters.maxPrice);
    
    router.push(`/search?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="container mx-auto py-12 md:py-20 px-4 relative">
      <div className="flex flex-col mb-12">
        <span className="text-primary text-[10px] font-bold uppercase tracking-[0.3em] mb-4">EQUINOX HERITAGE EDITION</span>
        <h1 className="text-5xl md:text-7xl font-display tracking-tight text-on-background mb-6 leading-[1.1]">
          Discovery<br />Reimagined.
        </h1>
        <p className="text-muted-foreground/80 max-w-xl text-sm leading-relaxed">
          Explore an exclusive collection of the most distinguished estates, curated with architectural excellence for the discerning investor.
        </p>
      </div>

      {/* Horizontal Filter Bar (Command Center) */}
      <div className="bg-card rounded-[2rem] p-10 shadow-2xl shadow-black/5 border border-border/10 mb-20 dark:bg-surface-container-low/40 dark:backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
          {/* Location & Type */}
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-3">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Location</label>
              <Select value={filters.location} onValueChange={(val) => updateFilter('location', val)}>
                <SelectTrigger className="bg-surface-container-low border-none rounded-xl h-14 dark:bg-card">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-locations">All Catchments</SelectItem>
                  {locations.map(loc => <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Property Type</label>
              <Select value={filters.type} onValueChange={(val) => updateFilter('type', val)}>
                <SelectTrigger className="bg-surface-container-low border-none rounded-xl h-14 dark:bg-card">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">All Typologies</SelectItem>
                  {propertyTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sliders (Price & Area) */}
          <div className="md:col-span-5 space-y-12 px-4">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Price Range (EGP)</label>
              </div>
              <div className="px-2">
                <Slider 
                  defaultValue={[1000000, 100000000]} 
                  max={100000000} 
                  step={500000}
                  onValueChange={(vals) => {
                    updateFilter('minPrice', vals[0].toString());
                    updateFilter('maxPrice', vals[1].toString());
                  }}
                />
                <div className="flex justify-between mt-4 text-[9px] font-bold text-muted-foreground/40">
                  <span>1,000,000</span>
                  <span className="text-[#005F73]">100,000,000+</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Area (SQM)</label>
              </div>
              <div className="px-2">
                <Slider 
                  defaultValue={[50, 2000]} 
                  max={2000} 
                  step={50}
                />
                <div className="flex justify-between mt-4 text-[9px] font-bold text-muted-foreground/40">
                  <span>50 sqm</span>
                  <span className="text-[#005F73]">2,000 sqm*</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bedrooms & Action */}
          <div className="md:col-span-4 space-y-10 pl-4">
            <div className="space-y-4">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Bedrooms</label>
              <div className="flex gap-2">
                 {['1', '2', '3+'].map((beds) => (
                   <button 
                    key={beds}
                    onClick={() => updateFilter('beds', beds === '3+' ? '3' : beds)}
                    className={cn(
                      "flex-1 h-12 rounded-lg border text-xs font-bold transition-all duration-300",
                      (filters.beds === beds || (beds === '3+' && filters.beds === '3'))
                        ? "bg-primary border-primary text-white shadow-lg"
                        : "bg-surface-container-low border-border/10 text-secondary hover:border-primary/30 dark:bg-card"
                    )}
                   >
                     {beds}
                   </button>
                 ))}
              </div>
            </div>

            <Button className="w-full bg-[#005F73] hover:bg-[#003D4D] text-white h-16 rounded-xl shadow-xl shadow-[#005F73]/10 gap-3 group">
              <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="text-[13px] font-bold uppercase tracking-widest">Search Listings</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <h2 className="text-3xl font-display text-secondary">Curated Results</h2>
          <p className="text-muted-foreground/60 text-sm italic font-serif">
            {filteredProperties.length} premier properties match your criteria
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2.5 rounded-full border border-border/10 dark:bg-card">
           <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Sort by:</span>
           <button className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center gap-1.5">
             Recommended
             <ChevronDown className="w-3.5 h-3.5" />
           </button>
        </div>
      </div>
      
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12 animate-fade-in-up">
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
        <div className="text-center py-32 rounded-[3rem] bg-surface-lowest/50 border border-dashed border-primary/5 flex flex-col items-center">
          <div className="p-6 rounded-full bg-primary/5 text-primary/20 mb-8">
            <MapPin className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-display text-primary mb-4 tracking-tight">No Discoveries Found.</h2>
          <p className="text-muted-foreground/60 max-w-sm font-serif italic text-lg">The curator could not find matching properties. Broaden your search for the extraordinary.</p>
        </div>
      )}
    </div>
  );
}

