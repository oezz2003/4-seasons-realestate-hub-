import Link from 'next/link';
import { Property } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface RecentPropertiesProps {
  properties: Property[];
}

export function RecentProperties({ properties }: RecentPropertiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Properties</CardTitle>
        <CardDescription>
          Latest property listings added to the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {properties.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No properties found</p>
            </div>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-gray-100">
                    {property.main_image ? (
                      <Image
                        src={property.main_image}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.title}
                    </p>
                    {property.is_featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                    {property.is_new_launch && (
                      <Badge variant="default" className="text-xs">
                        New Launch
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {property.property_type} • {property.area} sqm • {property.bedrooms} bed, {property.bathrooms} bath
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    EGP {parseFloat(property.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/dashboard/properties/${property.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/dashboard/properties/${property.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        {properties.length > 0 && (
          <div className="mt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/admin/dashboard/properties">
                View all properties
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

