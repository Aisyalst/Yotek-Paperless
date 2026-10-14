import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';
import Pagination from '@/Components/Pagination';
import AddButton from '@/Components/AddButton';
import DropdownActions from '@/Components/DropdownActions';
import { Head, router } from '@inertiajs/react';

const statusColor = {
    Tersedia: 'bg-green-100 text-green-700',
    Dipegang: 'bg-blue-100 text-blue-700',
    Service: 'bg-yellow-100 text-yellow-700',
    Rusak: 'bg-red-100 text-red-700',
    Dihapuskan: 'bg-gray-100 text-gray-500',
};

const conditionBadge = {
    'Baik': 'bg-green-50 text-green-600 border-green-200',
    'Rusak Ringan': 'bg-yellow-50 text-yellow-600 border-yellow-200',
    'Rusak Berat': 'bg-red-50 text-red-600 border-red-200',
};

export default function Index({ assets, companies, categories, filters }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [companyId, setCompanyId] = useState(filters?.company_id || '');
    const [categoryId, setCategoryId] = useState(filters?.asset_category_id || '');
    const [status, setStatus] = useState(filters?.status || '');

    const applyFilters = (overrides = {}) => {
        router.get(
            route('assets.index'),
            {
                search: searchQuery,
                per_page: perPage,
                company_id: companyId,
                asset_category_id: categoryId,
                status: status,
                ...overrides,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    const handleReset = () => {
        setSearchQuery('');
        setCompanyId('');
        setCategoryId('');
        setStatus('');
        router.get(route('assets.index'), { per_page: perPage }, { preserveState: true, replace: true });
    };

    const items = assets.data || [];

    return (
        <DashboardLayout judulHalaman="Daftar Barang">
            <Head title="Daftar Barang" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Daftar Barang / Aset</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola barang milik perusahaan dan pemegangnya.</p>
                </div>
                <AddButton
                    text="Tambah Barang"
                    href="/assets/create"
                    routeName="assets.create"
                />
            </div>

            {/* Filter bar */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SearchableSelect value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="w-full" placeholder="-- Semua Perusahaan --">
                    <option value="">-- Semua Perusahaan --</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </SearchableSelect>
                <SearchableSelect value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full" placeholder="-- Semua Kategori --">
                    <option value="">-- Semua Kategori --</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </SearchableSelect>
                <SearchableSelect value={status} onChange={(e) => setStatus(e.target.value)} className="w-full" placeholder="-- Semua Status --">
                    <option value="">-- Semua Status --</option>
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipegang">Dipegang</option>
                    <option value="Service">Service</option>
                    <option value="Rusak">Rusak</option>
                    <option value="Dihapuskan">Dihapuskan</option>
                </SearchableSelect>
                <div className="flex gap-2">
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
                <form onSubmit={handleSearch} className="flex w-full sm:w-1/3 gap-2">
                    <TextInput type="text" value={searchQuery} placeholder="Cari nama/kode/no seri..." className="w-full text-sm text-black" onChange={(e) => setSearchQuery(e.target.value)} />
                    <button type="submit" className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors">Cari</button>
                </form>
            </div>

            {/* Card grid: 1 barang = 1 card, 5 kolom di layar besar */}
            {items.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-gray-300 rounded-xl">
                    <p className="text-sm font-semibold text-gray-500">Belum ada barang</p>
                    <p className="text-xs text-gray-400 mt-1">Silakan tambahkan barang terlebih dahulu.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {items.map((a) => (
                        <div key={a.id} className="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#eaae36] transition-all duration-200">
                            {/* Header: kode barang (rapi, rata tengah) */}
                            <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 text-center">
                                <span className="font-mono text-xs font-semibold text-gray-600 tracking-wider">{a.asset_code}</span>
                            </div>

                            {/* Foto barang */}
                            <div className="relative aspect-[4/3] bg-gray-50 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                                {a.photo ? (
                                    <img src={`/storage/${a.photo}`} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                    <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}

                                {/* Badge status */}
                                <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm ${statusColor[a.status] || 'bg-gray-100 text-gray-500'}`}>
                                    {a.status}
                                </span>

                                {/* Badge kondisi */}
                                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-white/90 ${conditionBadge[a.condition] || 'border-gray-200 text-gray-500'}`}>
                                    {a.condition}
                                </span>
                            </div>

                            {/* Body */}
                            <div className="flex flex-col flex-1 p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-sm text-[#1a1a1a] truncate" title={a.name}>{a.name}</h3>
                                        <p className="text-[11px] text-gray-500 truncate">{a.category?.name || 'Tanpa kategori'}</p>
                                    </div>
                                    <DropdownActions items={[
                                        { label: 'Lihat', href: `/assets/${a.id}`, permission: 'assets.show' },
                                        { label: 'Edit', href: `/assets/${a.id}/edit`, permission: 'assets.edit' },
                                        { label: 'Hapus', href: `/assets/${a.id}`, method: 'delete', permission: 'assets.destroy', danger: true, confirm: 'Hapus barang ini?' },
                                    ]} />
                                </div>

                                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-[13px]">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-gray-400 shrink-0">Perusahaan</span>
                                        <span className="text-gray-700 truncate" title={a.company?.name || '-'}>{a.company?.name || '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-gray-400 shrink-0">Dipegang</span>
                                        <span className={a.current_assignment?.employee_name ? 'font-semibold text-[#1a1a1a] truncate' : 'text-gray-400 truncate'}>
                                            {a.current_assignment?.employee_name || '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-6">
                <Pagination links={assets.links} />
            </div>
        </DashboardLayout>
    );
}
