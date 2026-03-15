import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Bulk upload not yet implemented in unified backend. Please use individual uploads.' },
    { status: 501 }
  );
}

