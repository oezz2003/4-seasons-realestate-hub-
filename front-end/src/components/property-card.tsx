import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, Bath, AreaChart, Star, Rocket } from "lucide-react";
import { getImageUrl, getPlaceholderImage, formatPrice, getLocationName } from "@/lib/image-helpers";
import { Property } from "@/lib/types";

interface PropertyCardProps {
  id: number;
  title: string;
  image?: string;
  main_image?: string; // From API
  imageHint?: string;
  price: string | number;
  beds?: number;
  bedrooms?: number; // From API
  baths?: number;
  bathrooms?: number; // From API
  area: number;
  location: string | { name: string } | null; // Handle both
  property_type?: string; // From API
  is_featured?: boolean; // From API
  is_new_launch?: boolean; // From API
  compound?: { name: string } | null; // From API
  developer?: { name: string } | null; // From API
}

export function PropertyCard(props: PropertyCardProps) {
  const imageUrl = getImageUrl(
    props.main_image || props.image,
    getPlaceholderImage('property')
  );

  const beds = props.bedrooms || props.beds || 0;
  const baths = props.bathrooms || props.baths || 0;
  const locationName = getLocationName(props.location);
  const formattedPrice = formatPrice(props.price);

  return (
    <Link href={`/properties/${props.id}`} className="group h-full flex">
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col w-full group-hover:border-primary">
        <CardHeader className="p-0 relative">
          <div className="relative h-56 w-full">
            <Image
              src={imageUrl}
              alt={`Image of ${props.title}`}
              data-ai-hint={props.imageHint || 'property image'}
              fill
              className="object-cover"
            />
          </div>

          {/* Feature badges */}
          <div className="absolute top-2 left-2 flex gap-1">
            {props.is_featured && (
              <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {props.is_new_launch && (
              <Badge variant="default" className="text-xs bg-blue-500 text-white">
                <Rocket className="h-3 w-3 mr-1" />
                New Launch
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-grow">
          <div className="flex flex-col gap-2 mb-2">
            <Badge variant="secondary" className="w-fit">{locationName}</Badge>
            {props.property_type && (
              <Badge variant="outline" className="w-fit text-xs">{props.property_type}</Badge>
            )}
          </div>

          <CardTitle className="text-xl font-bold font-headline mb-2">{props.title}</CardTitle>

          {/* Show compound or developer info if available */}
          {(props.compound || props.developer) && (
            <div className="text-sm text-muted-foreground mb-2">
              {props.compound && (
                <p className="truncate">Compound: {props.compound.name}</p>
              )}
              {props.developer && (
                <p className="truncate">Developer: {props.developer.name}</p>
              )}
            </div>
          )}

          <p className="text-2xl font-bold text-primary mb-4">{formattedPrice}</p>
        </CardContent>

        <CardFooter className="p-4 bg-primary/5 flex justify-between text-sm text-muted-foreground mt-auto">
          <div className="flex items-center gap-1">
            <BedDouble className="w-4 h-4 text-primary" />
            <span>{beds} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-primary" />
            <span>{baths} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <AreaChart className="w-4 h-4 text-primary" />
            <span>{props.area} m²</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
