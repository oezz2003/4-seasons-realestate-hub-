import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyCard } from '@/components/property-card';
import { Building, MapPin, Sun, User, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCompoundById, getProperties, getCompounds } from '@/lib/api';
import { getImageUrl, getPlaceholderImage, getLocationName, getDeveloperName } from '@/lib/image-helpers';

export default async function CompoundDetailsPage({ params }: { params: { id: string } }) {
  const compound = await getCompoundById(params.id);

  if (!compound) {
    notFound();
  }

  // Fetch properties in this compound
  const compoundPropertiesData = await getProperties({
    compound: params.id,
    page_size: 6,
  });

  // Fetch other compounds for suggestions
  const otherCompoundsData = await getCompounds({
    page_size: 3,
  });

  const otherCompounds = otherCompoundsData.results.filter(c => c.id !== compound.id);

  return (
    <div className="animate-fade-in">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[300px] w-full">
            <Image
                src={getImageUrl(compound.main_image, getPlaceholderImage('compound'))}
                alt={compound.name}
                fill
                className="object-cover"
                priority
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
                <div className="overflow-hidden py-1">
                    <h1 className="text-4xl md:text-6xl font-bold font-headline animate-title-reveal">{compound.name}</h1>
                </div>
                <div className="overflow-hidden py-1">
                    <p className="text-lg md:text-xl mt-2 animate-title-reveal" style={{animationDelay: '0.1s'}}>
                        {getLocationName(compound.location)}
                    </p>
                </div>
            </div>
        </section>

        <div className="container mx-auto py-12 px-4 md:py-20">
            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        <User className="w-8 h-8 text-primary" />
                        <span className="text-sm text-muted-foreground">Developer</span>
                        <p className="font-bold">{getDeveloperName(compound.developer)}</p>
                    </CardContent>
                </Card>
                <Card>
                     <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        <MapPin className="w-8 h-8 text-primary" />
                        <span className="text-sm text-muted-foreground">Location</span>
                        <p className="font-bold">{getLocationName(compound.location)}</p>
                    </CardContent>
                </Card>
                <Card>
                     <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        <Sun className="w-8 h-8 text-primary" />
                        <span className="text-sm text-muted-foreground">Status</span>
                        <p className="font-bold">{compound.status}</p>
                    </CardContent>
                </Card>
                 <Card>
                     <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                        <Calendar className="w-8 h-8 text-primary" />
                        <span className="text-sm text-muted-foreground">Delivery</span>
                        <p className="font-bold">{compound.delivery_date || 'TBD'}</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                {/* Left: Description & Amenities */}
                <div className="lg:col-span-2">
                    <div className="overflow-hidden py-1">
                        <h2 className="text-3xl font-bold font-headline mb-4 animate-title-reveal">About {compound.name}</h2>
                    </div>
                    <div
                        className="prose max-w-none text-muted-foreground mb-8 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: compound.description }}
                    />
                    
                    <div className="overflow-hidden py-1">
                        <h3 className="text-2xl font-bold font-headline mb-4 animate-title-reveal">Amenities</h3>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {compound.amenities.map(amenity => (
                            <div key={amenity.id} className="bg-primary/5 p-4 rounded-lg flex items-center gap-3">
                                <Building className="w-6 h-6 text-primary" />
                                <span className="font-medium">{amenity.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Contact */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-28 shadow-lg">
                        <CardHeader>
                            <CardTitle>Interested in {compound.name}?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Contact us today to learn more about available units and payment plans.
                            </p>
                            <Link href="/contact" passHref>
                                <Button size="lg" className="w-full">Contact Us</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator className="my-12 md:my-20" />

            <section className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="overflow-hidden py-1 text-center">
                    <h2 className="text-3xl font-bold mb-10 font-headline animate-title-reveal">Available Properties</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {compoundPropertiesData.results.map((property) => (
                        <PropertyCard
                            key={property.id}
                            id={property.id}
                            title={property.title}
                            main_image={property.main_image}
                            price={property.price}
                            bedrooms={property.bedrooms}
                            bathrooms={property.bathrooms}
                            area={property.area}
                            location={getLocationName(property.location)}
                            property_type={property.property_type}
                            is_featured={property.is_featured}
                            is_new_launch={property.is_new_launch}
                            compound={property.compound}
                            developer={property.developer}
                        />
                    ))}
                </div>
            </section>

            <Separator className="my-12 md:my-20" />

            <section className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                 <div className="overflow-hidden py-1 text-center">
                    <h2 className="text-3xl font-bold text-center mb-10 font-headline animate-title-reveal">Other Compounds to Explore</h2>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherCompounds.map((compound) => (
                        <Link key={compound.id} href={`/compounds/${compound.id}`}>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="relative h-48">
                                    <Image
                                        src={getImageUrl(compound.main_image, getPlaceholderImage('compound'))}
                                        alt={compound.name}
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{compound.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {getDeveloperName(compound.developer)}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {getLocationName(compound.location)}
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    </div>
  );
}
