'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SeasonTransitionProps {
  isLoading: boolean;
}

const SEASONS = [
  {
    name: 'Spring',
    color: 'bg-[#3c6600]', // Spring Leaf
    textColor: 'text-white/90',
    delay: 0,
  },
  {
    name: 'Summer',
    color: 'bg-[#fbc02d]', // Sun Yellow
    textColor: 'text-[#006383]', // Winter Sky as contrast
    delay: 0.1,
  },
  {
    name: 'Autumn',
    color: 'bg-[#a33700]', // Autumn Sunset
    textColor: 'text-white/90',
    delay: 0.2,
  },
  {
    name: 'Winter',
    color: 'bg-[#006383]', // Winter Sky
    textColor: 'text-white/90',
    delay: 0.3,
  },
];

export function SeasonTransition({ isLoading }: SeasonTransitionProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-row overflow-hidden pointer-events-auto"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {SEASONS.map((season) => (
            <motion.div
              key={season.name}
              variants={{
                initial: { y: '100%' },
                animate: { 
                  y: 0,
                  transition: { 
                    duration: 0.8, 
                    delay: season.delay,
                    ease: [0.22, 1, 0.36, 1] 
                  } 
                },
                exit: { 
                  y: '-100%',
                  transition: { 
                    duration: 0.8, 
                    delay: season.delay,
                    ease: [0.22, 1, 0.36, 1] 
                  } 
                },
              }}
              className={cn(
                "relative flex-1 flex items-center justify-center h-full",
                season.color
              )}
            >
              <motion.span
                variants={{
                  initial: { opacity: 0, y: 20 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: season.delay + 0.4, duration: 0.6 } 
                  },
                  exit: { 
                    opacity: 0, 
                    transition: { duration: 0.3 } 
                  },
                }}
                className={cn(
                  "font-headline text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter vertical-text select-none",
                  season.textColor
                )}
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {season.name}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
