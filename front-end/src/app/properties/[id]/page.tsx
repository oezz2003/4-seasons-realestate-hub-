import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BedDouble, Bath, AreaChart, MapPin, CheckCircle, Star, Rocket, Info, ShieldCheck, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { WhatsappIcon } from '@/components/icons';
import { PropertyCard } from '@/components/property-card';
import { PropertyImageGallery } from '@/components/property-image-gallery';
import { ExperienceThePalette } from '@/components/experience-the-palette';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { notFound } from 'next/navigation';
import { getPropertyById, getProperties } from '@/lib/api';
import { getImageUrl, getPlaceholderImage, getLocationName, getDeveloperName, getCompoundName } from '@/lib/image-helpers';

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const property = await getPropertyById(resolvedParams.id);

  if (!property) {
    notFound();
  }

  const suggestedPropertiesData = await getProperties({
    location: property.location?.slug,
    page_size: 3,
  });

  const suggestedProperties = suggestedPropertiesData.results.filter(p => p.id !== property.id);

  const whatsappMessage = `Hello, I'm interested in the property "${property.title}" located at ${getLocationName(property.location)}. Could you please provide more information?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;

  const galleryImages = [
    getImageUrl(property.main_image, getPlaceholderImage('property')),
    ...property.gallery_images.map(img => getImageUrl(img.image, getPlaceholderImage('property')))
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header Gallery Section */}
      <section className="pt-24 md:pt-32 px-4 md:px-8 max-w-[1600px] mx-auto">
        <PropertyImageGallery images={galleryImages} title={property.title} />
      </section>

      {/* Narrative & Sidebar Content */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: Narrative & Amenities */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Architectural Narrative */}
            <div>
              <span className="text-secondary font-black tracking-[0.4em] uppercase text-[10px] mb-8 block">Architectural Narrative</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <h2 className="font-headline text-5xl font-black tracking-tighter leading-[0.9]">
                   Where raw tectonic power meets the <i className="font-medium text-emerald-800">serenity of the sky.</i>
                 </h2>
                 <div 
                    className="font-body text-muted-foreground/90 text-lg leading-relaxed space-y-6"
                    dangerouslySetInnerHTML={{ __html: property.description }}
                 />
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {[
                 { label: 'Bedrooms', value: property.bedrooms, icon: BedDouble },
                 { label: 'Bathrooms', value: property.bathrooms, icon: Bath },
                 { label: 'Private Pool', value: 'Private', icon: Zap },
                 { label: 'Smart Automation', value: 'Smart', icon: Rocket }
               ].map((item, idx) => (
                 <div key={idx} className="bg-surface-container-low rounded-[2rem] p-8 text-center border border-white/50 group hover:bg-white hover:shadow-xl transition-all duration-500">
                    <item.icon className="w-8 h-8 mx-auto mb-6 text-primary group-hover:scale-110 transition-transform" />
                    <p className="font-headline text-2xl font-black mb-1">{item.value}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{item.label}</p>
                 </div>
               ))}
            </div>

            {/* Map Placeholder Context */}
            <div className="space-y-8">
               <div className="flex justify-between items-end">
                 <h3 className="font-headline text-3xl font-black tracking-tighter">Location Context</h3>
                 <span className="text-primary font-black uppercase tracking-widest text-[9px]">{getLocationName(property.location)}, District 5</span>
               </div>
               <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-slate-200 relative grayscale hover:grayscale-0 transition-all duration-1000">
                  <Image 
                    src={property.map_image ? getImageUrl(property.map_image) : "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000"} 
                    alt="Map" 
                    fill 
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                      <MapPin className="text-white w-6 h-6" />
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Column: Listing Card Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-6">
              <Card className="rounded-[3rem] bg-[#F2F2F2] border-none p-10 space-y-10 shadow-[0_40px_80px_rgba(0,0,0,0.06)]">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Listing Price</p>
                    <p className="font-headline text-5xl font-black tracking-tight text-primary">
                      {parseInt(property.price) / 1000000}M <span className="text-xl">EGP</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Footprint</p>
                    <p className="font-headline text-3xl font-black tracking-tight">{property.area}sqm</p>
                  </div>
                </div>

                <ul className="space-y-5">
                  {[
                    'Fully furnished with bespoke Italian imports',
                    'Energy-neutral solar glass facade',
                    'Exclusive 24/7 Season Concierge access'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-4 text-xs font-body font-medium text-on-surface/80">
                      <div className="bg-primary/10 rounded-full p-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="space-y-4">
                  <Button className="w-full h-16 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    Schedule a Private Tour
                  </Button>
                  <Button variant="outline" className="w-full h-16 rounded-2xl border-primary/20 bg-white/50 text-primary font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all">
                    Download Brochure
                  </Button>
                </div>

                <div className="pt-6 border-t border-black/5 flex items-center gap-5">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-headline text-sm font-black tracking-tight">Alexander Vance</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Managing Partner • Elite Assets</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full bg-black/5">
                    <Info className="w-5 h-5 text-primary" />
                  </Button>
                </div>
              </Card>

              {/* Trust Badges */}
              <div className="flex gap-4 px-4 overflow-x-auto pb-4 no-scrollbar">
                <Badge variant="outline" className="rounded-full px-5 py-2 whitespace-nowrap bg-white/50 border-white font-black uppercase tracking-widest text-[8px] flex items-center gap-2">
                  <ShieldCheck className="w-3 h-3 text-secondary" />
                  Verified Listing
                </Badge>
                <Badge variant="outline" className="rounded-full px-5 py-2 whitespace-nowrap bg-white/50 border-white font-black uppercase tracking-widest text-[8px] flex items-center gap-2">
                   <Zap className="w-3 h-3 text-emerald-600" />
                   New Launch
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Palette Section */}
      <ExperienceThePalette />
      
      {/* Relational Curation Section */}
      {suggestedProperties.length > 0 && (
        <section className="py-32 px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-xl">
              <span className="text-secondary font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Relational Curation</span>
              <h2 className="font-headline text-5xl md:text-6xl font-black tracking-tighter leading-none">Related Enclaves</h2>
            </div>
            <Link href="/search">
              <Button variant="outline" className="rounded-full border-primary/20 px-8 py-6 font-black uppercase tracking-widest text-[9px]">
                Explore Entire Collection
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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