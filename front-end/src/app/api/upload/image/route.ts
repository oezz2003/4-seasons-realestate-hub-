import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize S3 Client
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:8333',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || 'admin',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'admin123',
  },
  forcePathStyle: true, // Required for SeaweedFS/MinIO
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const files = formData.getAll('image') as File[];
    const type = formData.get('type') as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create a unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const extension = file.name.split('.').pop() || 'tmp';
      const filename = `${type ? type + '-' : ''}${uniqueSuffix}.${extension}`;
      const key = filename; // Key is relative to the bucket

      // Upload to S3
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME || 'uploads',
          Key: key,
          Body: buffer,
          ContentType: file.type,
        })
      );

      // Construct the public URL
      const publicUrlBase = process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}`;
      const fileUrl = `${publicUrlBase.replace(/\/$/, '')}/${filename}`;

      results.push({
        id: uniqueSuffix,
        image: fileUrl,
        url: fileUrl,
        file_path: fileUrl
      });
    }

    // Return the appropriate format based on whether it was a single or multiple upload
    if (results.length === 1 && files.length === 1) {
      return NextResponse.json({
        success: true,
        ...results[0]
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      images: results
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json({ error: 'Failed to upload file to storage' }, { status: 500 });
  }
}

