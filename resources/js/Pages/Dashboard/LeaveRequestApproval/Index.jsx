import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, useForm } from '@inertiajs/react';
import PremiumTable from '@/Components/PremiumTable';

export default function Index({ approvals }) {
    const { put, processing } = useForm();

    const handleApprove = (id) => {
        if(confirm('Apakah Anda yakin ingin menyetujui request ini?')) {
            put(route('leave-request-approvals.update', id), {
                data: { status: 'Approved' },
                preserveScroll: true,
            });
        }
    };

    const handleReject = (id) => {
        if(confirm('Apakah Anda yakin ingin menolak request ini?')) {
            put(route('leave-request-approvals.update', id), {
                data: { status: 'Rejected' },
                preserveScroll: true,
            });
        }
    };

    const columns = [
        { key: 'id', label: 'ID' },
        { 
            key: 'leave_request', 
            label: 'Leave Request',
            render: (item) => item.leave_request ? `Request #${item.leave_request.id}` : '-'
        },
        { key: 'approval_level', label: 'Level' },
        { key: 'approver_role', label: 'Role' },
        { 
            key: 'status', 
            label: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    item.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                    item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {item.status}
                </span>
            )
        },
        { 
            key: 'actions', 
            label: 'Aksi',
            render: (item) => (
                <div className="flex space-x-2">
                    {item.status === 'Pending' && (
                        <>
                            <button 
                                onClick={() => handleApprove(item.id)}
                                disabled={processing}
                                className="text-green-600 hover:text-green-900 font-medium text-sm"
                            >
                                Setujui
                            </button>
                            <button 
                                onClick={() => handleReject(item.id)}
                                disabled={processing}
                                className="text-red-600 hover:text-red-900 font-medium text-sm"
                            >
                                Tolak
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <DashboardLayout judulHalaman="Approval Cuti">
            <Head title="Approval Cuti" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Approval Cuti</h1>
                    <p className="text-sm text-gray-600 mt-1">Daftar permintaan cuti yang membutuhkan persetujuan Anda.</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <PremiumTable
                    columns={columns}
                    data={approvals}
                    searchable={true}
                    searchField="id"
                    emptyMessage="Tidak ada request cuti yang perlu di-approve saat ini."
                />
            </div>
        </DashboardLayout>
    );
}
