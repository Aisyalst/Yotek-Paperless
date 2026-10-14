import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import AddButton from '@/Components/AddButton';
import Table from '@/Components/Table';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';
import Pagination from '@/Components/Pagination';
import { Head, router, usePage } from '@inertiajs/react';
import DropdownActions from '@/Components/DropdownActions';

const statusColor = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Fulfilled: 'bg-blue-100 text-blue-700',
    Dibatalkan: 'bg-gray-100 text-gray-600',
};

const priorityColor = {
    Rendah: 'bg-gray-100 text-gray-600',
    Normal: 'bg-blue-100 text-blue-700',
    Tinggi: 'bg-orange-100 text-orange-700',
    Urgent: 'bg-red-100 text-red-700',
};

export default function Index({ requests, filters }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];
    const canCreate = permissions.includes('asset-requests.store');

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [status, setStatus] = useState(filters?.status || '');
    const [priority, setPriority] = useState(filters?.priority || '');

    const applyFilters = (overrides = {}) => {
        router.get(
            route('asset-requests.index'),
            { search: searchQuery, per_page: perPage, status, priority, ...overrides },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearchQuery('');
        setStatus('');
        setPriority('');
        router.get(route('asset-requests.index'), { per_page: perPage }, { preserveState: true, replace: true });
    };

    const cancelRequest = (row) => {
        if (!confirm(`Batalkan pengajuan ${row.request_number}?`)) return;
        router.patch(route('asset-requests.cancel', row.id), {}, { preserveScroll: true });
    };

    const columns = [
        { header: '#', render: (r, i) => `${(requests.current_page - 1) * requests.per_page + i + 1}` },
        { header: 'No. Pengajuan', render: (r) => <span className="font-mono text-xs">{r.request_number}</span> },
        {
            header: 'Pemohon',
            render: (r) => (
                <div className="text-left">
                    <div className="font-semibold text-[#1a1a1a]">{r.employee_name || '-'}</div>
                    <div className="text-xs text-gray-500 font-mono">{r.employee_nik}</div>
                </div>
            ),
        },
        { header: 'Departemen', render: (r) => r.department || '-' },
        { header: 'Jumlah Item', render: (r) => r.items_count ?? r.items?.length ?? 0 },
        { header: 'Tgl Pengajuan', render: (r) => r.request_date || '-' },
        {
            header: 'Prioritas',
            render: (r) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColor[r.priority] || 'bg-gray-100 text-gray-500'}`}>
                    {r.priority}
                </span>
            ),
        },
        {
            header: 'Status',
            render: (r) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[r.status] || 'bg-gray-100 text-gray-500'}`}>
                    {r.status}
                </span>
            ),
        },
        {
            header: 'Aksi',
            render: (r) => (
                <DropdownActions items={[
                    { label: 'Detail', href: route('asset-requests.show', r.id) },
                    ...(r.status === 'Pending'
                        ? [{ label: 'Batalkan', onClick: () => cancelRequest(r), danger: true }]
                        : []),
                ]} />
            ),
        },
    ];

    return (
        <DashboardLayout judulHalaman="Pengajuan Barang">
            <Head title="Pengajuan Barang" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Pengajuan Barang</h1>
                    <p className="text-sm text-gray-600 mt-1">Daftar pengajuan barang & aset (multi-item).</p>
                </div>
                {canCreate && (
                    <AddButton text="Buat Pengajuan" href={route('asset-requests.create')} />
                )}
            </div>

            {/* Filter */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SearchableSelect value={status} onChange={(e) => setStatus(e.target.value)} className="w-full" placeholder="-- Semua Status --">
                    <option value="">-- Semua Status --</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Fulfilled">Fulfilled</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                </SearchableSelect>
                <SearchableSelect value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full" placeholder="-- Semua Prioritas --">
                    <option value="">-- Semua Prioritas --</option>
                    <option value="Rendah">Rendah</option>
                    <option value="Normal">Normal</option>
                    <option value="Tinggi">Tinggi</option>
                    <option value="Urgent">Urgent</option>
                </SearchableSelect>
                <div className="flex gap-2 lg:col-span-2">
                    <button onClick={() => applyFilters()} className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors">Terapkan</button>
                    <button onClick={handleReset} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors">Reset</button>
                </div>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tampilkan</span>
                    <SearchableSelect value={perPage} onChange={(e) => { setPerPage(e.target.value); applyFilters({ per_page: e.target.value }); }} className="border-gray-300 rounded-md shadow-sm text-sm text-black">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </SearchableSelect>
                    <span className="text-sm text-gray-600">entri</span>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex w-full sm:w-1/3 gap-2">
                    <TextInput type="text" value={searchQuery} placeholder="Cari no. pengajuan / pemohon..." className="w-full text-sm text-black" onChange={(e) => setSearchQuery(e.target.value)} />
                    <button type="submit" className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors">Cari</button>
                </form>
            </div>

            <Table columns={columns} data={requests.data} />
            <Pagination links={requests.links} />
        </DashboardLayout>
    );
}
