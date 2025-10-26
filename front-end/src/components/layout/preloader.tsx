'use client';

import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';

const seasonColumns = [
  { name: 'winter', color: 'bg-[--preloader-winter]' },
  { name: 'autumn', color: 'bg-[--preloader-autumn]' },
  { name: 'spring', color: 'bg-[--preloader-spring]' },
  { name: 'summer', color: 'bg-[--preloader-summer]' },
];

export function Preloader({ isLoading }: { isLoading: boolean }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] transition-opacity duration-300',
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none delay-700'
      )}
      aria-hidden={!isLoading}
    >
      <div className="relative flex h-full w-full overflow-hidden">
        {seasonColumns.map((season, index) => (
          <div
            key={season.name}
            className={cn(
              'h-full w-1/4',
              season.color,
              isLoading
                ? 'animate-preloader-slide-in'
                : index % 2 === 0
                ? 'animate-preloader-slide-out-up'
                : 'animate-preloader-slide-out-down'
            )}
            style={{ animationDelay: isLoading ? `${index * 200}ms` : '0ms' }}
          />
        ))}
      </div>

      <div
        className={cn(
          'absolute inset-0 z-10 flex items-center justify-center',
          isLoading ? 'animate-logo-fade-in' : 'animate-logo-fade-out'
        )}
      >
        <Logo className="h-20 w-20 text-white drop-shadow-lg" />
      </div>
    </div>
  );
}
