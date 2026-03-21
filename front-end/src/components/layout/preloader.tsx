'use client';

import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function Preloader({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ 
            duration: 0.8, 
            ease: [0.77, 0, 0.175, 1], // Custom slow-in, slow-out curve
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
          aria-hidden={!isLoading}
        >
          {/* Subtle Grain Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />

          {/* Branding Layer */}
          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.8, 
                ease: [0.22, 1, 0.36, 1] 
              }}
              className="relative"
            >
              <Logo className="h-80 w-80 drop-shadow-[0_0_80px_rgba(119,90,25,0.5)]" />
              
              {/* Pulsing Golden Aura */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 bg-secondary/30 blur-[100px] rounded-full -z-10"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-center"
            >
               <p className="text-secondary font-display italic text-2xl tracking-wide opacity-90">
                 Curating Time and Place
               </p>
            </motion.div>

            {/* Cinematic Progress Bar */}
            <div className="w-64 h-[2px] bg-white/10 mt-12 relative overflow-hidden rounded-full">
               <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '100%' }}
                 transition={{ 
                   duration: 1.5, 
                   repeat: Infinity,
                   ease: "easeInOut"
                 }}
                 className="absolute inset-y-0 w-full bg-gradient-to-r from-transparent via-secondary/60 to-transparent"
               />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
