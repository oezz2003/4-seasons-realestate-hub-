import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

const leadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  locationId: z.number().optional().nullable(),
  compoundId: z.number().optional().nullable(),
  developerId: z.number().optional().nullable(),
  propertyType: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    const lead = await prisma.lead.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        locationId: validatedData.locationId,
        compoundId: validatedData.compoundId,
        developerId: validatedData.developerId,
        propertyType: validatedData.propertyType,
        message: validatedData.message,
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating lead:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const leads = await prisma.lead.findMany({
      orderBy: { submittedAt: 'desc' },
      include: {
        location: { select: { name: true } },
        compound: { select: { name: true } },
        developer: { select: { name: true } },
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
