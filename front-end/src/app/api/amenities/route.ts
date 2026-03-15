import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('page_size') || '10');
        const skip = (page - 1) * pageSize;

        const [amenities, count] = await Promise.all([
            prisma.amenity.findMany({
                skip,
                take: pageSize,
                orderBy: { name: 'asc' }
            }),
            prisma.amenity.count()
        ]);

        return NextResponse.json({
            results: amenities,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching amenities:', error);
        return NextResponse.json({ error: 'Failed to fetch amenities' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const amenity = await prisma.amenity.create({
            data: {
                name: body.name,
            },
        });

        return NextResponse.json(amenity, { status: 201 });
    } catch (error) {
        console.error('Error creating amenity:', error);
        return NextResponse.json({ error: 'Failed to create amenity' }, { status: 500 });
    }
}
