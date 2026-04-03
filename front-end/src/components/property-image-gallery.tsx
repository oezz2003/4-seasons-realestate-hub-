"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

type PropertyImageGalleryProps = {
  images: string[];
  title: string;
};

export function PropertyImageGallery({ images, title }: PropertyImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full bg-muted rounded-[3rem] flex items-center justify-center border border-dashed border-primary/20">
        <p className="text-muted-foreground font-headline text-lg italic">No architectural captures available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[70vh] min-h-[500px]">
        {/* Main Large Image */}
        <div className="md:col-span-8 relative rounded-[3rem] overflow-hidden group shadow-2xl">
          <Image 
            src={images[0]} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-12 left-12">
            <Badge className="bg-secondary text-on-secondary border-none px-4 py-1.5 font-black tracking-[0.3em] uppercase text-[10px] mb-4">
              Autumn Collection
            </Badge>
            <h1 className="text-white font-headline text-5xl md:text-7xl font-black tracking-tighter leading-none">{title}</h1>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <button className="absolute bottom-12 right-12 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full px-8 py-4 font-black uppercase tracking-widest text-[9px] hover:bg-white hover:text-primary transition-all shadow-2xl dark:bg-black/20 dark:hover:bg-primary dark:hover:text-white">
                 Show all {images.length} photos
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 border-none bg-background/95 backdrop-blur-2xl rounded-[3rem] overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="p-8 flex justify-between items-center border-b border-white/10">
                  <DialogHeader className="text-left">
                    <DialogTitle className="font-headline text-3xl font-black tracking-tighter">The Full Collection</DialogTitle>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</p>
                  </DialogHeader>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="rounded-full h-12 w-12 bg-white/5 hover:bg-white/10 dark:bg-white/10">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((src, index) => (
                      <div 
                        key={index} 
                        className="relative rounded-[2rem] overflow-hidden shadow-xl cursor-zoom-in group"
                        onClick={() => setSelectedImage(index)}
                      >
                        <Image
                          src={src}
                          alt={`${title} - ${index + 1}`}
                          width={800}
                          height={600}
                          className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <Camera className="text-white w-8 h-8 opacity-50" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stacked Side Images */}
        <div className="md:col-span-4 grid grid-rows-2 gap-4">
          <div className="relative rounded-[3rem] overflow-hidden shadow-xl group">
            <Image 
              src={images[1] || images[0]} 
              alt="Gallery 2" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="relative rounded-[3rem] overflow-hidden shadow-xl group">
            <Image 
              src={images[2] || images[0]} 
              alt="Gallery 3" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <button 
              onClick={() => setIsOpen(true)}
              className="absolute inset-0 z-10 w-full h-full cursor-pointer flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
               <span className="bg-card text-primary rounded-full px-6 py-3 font-black uppercase tracking-widest text-[9px] shadow-2xl">
                 Expand Gallery
               </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox (Optional Enhancement) */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-20"
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-10 h-10" />
            </button>
            <div className="relative w-full h-full flex items-center justify-center">
              <button 
                onClick={() => setSelectedImage((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-16 h-16" />
              </button>
              <div className="relative w-full h-full max-w-6xl max-h-[80vh]">
                <Image
                  src={images[selectedImage]}
                  alt="Fullscreen view"
                  fill
                  className="object-contain"
                />
              </div>
              <button 
                onClick={() => setSelectedImage((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
              >
                <ChevronRight className="w-16 h-16" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
