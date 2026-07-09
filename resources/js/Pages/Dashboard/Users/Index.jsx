import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard'; // Pastikan path import DashboardLayout Anda benar
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head } from '@inertiajs/react';

// Props 'users' di bawah ini otomatis dikirim oleh UserController
export default function Index({ users }) {
    const userColumns = [
        { 
            header: '#', 
            render: (user, rowIndex) => `${rowIndex + 1}`
        },
        { 
            header: 'Name', 
            accessor: 'name' 
            // Kita bisa pakai 'accessor' biasa atau 'render' untuk styling khusus
            // render: (user) => (
            //     <div className="font-medium text-white">{user.name}</div>
            // )
        },
        { 
            header: 'Email', 
            accessor: 'email' 
        },
        { 
            header: 'Join Date', 
            // Contoh mengubah format tanggal dari database (created_at)
            render: (user) => {
                const date = new Date(user.created_at);
                return date.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            }
        },
        { 
            header: 'Permissions Count', 
            accessor: 'permissions_count' 
        },
        { 
            header: 'Status', 
            // Menggunakan komponen dropdown ActionDropdown
            render: (user) => (
                user.is_active ? (
                    <span className="px-2 py-1 rounded-md text-xs font-semibold text-green-500 border border-green-500">
                        Active
                    </span>
                ) : (
                    <span className="px-2 py-1 rounded-md text-xs font-semibold border border-red-500">
                        Inactive
                    </span>
                )
            ) 
        },
        { 
            header: 'Role', 
            render: (user) => (
                <span className="px-2 py-1 rounded-md text-xs font-semibold text-blue-500 border border-blue-500">
                    {user.role.name}
                </span>
            )
        },
        { 
            header: 'Actions', 
            // Menggunakan komponen dropdown ActionDropdown
            render: (user) => (
                <ActionsDropdown data={user} baseLink="/users" view="true"/>
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Users management">
            <Head title="Users management" />

            {/* Bagian Atas: Judul & Tombol Tambah */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-200">List User</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage all user accounts in the system.</p>
                </div>
                
                <RedirectOutlineButton 
                    text="Add User"
                    href="/users/create"
                    routeName="users.create"
                />
            </div>

            {/* Bagian Bawah: Memanggil Komponen Tabel */}
            {/* Kita lempar 'userColumns' dan data 'users' dari database */}
            <Table columns={userColumns} data={users} />

        </DashboardLayout>
    );
}