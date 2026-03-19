import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BedDouble, Bath, AreaChart, MapPin, CheckCircle, Star, Rocket } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { WhatsappIcon } from '@/components/icons';
import { PropertyCard } from '@/components/property-card';
import { PropertyImageGallery } from '@/components/property-image-gallery';
import { notFound } from 'next/navigation';
import { getPropertyById, getProperties } from '@/lib/api';
import { getImageUrl, getPlaceholderImage, getLocationName, getDeveloperName, getCompoundName } from '@/lib/image-helpers';

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await getPropertyById(resolvedParams.id);

  if (!property) {
    notFound();
  }

  // Fetch suggested properties (same location or developer)
  const suggestedPropertiesData = await getProperties({
    location: property.location?.slug,
    page_size: 3,
  });

  const suggestedProperties = suggestedPropertiesData.results.filter(p => p.id !== property.id);

  const whatsappMessage = `Hello, I'm interested in the property "${property.title}" located at ${getLocationName(property.location)}. Could you please provide more information?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  // Prepare gallery images
  const galleryImages = [
    getImageUrl(property.main_image, getPlaceholderImage('property')),
    ...property.gallery_images.map(img => getImageUrl(img.image, getPlaceholderImage('property')))
  ];

  return (
    <div className="container mx-auto py-12 px-4 md:py-20 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Images and Map */}
        <div className="lg:col-span-2 animate-fade-in-up">
          <div className="mb-8">
            <PropertyImageGallery 
              images={galleryImages} 
              imageHints={galleryImages.map(() => 'property image')} 
              title={property.title} 
            />
          </div>
          
          <Accordion type="single" collapsible defaultValue="description" className="w-full">
            <AccordionItem value="description">
              <AccordionTrigger className="text-2xl font-bold font-headline">Description</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pt-2">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </AccordionContent>
            </AccordionItem>
            
            {property.floor_plan_image && (
              <AccordionItem value="floor-plan">
                <AccordionTrigger className="text-2xl font-bold font-headline">Floor Plan</AccordionTrigger>
                <AccordionContent>
                  <div className="relative w-full h-96 mt-4">
                    <Image 
                      src={getImageUrl(property.floor_plan_image)} 
                      alt="Floor Plan" 
                      fill 
                      className="object-contain rounded-md" 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            
            {property.map_image && (
              <AccordionItem value="map">
                <AccordionTrigger className="text-2xl font-bold font-headline">Location</AccordionTrigger>
                <AccordionContent>
                  <div className="relative w-full h-80 mt-4 rounded-md overflow-hidden">
                    <Image 
                      src={getImageUrl(property.map_image)} 
                      alt="Location map" 
                      fill 
                      className="object-cover" 
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>

        {/* Right Column: Details and Contact */}
        <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <Card className="sticky top-28 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{property.property_type}</Badge>
                {property.is_featured && (
                  <Badge variant="secondary" className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {property.is_new_launch && (
                  <Badge variant="default" className="bg-blue-500 text-white">
                    <Rocket className="h-3 w-3 mr-1" />
                    New Launch
                  </Badge>
                )}
              </div>
              
              <div className="overflow-hidden py-1">
                <CardTitle className="text-3xl font-bold font-headline animate-title-reveal">{property.title}</CardTitle>
              </div>
              <p className="text-muted-foreground flex items-center gap-2 pt-1">
                <MapPin className="w-4 h-4"/> {getLocationName(property.location)}
              </p>
            </CardHeader>
            
            <CardContent>
              <p className="text-4xl font-bold text-primary mb-6">EGP {parseFloat(property.price).toLocaleString()}</p>
              
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <BedDouble className="w-6 h-6 mx-auto text-primary mb-1" />
                  <p className="font-semibold">{property.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Bath className="w-6 h-6 mx-auto text-primary mb-1" />
                  <p className="font-semibold">{property.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Baths</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <AreaChart className="w-6 h-6 mx-auto text-primary mb-1" />
                  <p className="font-semibold">{property.area} m²</p>
                  <p className="text-xs text-muted-foreground">Area</p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Compound and Developer Info */}
              {(property.compound || property.developer) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 font-headline">Project Details</h3>
                  {property.compound && (
                    <div className="mb-2">
                      <p className="text-sm text-muted-foreground">Compound</p>
                      <Link 
                        href={`/compounds/${property.compound.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {getCompoundName(property.compound)}
                      </Link>
                    </div>
                  )}
                  {property.developer && (
                    <div>
                      <p className="text-sm text-muted-foreground">Developer</p>
                      <Link 
                        href={`/developers/${property.developer.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {getDeveloperName(property.developer)}
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <Separator className="my-6" />

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mb-4 font-headline">Amenities</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    {property.amenities.map((amenity) => (
                      <li key={amenity.id} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{amenity.name}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-6" />
                </>
              )}

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                  <WhatsappIcon className="mr-2 h-5 w-5"/> Inquire via WhatsApp
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Separator className="my-12 md:my-20" />

      {/* Suggested Properties */}
      {suggestedProperties.length > 0 && (
        <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="overflow-hidden py-1 text-center">
            <h2 className="text-3xl font-bold mb-10 font-headline animate-title-reveal">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedProperties.map((property) => (
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
    </div>
  );
}