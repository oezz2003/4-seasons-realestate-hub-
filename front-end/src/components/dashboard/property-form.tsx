'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDevelopers } from '@/store/slices/developersSlice';
import { fetchCompounds } from '@/store/slices/compoundsSlice';
import { Property, Developer, Compound, Location, Amenity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { MultiSelect } from '@/components/dashboard/multi-select';
import { MultiImageUpload } from '@/components/dashboard/multi-image-upload';
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { Loader2, Upload, X } from 'lucide-react';

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  property_type: z.string().min(1, 'Property type is required'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  area: z.number().min(1, 'Area must be greater than 0'),
  bedrooms: z.number().min(0, 'Bedrooms must be 0 or greater'),
  bathrooms: z.number().min(0, 'Bathrooms must be 0 or greater'),
  description: z.string().min(1, 'Description is required'),
  compound: z.number().optional(),
  developer: z.number().optional(),
  location: z.number().optional(),
  amenities: z.array(z.number()).optional(),
  is_featured: z.boolean().optional(),
  is_new_launch: z.boolean().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  property?: Property;
  onSubmit: (data: PropertyFormData & { main_image?: string; gallery_images?: Array<{ id: string; image: string; alt_text?: string }> }) => void;
  isLoading?: boolean;
}

const PROPERTY_TYPES = [
  'Apartment',
  'Villa',
  'Chalet',
  'Duplex',
  'Studio',
];

export function PropertyForm({ property, onSubmit, isLoading = false }: PropertyFormProps) {
  const dispatch = useAppDispatch();
  const { developers } = useAppSelector((state) => state.developers);
  const { compounds } = useAppSelector((state) => state.compounds);
  
  const [mainImage, setMainImage] = useState<string | null>(property?.main_image || null);
  const [galleryImages, setGalleryImages] = useState<Array<{ id: string; image: string; alt_text?: string }>>(
    property?.gallery_images?.map(img => ({
      id: img.id.toString(),
      image: img.image,
      alt_text: img.alt_text || '',
    })) || []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
    property?.amenities?.map(amenity => amenity.id) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: property?.title || '',
      property_type: property?.property_type || '',
      price: Number(property?.price) || 0,
      area: property?.area || 0,
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      description: property?.description || '',
      compound: property?.compound?.id || undefined,
      developer: property?.developer?.id || undefined,
      location: property?.location?.id || undefined,
      amenities: property?.amenities?.map(amenity => amenity.id) || [],
      is_featured: property?.is_featured || false,
      is_new_launch: property?.is_new_launch || false,
    },
  });

  useEffect(() => {
    dispatch(fetchDevelopers({ page: 1, filters: {} }));
    dispatch(fetchCompounds({ page: 1, filters: {} }));
  }, [dispatch]);

  const handleFormSubmit = (data: PropertyFormData) => {
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    ) as PropertyFormData;
    onSubmit({
      ...filteredData,
      main_image: mainImage || undefined,
      gallery_images: galleryImages,
    });
  };

  const handleMainImageUpload = (imageUrl: string) => {
    setMainImage(imageUrl);
  };

  const handleGalleryImageUpload = (imageUrl: string) => {
    const newImage = {
      id: `temp-${Date.now()}`,
      image: imageUrl,
      alt_text: '',
    };
    setGalleryImages(prev => [...prev, newImage]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about the property
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                className={errors.title ? 'border-red-500' : ''}
                placeholder="Enter property title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">Property Type *</Label>
              <Select
                value={watch('property_type')}
                onValueChange={(value) => setValue('property_type', value)}
              >
                <SelectTrigger className={errors.property_type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_type && (
                <p className="text-sm text-red-500">{errors.property_type.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (EGP) *</Label>
                <Input
                  id="price"
                  type="number"
                  {...register('price')}
                  className={errors.price ? 'border-red-500' : ''}
                  placeholder="0"
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (sqm) *</Label>
                <Input
                  id="area"
                  type="number"
                  {...register('area', { valueAsNumber: true })}
                  className={errors.area ? 'border-red-500' : ''}
                  placeholder="0"
                />
                {errors.area && (
                  <p className="text-sm text-red-500">{errors.area.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className={errors.bedrooms ? 'border-red-500' : ''}
                  placeholder="0"
                />
                {errors.bedrooms && (
                  <p className="text-sm text-red-500">{errors.bedrooms.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className={errors.bathrooms ? 'border-red-500' : ''}
                  placeholder="0"
                />
                {errors.bathrooms && (
                  <p className="text-sm text-red-500">{errors.bathrooms.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Developer */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Developer</CardTitle>
            <CardDescription>
              Property location and developer information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="compound">Compound</Label>
              <Select
                value={watch('compound') !== undefined ? watch('compound')?.toString() : 'none'}
                onValueChange={(value) => setValue('compound', value === 'none' ? undefined : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select compound (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No compound</SelectItem>
                  {compounds.map((compound) => (
                    <SelectItem key={compound.id} value={compound.id.toString()}>
                      {compound.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="developer">Developer</Label>
              <Select
                value={watch('developer') !== undefined ? watch('developer')?.toString() : 'none'}
                onValueChange={(value) => setValue('developer', value === 'none' ? undefined : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select developer (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No developer</SelectItem>
                  {developers.map((developer) => (
                    <SelectItem key={developer.id} value={developer.id.toString()}>
                      {developer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities</Label>
              <MultiSelect
                options={[]} // TODO: Add amenities from API
                selectedValues={selectedAmenities}
                onChange={setSelectedAmenities}
                placeholder="Select amenities"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>
            Detailed description of the property
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={watch('description')}
            onChange={(value) => setValue('description', value)}
            placeholder="Enter property description..."
          />
          {errors.description && (
            <p className="text-sm text-red-500 mt-2">{errors.description.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>
            Upload property images
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Main Image *</Label>
            <ImageUpload
              onUpload={handleMainImageUpload}
              currentImage={mainImage}
              type="property-main"
            />
          </div>

          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <MultiImageUpload
              images={galleryImages}
              onImagesChange={setGalleryImages}
              type="property-gallery"
              maxImages={20}
            />
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Special features and flags
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              checked={watch('is_featured')}
              onCheckedChange={(checked) => setValue('is_featured', !!checked)}
            />
            <Label htmlFor="is_featured">Featured Property</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_new_launch"
              checked={watch('is_new_launch')}
              onCheckedChange={(checked) => setValue('is_new_launch', !!checked)}
            />
            <Label htmlFor="is_new_launch">New Launch</Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Property'
          )}
        </Button>
      </div>
    </form>
  );
}

