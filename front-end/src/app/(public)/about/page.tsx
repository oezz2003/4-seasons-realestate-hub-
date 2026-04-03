import Image from 'next/image';
import Link from 'next/link';
import { Target, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFeaturedProperties, getPageContent } from '@/lib/api';
import { getImageUrl, getPlaceholderImage } from '@/lib/image-helpers';

export default async function AboutPage() {
  const [featuredProperties, cmsData] = await Promise.all([
    getFeaturedProperties(),
    getPageContent('about')
  ]);

  const heroImage = cmsData?.hero_image || (featuredProperties.results.length > 0 
    ? getImageUrl(featuredProperties.results[0].main_image)
    : getPlaceholderImage('property'));

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt={cmsData?.title || "About 4 Seasons"}
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <div className="max-w-4xl space-y-6">
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.4em] mb-4 block animate-fade-in">Our Heritage</span>
            <h1 className="text-4xl md:text-7xl font-display tracking-tight animate-fade-in-up">
              {cmsData?.title || "The Digital Curator"}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto font-serif italic text-white/80 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {cmsData?.subtitle || "Redefining the Egyptian property landscape through transparency, technology, and a commitment to the extraordinary."}
            </p>
          </div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
            <div className="section-blend p-12 rounded-[3.5rem] bg-surface-low/30 backdrop-blur-xl border border-primary/5 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="p-5 rounded-2xl bg-primary/5 text-secondary mb-8">
                <Target className="w-10 h-10" />
              </div>
              <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Foundation</span>
              <h2 className="text-editorial-title text-4xl mb-6">Our Mission</h2>
              <p className="text-muted-foreground/90 font-serif leading-relaxed text-lg">
                {cmsData?.metadata?.mission || "To simplify the property journey through absolute transparency and bespoke service. We empower our collective with the intelligence needed to curate their future with confidence."}
              </p>
            </div>
            <div className="section-blend p-12 rounded-[3.5rem] bg-surface-low/30 backdrop-blur-xl border border-primary/5 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="p-5 rounded-2xl bg-primary/5 text-secondary mb-8">
                <Eye className="w-10 h-10" />
              </div>
              <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Trajectory</span>
              <h2 className="text-editorial-title text-4xl mb-6">Our Vision</h2>
              <p className="text-muted-foreground/90 font-serif leading-relaxed text-lg">
                {cmsData?.metadata?.vision || "To be the most prestigious real estate orchestrator in the region, recognized for our unwavering integrity and the creation of a world where everyone finds their sanctuary."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section (Rich Text) */}
      {cmsData?.content && (
        <section className="py-24 bg-surface-lowest border-y border-primary/5">
           <div className="container mx-auto px-4 max-w-4xl">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none font-serif text-muted-foreground/90"
                dangerouslySetInnerHTML={{ __html: cmsData.content }}
              />
           </div>
        </section>
      )}
      
       {/* CTA Section */}
      <section className="py-32 bg-surface-lowest relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-8">
                <div>
                  <span className="text-secondary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">Take Action</span>
                  <h2 className="text-editorial-title text-5xl">Your Legacy Begins Here</h2>
                </div>
                <p className="text-xl text-muted-foreground/80 font-serif italic mb-12">Whether you&apos;re acquiring, divesting, or simply exploring the horizon, our curators are prepared to guide you.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link href="/search" passHref>
                        <Button size="lg" className="gradient-primary text-white font-bold h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.05] transition-all">
                            EXPLORE ENCLAVES
                        </Button>
                    </Link>
                    <Link href="/contact" passHref>
                        <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-primary/20 text-primary font-bold hover:bg-primary/5 hover:border-primary/40 transition-all">
                            ESTABLISH DIALOGUE
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
