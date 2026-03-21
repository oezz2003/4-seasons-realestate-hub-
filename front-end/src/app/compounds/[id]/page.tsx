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

export default async function CompoundDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const compound = await getCompoundById(id);

  if (!compound) {
    notFound();
  }

  // Fetch properties in this compound
  const compoundPropertiesData = await getProperties({
    compound: id,
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
        <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
            <Image
                src={getImageUrl(compound.main_image, getPlaceholderImage('compound'))}
                alt={compound.name}
                fill
                className="object-cover scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
            <div className="relative z-10 flex h-full flex-col items-center justify-end text-center text-white pb-20 px-4">
                <div className="max-w-4xl space-y-6">
                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.4em] mb-4 block animate-fade-in">Masterplanned Estate</span>
                    <h1 className="text-4xl md:text-7xl font-display tracking-tight animate-fade-in-up">{compound.name}</h1>
                    <div className="flex items-center justify-center gap-3 text-white/80 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span className="text-lg font-serif italic">{getLocationName(compound.location)}</span>
                    </div>
                </div>
            </div>
        </section>

        <div className="container mx-auto py-24 px-4 md:py-32">
            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <Card className="card-premium border-none shadow-2xl shadow-primary/5">
                    <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
                        <User className="w-6 h-6 text-secondary/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Architect</span>
                        <p className="font-display text-xl text-center">{getDeveloperName(compound.developer)}</p>
                    </CardContent>
                </Card>
                <Card className="card-premium border-none shadow-2xl shadow-primary/5">
                     <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
                        <MapPin className="w-6 h-6 text-secondary/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Catchment</span>
                        <p className="font-display text-xl text-center">{getLocationName(compound.location)}</p>
                    </CardContent>
                </Card>
                <Card className="card-premium border-none shadow-2xl shadow-primary/5">
                     <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
                        <Sun className="w-6 h-6 text-secondary/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Maturity</span>
                        <p className="font-display text-xl text-center">{compound.status}</p>
                    </CardContent>
                </Card>
                 <Card className="card-premium border-none shadow-2xl shadow-primary/5">
                     <CardContent className="p-8 flex flex-col items-center justify-center gap-3">
                        <Calendar className="w-6 h-6 text-secondary/60" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-center">Handover</span>
                        <p className="font-display text-xl text-center">{compound.delivery_date || 'Enquire'}</p>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                {/* Left: Description & Amenities */}
                <div className="lg:col-span-2 space-y-16">
                    <div className="section-blend p-10 rounded-[2.5rem] bg-surface-low/30 backdrop-blur-xl border border-primary/5">
                        <h2 className="text-editorial-label border-b border-primary/10 pb-4 mb-8 text-secondary">The Narrative</h2>
                        <div
                            className="prose prose-lg max-w-none text-muted-foreground/90 font-serif leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: compound.description }}
                        />
                    </div>
                    
                    <div className="section-blend p-10 rounded-[2.5rem] bg-surface-low/30 backdrop-blur-xl border border-primary/5">
                        <h2 className="text-editorial-label border-b border-primary/10 pb-4 mb-8 text-secondary">Accoutrements</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {compound.amenities.map(amenity => (
                                <div key={amenity.id} className="flex items-center gap-4 text-sm text-muted-foreground group">
                                    <div className="p-3 rounded-xl bg-primary/5 text-primary opacity-40 group-hover:opacity-100 transition-all group-hover:scale-110">
                                        <Building className="w-5 h-5" />
                                    </div>
                                    <span className="font-bold uppercase tracking-widest text-[10px] group-hover:text-foreground transition-colors">{amenity.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Contact */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-32 card-premium p-4">
                        <CardHeader className="text-center">
                            <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Acquisition</span>
                            <CardTitle className="text-2xl font-display">Secure Your Position</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-muted-foreground/80 text-center font-serif italic">
                                Connect with our private consultants to explore exclusive payment structures and available inventory within {compound.name}.
                            </p>
                            <Link href="/contact" passHref className="block">
                                <Button size="lg" className="w-full gradient-primary text-white font-bold h-14 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                                    ESTABLISH CONTACT
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Separator className="my-24 opacity-5" />

            <section className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="mb-12">
                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-2 block">Inventory</span>
                    <h2 className="text-editorial-title text-4xl text-center md:text-left">Available Residences</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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

            <Separator className="my-24 opacity-5" />

            <section className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                 <div className="mb-12">
                    <span className="text-secondary text-xs font-bold uppercase tracking-[0.3em] mb-2 block">Exploration</span>
                    <h2 className="text-editorial-title text-4xl text-center md:text-left">Related Enclaves</h2>
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {otherCompounds.map((compound) => (
                        <Link key={compound.id} href={`/compounds/${compound.id}`} className="group h-full flex">
                            <Card className="card-premium overflow-hidden transition-all duration-500 hover:translate-y-[-8px] flex flex-col w-full">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={getImageUrl(compound.main_image, getPlaceholderImage('compound'))}
                                        alt={compound.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                </div>
                                <CardContent className="p-8 space-y-4">
                                    <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.2em]">Estate</span>
                                    <CardTitle className="text-2xl font-display group-hover:text-primary transition-colors line-clamp-1">{compound.name}</CardTitle>
                                    <div className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                        <span>{getDeveloperName(compound.developer)}</span>
                                        <span className="text-secondary/40">{getLocationName(compound.location)}</span>
                                    </div>
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
