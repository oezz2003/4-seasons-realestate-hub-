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

        const [testimonials, count] = await Promise.all([
            prisma.testimonial.findMany({
                skip,
                take: pageSize,
            }),
            prisma.testimonial.count()
        ]);

        const formattedTestimonials = testimonials.map(t => ({
            ...t,
            client_name: t.clientName,
            client_photo: t.clientAvatar,
            client_avatar: t.clientAvatar,
            testimonial_text: t.quote,
            quote: t.quote,
        }));

        return NextResponse.json({
            results: formattedTestimonials,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const testimonial = await prisma.testimonial.create({
            data: {
                clientName: body.client_name,
                clientAvatar: body.client_photo || body.client_avatar,
                rating: body.rating,
                quote: body.testimonial_text || body.quote,
            },
        });

        return NextResponse.json({
            ...testimonial,
            client_name: testimonial.clientName,
            client_avatar: testimonial.clientAvatar,
            testimonial_text: testimonial.quote,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating testimonial:', error);
        return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }
}
