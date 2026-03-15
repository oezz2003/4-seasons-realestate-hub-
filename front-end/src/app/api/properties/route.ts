import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Parse filters
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('page_size') || '10');
        const skip = (page - 1) * pageSize;

        const locationSlug = searchParams.get('location');
        const propertyType = searchParams.get('property_type');
        const minPrice = searchParams.get('min_price');
        const maxPrice = searchParams.get('max_price');
        const bedrooms = searchParams.get('bedrooms');
        const bathrooms = searchParams.get('bathrooms');
        const compound = searchParams.get('compound');
        const developer = searchParams.get('developer');
        const isFeatured = searchParams.get('is_featured');
        const isNewLaunch = searchParams.get('is_new_launch');
        const search = searchParams.get('search');
        const slug = searchParams.get('slug');

        const where: any = {};

        if (slug) where.slug = slug;
        if (locationSlug) where.location = { slug: locationSlug };
        if (propertyType) where.propertyType = propertyType;
        if (minPrice) where.price = { gte: parseFloat(minPrice) };
        if (maxPrice) {
            where.price = where.price || {};
            where.price.lte = parseFloat(maxPrice);
        }
        if (bedrooms) where.bedrooms = parseInt(bedrooms);
        if (bathrooms) where.bathrooms = parseInt(bathrooms);
        if (compound) {
            if (isNaN(Number(compound))) where.compound = { slug: compound };
            else where.compoundId = parseInt(compound);
        }
        if (developer) {
            if (isNaN(Number(developer))) where.developer = { slug: developer };
            else where.developerId = parseInt(developer);
        }
        if (isFeatured === 'true') where.isFeatured = true;
        if (isNewLaunch === 'true') where.isNewLaunch = true;

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [properties, count] = await Promise.all([
            prisma.property.findMany({
                where,
                include: {
                    compound: { include: { developer: true, location: true } },
                    developer: true,
                    location: true,
                    amenities: true,
                    galleryImages: true,
                },
                skip,
                take: pageSize,
                orderBy: { id: 'desc' }
            }),
            prisma.property.count({ where })
        ]);

        // Format output to match the legacy Django API
        const formattedProperties = properties.map(p => ({
            ...p,
            price: p.price.toString(), // Decimal to string
            property_type: p.propertyType,
            main_image: p.mainImage,
            floor_plan_image: p.floorPlanImage,
            map_image: p.mapImage,
            is_new_launch: p.isNewLaunch,
            is_featured: p.isFeatured,
            gallery_images: p.galleryImages,
        }));

        return NextResponse.json({
            results: formattedProperties,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const data = {
            title: body.title,
            slug: body.slug || slugify(body.title),
            propertyType: body.property_type,
            price: body.price,
            area: body.area,
            bedrooms: body.bedrooms,
            bathrooms: body.bathrooms,
            description: body.description,
            mainImage: body.main_image,
            floorPlanImage: body.floor_plan_image,
            mapImage: body.map_image,
            isNewLaunch: body.is_new_launch || false,
            isFeatured: body.is_featured || false,
            compoundId: body.compound_id || body.compound,
            developerId: body.developer_id || body.developer,
            locationId: body.location_id || body.location,
        };

        const property = await prisma.property.create({
            data,
        });

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
