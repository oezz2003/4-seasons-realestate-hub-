import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedProperties } from '@/lib/api';
import { getImageUrl, getPlaceholderImage } from '@/lib/image-helpers';

export default async function AboutPage() {
  const featuredProperties = await getFeaturedProperties();
  const heroImage = featuredProperties.results.length > 0 
    ? getImageUrl(featuredProperties.results[0].main_image)
    : getPlaceholderImage('property');

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[300px] w-full">
        <Image
          src={heroImage}
          alt="About 4 Seasons"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <div className="overflow-hidden py-1">
            <h1 className="text-4xl md:text-6xl font-bold font-headline animate-title-reveal">About Us</h1>
          </div>
          <div className="overflow-hidden py-1">
            <p className="text-lg md:text-xl max-w-3xl mt-4 animate-title-reveal" style={{ animationDelay: '0.1s' }}>
              We are Four Seasons, a team of passionate professionals dedicated to revolutionizing the real estate experience in Egypt.
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Target className="w-12 h-12 text-primary" />
              </div>
              <div className="overflow-hidden py-1">
                <h2 className="text-3xl font-bold font-headline mb-3 animate-title-reveal">Our Mission</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To simplify the property buying and selling process through transparency, technology, and personalized service. We strive to empower our clients with the knowledge and tools they need to make informed decisions and achieve their real estate goals with confidence.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Eye className="w-12 h-12 text-primary" />
              </div>
              <div className="overflow-hidden py-1">
                <h2 className="text-3xl font-bold font-headline mb-3 animate-title-reveal">Our Vision</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                To be the most trusted and sought-after real estate brokerage in the region, known for our integrity, innovation, and unwavering commitment to client satisfaction. We envision a future where everyone can find their perfect place to call home.
              </p>
            </div>
          </div>
        </div>
      </section>
      
       {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
            <div className="overflow-hidden py-1">
              <h2 className="text-3xl font-bold mb-4 font-headline animate-title-reveal">Ready to Start Your Journey?</h2>
            </div>
            <div className="overflow-hidden py-1">
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-title-reveal" style={{ animationDelay: '0.1s' }}>Whether you're buying, selling, or just exploring, our team is here to help. Get in touch today!</p>
            </div>
            <div className="flex justify-center gap-4">
                <Link href="/search" passHref>
                    <Button size="lg">
                        Search Properties
                    </Button>
                </Link>
                <Link href="/contact" passHref>
                    <Button size="lg" variant="outline">
                        Contact Us
                    </Button>
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
}
