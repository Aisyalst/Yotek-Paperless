import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

export default function Index({ companies, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('companies.index'),
            { search: searchQuery, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);
        router.get(
            route('companies.index'),
            { search: searchQuery, per_page: newPerPage },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        { 
            header: '#', 
            render: (company, rowIndex) => `${(companies.current_page - 1) * companies.per_page + rowIndex + 1}`
        },
        { 
            header: 'Perusahaan', 
            render: (company) => (
                <span className="font-semibold text-[#1a1a1a]">{company.name}</span>
            )
        },
        { 
            header: 'Daftar Cabang', 
            render: (company) => {
                const branches = Array.isArray(company.branch) ? company.branch : [];
                if (branches.length === 0) return '-';
                
                const cities = branches.map(b => b.city).join(', ');
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold text-gray-700 text-xs mb-1">{branches.length} Cabang</span>
                        <span className="text-sm text-gray-600 truncate max-w-xs" title={cities}>
                            {cities}
                        </span>
                    </div>
                );
            }
        },
        { 
            header: 'Aksi', 
            render: (company) => (
                <ActionsDropdown data={company} baseLink="/companies" />
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Master Data Perusahaan">
            <Head title="Master Data Perusahaan" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Daftar Perusahaan</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola master data perusahaan dan cabangnya.</p>
                </div>
                
                <RedirectOutlineButton 
                    text="Tambah Perusahaan"
                    href="/companies/create"
                    routeName="companies.create"
                />
            </div>

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tampilkan</span>
                    <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        className="border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm text-sm text-black"
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
                        placeholder="Cari perusahaan..."
                        className="w-full text-sm text-black"
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

            <Table columns={columns} data={companies.data} />
            
            <Pagination links={companies.links} />

        </DashboardLayout>
    );
}
