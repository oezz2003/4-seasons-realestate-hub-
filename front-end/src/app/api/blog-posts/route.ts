import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { slugify } from '@/lib/utils';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const blogPostSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255),
    slug: z.string().max(255).optional().nullable(),
    excerpt: z.string().min(1, 'Excerpt is required').max(1000),
    content: z.string().min(1, 'Content is required'),
    image: z.string().url('Invalid image URL').optional().nullable(),
    status: z.enum(['Draft', 'Published']).optional().default('Draft'),
    author_id: z.union([z.string(), z.number()]).optional().nullable(),
    author: z.union([z.string(), z.number()]).optional().nullable(),
});
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

        const where: Prisma.BlogPostWhereInput = {};

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
        
        const result = blogPostSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Validation failed', details: result.error.format() }, { status: 400 });
        }
        
        const data = result.data;
        const authorId = data.author_id ? parseInt(data.author_id as string) : (data.author ? parseInt(data.author as string) : null);
        
        const post = await prisma.blogPost.create({
            data: {
                title: data.title,
                slug: data.slug || slugify(data.title),
                excerpt: data.excerpt,
                content: data.content,
                image: data.image,
                status: data.status,
                authorId: isNaN(authorId as number) ? null : authorId,
            },
        });

        return NextResponse.json({ ...post, publish_date: post.publishDate }, { status: 201 });
    } catch (error) {
        console.error('Error creating blog post:', error);
        return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
    }
}
