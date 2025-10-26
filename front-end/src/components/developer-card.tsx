import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Building } from "lucide-react";
import { Button } from "./ui/button";

type DeveloperCardProps = {
  id: string;
  name: string;
  logo: string;
  logoHint: string;
  description: string;
  projectsCount: number;
};

export function DeveloperCard({ id, name, logo, logoHint, description, projectsCount }: DeveloperCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col w-full h-full group hover:border-primary">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={logo}
          alt={`${name} Logo`}
          data-ai-hint={logoHint}
          width={80}
          height={80}
          className="rounded-lg object-contain border p-1"
        />
        <div>
          <CardTitle className="text-2xl font-bold font-headline">{name}</CardTitle>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Building className="w-4 h-4 text-primary" />
            <span>{projectsCount} Project{projectsCount > 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <div className="p-6 pt-0 mt-auto">
        <Link href={`/developers/${id}`} passHref>
          <Button variant="outline" className="w-full">
            View Projects <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
