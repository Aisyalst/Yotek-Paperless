import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

export default function Index({ contracts, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('contracts.index'),
            { search: searchQuery, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);
        router.get(
            route('contracts.index'),
            { search: searchQuery, per_page: newPerPage },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        { 
            header: '#', 
            render: (contract, rowIndex) => `${(contracts.current_page - 1) * contracts.per_page + rowIndex + 1}`
        },
        { 
            header: 'Karyawan', 
            render: (contract) => contract.user?.name || contract.nik
        },
        { 
            header: 'Nomor Kontrak', 
            accessor: 'contract_number' 
        },
        { 
            header: 'Tipe Kontrak', 
            accessor: 'contract_type' 
        },
        { 
            header: 'Mulai', 
            accessor: 'contract_start_date' 
        },
        { 
            header: 'Selesai', 
            accessor: 'contract_end_date' 
        },
        { 
            header: 'Status', 
            accessor: 'contract_status' 
        },
        { 
            header: 'Aksi', 
            render: (contract) => (
                <ActionsDropdown data={contract} baseLink="/contracts" />
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Manajemen Kontrak">
            <Head title="Manajemen Kontrak" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Daftar Kontrak</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola data kontrak kerja karyawan.</p>
                </div>
                
                <RedirectOutlineButton 
                    text="Tambah Kontrak"
                    href="/contracts/create"
                    routeName="contracts.create"
                />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tampilkan</span>
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
                    <span className="text-sm text-gray-600">entri</span>
                </div>

                <form onSubmit={handleSearch} className="flex w-full sm:w-1/3 gap-2">
                    <TextInput
                        type="text"
                        name="search"
                        value={searchQuery}
                        placeholder="Cari kontrak..."
                        className="w-full text-sm"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors"
                    >
                        Cari
                    </button>
                </form>
            </div>

            <Table columns={columns} data={contracts.data} />
            
            <Pagination links={contracts.links} />

        </DashboardLayout>
    );
}
