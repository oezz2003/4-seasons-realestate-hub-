import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('page_size') || '10');
        const skip = (page - 1) * pageSize;

        const locationId = searchParams.get('location');
        const developerId = searchParams.get('developer');
        const search = searchParams.get('search');
        const slug = searchParams.get('slug');

        const where: any = {};

        if (slug) where.slug = slug;
        if (locationId) {
            if (isNaN(Number(locationId))) where.location = { slug: locationId };
            else where.locationId = parseInt(locationId);
        }
        if (developerId) {
            if (isNaN(Number(developerId))) where.developer = { slug: developerId };
            else where.developerId = parseInt(developerId);
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [compounds, count] = await Promise.all([
            prisma.compound.findMany({
                where,
                include: {
                    developer: true,
                    location: true,
                    amenities: true,
                },
                skip,
                take: pageSize,
                orderBy: { id: 'desc' }
            }),
            prisma.compound.count({ where })
        ]);

        const formattedCompounds = compounds.map(c => ({
            ...c,
            main_image: c.mainImage,
            delivery_date: c.deliveryDate,
        }));

        return NextResponse.json({
            results: formattedCompounds,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching compounds:', error);
        return NextResponse.json({ error: 'Failed to fetch compounds' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const compound = await prisma.compound.create({
            data: {
                name: body.name,
                slug: body.slug || slugify(body.name),
                description: body.description,
                mainImage: body.main_image,
                status: body.status,
                deliveryDate: body.delivery_date,
                developerId: body.developer_id || body.developer,
                locationId: body.location_id || body.location,
            },
        });

        return NextResponse.json(compound, { status: 201 });
    } catch (error) {
        console.error('Error creating compound:', error);
        return NextResponse.json({ error: 'Failed to create compound' }, { status: 500 });
    }
}
