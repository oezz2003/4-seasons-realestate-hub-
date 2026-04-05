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

        // Format output to match the legacy Django API and handle absolute URLs
        const formatUrl = (url: string | null) => {
            if (!url) return null;
            if (url.startsWith('/http')) return url.substring(1);
            return url;
        };

        const formattedProperties = properties.map(p => ({
            ...p,
            price: p.price.toString(), // Decimal to string
            property_type: p.propertyType,
            main_image: formatUrl(p.mainImage),
            floor_plan_image: formatUrl(p.floorPlanImage),
            map_image: formatUrl(p.mapImage),
            is_new_launch: p.isNewLaunch,
            is_featured: p.isFeatured,
            gallery_images: p.galleryImages.map(img => ({
                ...img,
                image: formatUrl(img.image)
            })),
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
        const data: any = {
            title: body.title,
            slug: body.slug || slugify(body.title),
            propertyType: body.property_type,
            price: body.price,
            area: typeof body.area === 'string' ? parseInt(body.area) : body.area,
            bedrooms: typeof body.bedrooms === 'string' ? parseInt(body.bedrooms) : body.bedrooms,
            bathrooms: typeof body.bathrooms === 'string' ? parseInt(body.bathrooms) : body.bathrooms,
            description: body.description,
            mainImage: body.main_image,
            floorPlanImage: body.floor_plan_image,
            mapImage: body.map_image,
            isNewLaunch: body.is_new_launch === true || body.is_new_launch === 'true',
            isFeatured: body.is_featured === true || body.is_featured === 'true',
            compoundId: body.compound_id ? parseInt(body.compound_id) : (body.compound ? parseInt(body.compound) : null),
            developerId: body.developer_id ? parseInt(body.developer_id) : (body.developer ? parseInt(body.developer) : null),
            locationId: body.location_id ? parseInt(body.location_id) : (body.location ? parseInt(body.location) : null),
        };

        // Handle amenities
        if (body.amenities && Array.isArray(body.amenities)) {
            data.amenities = {
                connect: body.amenities.map((id: any) => ({ id: parseInt(id) }))
            };
        }

        // Handle gallery images
        if (body.gallery_images && Array.isArray(body.gallery_images)) {
            data.galleryImages = {
                create: body.gallery_images.map((img: any) => ({
                    image: img.image,
                    altText: img.alt_text || ''
                }))
            };
        }

        const property = await prisma.property.create({
            data,
            include: {
                amenities: true,
                galleryImages: true
            }
        });

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
