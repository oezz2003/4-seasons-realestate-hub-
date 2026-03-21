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
    <div className="container mx-auto py-24 px-4 md:py-32">
      {/* Header */}
      <div className="mb-20">
        <Button variant="ghost" size="sm" className="mb-10 text-muted-foreground hover:text-primary p-0 h-auto group" asChild>
          <Link href="/developers" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
            Return to Collective
          </Link>
        </Button>
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="relative h-48 w-48 md:h-64 md:w-64 flex-shrink-0 card-premium p-10 bg-white">
            <Image
              src={getImageUrl(developer.logo, getPlaceholderImage('developer'))}
              alt={`${developer.name} logo`}
              fill
              className="object-contain p-8"
            />
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Concept Architect</span>
              <h1 className="text-editorial-title">{developer.name}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-primary/5 text-primary border-primary/10 tracking-widest text-[10px] uppercase font-bold py-1 px-3">
                <Award className="w-3 h-3 mr-2" />
                {developer.projects_count} Masterpieces
              </Badge>
            </div>

            <div 
              className="prose prose-lg max-w-none text-muted-foreground/90 font-serif leading-relaxed italic"
              dangerouslySetInnerHTML={{ __html: developer.description }}
            />
          </div>
        </div>
      </div>

      <Separator className="my-20 opacity-5" />

      {/* Compounds Section */}
      {developerCompoundsData.results.length > 0 && (
        <section className="mb-24">
          <div className="flex flex-col mb-12">
            <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block">Developments</span>
            <h2 className="text-editorial-title text-4xl">Masterplanned Enclaves</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {developerCompoundsData.results.map((compound) => (
              <Link key={compound.id} href={`/compounds/${compound.id}`} className="group h-full flex">
                <Card className="card-premium overflow-hidden transition-all duration-500 hover:translate-y-[-8px] flex flex-col w-full">
                  <CardHeader className="p-0 border-b border-primary/5">
                    <div className="relative h-64 w-full overflow-hidden">
                      <Image
                        src={getImageUrl(compound.main_image, getPlaceholderImage('compound'))}
                        alt={compound.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                    <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">Estate</span>
                    <CardTitle className="text-2xl font-display group-hover:text-primary transition-colors">
                      {compound.name}
                    </CardTitle>
                    
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-secondary/40" />
                        <span>{compound.location.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3 text-secondary/40" />
                        <span>{compound.status}</span>
                      </div>
                    </div>

                    <div 
                      className="text-sm text-muted-foreground/80 font-serif leading-relaxed line-clamp-2"
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