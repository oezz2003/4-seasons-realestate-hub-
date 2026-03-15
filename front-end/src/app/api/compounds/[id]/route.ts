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
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const id = parseInt(params.id);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const body = await request.json();
        const data: any = {};
        if (body.name !== undefined) data.name = body.name;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.description !== undefined) data.description = body.description;
        if (body.main_image !== undefined) data.mainImage = body.main_image;
        if (body.status !== undefined) data.status = body.status;
        if (body.delivery_date !== undefined) data.deliveryDate = body.delivery_date;
        if (body.developer_id !== undefined || body.developer !== undefined) data.developerId = body.developer_id || body.developer || null;
        if (body.location_id !== undefined || body.location !== undefined) data.locationId = body.location_id || body.location || null;

        const compound = await prisma.compound.update({
            where: { id },
            data,
        });

        return NextResponse.json(compound);
    } catch (error) {
        console.error('Error updating compound:', error);
        return NextResponse.json({ error: 'Failed to update compound' }, { status: 500 });
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

        await prisma.compound.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting compound:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
