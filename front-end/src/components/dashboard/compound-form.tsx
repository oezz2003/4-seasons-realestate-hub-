'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Compound, Developer, Location, Amenity } from '@/lib/types';
import { createCompound, updateCompound } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
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
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { Loader2, Save, X } from 'lucide-react';

const compoundSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  developer: z.number().min(1, 'Developer is required'),
  location: z.number().min(1, 'Location is required'),
  description: z.string().min(1, 'Description is required'),
  delivery_date: z.string().optional(),
  amenities: z.array(z.number()).optional(),
});

type CompoundFormData = z.infer<typeof compoundSchema>;

interface CompoundFormProps {
  compound?: Compound;
  developers: Developer[];
  locations: Location[];
  amenities: Amenity[];
}

export function CompoundForm({ compound, developers, locations, amenities }: CompoundFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState(compound?.main_image || '');
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(compound?.main_image || null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompoundFormData>({
    resolver: zodResolver(compoundSchema),
    defaultValues: {
      name: compound?.name || '',
      developer: compound?.developer?.id,
      location: compound?.location?.id,
      description: compound?.description || '',
      delivery_date: compound?.delivery_date || '',
      amenities: compound?.amenities?.map(a => a.id) || [],
    },
  });

  const watchedAmenities = watch('amenities') || [];

  const onSubmit = async (data: CompoundFormData) => {
    setIsLoading(true);
    try {
      let finalMainImage = mainImage;

      if (mainImageFile) {
        const { uploadImage } = await import('@/lib/upload-utils');
        const result = await uploadImage(mainImageFile, 'compound');
        finalMainImage = typeof result === 'string' ? result : result.image;
        setMainImage(finalMainImage);
        setMainImageFile(null);
      }

      const formData: any = {
        name: data.name,
        developer: data.developer,
        location: data.location,
        description: data.description,
      };

      // Only include optional fields if they have values
      if (finalMainImage) {
        formData.main_image = finalMainImage;
      }
      if (data.delivery_date) {
        formData.delivery_date = data.delivery_date;
      }
      if (data.amenities && data.amenities.length > 0) {
        formData.amenities = data.amenities;
      }

      if (compound) {
        await updateCompound(compound.id, formData);
      } else {
        await createCompound(formData);
      }

      toast({
        title: "Success",
        description: `Compound ${compound ? 'updated' : 'created'} successfully`,
      });
      router.push('/admin/dashboard/compounds');
    } catch (error: any) {
      console.error('Error saving compound:', error);
      const errorMessage = error?.response?.data?.detail || 
                          error?.response?.data?.message ||
                          JSON.stringify(error?.response?.data) ||
                          "Failed to save compound";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for the compound
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter compound name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="developer">Developer *</Label>
              <Select
                value={watch('developer')?.toString()}
                onValueChange={(value) => setValue('developer', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a developer" />
                </SelectTrigger>
                <SelectContent>
                  {developers.map((developer) => (
                    <SelectItem key={developer.id} value={developer.id.toString()}>
                      {developer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.developer && (
                <p className="text-sm text-red-600">{errors.developer.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select
                value={watch('location')?.toString()}
                onValueChange={(value) => setValue('location', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="text-sm text-red-600">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery_date">Delivery Date</Label>
              <Input
                id="delivery_date"
                type="date"
                {...register('delivery_date')}
              />
              {errors.delivery_date && (
                <p className="text-sm text-red-600">{errors.delivery_date.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Main Image</CardTitle>
            <CardDescription>
              Upload the main image for the compound
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              autoUpload={false}
              currentImage={mainImagePreview}
              onFileSelect={(file, previewUrl) => {
                setMainImageFile(file);
                setMainImagePreview(previewUrl);
                if (!file) {
                  setMainImage('');
                }
              }}
              type="compound"
            />
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>
            Provide a detailed description of the compound
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={watch('description')}
            onChange={(value) => setValue('description', value)}
            placeholder="Enter compound description..."
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-2">{errors.description.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
          <CardDescription>
            Select the amenities available in this compound
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MultiSelect
            options={amenities.map((amenity) => ({
              value: amenity.id,
              label: amenity.name,
            }))}
            selectedValues={watchedAmenities}
            onChange={(values: number[]) => setValue('amenities', values)}
            placeholder="Select amenities..."
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {compound ? 'Update' : 'Create'} Compound
        </Button>
      </div>
    </form>
  );
}
