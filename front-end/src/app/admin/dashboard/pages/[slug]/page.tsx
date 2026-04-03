'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { pagesApi } from '@/lib/admin-api';
import { PageContent } from '@/lib/types';

export default function PageEditor() {
  const { slug } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<Partial<PageContent>>({
    slug: slug as string,
    title: '',
    subtitle: '',
    content: '',
    metadata: {},
  });

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const data = await pagesApi.getBySlug(slug as string);
        setPageData(data);
      } catch (error) {
        console.error('Error fetching page:', error);
        // If not found, we keep the default empty state for creation
      } finally {
        setIsLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (pageData.id) {
        await pagesApi.update(slug as string, pageData);
      } else {
        await pagesApi.create(pageData);
      }
      toast({
        title: 'Success',
        description: 'Page content updated successfully.',
      });
      router.push('/admin/dashboard/pages');
    } catch (error) {
       toast({
        title: 'Error',
        description: 'Failed to save page content.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isLegal = slug === 'privacy' || slug === 'terms';
  const isAbout = slug === 'about';
  const isContact = slug === 'contact-info';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/pages">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display text-primary tracking-tight capitalize">
              Edit {slug?.toString().replace('-', ' ')}
            </h1>
            <p className="text-muted-foreground text-sm">Update the content shown on the public website.</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="h-12 px-8 gap-2 font-black uppercase tracking-widest text-[10px]">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="bg-surface-low/30 backdrop-blur-xl border-primary/5">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Page Title</Label>
                <Input 
                  id="title" 
                  value={pageData.title} 
                  onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                  placeholder="e.g. About Our Heritage" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle / Tagline</Label>
                <Input 
                  id="subtitle" 
                  value={pageData.subtitle || ''} 
                  onChange={(e) => setPageData({ ...pageData, subtitle: e.target.value })}
                  placeholder="e.g. Redefining the property landscape" 
                />
              </div>
            </div>

            {isAbout && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="mission">Our Mission</Label>
                  <Textarea 
                    id="mission" 
                    rows={4}
                    value={pageData.metadata?.mission || ''} 
                    onChange={(e) => setPageData({ 
                      ...pageData, 
                      metadata: { ...pageData.metadata, mission: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vision">Our Vision</Label>
                  <Textarea 
                    id="vision" 
                    rows={4}
                    value={pageData.metadata?.vision || ''} 
                    onChange={(e) => setPageData({ 
                      ...pageData, 
                      metadata: { ...pageData.metadata, vision: e.target.value } 
                    })}
                  />
                </div>
              </div>
            )}

            {isContact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/5">
                <div className="space-y-2">
                  <Label htmlFor="address">Office Address</Label>
                  <Input 
                    id="address" 
                    value={pageData.metadata?.address || ''} 
                    onChange={(e) => setPageData({ 
                      ...pageData, 
                      metadata: { ...pageData.metadata, address: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Public Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={pageData.metadata?.email || ''} 
                    onChange={(e) => setPageData({ 
                      ...pageData, 
                      metadata: { ...pageData.metadata, email: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={pageData.metadata?.phone || ''} 
                    onChange={(e) => setPageData({ 
                      ...pageData, 
                      metadata: { ...pageData.metadata, phone: e.target.value } 
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="map">Map URL (Google Maps Embed)</Label>
                  <Input 
                    id="map" 
                    value={pageData.metadata?.map_url || ''} 
                    onChange={(e) => setPageData({ 
                      ...pageData, 
                      metadata: { ...pageData.metadata, map_url: e.target.value } 
                    })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-surface-low/30 backdrop-blur-xl border-primary/5">
          <CardHeader>
            <CardTitle>{isLegal ? 'Policy Content' : 'Main Content'}</CardTitle>
          </CardHeader>
          <CardContent>
             <RichTextEditor 
                value={pageData.content || ''} 
                onChange={(content) => setPageData({ ...pageData, content })}
                className="min-h-[400px] bg-background/50"
             />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
