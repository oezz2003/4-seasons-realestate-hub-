'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Author } from '@/lib/types';
import { createAuthor, updateAuthor } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/dashboard/image-upload';

const authorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  bio: z.string().optional(),
  image: z.string().optional(),
});

type AuthorFormData = z.infer<typeof authorSchema>;

interface AuthorFormDialogProps {
  author?: Author;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AuthorFormDialog({ author, open, onOpenChange, onSuccess }: AuthorFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState((author as any)?.image || '');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorSchema),
    defaultValues: {
      name: author?.name || '',
      bio: (author as any)?.bio || '',
    },
  });

  // Reset form when author changes or dialog opens
  useEffect(() => {
    if (open) {
      reset({
        name: author?.name || '',
        bio: (author as any)?.bio || '',
      });
      setImage((author as any)?.image || '');
    }
  }, [author, open, reset]);

  const onSubmit = async (data: AuthorFormData) => {
    setIsLoading(true);
    try {
      const formData = {
        ...data,
        image,
      };

      if (author) {
        await updateAuthor(author.id, formData);
      } else {
        await createAuthor(formData);
      }

      toast({
        title: "Success",
        description: `Author ${author ? 'updated' : 'created'} successfully`,
      });
      
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error saving author:', error);
      toast({
        title: "Error",
        description: "Failed to save author",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{author ? 'Edit' : 'Add'} Author</DialogTitle>
          <DialogDescription>
            {author ? 'Update the author details.' : 'Add a new blog author.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Author biography..."
                rows={3}
              />
              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Profile Image</Label>
              <ImageUpload
                onUpload={setImage}
                currentImage={image}
                type="author-image"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {author ? 'Update' : 'Create'} Author
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
