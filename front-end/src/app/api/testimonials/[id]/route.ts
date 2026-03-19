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

        const testimonial = await prisma.testimonial.findUnique({
            where: { id },
        });

        if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            ...testimonial,
            client_name: testimonial.clientName,
            client_avatar: testimonial.clientAvatar,
            testimonial_text: testimonial.quote,
        });
    } catch (error) {
        console.error('Error fetching testimonial:', error);
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
        if (body.client_name !== undefined) data.clientName = body.client_name;
        if (body.client_photo !== undefined || body.client_avatar !== undefined) data.clientAvatar = body.client_photo || body.client_avatar;
        if (body.rating !== undefined) data.rating = body.rating;
        if (body.testimonial_text !== undefined || body.quote !== undefined) data.quote = body.testimonial_text || body.quote;

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data,
        });

        return NextResponse.json({
            ...testimonial,
            client_name: testimonial.clientName,
            client_avatar: testimonial.clientAvatar,
            testimonial_text: testimonial.quote,
        });
    } catch (error) {
        console.error('Error updating testimonial:', error);
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

        await prisma.testimonial.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting testimonial:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
