import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Award } from "lucide-react";
import { getDevelopers } from "@/lib/api";
import { getImageUrl, getPlaceholderImage } from "@/lib/image-helpers";

export default async function DevelopersPage() {
  const developersData = await getDevelopers();

  return (
    <div className="container mx-auto py-12 px-4 md:py-20">
      <div className="text-center mb-12">
        <div className="overflow-hidden py-1">
          <h1 className="text-4xl font-bold font-headline animate-title-reveal">Our Developers</h1>
        </div>
        <div className="overflow-hidden py-1">
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>
            Partnering with Egypt's most trusted and innovative real estate developers to bring you exceptional properties.
          </p>
        </div>
        <div className="overflow-hidden py-1">
          <p className="mt-2 text-sm text-muted-foreground animate-title-reveal" style={{ animationDelay: '0.2s' }}>
            {developersData.count} developers in our network
          </p>
        </div>
      </div>

      {developersData.results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developersData.results.map((developer, index) => (
            <div key={developer.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + 0.2}s` }}>
              <Link href={`/developers/${developer.id}`} className="group">
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:border-primary h-full">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={getImageUrl(developer.logo, getPlaceholderImage('developer'))}
                        alt={`${developer.name} logo`}
                        fill
                        className="object-contain p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-xl font-bold font-headline mb-2 group-hover:text-primary transition-colors">
                      {developer.name}
                    </CardTitle>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        {developer.projects_count} Projects
                      </span>
                    </div>

                    <div 
                      className="text-sm text-muted-foreground line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: developer.description.length > 150 
                          ? developer.description.substring(0, 150) + '...' 
                          : developer.description 
                      }}
                    />
                  </CardContent>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold font-headline mb-4">No Developers Available</h2>
          <p className="text-muted-foreground">Check back soon for developer information!</p>
        </div>
      )}
    </div>
  );
}