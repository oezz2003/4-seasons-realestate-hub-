'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProperty } from '@/store/slices/propertiesSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, ArrowLeft, Star, Rocket, MapPin, Building2, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PropertyDetailsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { currentProperty, isLoading } = useAppSelector((state) => state.properties);

  const propertyId = params.id as string;

  useEffect(() => {
    if (propertyId) {
      dispatch(fetchProperty(propertyId));
    }
  }, [dispatch, propertyId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!currentProperty) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
        <p className="text-gray-600 mb-4">The property you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/admin/dashboard/properties')}>
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{currentProperty.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              {currentProperty.is_featured && (
                <Badge variant="secondary">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {currentProperty.is_new_launch && (
                <Badge variant="default">
                  <Rocket className="h-3 w-3 mr-1" />
                  New Launch
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/dashboard/properties/${currentProperty.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Property
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card>
            <CardContent className="p-0">
              {currentProperty.main_image ? (
                <div className="relative h-64 lg:h-96">
                  <Image
                    src={currentProperty.main_image}
                    alt={currentProperty.title}
                    fill
                    className="object-cover rounded-t-lg"
                  />
                </div>
              ) : (
                <div className="h-64 lg:h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: currentProperty.description }}
              />
            </CardContent>
          </Card>

          {/* Gallery Images */}
          {currentProperty.gallery_images && currentProperty.gallery_images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Gallery</CardTitle>
                <CardDescription>
                  Additional property images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {currentProperty.gallery_images.map((image, index) => (
                    <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                      <Image
                        src={image.image}
                        alt={image.alt_text || `Gallery ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{currentProperty.property_type}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-medium text-lg">
                  EGP {parseFloat(currentProperty.price).toLocaleString()}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Area</span>
                <span className="font-medium">{currentProperty.area} sqm</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Bedrooms</span>
                <span className="font-medium">{currentProperty.bedrooms}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-600">Bathrooms</span>
                <span className="font-medium">{currentProperty.bathrooms}</span>
              </div>
            </CardContent>
          </Card>

          {/* Location & Developer */}
          <Card>
            <CardHeader>
              <CardTitle>Location & Developer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentProperty.compound && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{currentProperty.compound.name}</p>
                    <p className="text-sm text-gray-500">Compound</p>
                  </div>
                </div>
              )}
              
              {currentProperty.developer && (
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{currentProperty.developer.name}</p>
                    <p className="text-sm text-gray-500">Developer</p>
                  </div>
                </div>
              )}

              {currentProperty.location && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{currentProperty.location.name}</p>
                    <p className="text-sm text-gray-500">Location</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Amenities */}
          {currentProperty.amenities && currentProperty.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentProperty.amenities.map((amenity) => (
                    <Badge key={amenity.id} variant="outline">
                      {amenity.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

