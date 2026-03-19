'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, Edit, Trash2, Star, Rocket, MoreHorizontal } from 'lucide-react';
import { Property } from '@/lib/types';
import { DataTable } from '@/components/dashboard/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteProperty } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getImageUrl } from '@/lib/image-helpers';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PropertiesTableProps {
  data: Property[];
}

export function PropertiesTable({ data }: PropertiesTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await deleteProperty(id);
      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      router.refresh();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: 'main_image',
      header: 'Image',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <div className="h-12 w-12 relative rounded-lg overflow-hidden bg-gray-100">
            {property.main_image ? (
              <Image
                src={getImageUrl(property.main_image)}
                alt={property.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{property.title}</span>
              {property.is_featured && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
              {property.is_new_launch && (
                <Badge variant="default" className="text-xs">
                  <Rocket className="h-3 w-3 mr-1" />
                  New Launch
                </Badge>
              )}
            </div>
            <span className="text-sm text-gray-500">{property.property_type}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'compound',
      header: 'Compound',
      cell: ({ row }) => {
        const property = row.original;
        return property.compound ? (
          <span className="text-sm">{property.compound.name}</span>
        ) : (
          <span className="text-sm text-gray-400">Standalone</span>
        );
      },
    },
    {
      accessorKey: 'developer',
      header: 'Developer',
      cell: ({ row }) => {
        const property = row.original;
        return property.developer ? (
          <span className="text-sm">{property.developer.name}</span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
      cell: ({ row }) => {
        const property = row.original;
        return property.location ? (
          <span className="text-sm">{property.location.name}</span>
        ) : (
          <span className="text-sm text-gray-400">-</span>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <span className="font-medium">
            EGP {parseFloat(property.price).toLocaleString()}
          </span>
        );
      },
    },
    {
      accessorKey: 'area',
      header: 'Area',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <span className="text-sm">
            {property.area} sqm
          </span>
        );
      },
    },
    {
      accessorKey: 'bedrooms',
      header: 'Bedrooms',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <span className="text-sm">
            {property.bedrooms} bed, {property.bathrooms} bath
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const property = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/properties/${property.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/admin/dashboard/properties/${property.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDelete(property.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} searchKey="title" searchPlaceholder="Search properties..." />;
}
