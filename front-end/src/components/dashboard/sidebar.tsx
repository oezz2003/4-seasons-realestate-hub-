'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import {
  Home,
  Building2,
  MapPin,
  Users,
  FileText,
  Settings,
  Star,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Properties', href: '/admin/dashboard/properties', icon: Building2 },
  { name: 'Compounds', href: '/admin/dashboard/compounds', icon: MapPin },
  { name: 'Developers', href: '/admin/dashboard/developers', icon: Users },
  { name: 'Blog Posts', href: '/admin/dashboard/blog', icon: FileText },
  { name: 'Locations', href: '/admin/dashboard/settings/locations', icon: MapPin },
  { name: 'Amenities', href: '/admin/dashboard/settings/amenities', icon: Star },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card border-r border-border transition-colors duration-200">
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center py-10 px-4 border-b border-border/10 bg-surface-low/30">
        <div className="relative h-14 w-full">
           <Image 
              src="/4SEASONSLOGO.png" 
              alt="4 Seasons Logo" 
              fill 
              className="object-contain" 
              priority
           />
        </div>
        <div className="mt-4 text-center">
           <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
              Administrative Suite
           </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors mx-2',
                isActive
                  ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Four Seasons Real Estate Hub
          <br />
          Admin Dashboard v1.0
        </div>
      </div>
    </div>
  );
}

