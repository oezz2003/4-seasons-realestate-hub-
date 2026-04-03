'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Edit, ExternalLink, Shield, Info, Phone } from 'lucide-react';
import Link from 'next/link';
import { pagesApi } from '@/lib/admin-api';
import { PageContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const PAGES_CONFIG = [
  { slug: 'about', name: 'About Us', icon: Info, description: 'Manage mission, vision, and heritage content.' },
  { slug: 'contact-info', name: 'Contact Information', icon: Phone, description: 'Manage office address, email, phone, and maps.' },
  { slug: 'privacy', name: 'Privacy Policy', icon: Shield, description: 'Edit the legal privacy policy document.' },
  { slug: 'terms', name: 'Terms of Service', icon: FileText, description: 'Edit the legal terms and conditions.' },
];

export default function PagesManagementPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await pagesApi.getAll();
        setPages(response.results);
      } catch (error) {
        console.error('Error fetching pages:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPages();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-primary tracking-tight">Page Content CMS</h1>
        <p className="text-muted-foreground mt-2">Curate the editorial and legal content of the 4 Seasons Hub.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PAGES_CONFIG.map((page) => {
          const existingPage = pages.find((p) => p.slug === page.slug);
          
          return (
            <Card key={page.slug} className="group hover:border-primary/20 transition-all duration-300 bg-surface-low/30 backdrop-blur-xl border-primary/5 h-full flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                    <page.icon className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/${page.slug === 'contact-info' ? 'contact' : page.slug}`} target="_blank">
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
                <CardTitle className="text-xl font-headline tracking-wide group-hover:text-primary transition-colors">
                  {page.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground/80 font-medium">
                  {page.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/dashboard/pages/${page.slug}`}>
                  <Button className="w-full h-12 gap-2 text-xs font-black tracking-widest uppercase transition-all duration-300 group-hover:scale-[1.02]">
                    <Edit className="w-4 h-4" />
                    Edit Content
                  </Button>
                </Link>
                {existingPage && (
                  <p className="text-[10px] text-muted-foreground/40 mt-4 text-center font-bold tracking-widest uppercase">
                    Last updated: {new Date(existingPage.updated_at || '').toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
