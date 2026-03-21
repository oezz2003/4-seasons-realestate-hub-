import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import { Award, Building2, Users, Star, MapPin, Search, ArrowRight, Home as HomeIcon, CheckCircle2, Calendar, Sparkles, Map } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { AnimatedStats } from "@/components/animated-stats";
import { LocationsMap } from "@/components/locations-map";
import { getPartners, getNewLaunches, getFeaturedProperties, getTestimonials, getProperties, getCompounds, getDevelopers } from "@/lib/api";
import { getImageUrl, getPlaceholderImage } from "@/lib/image-helpers";

export default async function Home() {
  // Fetch real data from API
  const [partnersData, newLaunchesData, featuredPropertiesData, testimonialsData, statsData] = await Promise.all([
    getPartners(),
    getNewLaunches(),
    getFeaturedProperties(),
    getTestimonials(),
    Promise.all([
      getProperties({}, true),
      getCompounds({}, true),
      getDevelopers({}, true),
      getTestimonials()
    ])
  ]);

  const stats = {
    properties: statsData[0].count,
    compounds: statsData[1].count,
    developers: statsData[2].count,
    clients: statsData[3].count,
  };

  const heroProperty = featuredPropertiesData.results[0] || newLaunchesData.results[0];
  const sideProperty = featuredPropertiesData.results[1] || newLaunchesData.results[1];

  return (
    <div className="flex flex-col -mt-[80px]">
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-32 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="col-span-1 md:col-span-12 lg:col-span-8 relative group overflow-hidden rounded-[2rem] md:rounded-[3rem]">
            <div className="aspect-[4/3] md:aspect-auto md:h-[600px] relative overflow-hidden">
              <Image 
                src={getImageUrl(heroProperty?.main_image, getPlaceholderImage('property'))}
                alt={heroProperty?.title || "Luxury Villa"}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12">
                <span className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4 inline-block backdrop-blur-md">
                  Summer Selection
                </span>
                <h1 className="font-headline text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-2">
                  Living<br/>Panorama
                </h1>
              </div>
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-12 lg:col-span-4 flex flex-col gap-6 h-full">
            <div className="bg-secondary-container p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] editorial-shadow flex flex-col justify-center h-full min-h-[300px]">
              <h2 className="font-headline text-3xl font-bold text-on-secondary-container mb-4 tracking-tight">Escape to the Coast</h2>
              <p className="text-on-secondary-container/70 mb-8 leading-relaxed font-body">
                Discover exclusive retreats in North Coast and El Gouna, curated for the discerning traveler.
              </p>
              <Link href="/search?location=North%20Coast">
                <button className="flex items-center gap-2 font-black text-secondary group text-sm tracking-widest uppercase">
                  Explore Shorelines 
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
            
            <div className="hidden lg:block relative h-full min-h-[250px] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src={getImageUrl(sideProperty?.main_image, getPlaceholderImage('property'))}
                alt="Interior Luxury"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        <div className="mt-[-40px] relative z-20 max-w-5xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-2xl p-3 md:p-4 rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.12)] flex flex-wrap md:flex-nowrap items-center gap-2 border border-white/20">
            <div className="flex-1 px-4 md:px-8 flex items-center gap-4 border-r border-slate-100 min-w-[200px]">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Location</span>
                <input 
                  className="w-full border-none focus:ring-0 text-on-surface font-bold placeholder:text-slate-300 p-0 bg-transparent text-sm h-6" 
                  placeholder="Where in Egypt?" 
                  type="text"
                />
              </div>
            </div>
            
            <div className="flex-1 px-4 md:px-8 flex items-center gap-4 border-r border-slate-100 min-w-[150px] hidden md:flex">
              <HomeIcon className="w-5 h-5 text-primary shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Typology</span>
                <select className="w-full border-none focus:ring-0 text-on-surface font-bold p-0 bg-transparent text-sm h-6 appearance-none">
                  <option>Any Type</option>
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Chalet</option>
                </select>
              </div>
            </div>

            <Link href="/search" className="w-full md:w-auto">
              <button className="w-full md:w-auto bg-primary text-on-primary px-8 md:px-12 py-4 rounded-full font-black hover:bg-primary-dim transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/20 scale-95 hover:scale-100 active:scale-90 duration-200 uppercase tracking-widest text-xs">
                <Search className="w-4 h-4" /> 
                Search
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Partners Section */}
      <section className="bg-surface py-20 border-y border-slate-100">
        <div className="container mx-auto px-8">
          <p className="font-label text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground/60 mb-12 font-bold">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
            {['EMAAR', 'SODIC', 'ORASCOM', 'PALM HILLS', 'TMG'].map((name) => (
              <span key={name} className="font-headline text-2xl md:text-3xl font-black tracking-tighter">{name}</span>
            ))}
          </div>
        </div>
      </section>

      <AnimatedStats stats={stats} />

      <section className="py-24 md:py-32 bg-surface-lowest">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-4">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] block">Curated Selection</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter">Latest Launches</h2>
            </div>
            <Link href="/new-launches" passHref>
              <Button variant="ghost" className="h-14 px-8 rounded-xl text-primary font-black hover:bg-primary/5 transition-all text-[10px] tracking-[0.2em] uppercase group">
                View Archive <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {newLaunchesData.results.slice(0, 3).map((property, index) => (
              <div key={property.id} className="animate-fade-in-up h-full" style={{ animationDelay: `${index * 0.1}s` }}>
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

      <section className="py-24 md:py-32 bg-background relative">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] block">Curation</span>
              <h2 className="font-headline text-4xl md:text-5xl font-black tracking-tighter mt-2">Featured Enclaves</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {featuredPropertiesData.results.slice(0, 3).map((property, index) => (
              <div key={property.id} className="animate-fade-in-up h-full" style={{ animationDelay: `${index * 0.1}s` }}>
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

      {/* Value Proposition */}
      <section className="py-32 max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="aspect-square bg-surface-container-highest rounded-[3rem] overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Concierge Service"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-primary text-on-primary p-12 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.2)] max-w-xs hidden md:block backdrop-[5px] animate-fade-in-up">
              <CheckCircle2 className="w-12 h-12 mb-6" />
              <h4 className="text-2xl font-headline font-black mb-3">The Gold Standard</h4>
              <p className="text-sm opacity-80 leading-relaxed font-body">Every property in our portfolio undergoes a 4-point seasonal inspection to ensure year-round luxury.</p>
            </div>
          </div>
          <div>
            <span className="text-secondary font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Our Philosophy</span>
            <h2 className="font-headline text-5xl md:text-6xl font-black tracking-tighter mb-12">The 4 Seasons Standard</h2>
            <div className="space-y-10">
              <div className="flex gap-6 items-start group">
                <div className="bg-primary-container text-primary p-5 rounded-2xl shrink-0 transition-transform group-hover:scale-110">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-2 tracking-tight">Year-Round Suitability</h4>
                  <p className="text-muted-foreground/80 leading-relaxed font-body">We curate homes that offer peak comfort regardless of the season, from summer sea breezes to winter warmth.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start group">
                <div className="bg-secondary-container text-secondary p-5 rounded-2xl shrink-0 transition-transform group-hover:scale-110">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-2 tracking-tight">Bespoke Concierge</h4>
                  <p className="text-muted-foreground/80 leading-relaxed font-body">Our service doesn&apos;t end at the sale. Enjoy lifetime access to seasonal maintenance and relocation support.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start group">
                <div className="bg-tertiary-container text-tertiary p-5 rounded-2xl shrink-0 transition-transform group-hover:scale-110">
                  <Map className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-2 tracking-tight">Strategic Locations</h4>
                  <p className="text-muted-foreground/80 leading-relaxed font-body">Only the most promising investment corridors in Egypt make it into our &quot;Hub&quot; collection.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LocationsMap />

      <section className="py-24 md:py-40 bg-background relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="flex flex-col mb-24 items-center text-center">
            <span className="text-secondary font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">Perspectives</span>
            <h2 className="font-headline text-5xl md:text-7xl font-black tracking-tighter leading-[0.85]">Client<br/>Narratives</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
            {testimonialsData.results.slice(0, 2).map((testimonial, index) => (
              <div key={testimonial.id} className="animate-fade-in-up group" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative p-12 rounded-[3rem] bg-surface-container-low/50 backdrop-blur-xl border border-slate-100 dark:border-slate-800 editorial-shadow transition-transform hover:-translate-y-2 duration-500">
                  <div className="font-headline text-8xl absolute -top-10 -left-6 text-primary/10 select-none">“</div>
                  <p className="text-xl md:text-2xl font-body font-medium leading-[1.6] mb-12 text-on-surface/80 relative z-10">
                    {testimonial.testimonial_text}
                  </p>
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16 grayscale group-hover:grayscale-0 transition-all duration-700">
                      <AvatarImage
                        src={getImageUrl(testimonial.client_photo, getPlaceholderImage('author'))}
                        alt={testimonial.client_name}
                      />
                      <AvatarFallback>{testimonial.client_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-6">
                      <p className="font-headline text-lg font-black tracking-tight">{testimonial.client_name}</p>
                      <div className="flex text-secondary mt-1 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-32 px-8">
        <div className="max-w-7xl mx-auto rounded-[4rem] bg-primary p-20 md:p-32 text-center text-on-primary overflow-hidden relative shadow-[0_50px_100px_rgba(0,99,131,0.3)]">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-12">
            <div className="space-y-6">
              <span className="text-on-primary/60 font-bold tracking-[0.5em] uppercase text-[10px] block">The Hub Collection</span>
              <h2 className="font-headline text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter">Your Legacy<br/>Starts Here</h2>
            </div>
            <p className="text-xl md:text-2xl text-on-primary/80 font-body font-medium max-w-2xl mx-auto leading-relaxed">
              Experience the pinnacle of Egyptian luxury real estate. Join the 4 Seasons Hub community today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
              <Link href="/search" passHref>
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-black h-20 px-12 rounded-full text-sm tracking-[0.2em] uppercase shadow-2xl transition-all hover:scale-105 active:scale-95">
                  Explore Enclaves
                </Button>
              </Link>
              <Link href="/contact" passHref>
                <Button size="lg" variant="outline" className="h-20 px-12 rounded-full border-white/20 text-white hover:bg-white/10 hover:border-white/40 font-black text-sm tracking-[0.2em] uppercase transition-all backdrop-blur-md">
                  Establish Dialogue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}