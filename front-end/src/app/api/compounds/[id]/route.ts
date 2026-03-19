import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    try {
        const id = parseInt(idParam);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const compound = await prisma.compound.findUnique({
            where: { id },
            include: {
                developer: true,
                location: true,
                amenities: true,
            },
        });

        if (!compound) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const formattedCompound = {
            ...compound,
            main_image: compound.mainImage,
            delivery_date: compound.deliveryDate,
        };

        return NextResponse.json(formattedCompound);
    } catch (error) {
        console.error('Error fetching compound:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const id = parseInt(idParam);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const body = await request.json();
        const data: any = {};
        if (body.name !== undefined) data.name = body.name;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.description !== undefined) data.description = body.description;
        if (body.main_image !== undefined) data.mainImage = body.main_image;
        if (body.status !== undefined) data.status = body.status;
        if (body.delivery_date !== undefined) data.deliveryDate = body.delivery_date;
        if (body.developer_id !== undefined || body.developer !== undefined) data.developerId = body.developer_id ? parseInt(body.developer_id) : (body.developer ? parseInt(body.developer) : null);
        if (body.location_id !== undefined || body.location !== undefined) data.locationId = body.location_id ? parseInt(body.location_id) : (body.location ? parseInt(body.location) : null);

        // Handle amenities
        if (body.amenities && Array.isArray(body.amenities)) {
            data.amenities = {
                set: body.amenities.map((id: any) => ({ id: parseInt(id) }))
            };
        }

        const compound = await prisma.compound.update({
            where: { id },
            data,
            include: {
                amenities: true,
                developer: true,
                location: true
            }
        });

        return NextResponse.json(compound);
    } catch (error) {
        console.error('Error updating compound:', error);
        return NextResponse.json({ error: 'Failed to update compound' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: idParam } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const id = parseInt(idParam);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        await prisma.compound.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting compound:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
