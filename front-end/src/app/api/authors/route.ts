import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('page_size') || '10');
        const skip = (page - 1) * pageSize;
        const search = searchParams.get('search');

        const where: any = {};
        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        const [authors, count] = await Promise.all([
            prisma.author.findMany({
                where,
                skip,
                take: pageSize,
            }),
            prisma.author.count({ where })
        ]);

        return NextResponse.json({
            results: authors,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching authors:', error);
        return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const author = await prisma.author.create({
            data: {
                name: body.name,
                picture: body.picture,
            },
        });

        return NextResponse.json(author, { status: 201 });
    } catch (error) {
        console.error('Error creating author:', error);
        return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
    }
}
