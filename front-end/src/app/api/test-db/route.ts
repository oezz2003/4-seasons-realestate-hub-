import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const testInternal = searchParams.get('test_internal') === 'true';
    
    try {
        // 1. Direct DB Test
        const count = await prisma.property.count();
        
        let internalFetchResult = null;
        if (testInternal) {
            try {
                // Determine base URL dynamically for this test
                const host = request.headers.get('host');
                const protocol = host?.includes('localhost') ? 'http' : 'https';
                const internalUrl = `${protocol}://${host}/api/properties`;
                
                const res = await fetch(internalUrl, {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                
                internalFetchResult = {
                    url: internalUrl,
                    status: res.status,
                    ok: res.ok,
                    data: res.ok ? await res.json() : null
                };
            } catch (fetchErr) {
                internalFetchResult = {
                    error: fetchErr instanceof Error ? fetchErr.message : String(fetchErr)
                };
            }
        }

        return NextResponse.json({
            status: 'success',
            database_reachable: true,
            records_found: count,
            internal_fetch_test: internalFetchResult,
            env: {
                 NODE_ENV: process.env.NODE_ENV,
                 VERCEL: process.env.VERCEL || 'MISSING',
                 VERCEL_URL: process.env.VERCEL_URL || 'MISSING',
                 NEXTAUTH_URL: process.env.NEXTAUTH_URL ?? 'MISSING',
                 SITE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'MISSING'
            }
        });
    } catch (error) {
        console.error('Database diagnostic failed:', error);
        return NextResponse.json({
            status: 'error',
            database_reachable: false,
            error_message: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}
