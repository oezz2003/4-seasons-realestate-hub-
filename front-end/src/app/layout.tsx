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
  title: 'Four Seasons Real Estate Hub',
  description: 'Your premier destination for finding the perfect property.',
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
