import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const developer = await prisma.developer.findUnique({
            where: { id },
        });

        if (!developer) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const projectsCount = await prisma.compound.count({ where: { developerId: developer.id } });

        return NextResponse.json({
            ...developer,
            projects_count: projectsCount
        });
    } catch (error) {
        console.error('Error fetching developer:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}

import { z } from 'zod';

const developerUpdateSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z.string().max(255).optional(),
    description: z.string().optional().nullable(),
    logo: z.string().url().optional().nullable(),
});

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const id = parseInt(idParam);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const body = await request.json();
        
        const result = developerUpdateSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Validation failed', details: result.error.format() }, { status: 400 });
        }
        
        const data = result.data;

        const developer = await prisma.developer.update({
            where: { id },
            data,
        });

        return NextResponse.json(developer);
    } catch (error) {
        console.error('Error updating developer:', error);
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const id = parseInt(idParam);
        if (isNaN(id)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        await prisma.developer.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting developer:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
