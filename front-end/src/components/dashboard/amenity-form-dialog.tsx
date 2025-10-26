'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Amenity } from '@/lib/types';
import { createAmenity, updateAmenity } from '@/lib/api';
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

const amenitySchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type AmenityFormData = z.infer<typeof amenitySchema>;

interface AmenityFormDialogProps {
  amenity?: Amenity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AmenityFormDialog({ amenity, open, onOpenChange, onSuccess }: AmenityFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AmenityFormData>({
    resolver: zodResolver(amenitySchema),
    defaultValues: {
      name: amenity?.name || '',
    },
  });

  // Reset form when amenity changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        name: amenity?.name || '',
      });
    }
  }, [amenity, open, reset]);

  const onSubmit = async (data: AmenityFormData) => {
    setIsLoading(true);
    try {
      if (amenity) {
        await updateAmenity(amenity.id, data);
      } else {
        await createAmenity(data);
      }

      toast({
        title: "Success",
        description: `Amenity ${amenity ? 'updated' : 'created'} successfully`,
      });
      
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error saving amenity:', error);
      toast({
        title: "Error",
        description: "Failed to save amenity",
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
          <DialogTitle>{amenity ? 'Edit' : 'Add'} Amenity</DialogTitle>
          <DialogDescription>
            {amenity ? 'Update the amenity details.' : 'Add a new amenity for properties.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Swimming Pool"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
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
              {amenity ? 'Update' : 'Create'} Amenity
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
