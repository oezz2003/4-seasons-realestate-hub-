import { notFound } from 'next/navigation';
import { getDeveloperById } from '@/lib/api';
import { DeveloperForm } from '@/components/dashboard/developer-form';

interface EditDeveloperPageProps {
  params: { id: string };
}

export default async function EditDeveloperPage({ params }: EditDeveloperPageProps) {
  // Await params for Next.js 15 compatibility
  const resolvedParams = await params;
  const developer = await getDeveloperById(resolvedParams.id);

  if (!developer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Developer</h1>
        <p className="text-muted-foreground">
          Update developer information
        </p>
      </div>

      <DeveloperForm developer={developer} />
    </div>
  );
}
