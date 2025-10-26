'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface PublicLayoutWrapperProps {
  children: React.ReactNode;
}

export function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
  const pathname = usePathname();

  // Check if we're in admin routes
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // For admin routes, don't show header and footer
    return <>{children}</>;
  }

  // For public routes, show header and footer
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
