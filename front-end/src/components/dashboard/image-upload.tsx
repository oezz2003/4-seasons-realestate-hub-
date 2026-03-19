'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage, type UploadResult } from '@/lib/upload-utils';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/image-helpers';

interface ImageUploadProps {
  onUpload?: (imageUrl: string) => void;
  onFileSelect?: (file: File | null, previewUrl: string | null) => void;
  currentImage?: string | null;
  type: string;
  className?: string;
  autoUpload?: boolean;
}

export function ImageUpload({
  onUpload,
  onFileSelect,
  currentImage,
  type,
  className,
  autoUpload = true,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage ? getImageUrl(currentImage) : null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setPreview(currentImage ? getImageUrl(currentImage) : null);
  }, [currentImage]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current && previewUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (previewUrlRef.current && previewUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    if (!autoUpload) {
      const objectUrl = URL.createObjectURL(file);
      previewUrlRef.current = objectUrl;
      setPreview(objectUrl);
      onFileSelect?.(file, objectUrl);
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadImage(file, type);
      const imageUrl = getImageUrl(extractImageUrl(result));
      setPreview(imageUrl);
      onUpload?.(imageUrl);
      onFileSelect?.(file, imageUrl);
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (previewUrlRef.current && previewUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onUpload?.('');
    onFileSelect?.(null, null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleClick}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-500">Click to upload image</p>
               <p className="text-xs text-gray-400">Images (JPEG, PNG, WebP) up to 5MB</p>
            </div>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

function extractImageUrl(result: UploadResult): string {
  if (typeof result === 'string') {
    return result;
  }

  if ('image' in result && result.image) {
    return result.image;
  }

  throw new Error('Upload did not return an image URL');
}

