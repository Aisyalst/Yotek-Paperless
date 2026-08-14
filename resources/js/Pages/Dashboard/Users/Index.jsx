import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard'; // Pastikan path import DashboardLayout Anda benar
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

// Props 'users' di bawah ini otomatis dikirim oleh UserController
export default function Index({ users, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('users.index'),
            { search: searchQuery, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);
        router.get(
            route('users.index'),
            { search: searchQuery, per_page: newPerPage },
            { preserveState: true, replace: true }
        );
    };

    const userColumns = [
        { 
            header: '#', 
            render: (user, rowIndex) => `${(users.current_page - 1) * users.per_page + rowIndex + 1}`
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
            header: 'Phone',
            accessor: 'phone'
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
                Number(user.is_active) === 1 ? (
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
                    <h1 className="text-xl font-bold text-[#1a1a1a]">List User</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage all user accounts in the system.</p>
                </div>
                
                <RedirectOutlineButton 
                    text="Add User"
                    href="/users/create"
                    routeName="users.create"
                />
            </div>

            {/* Search Bar & Per Page */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Show</span>
                    <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm text-sm"
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                    <span className="text-sm text-gray-600">entries</span>
                </div>

                <form onSubmit={handleSearch} className="flex w-full sm:w-1/3 gap-2">
                    <TextInput
                        type="text"
                        name="search"
                        value={searchQuery}
                        placeholder="Search users..."
                        className="w-full text-sm"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Bagian Bawah: Memanggil Komponen Tabel */}
            {/* Kita lempar 'userColumns' dan data 'users' dari database */}
            <Table columns={userColumns} data={users.data} />
            
            <Pagination links={users.links} />

        </DashboardLayout>
    );
}
