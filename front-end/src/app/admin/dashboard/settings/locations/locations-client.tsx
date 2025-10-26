'use client';

import { useState } from 'react';
import { Location } from '@/lib/types';
import { deleteLocation } from '@/lib/api';
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
import { LocationFormDialog } from '@/components/dashboard/location-form-dialog';
import { Edit, Trash2, Plus } from 'lucide-react';

interface LocationsPageClientProps {
  initialLocations: Location[];
  count: number;
}

export function LocationsPageClient({ initialLocations, count }: LocationsPageClientProps) {
  const [locations, setLocations] = useState(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState<Location | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      await deleteLocation(id);
      toast({
        title: "Success",
        description: "Location deleted successfully",
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Error",
        description: "Failed to delete location",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const handleFormSuccess = () => {
    router.refresh();
  };

  const tableData = locations.map((location) => ({
    id: location.id.toString(),
    name: location.name,
    slug: location.slug,
    actions: (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedLocation(location);
            setIsFormOpen(true);
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setDeleteId(location.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }));

  const columns = [
    { id: 'name', accessorKey: 'name', header: 'Name' },
    { id: 'slug', accessorKey: 'slug', header: 'Slug' },
    { id: 'actions', accessorKey: 'actions', header: 'Actions' },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Locations</h1>
            <p className="text-muted-foreground">
              Manage property locations
            </p>
          </div>
          <Button onClick={() => {
            setSelectedLocation(undefined);
            setIsFormOpen(true);
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Location
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Locations ({count})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tableData}
              columns={columns}
            />
          </CardContent>
        </Card>
      </div>

      <LocationFormDialog
        location={selectedLocation}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the location.
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
