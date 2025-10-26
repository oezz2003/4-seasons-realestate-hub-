'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { name: 'Dashboard', href: '/admin/dashboard', current: pathname === '/admin/dashboard' }
    ];

    // Skip the first segment (admin) and second segment (dashboard)
    const pathSegments = segments.slice(2);
    
    let currentPath = '/admin/dashboard';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Convert segment to readable name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        name,
        href: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
            )}
            {breadcrumb.current ? (
              <span className="text-sm font-medium text-gray-900">
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {index === 0 ? (
                  <div className="flex items-center">
                    <Home className="h-4 w-4 mr-1" />
                    {breadcrumb.name}
                  </div>
                ) : (
                  breadcrumb.name
                )}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

