import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head } from '@inertiajs/react';

export default function Index({ tokens }) {
    const tokenColumns = [
        { 
            header: '#', 
            render: (token, rowIndex) => `${rowIndex + 1}`
        },
        { 
            header: 'Token', 
            accessor: 'token' 
        },
        { 
            header: 'Test Types', 
            accessor: 'test_type' 
        },
        { 
            header: 'Status', 
            render: (token) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${token.status === 'unused' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {token.status}
                </span>
            )
        },
        { 
            header: 'Expires At', 
            render: (token) => new Date(token.expires_at).toLocaleString()
        },
        { 
            header: 'Actions', 
            render: (token) => (
                <ActionsDropdown data={token} baseLink="/tokens" view="false" edit="false" />
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Tokens Management">
            <Head title="Tokens Management" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-200">List Tokens</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage all API tokens for participants.</p>
                </div>

                <RedirectOutlineButton
                    text="Generate Token"
                    href="/tokens/create"
                    routeName="tokens.create"
                />
            </div>

            <Table columns={tokenColumns} data={tokens} />

        </DashboardLayout>
    );
}
