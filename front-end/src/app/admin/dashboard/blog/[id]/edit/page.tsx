import { BlogPostEditClient } from '../../blog-post-edit-client';

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = await params;
  return <BlogPostEditClient id={id} />;
}
