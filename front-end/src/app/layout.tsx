import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PageTransitionProvider } from '@/components/layout/page-transition-provider';
import { ThemeProvider } from '@/components/layout/theme-provider';
import ClickSpark from '@/components/click-spark';
import { ReduxProvider } from '@/components/providers/redux-provider';
import { NextAuthProvider } from '@/components/providers/next-auth-provider';
import { PublicLayoutWrapper } from '@/components/layout/public-layout-wrapper';

import { WhatsAppButton } from '@/components/whats-app-button';

export const metadata: Metadata = {
  title: {
    default: '4 Seasons Real Estate Hub | Egypt Luxury Properties',
    template: '%s | 4 Seasons Hub'
  },
  description: 'Egypt\'s premier destination for luxury real estate across Cairo, North Coast, and Gouna. Explore exclusive enclaves with the 4 Seasons Standard.',
  keywords: ['egypt luxury real estate', 'north coast villas', 'el gouna chalets', 'cairo penthouses', '4 seasons hub'],
  authors: [{ name: '4 Seasons Hub Team' }],
  creator: '4 Seasons Hub',
  publisher: '4 Seasons Hub',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '4 Seasons Real Estate Hub | Egypt Luxury Properties',
    description: 'Egypt\'s premier destination for luxury real estate. Discover the Living Panorama.',
    url: 'https://4seasons-hub.com',
    siteName: '4 Seasons Hub',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '4 Seasons Real Estate Hub',
    description: 'Egypt\'s premier destination for luxury real estate.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <ReduxProvider>
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <ClickSpark>
                <PageTransitionProvider>
                  <PublicLayoutWrapper>
                    {children}
                  </PublicLayoutWrapper>
                </PageTransitionProvider>
                <WhatsAppButton variant="floating" />
                <Toaster />
              </ClickSpark>
            </ThemeProvider>
          </NextAuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
