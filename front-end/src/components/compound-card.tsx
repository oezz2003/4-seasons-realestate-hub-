import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building } from "lucide-react";

type CompoundCardProps = {
  id: string;
  name: string;
  image: string;
  imageHint: string;
  location: string;
  developer: string;
};

export function CompoundCard({ id, name, image, imageHint, location, developer }: CompoundCardProps) {
  return (
    <Link href={`/compounds/${id}`} className="group h-full flex">
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col w-full group-hover:border-primary">
        <CardHeader className="p-0">
          <div className="relative h-56 w-full">
            <Image
              src={image}
              alt={`Image of ${name}`}
              data-ai-hint={imageHint}
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl font-bold font-headline mb-3">{name}</CardTitle>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{location}</span>
            </div>
            <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-primary" />
                <span>By {developer}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
