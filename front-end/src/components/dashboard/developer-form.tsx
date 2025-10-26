'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Developer } from '@/lib/types';
import { createDeveloper, updateDeveloper } from '@/lib/api';
import { uploadImage } from '@/lib/upload-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, X } from 'lucide-react';

const developerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  logo: z.string().optional(),
});

type DeveloperFormData = z.infer<typeof developerSchema>;

interface DeveloperFormProps {
  developer?: Developer;
}

export function DeveloperForm({ developer }: DeveloperFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState(developer?.logo || '');
  const [logoPreview, setLogoPreview] = useState<string | null>(developer?.logo || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeveloperFormData>({
    resolver: zodResolver(developerSchema),
    defaultValues: {
      name: developer?.name || '',
      description: developer?.description || '',
    },
  });

  const onSubmit = async (data: DeveloperFormData) => {
    setIsLoading(true);
    try {
      let finalLogoUrl = logoUrl;

      if (logoFile) {
        const result = await uploadImage(logoFile, 'developer-logo');
        finalLogoUrl = typeof result === 'string' ? result : result.image;
        setLogoUrl(finalLogoUrl || '');
        setLogoFile(null);
        setLogoPreview(finalLogoUrl || null);
      }

      const formData: any = {
        name: data.name,
        description: data.description,
      };

      // Only include logo if it's not empty
      if (finalLogoUrl) {
        formData.logo = finalLogoUrl;
      }

      if (developer) {
        // Update existing developer
        await updateDeveloper(developer.id, formData);
      } else {
        // Create new developer
        await createDeveloper(formData);
      }

      toast({
        title: "Success",
        description: `Developer ${developer ? 'updated' : 'created'} successfully`,
      });
      router.push('/admin/dashboard/developers');
    } catch (error: any) {
      console.error('Error saving developer:', error);
      const errorMessage = error?.response?.data?.detail ||
                          error?.response?.data?.message ||
                          error?.response?.data?.name?.[0] ||
                          error?.response?.data?.description?.[0] ||
                          JSON.stringify(error?.response?.data) ||
                          "Failed to save developer";
      console.error('Error details:', error?.response?.data);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for the developer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter developer name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logo */}
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>
              Upload the developer logo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              autoUpload={false}
              currentImage={logoPreview || undefined}
              type="developer-logo"
              onFileSelect={(file, previewUrl) => {
                setLogoFile(file);
                setLogoPreview(previewUrl);
                if (!file) {
                  setLogoUrl('');
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>
            Provide a detailed description of the developer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={watch('description')}
            onChange={(value) => setValue('description', value)}
            placeholder="Enter developer description..."
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-2">{errors.description.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {developer ? 'Update' : 'Create'} Developer
        </Button>
      </div>
    </form>
  );
}
