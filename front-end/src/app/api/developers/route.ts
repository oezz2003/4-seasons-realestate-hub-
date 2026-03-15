import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { slugify } from '@/lib/utils';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('page_size') || '10');
        const skip = (page - 1) * pageSize;

        const search = searchParams.get('search');
        const slug = searchParams.get('slug');

        const where: any = {};

        if (slug) where.slug = slug;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [developers, count] = await Promise.all([
            prisma.developer.findMany({
                where,
                skip,
                take: pageSize,
                orderBy: { id: 'desc' }
            }),
            prisma.developer.count({ where })
        ]);

        const formattedDevelopers = await Promise.all(developers.map(async (d: any) => {
            const projectsCount = await prisma.compound.count({ where: { developerId: d.id } });
            return {
                ...d,
                projects_count: projectsCount
            };
        }));

        return NextResponse.json({
            results: formattedDevelopers,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching developers:', error);
        return NextResponse.json({ error: 'Failed to fetch developers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const developer = await prisma.developer.create({
            data: {
                name: body.name,
                slug: body.slug || slugify(body.name),
                description: body.description,
                logo: body.logo,
            },
        });

        return NextResponse.json({ ...developer, projects_count: 0 }, { status: 201 });
    } catch (error) {
        console.error('Error creating developer:', error);
        return NextResponse.json({ error: 'Failed to create developer' }, { status: 500 });
    }
}
