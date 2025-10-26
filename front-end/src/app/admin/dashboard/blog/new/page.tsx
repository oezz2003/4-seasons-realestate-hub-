import { getAuthors } from '@/lib/api';
import { BlogForm } from '@/components/dashboard/blog-form';

export default async function NewBlogPostPage() {
  const authors = await getAuthors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Blog Post</h1>
        <p className="text-muted-foreground">
          Create a new blog post
        </p>
      </div>

      <BlogForm authors={authors.results} />
    </div>
  );
}
