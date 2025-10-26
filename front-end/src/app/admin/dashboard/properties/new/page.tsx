'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createProperty } from '@/store/slices/propertiesSlice';
import { PropertyForm } from '@/components/dashboard/property-form';
import { useToast } from '@/hooks/use-toast';

export default function NewPropertyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      await dispatch(createProperty(data));
      
      toast({
        title: 'Success',
        description: 'Property created successfully',
      });
      
      router.push('/admin/dashboard/properties');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create property',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Property</h1>
        <p className="text-sm text-gray-500">
          Add a new property listing to the platform
        </p>
      </div>

      <PropertyForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}

