"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Preloader } from './preloader';
import { cn } from '@/lib/utils';

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const previousPath = useRef(pathname);

  // This state now specifically handles the very first load of the website
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    // This timer simulates the initial preloader duration
    const timer = setTimeout(() => setIsInitialLoad(false), 2200); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Don't trigger transition on the initial load or if the path is the same
    if (isInitialLoad || pathname === previousPath.current) {
      previousPath.current = pathname;
      return;
    }

    setIsTransitioning(true);
    
    // This timer simulates the transition duration between pages
    const timer = setTimeout(() => {
      setIsTransitioning(false);
      previousPath.current = pathname;
    }, 1600); // Duration of the preloader for page changes

    return () => clearTimeout(timer);
  }, [pathname, isInitialLoad]);

  // Determine if the preloader should be visible
  const showPreloader = isInitialLoad || isTransitioning;

  const HEADER_HEIGHT_PX = 80;
  const HEADER_HEIGHT_CLASS_TOP = `pt-[${HEADER_HEIGHT_PX}px]`;
  const isHomePage = pathname === '/';

  return (
    <>
      <Preloader isLoading={showPreloader} />
      <main
        className={cn(
          'flex-1',
          // Add bottom padding on mobile to account for the bottom nav bar.
          'pb-24 md:pb-0',
          // Add top padding to account for the sticky header's height, except on homepage.
          isHomePage ? '' : HEADER_HEIGHT_CLASS_TOP,
          // Apply transition styles to the main container
          'transition-opacity duration-500 ease-in-out'
        )}
        style={{
          // Set opacity to 0 when preloader is active, and fade it in when not.
          opacity: showPreloader ? 0 : 1,
          // Delay the fade-in to happen after the preloader animation
          transitionDelay: showPreloader ? '0ms' : '900ms',
        }}
      >
        <div key={pathname}>
          {children}
        </div>
      </main>
    </>
  );
}
