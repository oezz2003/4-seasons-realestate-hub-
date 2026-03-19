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

        const post = await prisma.blogPost.findUnique({
            where: { id },
            include: { author: true },
        });

        if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        return NextResponse.json({
            ...post,
            publish_date: post.publishDate.toISOString(),
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
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
        if (body.title !== undefined) data.title = body.title;
        if (body.slug !== undefined) data.slug = body.slug;
        if (body.excerpt !== undefined) data.excerpt = body.excerpt;
        if (body.content !== undefined) data.content = body.content;
        if (body.image !== undefined) data.image = body.image;
        if (body.status !== undefined) data.status = body.status;
        if (body.author_id !== undefined || body.author !== undefined) {
            data.authorId = body.author_id ? parseInt(body.author_id) : (body.author ? parseInt(body.author) : null);
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data,
        });

        return NextResponse.json({ ...post, publish_date: post.publishDate.toISOString() });
    } catch (error) {
        console.error('Error updating blog post:', error);
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

        await prisma.blogPost.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
    }
}
