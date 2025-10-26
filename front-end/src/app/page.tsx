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

// Mock data for hero items (static content)
const heroItems = [
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600&h=400&fit=crop',
  <div key='hero-1' className="p-4 text-center">Modern Villas</div>,
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&h=400&fit=crop',
  <div key='hero-2' className="p-4 text-center">Luxury Penthouses</div>,
  'https://images.unsplash.com/photo-1560518883-ce09059ee41f?q=80&w=600&h=400&fit=crop',
  <div key='hero-3' className="p-4 text-center">Family Homes</div>,
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&h=400&fit=crop',
  <div key='hero-4' className="p-4 text-center">Coastal Properties</div>,
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&h=400&fit=crop',
  <div key='hero-5' className="p-4 text-center">Oceanfront Views</div>,
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=600&h=400&fit=crop',
  <div key='hero-6' className="p-4 text-center">City Apartments</div>,
  'https://images.unsplash.com/photo-1598228723793-52759bba239c?q=80&w=600&h=400&fit=crop',
  <div key='hero-7' className="p-4 text-center">Your Dream Home Awaits</div>,
  'https://images.unsplash.com/photo-1628744448845-934414849a62?q=80&w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=600&h=400&fit=crop',
  <div key='hero-8' className="p-4 text-center">Find Your Space</div>,
  'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1605276374104-5de67d609240?q=80&w=600&h=400&fit=crop',
  <div key='hero-9' className="p-4 text-center">Invest in a Lifestyle</div>,
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=600&h=400&fit=crop',
  <div key='hero-10' className="p-4 text-center">Modern Designs</div>,
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=600&h=400&fit=crop',
  <div key='hero-11' className="p-4 text-center">Premium Locations</div>,
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1600585152225-3579fe9d090b?q=80&w=600&h=400&fit=crop',
  <div key='hero-12' className="p-4 text-center">Exclusive Compounds</div>,
];

export default async function Home() {
  // Fetch real data from API
  const [partnersData, newLaunchesData, featuredPropertiesData, testimonialsData, statsData] = await Promise.all([
    getPartners(),
    getNewLaunches(),
    getFeaturedProperties(),
    getTestimonials(),
    Promise.all([
      getProperties({}),
      getCompounds({}),
      getDevelopers({}),
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
            {partnersData.results.length > 0 ? (
              partnersData.results.map((partner, index) => (
                <div key={partner.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <Image
                    src={getImageUrl(partner.logo, getPlaceholderImage('partner'))}
                    alt={`${partner.name} logo`}
                    width={150}
                    height={80}
                    className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                  />
                </div>
              ))
            ) : (
              // Fallback to mock data if API fails
              [
                { name: 'Emaar Misr', logo: 'https://images.unsplash.com/photo-1611108018339-b7b5391c6e43?w=150&h=80&fit=crop' },
                { name: 'SODIC', logo: 'https://images.unsplash.com/photo-1628587930559-456cb3f101a3?w=150&h=80&fit=crop' },
                { name: 'Palm Hills', logo: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=150&h=80&fit=crop' },
                { name: 'Mountain View', logo: 'https://images.unsplash.com/photo-1609342122563-a43ac8917a3a?w=150&h=80&fit=crop' },
                { name: 'Tatweer Misr', logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=150&h=80&fit=crop' },
                { name: 'Orascom Development', logo: 'https://images.unsplash.com/photo-1618331835718-404a732c3ee7?w=150&h=80&fit=crop' },
              ].map((partner, index) => (
                <div key={partner.name} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <Image
                    src={partner.logo}
                    alt={`${partner.name} logo`}
                    width={150}
                    height={80}
                    className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                  />
                </div>
              ))
            )}
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
            {newLaunchesData.results.length > 0 ? (
              newLaunchesData.results.slice(0, 3).map((property, index) => (
                <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PropertyCard
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
                </div>
              ))
            ) : (
              // Fallback to mock data
              [
                {
                  id: 4,
                  title: "Future Towers",
                  image: "https://images.unsplash.com/photo-1542317852-614a9388e436?q=80&w=600&h=400&fit=crop",
                  imageHint: "futuristic skyscraper",
                  price: "Starts at 980,000",
                  beds: 2,
                  baths: 2,
                  area: 120,
                  location: "Innovation District",
                },
                {
                  id: 8,
                  title: "Azure Sands",
                  image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=600&h=400&fit=crop",
                  imageHint: "beach resort pool",
                  price: "Starts at 2,800,000",
                  beds: 3,
                  baths: 2,
                  area: 175,
                  location: "North Coast",
                },
                {
                  id: 6,
                  title: "The Pinnacle",
                  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600&h=400&fit=crop",
                  imageHint: "luxury penthouse view",
                  price: "Starts at 4,200,000",
                  beds: 3,
                  baths: 4,
                  area: 280,
                  location: "Summit Hills",
                },
              ].map((property, index) => (
                <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PropertyCard {...property} />
                </div>
              ))
            )}
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
            <h2 className="text-3xl font-bold mb-10 font-headline animate-title-reveal">Top Compounds</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPropertiesData.results.length > 0 ? (
              featuredPropertiesData.results.slice(0, 3).map((property, index) => (
                <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PropertyCard
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
                </div>
              ))
            ) : (
              // Fallback to mock data
              [
                {
                  id: 1,
                  title: "Skyline Residences",
                  image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&h=400&fit=crop",
                  imageHint: "modern apartment building",
                  price: "1,200,000",
                  beds: 3,
                  baths: 2,
                  area: 150,
                  location: "Downtown",
                },
                {
                  id: 2,
                  title: "Oceanview Villas",
                  image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600&h=400&fit=crop",
                  imageHint: "luxury villa ocean",
                  price: "3,500,000",
                  beds: 5,
                  baths: 4,
                  area: 320,
                  location: "Coastal Route",
                },
                {
                  id: 3,
                  title: "The Green Meadows",
                  image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=600&h=400&fit=crop",
                  imageHint: "suburban house garden",
                  price: "850,000",
                  beds: 4,
                  baths: 3,
                  area: 210,
                  location: "Green Valley",
                },
              ].map((property, index) => (
                <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <PropertyCard {...property} />
                </div>
              ))
            )}
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
            {testimonialsData.results.length > 0 ? (
              testimonialsData.results.slice(0, 2).map((testimonial, index) => (
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
              ))
            ) : (
              // Fallback to mock data
              [
                {
                  name: "Ahmed Saleh",
                  text: "The team at 4 Seasons was incredibly professional and helpful. They made the process of buying my new apartment seamless and stress-free. Highly recommended!",
                  image: "https://images.unsplash.com/photo-1557862921-37829c790f19?q=80&w=100&h=100&fit=crop"
                },
                {
                  name: "Fatima Mostafa",
                  text: "I sold my property through them and got a fantastic price. Their market knowledge is top-notch, and they handled everything from A to Z. Thank you!",
                  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&h=100&fit=crop"
                }
              ].map((testimonial, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card className="text-left">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <Avatar>
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <p className="font-bold">{testimonial.name}</p>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
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