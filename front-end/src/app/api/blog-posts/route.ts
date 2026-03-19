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

        const authorId = searchParams.get('author');
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const slug = searchParams.get('slug');

        const where: any = {};

        if (slug) where.slug = slug;
        if (authorId) {
            if (isNaN(Number(authorId))) where.author = { name: authorId }; // fallback for name match
            else where.authorId = parseInt(authorId);
        }
        if (status) where.status = status;

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
                { excerpt: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [posts, count] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                include: { author: true },
                skip,
                take: pageSize,
                orderBy: { publishDate: 'desc' }
            }),
            prisma.blogPost.count({ where })
        ]);

        const formattedPosts = posts.map(p => ({
            ...p,
            publish_date: p.publishDate.toISOString(),
        }));

        return NextResponse.json({
            results: formattedPosts,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const authorId = body.author_id ? parseInt(body.author_id) : (body.author ? parseInt(body.author) : null);
        
        const post = await prisma.blogPost.create({
            data: {
                title: body.title,
                slug: body.slug || slugify(body.title),
                excerpt: body.excerpt,
                content: body.content,
                image: body.image,
                status: body.status || 'Draft',
                authorId: authorId,
            },
        });

        return NextResponse.json({ ...post, publish_date: post.publishDate }, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}
