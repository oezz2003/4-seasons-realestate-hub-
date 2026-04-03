"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BedDouble, Bath, AreaChart, Star, Rocket, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrl, getPlaceholderImage, formatPrice, getLocationName } from "@/lib/image-helpers";
import { Property } from "@/lib/types";
import { WhatsAppButton } from "./whats-app-button";

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
  const [isSaved, setIsSaved] = useState(false);
  
  const imageUrl = getImageUrl(
    props.main_image || props.image,
    getPlaceholderImage('property')
  );

  const beds = props.bedrooms || props.beds || 0;
  const baths = props.bathrooms || props.baths || 0;
  const locationName = getLocationName(props.location);
  const formattedPrice = formatPrice(props.price);

  return (
    <Card className="group h-full overflow-hidden border-none shadow-xl shadow-black/5 bg-card flex flex-col transition-all duration-500 hover:shadow-2xl">
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={`Image of ${props.title}`}
          fill
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {props.is_featured ? (
            <Badge className="bg-[#005F73]/90 text-white border-none text-[10px] font-bold tracking-widest px-3 py-1 rounded-sm uppercase">
              Featured Collection
            </Badge>
          ) : props.is_new_launch ? (
            <Badge className="bg-[#005F73]/90 text-white border-none text-[10px] font-bold tracking-widest px-3 py-1 rounded-sm uppercase">
              New Arrival
            </Badge>
          ) : null}
        </div>

        {/* WhatsApp Button */}
        <WhatsAppButton
          variant="icon"
          message={`Hello, I'm interested in "${props.title}" in ${locationName}.`}
          className="absolute top-4 right-16 z-20"
        />

        {/* Save Toggle */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsSaved(!isSaved);
          }}
          className={cn(
            "absolute top-4 right-4 z-20 p-2.5 rounded-full backdrop-blur-md transition-all duration-300",
            isSaved ? "bg-primary text-white" : "bg-black/20 text-white hover:bg-black/40"
          )}
        >
          <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
        </button>

        {/* Floating Title Pill */}
        <div className="absolute bottom-6 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
             {/* We can show it always or on hover based on design, but screenshot shows it visible */}
        </div>
        
        <div className="absolute bottom-6 left-4">
          <div className="bg-background/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg dark:bg-card/90">
             <span className="text-secondary text-sm font-bold tracking-tight">{props.title}</span>
          </div>
        </div>
      </div>

      <CardContent className="p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <MapPin className="w-3.5 h-3.5 text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{locationName}</span>
          </div>
          <div className="text-xl font-bold text-[#005F73] tracking-tighter">
            {formattedPrice}
          </div>
        </div>

        {/* Info Grid - 3 Boxes */}
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-surface-container-low rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 border border-black/5 dark:border-white/5 hover:border-primary/20 transition-colors">
              <BedDouble className="w-4 h-4 text-secondary/40" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{beds} Beds</span>
           </div>
           <div className="bg-surface-container-low rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 border border-black/5 dark:border-white/5 hover:border-primary/20 transition-colors">
              <Bath className="w-4 h-4 text-secondary/40" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{baths} Baths</span>
           </div>
           <div className="bg-surface-container-low rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 border border-black/5 dark:border-white/5 hover:border-primary/20 transition-colors">
              <AreaChart className="w-4 h-4 text-secondary/40" />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{props.area} sqm</span>
           </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Link href={`/properties/${props.id}`} className="w-full">
          <Button className="w-full bg-[#111827] hover:bg-black text-white text-xs font-bold uppercase tracking-[0.2em] py-6 rounded-xl transition-all duration-300">
            View Property Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
