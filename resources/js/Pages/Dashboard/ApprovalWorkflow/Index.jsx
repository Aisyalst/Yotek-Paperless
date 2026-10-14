import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import AddButton from '@/Components/AddButton';
import DropdownActions from '@/Components/DropdownActions';
import { Head, router } from '@inertiajs/react';

export default function Index({ workflows }) {
    const columns = [
        { 
            header: '#', 
            render: (workflow, rowIndex) => `${rowIndex + 1}`
        },
        { 
            header: 'Tipe Workflow', 
            render: (workflow) => (
                <span className="font-semibold text-[#1a1a1a]">{workflow.workflow_type}</span>
            )
        },
        { 
            header: 'Judul', 
            render: (workflow) => (
                <span className="text-[#1a1a1a]">{workflow.title}</span>
            )
        },
        { 
            header: 'Aksi',
            render: (workflow) => (
                <DropdownActions items={[
                    { label: 'Edit', href: `/approval-workflows/${workflow.id}/edit`, permission: 'approval-workflows.edit' },
                    { label: 'Hapus', href: `/approval-workflows/${workflow.id}`, method: 'delete', permission: 'approval-workflows.destroy', danger: true, confirm: 'Hapus data ini?' },
                ]} />
            )
        }
    ];

    return (
        <DashboardLayout judulHalaman="Approval Workflows">
            <Head title="Approval Workflows" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Approval Workflows</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola data approval workflow dan tahapannya.</p>
                </div>
                
                <AddButton
                    text="Tambah Workflow"
                    href="/approval-workflows/create"
                    routeName="approval-workflows.create"
                />
            </div>

            <Table columns={columns} data={workflows} />

        </DashboardLayout>
    );
}
