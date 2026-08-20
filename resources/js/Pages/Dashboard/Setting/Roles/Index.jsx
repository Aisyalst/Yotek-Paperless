import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard'; // Pastikan path import DashboardLayout Anda benar
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head } from '@inertiajs/react';

// Props 'roles' di bawah ini otomatis dikirim oleh RoleController
export default function Index({ roles }) {
    const roleColumns = [
        { 
            header: '#', 
            render: (role, rowIndex) => `${rowIndex + 1}`
        },
        { 
            header: 'Name', 
            accessor: 'name' 
        },
        {
            header: 'Divisi',
            render: (role) => (
                role.devision ? role.devision.name : '-'
            )
        },
        { 
            header: 'Total Permissions', 
            accessor: 'permissions_count' 
        },
        { 
            header: 'Total Users', 
            accessor: 'users_count' 
        },
        { 
            header: 'Actions', 
            // Menggunakan komponen dropdown ActionDropdown
            render: (role) => (
                <ActionsDropdown data={role} baseLink="/roles" view="false"/>
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Roles management">
            <Head title="Roles management" />

            {/* Bagian Atas: Judul & Tombol Tambah */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">List Roles</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage all roles in the system.</p>
                </div>

                <RedirectOutlineButton
                    text="Add Role"
                    href="/roles/create"
                    routeName="roles.create"
                />
            </div>

            {/* Bagian Bawah: Memanggil Komponen Tabel */}
            {/* Kita lempar 'roleColumns' dan data 'roles' dari database */}
            <Table columns={roleColumns} data={roles} />

        </DashboardLayout>
    );
}
