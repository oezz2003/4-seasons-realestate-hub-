'use client';

import { ContactFormSubmission } from '@/lib/types';
import { DataTable } from '@/components/dashboard/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Eye, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { contactSubmissionsApi } from '@/lib/admin-api';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactsTableProps {
    data: ContactFormSubmission[];
    count: number;
    page: number;
    pageSize: number;
}

export function ContactsTable({ data, count, page, pageSize }: ContactsTableProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        try {
            await contactSubmissionsApi.delete(deleteId);
            toast({
                title: "Success",
                description: "Submission deleted successfully",
            });
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete submission",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const columns: ColumnDef<ContactFormSubmission>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'phone',
            header: 'Phone',
            cell: ({ row }) => row.original.phone || 'N/A',
        },
        {
            accessorKey: 'submitted_at',
            header: 'Date',
            cell: ({ row }) => format(new Date(row.original.submitted_at), 'PPP'),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/dashboard/contacts/${row.original.id}`)}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(row.original.id)}
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                pagination={{
                    currentPage: page,
                    totalPages: Math.ceil(count / pageSize),
                    totalCount: count,
                    pageSize: pageSize,
                    baseUrl: '/admin/dashboard/contacts',
                    showPageSizeSelector: true,
                }}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the contact submission.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
