import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        const where: any = {};
        if (slug) where.slug = slug;

        // Locations usually aren't paginated in standard selectors, but we maintain the format
        const locations = await prisma.location.findMany({
            where,
            orderBy: { name: 'asc' }
        });

        const formattedLocations = locations.map(l => ({
            ...l,
            map_url: l.mapUrl,
        }));

        return NextResponse.json({
            results: formattedLocations,
            count: locations.length,
            next: null,
            previous: null,
        });
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const location = await prisma.location.create({
            data: {
                name: body.name,
                slug: body.slug || slugify(body.name),
                mapUrl: body.map_url,
            },
        });

        return NextResponse.json({ ...location, map_url: location.mapUrl }, { status: 201 });
    } catch (error) {
        console.error('Error creating location:', error);
        return NextResponse.json({ error: 'Failed to create location' }, { status: 500 });
    }
}
