import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import Table from '@/Components/Table';
import AddButton from '@/Components/AddButton';
import DropdownActions from '@/Components/DropdownActions';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import SearchableSelect from '@/Components/SearchableSelect';

export default function Index({ employees, filters, filterOptions }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [company, setCompany] = useState(filters?.company || '');
    const [department, setDepartment] = useState(filters?.department || '');
    const [positionId, setPositionId] = useState(filters?.employee_position_id || '');
    const [rankId, setRankId] = useState(filters?.employee_rank_id || '');
    const [status, setStatus] = useState(filters?.employment_status || '');

    const options = filterOptions || {};

    // Bangun semua query param dari state filter (search + dropdown).
    const buildQuery = (overrides = {}) => ({
        search: searchQuery || undefined,
        per_page: perPage,
        company: company || undefined,
        department: department || undefined,
        employee_position_id: positionId || undefined,
        employee_rank_id: rankId || undefined,
        employment_status: status || undefined,
        ...overrides,
    });

    const applyFilters = (overrides = {}) => {
        router.get(
            route('employee-registrations.index'),
            buildQuery(overrides),
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);
        applyFilters({ per_page: newPerPage });
    };

    // Auto-submit saat salah satu dropdown filter berubah.
    const handleFilterChange = (setter) => (e) => {
        const value = e.target.value;
        setter(value);
        applyFilters({ [e.target.name]: value || undefined });
    };

    const handleReset = () => {
        setSearchQuery('');
        setCompany('');
        setDepartment('');
        setPositionId('');
        setRankId('');
        setStatus('');
        router.get(
            route('employee-registrations.index'),
            { per_page: perPage },
            { preserveState: true, replace: true }
        );
    };

    const hasActiveFilter = Boolean(
        company || department || positionId || rankId || status || searchQuery
    );

    const filterSelectClass =
        'border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm text-sm';

    const columns = [
        { 
            header: '#', 
            render: (emp, rowIndex) => `${(employees.current_page - 1) * employees.per_page + rowIndex + 1}`
        },
        { 
            header: 'Karyawan', 
            render: (emp) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-[#1a1a1a]">{emp.employee_name || emp.user?.name || '-'}</span>
                    <span className="text-xs text-gray-500">{emp.nik}</span>
                </div>
            )
        },
        { 
            header: 'Perusahaan', 
            render: (emp) => {
                // Satu karyawan bisa punya beberapa penempatan di perusahaan yang
                // sama (multi-jabatan), jadi nama perusahaan di-dedupe agar unik.
                const raw = Array.isArray(emp.employments) && emp.employments.length
                    ? emp.employments.map(e => e.company).filter(Boolean)
                    : (emp.company ? [emp.company] : []);
                const list = [...new Set(raw)];
                if (!list.length) return '-';
                return (
                    <div className="flex flex-wrap gap-1">
                        {list.map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                {c}
                            </span>
                        ))}
                    </div>
                );
            }
        },
        { 
            header: 'Departemen', 
            accessor: 'department' 
        },
        { 
            header: 'Jabatan', 
            render: (emp) => emp.employee_position ? emp.employee_position.name : '-'
        },
        { 
            header: 'Level', 
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
                <DropdownActions items={[
                    { label: 'Detail', href: route('employee-documents.index', emp.nik) },
                    { label: 'Edit', href: route('employee-registrations.edit', emp.id), permission: 'employee-registrations.edit' },
                    { label: 'Hapus', href: route('employee-registrations.destroy', emp.id), method: 'delete', permission: 'employee-registrations.destroy', danger: true, confirm: 'Hapus data ini?' },
                ]} />
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
                
                <div className="flex gap-2">
                    <a
                        href={route('employee-registrations.export', buildQuery())}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                    >
                        Ekspor Excel
                    </a>
                    <AddButton
                        text="Tambah Karyawan"
                        href="/employee-registrations/create"
                        routeName="employee-registrations.create"
                    />
                </div>
            </div>

            {/* Baris filter: pencarian + dropdown filter (perusahaan, departemen,
                jabatan, level, status). */}
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-wrap items-end gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-[220px]">
                        <TextInput
                            type="text"
                            name="search"
                            value={searchQuery}
                            placeholder="Cari nama / NIK karyawan..."
                            className="w-full text-sm"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors whitespace-nowrap"
                        >
                            Cari
                        </button>
                    </form>

                    <SearchableSelect
                        name="company"
                        value={company}
                        onChange={handleFilterChange(setCompany)}
                        className={filterSelectClass}
                    >
                        <option value="">Semua Perusahaan</option>
                        {(options.companies || []).map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </SearchableSelect>

                    <SearchableSelect
                        name="department"
                        value={department}
                        onChange={handleFilterChange(setDepartment)}
                        className={filterSelectClass}
                    >
                        <option value="">Semua Departemen</option>
                        {(options.departments || []).map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </SearchableSelect>

                    <SearchableSelect
                        name="employee_position_id"
                        value={positionId}
                        onChange={handleFilterChange(setPositionId)}
                        className={filterSelectClass}
                    >
                        <option value="">Semua Jabatan</option>
                        {(options.positions || []).map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </SearchableSelect>

                    <SearchableSelect
                        name="employee_rank_id"
                        value={rankId}
                        onChange={handleFilterChange(setRankId)}
                        className={filterSelectClass}
                    >
                        <option value="">Semua Level</option>
                        {(options.ranks || []).map((r) => (
                            <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                    </SearchableSelect>

                    <SearchableSelect
                        name="employment_status"
                        value={status}
                        onChange={handleFilterChange(setStatus)}
                        className={filterSelectClass}
                    >
                        <option value="">Semua Status</option>
                        {(options.statuses || []).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </SearchableSelect>

                    {hasActiveFilter && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tampilkan</span>
                    <SearchableSelect
                        value={perPage}
                        onChange={handlePerPageChange}
                        className={filterSelectClass}
                    >
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </SearchableSelect>
                    <span className="text-sm text-gray-600">entri</span>
                </div>

                <span className="text-sm text-gray-600">
                    Total <span className="font-semibold text-[#1a1a1a]">{employees.total}</span> karyawan
                </span>
            </div>

            <Table columns={columns} data={employees.data} />
            
            <Pagination links={employees.links} />

        </DashboardLayout>
    );
}