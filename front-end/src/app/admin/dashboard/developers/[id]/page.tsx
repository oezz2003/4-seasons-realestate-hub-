import { notFound } from 'next/navigation';
import { getAdminDeveloperById, getCompounds, getProperties } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Edit, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image-helpers';

interface DeveloperDetailsPageProps {
  params: { id: string };
}

export default async function DeveloperDetailsPage({ params }: DeveloperDetailsPageProps) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  const developer = await getAdminDeveloperById(resolvedParams.id);

  if (!developer) {
    notFound();
  }

  // Fetch developer's compounds and properties
  const [compounds, properties] = await Promise.all([
    getCompounds({ developer: resolvedParams.id, page_size: 5 }),
    getProperties({ developer: resolvedParams.id, page_size: 5 }),
  ]);

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/dashboard/developers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Developers
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/dashboard/developers/${developer.id}/edit`}>
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
                    <CardTitle className="text-2xl">{developer.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">
                      Developer Details
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {developer.logo && (
                  <div className="aspect-video relative rounded-lg overflow-hidden max-w-md">
                    <Image
                      src={getImageUrl(developer.logo)}
                      alt={developer.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-3">Description</h3>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: developer.description }}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{developer.projects_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Compounds */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Compounds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {compounds.count} compounds found
                </p>
                {compounds.results.length > 0 ? (
                  <div className="space-y-3">
                    {compounds.results.map((compound) => (
                      <div key={compound.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-12 h-12 relative rounded overflow-hidden">
                          <Image
                            src={getImageUrl(compound.main_image)}
                            alt={compound.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{compound.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {compound.location?.name}
                          </p>
                        </div>
                      </div>
                    ))}
                    {compounds.count > 5 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/admin/dashboard/compounds?developer=${developer.id}`}>
                          View All Compounds
                        </Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No compounds found</p>
                )}
              </CardContent>
            </Card>

            {/* Properties */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Properties</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {properties.count} properties found
                </p>
                {properties.results.length > 0 ? (
                  <div className="space-y-3">
                    {properties.results.map((property) => (
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
                      </div>
                    ))}
                    {properties.count > 5 && (
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/admin/dashboard/properties?developer=${developer.id}`}>
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
