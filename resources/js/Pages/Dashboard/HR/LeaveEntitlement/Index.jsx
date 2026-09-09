import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head } from '@inertiajs/react';

export default function Index({ leaveEntitlements = [] }) {
    const columns = [
        { 
            header: '#', 
            render: (item, rowIndex) => rowIndex + 1
        },
        { 
            header: 'Karyawan', 
            render: (item) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-[#1a1a1a]">{item.user?.personal_information?.full_name || item.user?.name || '-'}</span>
                    <span className="text-xs text-gray-500">{item.nik}</span>
                </div>
            )
        },
        { 
            header: 'Total Cuti', 
            render: (item) => `${item.total} Hari`
        },
        { 
            header: 'Durasi', 
            accessor: 'duration' 
        },
        {
            header: 'Tanggal Mulai',
            render: (item) => {
                if (!item.start_date) return '-';
                const date = new Date(item.start_date);
                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            }
        },
        {
            header: 'Tanggal Berakhir',
            render: (item) => {
                if (!item.end_date) return '-';
                const date = new Date(item.end_date);
                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            }
        },
        {
            header: 'Status',
            render: (item) => {
                const statusColors = {
                    'Aktif': 'text-green-500 border-green-500',
                    'Hangus': 'text-red-500 border-red-500',
                    'Habis': 'text-yellow-500 border-yellow-500',
                };
                const colorClass = statusColors[item.status] || 'text-gray-500 border-gray-500';
                
                return item.status ? (
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
                        {item.status}
                    </span>
                ) : '-';
            }
        },
        { 
            header: 'Aksi', 
            render: (item) => (
                <ActionsDropdown data={item} baseLink="/leave-entitlements" />
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Hak Cuti">
            <Head title="Hak Cuti" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Hak Cuti</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola hak cuti karyawan.</p>
                </div>
                
                <RedirectOutlineButton 
                    text="Tambah Hak Cuti"
                    href="/leave-entitlements/create"
                    routeName="leave-entitlements.create"
                />
            </div>

            <Table columns={columns} data={leaveEntitlements} />

        </DashboardLayout>
    );
}
