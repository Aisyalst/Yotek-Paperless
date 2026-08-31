import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import ActionsDropdown from '@/Components/ActionsDropdown';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';

export default function Index({ employees, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('employee-registrations.index'),
            { search: searchQuery, per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);
        router.get(
            route('employee-registrations.index'),
            { search: searchQuery, per_page: newPerPage },
            { preserveState: true, replace: true }
        );
    };

    const columns = [
        { 
            header: '#', 
            render: (emp, rowIndex) => `${(employees.current_page - 1) * employees.per_page + rowIndex + 1}`
        },
        { 
            header: 'Karyawan', 
            render: (emp) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-[#1a1a1a]">{emp.user?.name || '-'}</span>
                    <span className="text-xs text-gray-500">{emp.nik}</span>
                </div>
            )
        },
        { 
            header: 'Perusahaan', 
            accessor: 'company' 
        },
        { 
            header: 'Departemen', 
            accessor: 'department' 
        },
        { 
            header: 'Jabatan', 
            render: (emp) => emp.employee_rank ? emp.employee_rank.title : '-'
        },
        { 
            header: 'Atasan', 
            render: (emp) => emp.supervisor ? emp.supervisor.name : '-'
        },
        {
            header: 'Status',
            render: (emp) => {
                const statusColors = {
                    'Active': 'text-green-500 border-green-500',
                    'Inactive': 'text-gray-500 border-gray-500',
                    'Resigned': 'text-yellow-500 border-yellow-500',
                    'Terminated': 'text-red-500 border-red-500',
                };
                const colorClass = statusColors[emp.employment_status] || 'text-blue-500 border-blue-500';
                
                return emp.employment_status ? (
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${colorClass}`}>
                        {emp.employment_status}
                    </span>
                ) : '-';
            }
        },
        {
            header: 'Tgl Gabung',
            render: (emp) => {
                if (!emp.join_date) return '-';
                const date = new Date(emp.join_date);
                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            }
        },
        { 
            header: 'Aksi', 
            render: (emp) => (
                <ActionsDropdown data={emp} baseLink="/employee-registrations" />
            ) 
        }
    ];

    return (
        <DashboardLayout judulHalaman="Registrasi Karyawan">
            <Head title="Registrasi Karyawan" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Daftar Karyawan</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola data informasi karyawan perusahaan.</p>
                </div>
                
                <RedirectOutlineButton 
                    text="Tambah Karyawan"
                    href="/employee-registrations/create"
                    routeName="employee-registrations.create"
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
                        placeholder="Cari karyawan..."
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

            <Table columns={columns} data={employees.data} />
            
            <Pagination links={employees.links} />

        </DashboardLayout>
    );
}
