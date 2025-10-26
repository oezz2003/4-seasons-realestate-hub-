'use client';

import { useState } from 'react';
import { Amenity } from '@/lib/types';
import { deleteAmenity } from '@/lib/api';
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
import { AmenityFormDialog } from '@/components/dashboard/amenity-form-dialog';
import { Edit, Trash2, Plus } from 'lucide-react';

interface AmenitiesPageClientProps {
  initialAmenities: Amenity[];
  count: number;
}

export function AmenitiesPageClient({ initialAmenities, count }: AmenitiesPageClientProps) {
  const [amenities, setAmenities] = useState(initialAmenities);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await deleteAmenity(id);
      toast({
        title: "Success",
        description: "Amenity deleted successfully",
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting amenity:', error);
      toast({
        title: "Error",
        description: "Failed to delete amenity",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleFormSuccess = () => {
    router.refresh();
  };

  const tableData = amenities.map((amenity) => ({
    id: amenity.id.toString(),
    name: amenity.name,
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedAmenity(amenity);
            setIsFormOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteId(amenity.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }));

  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'actions', accessorKey: 'actions', header: 'Actions' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Amenities</h1>
            <p className="text-muted-foreground">
              Manage property amenities
            </p>
          </div>
          <Button onClick={() => {
            setSelectedAmenity(undefined);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Amenity
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Amenities ({count})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tableData}
              columns={columns}
            />
          </CardContent>
        </Card>
      </div>

      <AmenityFormDialog
        amenity={selectedAmenity}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the amenity.
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
