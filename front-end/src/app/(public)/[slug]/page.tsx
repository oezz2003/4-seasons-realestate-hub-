import { pagesApi } from '@/lib/admin-api';
import { notFound } from 'next/navigation';

interface LegalPageProps {
  params: { slug: string };
}

// NOTE: Since this is a public page in a Server Component, 
// we normally would need a separate 'getPublicPage' method in lib/api.ts
// that doesn't require admin auth.
// I'll add that to lib/api.ts next.

import { getPageContent } from '@/lib/api';

export default async function LegalPage({ params }: LegalPageProps) {
  const { slug } = await params;
  
  if (slug !== 'privacy' && slug !== 'terms') {
    notFound();
  }

  const page = await getPageContent(slug);

  if (!page) {
    return (
       <div className="container mx-auto py-32 px-4 text-center">
        <h1 className="text-4xl font-display mb-4 capitalize">{slug.replace('-', ' ')}</h1>
        <p className="text-muted-foreground font-serif italic text-xl">
          Content being curated. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24 md:py-32 px-4 max-w-4xl">
      <div className="mb-16 text-center">
        <span className="text-secondary text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">Legal Notice</span>
        <h1 className="text-editorial-title text-5xl md:text-7xl mb-6">{page.title}</h1>
        {page.subtitle && (
          <p className="text-xl text-muted-foreground/80 font-serif italic">{page.subtitle}</p>
        )}
      </div>

      <div 
        className="prose prose-lg dark:prose-invert max-w-none font-serif leading-relaxed text-muted-foreground/90 
          prose-h1:text-primary prose-h2:text-primary prose-h3:text-primary/80
          prose-a:text-secondary prose-strong:text-foreground"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
      
      <div className="mt-20 pt-8 border-t border-primary/5 text-center">
        <p className="text-xs text-muted-foreground/40 font-bold uppercase tracking-widest">
          Last Updated: {new Date(page.updated_at || '').toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
