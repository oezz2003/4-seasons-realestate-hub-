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

        const location = await prisma.location.findUnique({
            where: { id },
        });

        if (!location) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            ...location,
            map_url: location.mapUrl
        });
    } catch (error) {
        console.error('Error fetching location:', error);
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
        if (body.map_url !== undefined) data.mapUrl = body.map_url;

        const location = await prisma.location.update({
            where: { id },
            data,
        });

        return NextResponse.json({ ...location, map_url: location.mapUrl });
    } catch (error) {
        console.error('Error updating location:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
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

        await prisma.location.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting location:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
