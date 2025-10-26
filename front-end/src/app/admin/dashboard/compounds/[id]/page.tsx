import { notFound } from 'next/navigation';
import { getAdminCompoundById, getProperties } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Building2, Eye, Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image-helpers';

interface CompoundDetailsPageProps {
  params: { id: string };
}

export default async function CompoundDetailsPage({ params }: CompoundDetailsPageProps) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  const compound = await getAdminCompoundById(resolvedParams.id);

  if (!compound) {
    notFound();
  }

  // Fetch properties in this compound
  const compoundProperties = await getProperties({
    compound: resolvedParams.id,
    page_size: 5,
  });

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard/compounds">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Compounds
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/dashboard/compounds/${compound.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{compound.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Compound Details
                    </p>
                  </div>
                  <Badge variant={compound.status === 'Active' ? 'default' : 'secondary'}>
                    {compound.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {compound.main_image && (
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={getImageUrl(compound.main_image)}
                      alt={compound.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Developer:</strong> {compound.developer?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Location:</strong> {compound.location?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <strong>Delivery:</strong> {compound.delivery_date || 'N/A'}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: compound.description }}
                  />
                </div>

                {compound.amenities && compound.amenities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {compound.amenities.map((amenity) => (
                          <Badge key={amenity.id} variant="outline">
                            {amenity.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Properties in Compound</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {compoundProperties.count} properties found
                </p>
                {compoundProperties.results.length > 0 ? (
                  <div className="space-y-3">
                    {compoundProperties.results.map((property) => (
                      <div key={property.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 relative rounded overflow-hidden">
                          <Image
                            src={getImageUrl(property.main_image)}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{property.title}</p>
                          <p className="text-xs text-muted-foreground">
                            EGP {parseFloat(property.price).toLocaleString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/dashboard/properties/${property.id}`}>
                            <Eye className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                    {compoundProperties.count > 5 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/admin/dashboard/properties?compound=${compound.id}`}>
                          View All Properties
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No properties found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
