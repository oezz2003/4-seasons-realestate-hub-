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

        const partner = await prisma.partner.findUnique({
            where: { id },
        });

        if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json(partner);
    } catch (error) {
        console.error('Error fetching partner:', error);
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
        if (body.logo !== undefined) data.logo = body.logo;

        const partner = await prisma.partner.update({
            where: { id },
            data,
        });

        return NextResponse.json(partner);
    } catch (error) {
        console.error('Error updating partner:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
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

        await prisma.partner.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting partner:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
