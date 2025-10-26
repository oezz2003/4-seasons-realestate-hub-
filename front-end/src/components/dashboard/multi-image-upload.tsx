'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, Plus } from 'lucide-react';
import { uploadMultipleImages, formatFileSize } from '@/lib/upload-utils';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface MultiImageUploadProps {
  images: Array<{ id: string; image: string; alt_text?: string }>;
  onImagesChange: (images: Array<{ id: string; image: string; alt_text?: string }>) => void;
  type: string;
  maxImages?: number;
  className?: string;
}

export function MultiImageUpload({
  images,
  onImagesChange,
  type,
  maxImages = 20,
  className = '',
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      toast({
        title: 'Too many files',
        description: `You can only upload up to ${maxImages} images. Currently have ${images.length}.`,
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload all files
      const uploadedImages = await uploadMultipleImages(files, type, (progress) => {
        // Update progress for each file
        const newProgress = { ...uploadProgress };
        files.forEach((file, index) => {
          newProgress[file.name] = progress.percentage;
        });
        setUploadProgress(newProgress);
      });

      // Add uploaded images to the existing images
      const newImages = [...images, ...uploadedImages.map(img => ({
        id: String(img.id),  // Ensure id is always a string
        image: img.image,
        alt_text: img.alt_text || '',
      }))];

      onImagesChange(newImages);

      toast({
        title: 'Success',
        description: `Successfully uploaded ${uploadedImages.length} image(s)`,
      });

      // Clear progress
      setUploadProgress({});

    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [images, maxImages, onImagesChange, toast, uploadProgress, type]);

  const handleRemoveImage = useCallback((imageId: string) => {
    const newImages = images.filter(img => img.id !== imageId);
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const handleAltTextChange = useCallback((imageId: string, altText: string) => {
    const newImages = images.map(img =>
      img.id === imageId ? { ...img, alt_text: altText } : img
    );
    onImagesChange(newImages);
  }, [images, onImagesChange]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const remainingSlots = maxImages - images.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {images.length} of {maxImages} images uploaded
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isUploading || remainingSlots <= 0}
          className="flex items-center gap-2"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Add Images
        </Button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Existing Images */}
        {images.map((image, index) => (
          <div key={image.id} className="relative group border rounded-lg overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={image.image}
                alt={image.alt_text || `Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            {/* Remove button */}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => handleRemoveImage(image.id)}
            >
              <X className="h-3 w-3" />
            </Button>

            {/* Alt text input */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/75 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <input
                type="text"
                placeholder="Alt text..."
                value={image.alt_text || ''}
                onChange={(e) => handleAltTextChange(image.id, e.target.value)}
                className="w-full text-xs bg-white/90 rounded px-2 py-1 text-black placeholder-gray-500"
              />
            </div>
          </div>
        ))}

        {/* Upload Placeholder */}
        {remainingSlots > 0 && (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
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
                <p className="text-sm text-gray-500">Add Image</p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicators */}
      {isUploading && Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Upload Progress:</p>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12">{Math.round(progress)}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Instructions */}
      <div className="text-xs text-muted-foreground">
        <p>• Upload up to {maxImages} images</p>
        <p>• Supported formats: JPEG, PNG, WebP</p>
        <p>• Maximum file size: 5MB per image</p>
        <p>• Images will be automatically resized and optimized</p>
      </div>
    </div>
  );
}
