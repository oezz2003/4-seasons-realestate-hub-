import { NextRequest, NextResponse } from 'next/server';

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://127.0.0.1:8000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const authToken = request.headers.get('authorization');

    if (!authToken) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    // Forward the request to Django backend
    const response = await fetch(`${DJANGO_API_URL}/api/admin/upload/image/`, {
      method: 'POST',
      headers: {
        'Authorization': authToken,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Upload failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

