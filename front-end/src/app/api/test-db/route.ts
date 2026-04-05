import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Try a simple query
        const count = await prisma.property.count();
        const firstProperty = await prisma.property.findFirst();
        
        return NextResponse.json({
            status: 'success',
            database_reachable: true,
            records_found: count,
            has_data: count > 0,
            sample: firstProperty ? { id: firstProperty.id, title: (firstProperty as any).title } : null,
            env: {
                 NODE_ENV: process.env.NODE_ENV,
                 VERCEL: process.env.VERCEL,
                 VERCEL_URL: process.env.VERCEL_URL ? 'PRESENT' : 'MISSING',
                 NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'PRESENT' : 'MISSING',
                 SITE_URL: process.env.NEXT_PUBLIC_BASE_URL ? 'PRESENT' : 'MISSING'
            }
        });
    } catch (error) {
        console.error('Database diagnostic failed:', error);
        return NextResponse.json({
            status: 'error',
            database_reachable: false,
            error_message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
