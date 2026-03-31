"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SeasonTransition } from '../transitions/SeasonTransition';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPath = useRef(pathname);

  // This state now specifically handles the very first load of the website
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  useEffect(() => {
    // Initial load: 3 seconds to allow for full Branding and Sweep
    const timer = setTimeout(() => setIsInitialLoad(false), 3000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Don't trigger transition on the initial load or if the path is the same
    if (isInitialLoad || pathname === previousPath.current) {
      previousPath.current = pathname;
      return;
    }

    setIsTransitioning(true);
    
    // Page transition: 1.5 seconds. 
    // This allows for: Slide-in (0.8s), Logo reveal, and start of Slide-out
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      previousPath.current = pathname;
    }, 1500); 

    return () => clearTimeout(timer);
  }, [pathname, isInitialLoad]);

  // Determine if the transition should be visible
  const showTransition = isInitialLoad || isTransitioning;

  const HEADER_HEIGHT_PX = 80;
  const HEADER_HEIGHT_CLASS_TOP = `pt-[${HEADER_HEIGHT_PX}px]`;
  const isHomePage = pathname === '/';

  return (
    <>
      <SeasonTransition isLoading={showTransition} />
      <main
        className={cn(
          'flex-1 flex flex-col min-h-screen',
          // Add bottom padding on mobile to account for the bottom nav bar.
          'pb-24 md:pb-0',
          // Add top padding to account for the sticky header's height, except on homepage.
          isHomePage ? '' : HEADER_HEIGHT_CLASS_TOP
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: 50 }}
            animate={{ 
              opacity: showTransition ? 0 : 1, 
              x: showTransition ? 50 : 0 
            }}
            transition={{ 
              duration: 1, 
              delay: showTransition ? 0 : 0.6,
              ease: [0.22, 1, 0.36, 1] 
            }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
