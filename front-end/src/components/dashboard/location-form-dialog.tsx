'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Location } from '@/lib/types';
import { createLocation, updateLocation } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .optional()
    .refine(
      (value) => !value || slugRegex.test(value),
      'Slug must be lowercase with hyphens'
    ),
});

type LocationFormData = z.infer<typeof locationSchema>;

const generateSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

interface LocationFormDialogProps {
  location?: Location;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function LocationFormDialog({ location, open, onOpenChange, onSuccess }: LocationFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: location?.name || '',
      slug: location?.slug || '',
    },
  });

  const nameValue = watch('name');

  // Reset form when location changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        name: location?.name || '',
        slug: location?.slug || '',
      });
      setIsSlugManuallyEdited(false);
    }
  }, [location, open, reset]);

  // Auto-generate slug from name when not manually edited
  useEffect(() => {
    if (isSlugManuallyEdited) return;
    const generatedSlug = generateSlug(nameValue || '');
    setValue('slug', generatedSlug, { shouldValidate: true });
  }, [isSlugManuallyEdited, nameValue, setValue]);

  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    const rawValue = event.target.value;
    const sanitized = rawValue.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
    setValue('slug', sanitized, { shouldValidate: true });
  };

  const onSubmit = async (data: LocationFormData) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        slug: data.slug && data.slug.length > 0 ? data.slug : generateSlug(data.name),
      };

      if (!slugRegex.test(payload.slug)) {
        throw new Error('Slug must be lowercase with hyphens');
      }

      if (location) {
        await updateLocation(location.id, payload);
      } else {
        await createLocation(payload);
      }

      toast({
        title: "Success",
        description: `Location ${location ? 'updated' : 'created'} successfully`,
      });
      
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error saving location:', error);
      toast({
        title: "Error",
        description: "Failed to save location",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{location ? 'Edit' : 'Add'} Location</DialogTitle>
          <DialogDescription>
            {location ? 'Update the location details.' : 'Add a new location for properties.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., New Cairo"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="e.g., new-cairo"
                onChange={handleSlugChange}
              />
              {errors.slug && (
                <p className="text-sm text-red-600">{errors.slug.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {location ? 'Update' : 'Create'} Location
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
