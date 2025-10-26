'use client';

import { useState } from 'react';
import { Author } from '@/lib/types';
import { deleteAuthor } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AuthorFormDialog } from '@/components/dashboard/author-form-dialog';
import { Edit, Trash2, Plus } from 'lucide-react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/image-helpers';

interface AuthorsPageClientProps {
  initialAuthors: Author[];
  count: number;
}

export function AuthorsPageClient({ initialAuthors, count }: AuthorsPageClientProps) {
  const [authors, setAuthors] = useState(initialAuthors);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await deleteAuthor(id);
      toast({
        title: "Success",
        description: "Author deleted successfully",
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting author:', error);
      toast({
        title: "Error",
        description: "Failed to delete author",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleFormSuccess = () => {
    router.refresh();
  };

  const tableData = authors.map((author) => ({
    id: author.id.toString(),
    name: (
      <div className="flex items-center gap-3">
        {(author as any).image && (
          <div className="w-10 h-10 relative rounded-full overflow-hidden">
            <Image
              src={getImageUrl((author as any).image)}
              alt={author.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        <span>{author.name}</span>
      </div>
    ),
    bio: (author as any).bio?.substring(0, 100) || 'N/A',
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedAuthor(author);
            setIsFormOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteId(author.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }));

  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'bio', accessorKey: 'bio', header: 'Bio' },
    { id: 'actions', accessorKey: 'actions', header: 'Actions' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Authors</h1>
            <p className="text-muted-foreground">
              Manage blog post authors
            </p>
          </div>
          <Button onClick={() => {
            setSelectedAuthor(undefined);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Author
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Authors ({count})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tableData}
              columns={columns}
            />
          </CardContent>
        </Card>
      </div>

      <AuthorFormDialog
        author={selectedAuthor}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the author.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
