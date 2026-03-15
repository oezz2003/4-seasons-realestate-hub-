import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const property = await prisma.property.findUnique({
            where: { id },
            include: {
                compound: { include: { developer: true, location: true } },
                developer: true,
                location: true,
                amenities: true,
                galleryImages: true,
            },
        });

        if (!property) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const formattedProperty = {
            ...property,
            price: property.price.toString(),
            property_type: property.propertyType,
            main_image: property.mainImage,
            floor_plan_image: property.floorPlanImage,
            map_image: property.mapImage,
            is_new_launch: property.isNewLaunch,
            is_featured: property.isFeatured,
            gallery_images: property.galleryImages,
        };

        return NextResponse.json(formattedProperty);
    } catch (error) {
        console.error('Error fetching property:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const id = parseInt(params.id);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const body = await request.json();
        const data: any = {};
        if (body.title !== undefined) data.title = body.title;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.property_type !== undefined) data.propertyType = body.property_type;
        if (body.price !== undefined) data.price = body.price;
        if (body.area !== undefined) data.area = body.area;
        if (body.bedrooms !== undefined) data.bedrooms = body.bedrooms;
        if (body.bathrooms !== undefined) data.bathrooms = body.bathrooms;
        if (body.description !== undefined) data.description = body.description;
        if (body.main_image !== undefined) data.mainImage = body.main_image;
        if (body.floor_plan_image !== undefined) data.floorPlanImage = body.floor_plan_image;
        if (body.map_image !== undefined) data.mapImage = body.map_image;
        if (body.is_new_launch !== undefined) data.isNewLaunch = body.is_new_launch;
        if (body.is_featured !== undefined) data.isFeatured = body.is_featured;
        if (body.compound_id !== undefined || body.compound !== undefined) data.compoundId = body.compound_id || body.compound || null;
        if (body.developer_id !== undefined || body.developer !== undefined) data.developerId = body.developer_id || body.developer || null;
        if (body.location_id !== undefined || body.location !== undefined) data.locationId = body.location_id || body.location || null;

        const property = await prisma.property.update({
            where: { id },
            data,
        });

        return NextResponse.json(property);
    } catch (error) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const id = parseInt(params.id);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        await prisma.property.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
