const { S3Client, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Manually load .env since we are in a script
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, 'utf8');
  env.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=');
    if (key && value) {
      process.env[key.trim()] = value.trim().replace(/^"|"$/g, '');
    }
  });
}

const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'http://localhost:8333',
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || 'admin',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'admin123',
  },
  forcePathStyle: true,
});

async function main() {
  const bucketName = process.env.S3_BUCKET_NAME || 'uploads';
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicRead',
        Effect: 'Allow',
        Principal: '*',
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  };

  try {
    console.log(`Setting public policy for bucket: ${bucketName}`);
    console.log(`Endpoint: ${process.env.S3_ENDPOINT}`);
    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(policy),
      })
    );
    console.log('Public policy set successfully!');
  } catch (error) {
    console.error('Error setting bucket policy:', error);
  }
}

main();
