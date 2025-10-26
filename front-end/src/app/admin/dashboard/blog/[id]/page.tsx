import { BlogPostDetailsClient } from '../blog-post-detail-client';

interface BlogPostDetailsPageProps {
  params: { id: string };
}

export default async function BlogPostDetailsPage({ params }: BlogPostDetailsPageProps) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  return <BlogPostDetailsClient id={resolvedParams.id} />;
}

