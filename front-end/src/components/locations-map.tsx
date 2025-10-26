'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const locations = [
  {
    name: 'New Capital',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221255.94290740927!2d31.62406834469792!3d29.9770512529342!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581bd633ab119d%3A0x240693081e23a563!2sNew%20Administrative%20Capital%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1717081855639',
  },
  {
    name: 'North Coast',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d441193.3869914734!2d28.57259169658511!3d30.82283944365757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458b8778a46b963%3A0x86819c45cb91741!2sEl%20Alamein%2C%20Matrouh%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1717081928091',
  },
  {
    name: 'New Cairo & 5th Settlement',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55291.12151478177!2d31.43916214959441!3d30.007621464332154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145822cffb978e87%3A0x25a6119a45617a02!2sNew%20Cairo%20City%2C%20Cairo%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1717081989061',
  },
  {
    name: 'Sheikh Zayed & October',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110620.65089311025!2d30.85244954751336!3d29.96879861678855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458565a044f1555%3A0x4466c43317c24097!2s6th%20of%20October%20City%2C%20Giza%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1720542260682',
  },
   {
    name: 'Ain Sokhna',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55502.59599553696!2d32.282936749999995!3d29.61008695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1454657193c6f059%3A0x41f4f95e63825852!2sAin%20Sokhna%2C%20Attaka%2C%20Suez%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1720542385153!5m2!1sen!2sus'
  },
  {
    name: 'Ras Sudr',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55437.03748281313!2d32.65683935!3d29.722645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1454e60274149e67%3A0x956b6b3e9334585c!2sRas%20Sudr%2C%20South%20Sinai%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1720542457850!5m2!1sen!2sus'
  },
  {
    name: 'Port Said',
    url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54593.81571408331!2d32.253680349999995!3d31.22156635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f99c75a42e057b%3A0x3f5c78678d910609!2sPort%20Said%2C%20Port%20Said%20Governorate%2C%20Egypt!5e0!3m2!1sen!2sus!4v1720542502690!5m2!1sen!2sus'
  }
];

export function LocationsMap() {
  const [activeLocation, setActiveLocation] = useState(locations[0]);

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="overflow-hidden py-1">
            <h2 className="text-3xl font-bold font-headline animate-title-reveal">
              Explore Our Key Locations
            </h2>
          </div>
          <div className="overflow-hidden py-1">
            <p
              className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto animate-title-reveal"
              style={{ animationDelay: '0.1s' }}
            >
              Hover over a location to preview it on the map, and click to see available properties.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="md:col-span-1 lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Card className="p-4">
                    <h3 className="font-bold mb-4 px-2">Our Locations</h3>
                    <div className="flex flex-col gap-2">
                        {locations.map((location) => (
                            <Link
                                key={location.name}
                                href={`/search?location=${encodeURIComponent(location.name)}`}
                                onMouseEnter={() => setActiveLocation(location)}
                                className={cn(
                                    buttonVariants({ variant: activeLocation.name === location.name ? "default" : "ghost" }),
                                    "w-full justify-between group"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{location.name}</span>
                                </div>
                                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        ))}
                    </div>
                </Card>
            </div>
            <div className="md:col-span-2 lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <Card className="w-full aspect-video md:aspect-auto md:h-full overflow-hidden shadow-lg rounded-lg">
                    <iframe
                        key={activeLocation.name} 
                        src={activeLocation.url}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="animate-fade-in"
                    ></iframe>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
}
