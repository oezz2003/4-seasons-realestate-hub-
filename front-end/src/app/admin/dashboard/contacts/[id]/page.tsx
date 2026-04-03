'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Calendar, ArrowLeft, Trash, User } from 'lucide-react';
import { contactSubmissionsApi } from '@/lib/admin-api';
import { ContactFormSubmission } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function ContactDetailView() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<ContactFormSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const data = await contactSubmissionsApi.getById(Number(id));
        setSubmission(data);
      } catch (error) {
        console.error('Error fetching submission:', error);
        toast({
          title: 'Error',
          description: 'Failed to load submission details.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmission();
  }, [id, toast]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      await contactSubmissionsApi.delete(Number(id));
      toast({
        title: 'Success',
        description: 'Submission deleted.',
      });
      router.push('/admin/dashboard/contacts');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete submission.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!submission) {
    return <div className="text-center py-20">Submission not found.</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/contacts">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display text-primary tracking-tight">Inquiry Details</h1>
            <p className="text-muted-foreground text-sm">Reviewing submission from {submission.name}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={handleDelete} className="gap-2">
          <Trash className="w-4 h-4" />
          Delete
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-surface-low/30 backdrop-blur-xl border-primary/5">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">{submission.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${submission.email}`} className="text-sm hover:text-primary transition-colors">{submission.email}</a>
              </div>
              {submission.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-primary" />
                  <a href={`tel:${submission.phone}`} className="text-sm hover:text-primary transition-colors">{submission.phone}</a>
                </div>
              )}
              <div className="flex items-center gap-3 text-muted-foreground/60">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase font-black tracking-tighter">
                  {format(new Date(submission.submitted_at), 'PPP p')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Content */}
        <div className="md:col-span-2">
          <Card className="bg-surface-low/50 backdrop-blur-2xl border-primary/10 shadow-2xl">
            <CardHeader>
              <CardTitle className="font-serif">Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 rounded-2xl bg-background/50 font-serif leading-relaxed text-lg italic text-foreground/90 whitespace-pre-wrap">
                &ldquo;{submission.message}&rdquo;
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Internal Link helper
import Link from 'next/link';
