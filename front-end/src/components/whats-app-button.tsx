'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { WhatsappIcon } from './icons';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  phone?: string;
  message?: string;
  variant?: 'primary' | 'outline' | 'icon' | 'floating';
  className?: string;
}

/**
 * Reusable WhatsApp Button component with dynamic messaging.
 * Follows the 4 Seasons Hub editorial design system.
 */
export function WhatsAppButton({ 
  phone = '', // Default to opening contact selector if no phone is provided
  message = "Hello! I'm interested in learning more about properties at 4 Seasons Hub.", 
  variant = 'primary', 
  className 
}: WhatsAppButtonProps) {
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  if (variant === 'floating') {
    return (
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "fixed bottom-28 right-6 md:bottom-8 md:right-8 z-50",
          "w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center",
          "bg-green-500 text-white shadow-[0_10px_30px_rgba(34,197,94,0.4)] transition-colors hover:bg-green-600",
          className
        )}
      >
        <WhatsappIcon className="w-7 h-7 md:w-8 md:h-8" />
      </motion.a>
    );
  }

  if (variant === 'icon') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "p-2.5 rounded-full backdrop-blur-md bg-green-500/80 text-white hover:bg-green-600 transition-all duration-300 shadow-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <WhatsappIcon className="w-4 h-4" />
      </a>
    );
  }

  return (
    <Button
      asChild
      variant={variant === 'outline' ? 'outline' : 'default'}
      className={cn(
        variant === 'primary' && "bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/20",
        "h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
        className
      )}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <WhatsappIcon className="mr-2 h-4 w-4" />
        WhatsApp Inquiry
      </a>
    </Button>
  );
}
