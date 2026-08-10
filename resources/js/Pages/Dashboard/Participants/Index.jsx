import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head } from '@inertiajs/react';

export default function Index({ participants }) {
    const columns = [
        { 
            header: '#', 
            render: (participant, rowIndex) => `${rowIndex + 1}`
        },
        { 
            header: 'Name', 
            accessor: 'name' 
        },
        { 
            header: 'Email', 
            accessor: 'email' 
        },
        { 
            header: 'Institution', 
            accessor: 'institution' 
        },
        { 
            header: 'Actions', 
            render: (participant) => (
                <ActionsDropdown data={participant} baseLink="/participants" edit="false" view="true" />
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Participants Management">
            <Head title="Participants Management" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-200">List Participants</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage all participants who have taken tests.</p>
                </div>
            </div>

            <Table columns={columns} data={participants} />

        </DashboardLayout>
    );
}
