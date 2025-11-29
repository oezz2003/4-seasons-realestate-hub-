'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { contactSubmissionsApi } from '@/lib/admin-api';
import { ContactsTable } from './table';
import { ContactFormSubmission } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

export function ContactsPageClient() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('page_size') || '10');

    const [data, setData] = useState<ContactFormSubmission[]>([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await contactSubmissionsApi.getAll({
                    page,
                    page_size: pageSize,
                });
                setData(response.results);
                setCount(response.count);
            } catch (error) {
                console.error('Failed to fetch contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, pageSize]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Contact Submissions</h1>
                    <p className="text-sm text-gray-500">
                        View and manage messages from the contact form
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Submissions ({count})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <ContactsTable
                            data={data}
                            count={count}
                            page={page}
                            pageSize={pageSize}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
