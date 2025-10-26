import { BlogPostEditClient } from '../../blog-post-edit-client';

interface EditBlogPostPageProps {
  params: { id: string };
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  return <BlogPostEditClient id={params.id} />;
}
