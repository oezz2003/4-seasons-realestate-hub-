'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
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
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            Real Estate Hub
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
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

