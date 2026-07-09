import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard'; // Pastikan path import DashboardLayout Anda benar
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head } from '@inertiajs/react';

// Props 'routes' di bawah ini otomatis dikirim oleh RouteController
export default function Index({ routes }) {
    const routeColumns = [
        { 
            header: '#', 
            render: (route, rowIndex) => `${rowIndex + 1}`
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
            header: 'Route Name', 
            accessor: 'route_name' 
            // Kita bisa pakai 'accessor' biasa atau 'render' untuk styling khusus
            // render: (user) => (
            //     <div className="font-medium text-white">{user.name}</div>
            // )
        },
        { 
            header: 'Actions', 
            // Menggunakan komponen dropdown ActionDropdown
            render: (route) => (
                <ActionsDropdown data={route} baseLink="/routes" view="false"/>
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Routes management">
            <Head title="Routes management" />

            {/* Bagian Atas: Judul & Tombol Tambah */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-zinc-700">List Routes</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all routes in the system.</p>
                </div>

                <RedirectOutlineButton
                    text="Add Route"
                    href="/routes/create"
                    routeName="routes.create"
                />
            </div>

            {/* Bagian Bawah: Memanggil Komponen Tabel */}
            {/* Kita lempar 'routeColumns' dan data 'routes' dari database */}
            <Table columns={routeColumns} data={routes} />

        </DashboardLayout>
    );
}