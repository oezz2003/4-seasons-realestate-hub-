import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, Award, ArrowLeft } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { getDeveloperById, getProperties, getCompounds } from "@/lib/api";
import { getImageUrl, getPlaceholderImage } from "@/lib/image-helpers";
import { notFound } from "next/navigation";

export default async function DeveloperDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const developer = await getDeveloperById(id);

  if (!developer) {
    notFound();
  }

  // Fetch developer's properties and compounds
  const [developerPropertiesData, developerCompoundsData] = await Promise.all([
    getProperties({ developer: id }),
    getCompounds({ developer: id }),
  ]);

  return (
    <div className="container mx-auto py-12 px-4 md:py-20">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/developers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Developers
          </Link>
        </Button>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative h-32 w-32 md:h-48 md:w-48 flex-shrink-0">
            <Image
              src={getImageUrl(developer.logo, getPlaceholderImage('developer'))}
              alt={`${developer.name} logo`}
              fill
              className="object-contain rounded-lg bg-gray-50 p-4"
            />
          </div>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold font-headline mb-4">{developer.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                {developer.projects_count} Projects
              </Badge>
            </div>

            <div 
              className="prose max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: developer.description }}
            />
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Compounds Section */}
      {developerCompoundsData.results.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-headline">Compounds</h2>
            <Badge variant="outline">{developerCompoundsData.count} Compounds</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developerCompoundsData.results.map((compound) => (
              <Link key={compound.id} href={`/compounds/${compound.id}`} className="group">
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={getImageUrl(compound.main_image, getPlaceholderImage('compound'))}
                        alt={compound.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                      {compound.name}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {compound.location.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Status: {compound.status}
                      </span>
                    </div>

                    <div 
                      className="text-sm text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: compound.description.length > 120 
                          ? compound.description.substring(0, 120) + '...' 
                          : compound.description 
                      }}
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Separator className="my-8" />

      {/* Properties Section */}
      {developerPropertiesData.results.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold font-headline">Properties</h2>
            <Badge variant="outline">{developerPropertiesData.count} Properties</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developerPropertiesData.results.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                title={property.title}
                main_image={property.main_image}
                price={property.price}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
                area={property.area}
                location={property.location}
                property_type={property.property_type}
                is_featured={property.is_featured}
                is_new_launch={property.is_new_launch}
                compound={property.compound}
                developer={property.developer}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {developerCompoundsData.results.length === 0 && developerPropertiesData.results.length === 0 && (
        <div className="text-center py-16">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-headline mb-4">No Projects Available</h2>
          <p className="text-muted-foreground mb-8">
            This developer doesn't have any projects listed yet.
          </p>
          <Link href="/search">
            <Button size="lg">Browse All Properties</Button>
          </Link>
        </div>
      )}
    </div>
  );
}