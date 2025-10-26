"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera } from 'lucide-react';

type PropertyImageGalleryProps = {
  images: string[];
  imageHints: string[];
  title: string;
};

export function PropertyImageGallery({ images, imageHints, title }: PropertyImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const mainImage = images[activeIndex];
  const mainImageHint = imageHints[activeIndex];

  const spring = {
    type: "spring",
    stiffness: 400,
    damping: 30,
  };

  return (
    <LayoutGroup>
      <div className="space-y-2">
        {/* Main Image Display */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg group">
          <AnimatePresence>
            <motion.div
              key={mainImage}
              layoutId={mainImage}
              className="absolute inset-0"
              transition={spring}
            >
              <Image
                src={mainImage}
                alt={`${title} - Image ${activeIndex + 1}`}
                data-ai-hint={mainImageHint || ''}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 66vw"
              />
            </motion.div>
          </AnimatePresence>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="mr-2 h-4 w-4" />
                Show all photos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Photos of {title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {images.map((src, index) => (
                  <div key={src} className="relative aspect-square w-full rounded-md overflow-hidden">
                    <Image
                      src={src}
                      alt={`${title} - Thumbnail ${index + 1}`}
                      data-ai-hint={imageHints[index] || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {images.map((src, index) => (
              <div
                key={src}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  'relative aspect-square w-full rounded-md overflow-hidden cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                )}
              >
                <motion.div layoutId={src} className="w-full h-full" transition={spring}>
                  <Image
                    src={src}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    data-ai-hint={imageHints[index] || ''}
                    fill
                    className={cn(
                      'object-cover transition-all duration-300',
                      activeIndex !== index && 'filter grayscale hover:grayscale-0'
                    )}
                    sizes="25vw"
                    loading="lazy"
                  />
                </motion.div>
                {activeIndex === index && (
                  <motion.div
                    className="absolute inset-0 border-2 border-primary rounded-md"
                    layoutId="active-indicator"
                    transition={spring}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutGroup>
  );
}
