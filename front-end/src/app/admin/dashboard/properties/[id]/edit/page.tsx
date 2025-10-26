'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProperty, updateProperty } from '@/store/slices/propertiesSlice';
import { PropertyForm } from '@/components/dashboard/property-form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function EditPropertyPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { currentProperty, isLoading } = useAppSelector((state) => state.properties);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyId = params.id as string;

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchProperty(propertyId));
    }
  }, [dispatch, propertyId]);

  const handleSubmit = async (data: any) => {
    if (!propertyId) return;

    setIsSubmitting(true);

    try {
      await dispatch(updateProperty({ id: propertyId, data }));
      
      toast({
        title: 'Success',
        description: 'Property updated successfully',
      });
      
      router.push('/admin/dashboard/properties');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update property',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading property...</span>
        </div>
      </div>
    );
  }

  if (!currentProperty) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/admin/dashboard/properties')}
          className="text-blue-600 hover:text-blue-800"
        >
          Back to Properties
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        <p className="text-sm text-gray-500">
          Update property information
        </p>
      </div>

      <PropertyForm 
        property={currentProperty} 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}

