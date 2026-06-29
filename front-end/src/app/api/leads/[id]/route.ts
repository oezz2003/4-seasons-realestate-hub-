import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || typeof status !== 'string') {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: parseInt(id, 10) },
      data: { status },
    });

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update lead status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;

    await prisma.lead.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
