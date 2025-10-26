import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getNewLaunches } from "@/lib/api";

export default async function NewLaunchesPage() {
  const newLaunchesData = await getNewLaunches();

  return (
    <div className="container mx-auto py-12 px-4 md:py-20">
      <div className="text-center mb-12">
        <div className="overflow-hidden py-1">
          <h1 className="text-4xl font-bold font-headline animate-title-reveal">New Launches</h1>
        </div>
        <div className="overflow-hidden py-1">
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>
            Discover the latest and most promising real estate projects. Be the first to invest in the future of luxury living.
          </p>
        </div>
        <div className="overflow-hidden py-1">
          <p className="mt-2 text-sm text-muted-foreground animate-title-reveal" style={{ animationDelay: '0.2s' }}>
            Showing {newLaunchesData.count} new properties
          </p>
        </div>
      </div>

      {newLaunchesData.results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newLaunchesData.results.map((property, index) => (
            <div key={property.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
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
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold font-headline mb-4">No New Launches Available</h2>
          <p className="text-muted-foreground mb-8">Check back soon for exciting new projects!</p>
          <Link href="/search">
            <Button size="lg">Browse All Properties</Button>
          </Link>
        </div>
      )}
    </div>
  );
}