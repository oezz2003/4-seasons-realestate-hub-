import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('page_size') || '10');
        const skip = (page - 1) * pageSize;

        const [submissions, count] = await Promise.all([
            prisma.contactFormSubmission.findMany({
                skip,
                take: pageSize,
                orderBy: { submittedAt: 'desc' }
            }),
            prisma.contactFormSubmission.count()
        ]);

        const formattedSubmissions = submissions.map(s => ({
            ...s,
            submitted_at: s.submittedAt.toISOString(),
        }));

        return NextResponse.json({
            results: formattedSubmissions,
            count,
            next: page * pageSize < count ? `?page=${page + 1}` : null,
            previous: page > 1 ? `?page=${page - 1}` : null,
        });
    } catch (error) {
        console.error('Error fetching submissions:', error);
        return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const submission = await prisma.contactFormSubmission.create({
            data: {
                name: body.name,
                email: body.email,
                phone: body.phone,
                message: body.message,
            },
        });

        return NextResponse.json({
            ...submission,
            submitted_at: submission.submittedAt.toISOString()
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating submission:', error);
        return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
    }
}
