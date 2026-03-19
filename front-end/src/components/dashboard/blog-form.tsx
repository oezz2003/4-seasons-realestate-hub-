'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { BlogPost, Author } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageUpload } from '@/components/dashboard/image-upload';
import { RichTextEditor } from '@/components/dashboard/rich-text-editor';
import { uploadImage } from '@/lib/upload-utils';
import { createBlogPost, updateBlogPost } from '@/lib/api';
import { getImageUrl } from '@/lib/image-helpers';
import { Loader2, Save, X } from 'lucide-react';

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  author: z.number().min(1, 'Author is required'),
  status: z.enum(['Published', 'Draft']),
  publish_date: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface BlogFormProps {
  post?: BlogPost;
  authors: Author[];
}

export function BlogForm({ post, authors }: BlogFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(post?.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      author: post?.author?.id,
      status: post?.status || 'Draft',
      publish_date: post?.publish_date || '',
    },
  });

  const onSubmit = async (data: BlogPostFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let finalImage = imageUrl;

      if (imageFile) {
        const result = await uploadImage(imageFile, 'blog');
        finalImage = result.image;
        setImageUrl(finalImage);
        setImageFile(null);
      }

      const { author, ...rest } = data;
      const formData = {
        ...rest,
        image: finalImage,
        author_id: author ?? null,
      };

      if (post) {
        await updateBlogPost(post.id, formData);
      } else {
        await createBlogPost(formData);
      }

      router.push('/admin/dashboard/blog');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save blog post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {errorMessage}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for the blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter post title"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                {...register('excerpt')}
                placeholder="Brief description of the post"
                rows={3}
              />
              {errors.excerpt && (
                <p className="text-sm text-red-600">{errors.excerpt.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author *</Label>
              <Select
                value={watch('author')?.toString()}
                onValueChange={(value) => setValue('author', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id.toString()}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.author && (
                <p className="text-sm text-red-600">{errors.author.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value: 'Published' | 'Draft') => setValue('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publish_date">Publish Date</Label>
                <Input
                  id="publish_date"
                  type="date"
                  {...register('publish_date')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Image */}
        <Card>
          <CardHeader>
            <CardTitle>Featured Image</CardTitle>
            <CardDescription>
              Upload a featured image for the blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              autoUpload={false}
              currentImage={imageUrl || undefined}
              type="blog"
              onFileSelect={(file) => {
                setImageFile(file);
                if (!file && !post?.image) {
                  setImageUrl('');
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>
            Write the full content of your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={watch('content')}
            onChange={(value) => setValue('content', value)}
            placeholder="Write your blog post content here..."
          />
          {errors.content && (
            <p className="text-sm text-red-600 mt-2">{errors.content.message}</p>
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
          {post ? 'Update' : 'Create'} Post
        </Button>
      </div>
    </form>
  );
}
