"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Search } from 'lucide-react';

import { Location, Developer } from "@/lib/types";

type SearchFiltersProps = {
  locations: Location[];
  developers: Developer[];
  propertyTypes: string[];
}

const MAX_PRICE = 5000000;

export function SearchFilters({ locations, developers, propertyTypes }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [developer, setDeveloper] = useState(searchParams.get('developer') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [beds, setBeds] = useState(searchParams.get('beds') || '');
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get('minPrice')) || 0,
    Number(searchParams.get('maxPrice')) || MAX_PRICE
  ]);

  const createQueryString = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    if (developer) params.set('developer', developer);
    if (type) params.set('type', type);
    if (beds) params.set('beds', beds);
    if (priceRange[0] > 0) params.set('minPrice', String(priceRange[0]));
    if (priceRange[1] < MAX_PRICE) params.set('maxPrice', String(priceRange[1]));
    return params.toString();
  };

  const handleSearch = () => {
    router.push(`${pathname}?${createQueryString()}`);
  };
  
  const handleReset = () => {
    setQuery('');
    setLocation('');
    setDeveloper('');
    setType('');
    setBeds('');
    setPriceRange([0, MAX_PRICE]);
    router.push(pathname);
  };
  
  // Sync state with URL params on navigation
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setLocation(searchParams.get('location') || '');
    setDeveloper(searchParams.get('developer') || '');
    setType(searchParams.get('type') || '');
    setBeds(searchParams.get('beds') || '');
    setPriceRange([
      Number(searchParams.get('minPrice')) || 0,
      Number(searchParams.get('maxPrice')) || MAX_PRICE
    ]);
  }, [searchParams]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Filter Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search-query">Search by Name</Label>
          <Input 
            id="search-query" 
            placeholder="e.g., Skyline, Oceanview"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger id="location"><SelectValue placeholder="All Locations" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">All Locations</SelectItem>
              {locations.map(loc => <SelectItem key={loc.id} value={loc.name}>{loc.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="developer">Developer</Label>
          <Select value={developer} onValueChange={setDeveloper}>
            <SelectTrigger id="developer"><SelectValue placeholder="All Developers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-developers">All Developers</SelectItem>
              {developers.map(dev => <SelectItem key={dev.id} value={dev.name}>{dev.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Property Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              {propertyTypes.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="beds">Minimum Bedrooms</Label>
          <Select value={beds} onValueChange={setBeds}>
            <SelectTrigger id="beds"><SelectValue placeholder="Any" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all-beds">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 pt-2">
          <Label>Price Range</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={MAX_PRICE}
            step={50000}
            className="my-4"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} EGP</span>
            <span>{priceRange[1].toLocaleString()} EGP</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-4">
            <Button onClick={handleSearch} size="lg"><Search className="mr-2 h-4 w-4"/> Apply Filters</Button>
            <Button onClick={handleReset} variant="ghost"><X className="mr-2 h-4 w-4"/> Reset Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
}
