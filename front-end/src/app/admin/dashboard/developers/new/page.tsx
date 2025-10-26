import { DeveloperForm } from '@/components/dashboard/developer-form';

export default async function NewDeveloperPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Developer</h1>
        <p className="text-muted-foreground">
          Create a new property developer
        </p>
      </div>

      <DeveloperForm />
    </div>
  );
}
