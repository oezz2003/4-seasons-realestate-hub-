import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { contactSubmissionsApi } from '@/lib/admin-api';
import { ContactsTable } from './table';

interface ContactsPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ContactsPage({ searchParams }: ContactsPageProps) {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
    const pageSize = resolvedSearchParams.page_size ? parseInt(resolvedSearchParams.page_size as string) : 10;

    // We need to handle the case where we might not have a token on the server side yet
    // Ideally, this data fetching should happen in a way that respects the auth token
    // Since admin-api.ts relies on localStorage, it won't work directly in a Server Component for auth-protected routes
    // However, for this architecture, we might need to rely on client-side fetching or passing cookies

    // For now, we'll try to fetch. If it fails due to auth, the client-side interceptor in layout will handle redirect.
    // BUT, admin-api.ts uses localStorage which is not available here.
    // We should probably move the fetching to the client component OR use a cookie-based approach.

    // WAIT: The properties page uses `getAdminProperties` which uses `adminApi` which uses `localStorage`.
    // How does `properties/page.tsx` work?
    // Ah, `getAdminProperties` in `api.ts` (not `admin-api.ts`) might be used?
    // No, `properties/page.tsx` imports `getAdminProperties` from `@/lib/api`.
    // Let's check `@/lib/api.ts` again.

    // In `api.ts`:
    // export async function getAdminProperties(filters?: PropertyFilters): Promise<ApiResponse<Property>> {
    //   ...
    //   return await fetchApiWithParams<Property>('properties/', params, ADMIN_API_BASE_URL);
    // }

    // `fetchApiWithParams` uses `axios.get`.
    // `axios` interceptor in `api.ts` adds token from `getAuthToken()` which uses `localStorage`.
    // `localStorage` is NOT available in Server Components.

    // This means the existing `properties/page.tsx` likely FAILS to send the token if run on the server.
    // If it works, it's because the API doesn't require auth for GET (which is true for `IsAuthenticatedOrReadOnly`).
    // BUT `ContactFormSubmissionViewSet` is `IsAdminUser`. So it REQUIRES auth.

    // So `properties/page.tsx` works because it's ReadOnly public access effectively (or the user is lucky).
    // For Contacts, we MUST send the token.

    // Since we don't have cookies set up for Next.js middleware to pass to server components,
    // we should switch this page to be a Client Component or fetch data on the client.

    // Let's make the Page a Client Component that fetches data.
    // Actually, let's look at `properties/page.tsx` again. It IS an async server component.
    // If `getAdminProperties` is called there, it sends a request WITHOUT a token (on server).
    // If the backend allows it (ReadOnly), it works.

    // Contacts require Admin. So server-side fetch without token will return 401 or 403.

    // STRATEGY CHANGE:
    // I will make `ContactsPage` a Client Component that fetches data using a hook or `useEffect`.
    // This ensures `localStorage` token is used.

    return (
        <ContactsPageClient />
    );
}

// We'll create a client wrapper
import { ContactsPageClient } from './page-client';
