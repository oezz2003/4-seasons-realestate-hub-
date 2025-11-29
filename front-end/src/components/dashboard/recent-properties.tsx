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
    <Card className="bg-card text-card-foreground">
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
              <p className="text-muted-foreground">No properties found</p>
            </div>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-muted">
                    {property.main_image ? (
                      <Image
                        src={property.main_image}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted-foreground/10 flex items-center justify-center">
                        <span className="text-muted-foreground text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {property.title}
                    </p>
                    {property.is_featured && (
                      <Badge variant="outline" className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200">
                        Featured
                      </Badge>
                    )}
                    {property.is_new_launch && (
                      <Badge variant="outline" className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-200">
                        New Launch
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {property.property_type} • {property.area} sqm • {property.bedrooms} bed, {property.bathrooms} bath
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    EGP {parseFloat(property.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/dashboard/properties/${property.id}`} className="text-muted-foreground hover:text-foreground">
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/dashboard/properties/${property.id}/edit`} className="text-muted-foreground hover:text-foreground">
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

