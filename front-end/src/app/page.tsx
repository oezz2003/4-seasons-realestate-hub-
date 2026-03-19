import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import { Award, Building2, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { AnimatedStats } from "@/components/animated-stats";
import { LocationsMap } from "@/components/locations-map";
import { GridMotion } from "@/components/grid-motion";
import { getPartners, getNewLaunches, getFeaturedProperties, getTestimonials, getProperties, getCompounds, getDevelopers } from "@/lib/api";
import { getImageUrl, getPlaceholderImage } from "@/lib/image-helpers";

// We'll dynamically populate hero items in the component

export default async function Home() {
  // Fetch real data from API
  const [partnersData, newLaunchesData, featuredPropertiesData, testimonialsData, statsData] = await Promise.all([
    getPartners(),
    getNewLaunches(),
    getFeaturedProperties(),
    getTestimonials(),
    Promise.all([
      getProperties({}, true),  // Use admin API
      getCompounds({}, true),   // Use admin API
      getDevelopers({}, true),  // Use admin API
      getTestimonials()
    ])
  ]);

  // Calculate stats
  const stats = {
    properties: statsData[0].count,
    compounds: statsData[1].count,
    developers: statsData[2].count,
    clients: statsData[3].count,
  };

  // Dynamically generate hero image items from properties
  const allProperties = [...featuredPropertiesData.results, ...newLaunchesData.results];
  const propertyImages = allProperties
    .map(p => getImageUrl(p.main_image))
    .filter(Boolean);
  
  // Mix in some text items and ensure we have enough items for GridMotion
  const heroItems = propertyImages.flatMap((img, idx) => [
    img,
    <div key={`hero-text-${idx}`} className="p-4 text-center font-headline font-bold">
      {allProperties[idx]?.title || 'Premium Property'}
    </div>
  ]);

  // If we have no images, use a default fallback
  if (heroItems.length === 0) {
    heroItems.push(getPlaceholderImage('property'));
    heroItems.push(<div key="hero-fallback" className="p-4 text-center">Luxury Real Estate</div>);
  }

  return (
    // The negative margin-top pulls the hero section up to sit behind the transparent sticky header.
    // Header height: h-16 (64px) + py-2 (16px) = 80px
    <div className="flex flex-col -mt-[80px]">
      <section className="relative h-screen w-full">
        <GridMotion items={heroItems} />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white bg-black/50 pointer-events-none">
          <div className="overflow-hidden py-1">
            <h1 className="text-4xl md:text-6xl font-bold font-headline animate-title-reveal">
              Find Your Home for Every Season
            </h1>
          </div>
          <div className="overflow-hidden py-1">
            <p className="text-lg md:text-xl max-w-2xl mt-4 animate-title-reveal" style={{ animationDelay: '0.1s' }}>
              Discover premier properties tailored to your lifestyle.
            </p>
          </div>
          <div className="mt-8 animate-fade-in-up pointer-events-auto" style={{ animationDelay: '0.2s' }}>
            <Link href="/search">
              <Button size="lg">Start Your Search</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="overflow-hidden py-1">
              <h2 className="text-3xl font-bold font-headline animate-title-reveal">Our Esteemed Partners</h2>
            </div>
            <div className="overflow-hidden py-1">
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>
                We collaborate with the leading names in real estate to bring you the most exclusive and prestigious properties in Egypt.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12 items-center justify-items-center">
            {partnersData.results.map((partner, index) => (
              <div key={partner.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                <Image
                  src={getImageUrl(partner.logo, getPlaceholderImage('partner'))}
                  alt={`${partner.name} logo`}
                  width={150}
                  height={80}
                  className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedStats stats={stats} />

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="overflow-hidden py-1">
              <h2 className="text-3xl font-bold font-headline animate-title-reveal">Latest Launches</h2>
            </div>
            <div className="overflow-hidden py-1">
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>
                Be the first to explore the newest and most exciting projects on the market.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newLaunchesData.results.slice(0, 3).map((property, index) => (
              <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <PropertyCard
                  id={property.id}
                  title={property.title}
                  main_image={property.main_image}
                  price={property.price}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area}
                  location={property.location || "Unknown Location"}
                  property_type={property.property_type}
                  is_featured={property.is_featured}
                  is_new_launch={property.is_new_launch}
                  compound={property.compound}
                  developer={property.developer}
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/new-launches" passHref>
              <Button size="lg" variant="outline">
                View All New Launches
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-primary/10">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden py-1 text-center">
            <h2 className="text-3xl font-bold mb-10 font-headline animate-title-reveal">Featured Properties</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPropertiesData.results.slice(0, 3).map((property, index) => (
              <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <PropertyCard
                  id={property.id}
                  title={property.title}
                  main_image={property.main_image}
                  price={property.price}
                  bedrooms={property.bedrooms}
                  bathrooms={property.bathrooms}
                  area={property.area}
                  location={property.location || "Unknown Location"}
                  property_type={property.property_type}
                  is_featured={property.is_featured}
                  is_new_launch={property.is_new_launch}
                  compound={property.compound}
                  developer={property.developer}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="overflow-hidden py-1">
            <h2 className="text-3xl font-bold mb-10 font-headline animate-title-reveal">Why Choose 4 Seasons?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <Card className="text-center p-6 border-2 border-transparent hover:border-primary hover:shadow-lg transition-all h-full">
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Award className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Expert Agents</h3>
                  <p className="text-muted-foreground">Our team of experienced agents is dedicated to finding you the perfect property.</p>
                </CardContent>
              </Card>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Card className="text-center p-6 border-2 border-transparent hover:border-primary hover:shadow-lg transition-all h-full">
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Building2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Vast Portfolio</h3>
                  <p className="text-muted-foreground">We offer a wide range of properties, from luxury villas to modern apartments.</p>
                </CardContent>
              </Card>
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Card className="text-center p-6 border-2 border-transparent hover:border-primary hover:shadow-lg transition-all h-full">
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Users className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-headline">Trusted by Many</h3>
                  <p className="text-muted-foreground">Join thousands of satisfied clients who found their dream homes with us.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <LocationsMap />

      <section className="py-12 md:py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="overflow-hidden py-1">
            <h2 className="text-3xl font-bold mb-10 font-headline animate-title-reveal">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonialsData.results.slice(0, 2).map((testimonial, index) => (
              <div key={testimonial.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Card className="text-left">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar>
                        <AvatarImage
                          src={getImageUrl(testimonial.client_photo, getPlaceholderImage('author'))}
                          alt={testimonial.client_name}
                        />
                        <AvatarFallback>{testimonial.client_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-bold">{testimonial.client_name}</p>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground italic">"{testimonial.testimonial_text}"</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="overflow-hidden py-1">
            <h2 className="text-3xl font-bold mb-4 font-headline animate-title-reveal">Ready to Find Your Home?</h2>
          </div>
          <div className="overflow-hidden py-1">
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>Let's get started. Browse our listings or get in touch with an agent today.</p>
          </div>
          <Link href="/search" passHref>
            <Button size="lg">
              Search Properties
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}