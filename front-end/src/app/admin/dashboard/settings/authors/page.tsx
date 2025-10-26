import { getAuthors } from '@/lib/api';
import { AuthorsPageClient } from './authors-client';

export default async function AuthorsPage() {
  const authorsData = await getAuthors();

  return <AuthorsPageClient initialAuthors={authorsData.results} count={authorsData.count} />;
}
