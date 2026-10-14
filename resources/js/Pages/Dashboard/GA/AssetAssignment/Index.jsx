import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import AddButton from '@/Components/AddButton';
import Table from '@/Components/Table';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SearchableSelect from '@/Components/SearchableSelect';
import Pagination from '@/Components/Pagination';
import SecondaryButton from '@/Components/SecondaryButton';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import DropdownActions from '@/Components/DropdownActions';

const statusColor = {
    Aktif: 'bg-blue-100 text-blue-700',
    Dikembalikan: 'bg-gray-100 text-gray-500',
};

export default function Index({ assignments, availableAssets, employees, companies, filters }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];
    const canAssign = permissions.includes('asset-assignments.store');
    const canReturn = permissions.includes('asset-assignments.return');

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [companyId, setCompanyId] = useState(filters?.company_id || '');
    const [status, setStatus] = useState(filters?.status ?? 'Aktif');

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [returning, setReturning] = useState(null);

    const today = new Date().toISOString().slice(0, 10);

    const assignForm = useForm({
        asset_id: '',
        employee_nik: '',
        assigned_date: today,
        condition_on_assign: 'Baik',
        notes: '',
    });

    const returnForm = useForm({
        returned_date: today,
        condition_on_return: 'Baik',
        notes: '',
    });

    const applyFilters = (overrides = {}) => {
        router.get(
            route('asset-assignments.index'),
            {
                search: searchQuery,
                per_page: perPage,
                company_id: companyId,
                status: status,
                ...overrides,
            },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearchQuery('');
        setCompanyId('');
        setStatus('Aktif');
        router.get(route('asset-assignments.index'), { per_page: perPage, status: 'Aktif' }, { preserveState: true, replace: true });
    };

    const openAssign = () => {
        assignForm.clearErrors();
        assignForm.reset();
        assignForm.setData({
            asset_id: '',
            employee_nik: '',
            assigned_date: today,
            condition_on_assign: 'Baik',
            notes: '',
        });
        setShowAssignModal(true);
    };

    const submitAssign = (e) => {
        e.preventDefault();
        assignForm.post(route('asset-assignments.store'), {
            onSuccess: () => setShowAssignModal(false),
        });
    };

    const openReturn = (row) => {
        returnForm.clearErrors();
        returnForm.setData({
            returned_date: today,
            condition_on_return: 'Baik',
            notes: '',
        });
        setReturning(row);
        setShowReturnModal(true);
    };

    const submitReturn = (e) => {
        e.preventDefault();
        returnForm.patch(route('asset-assignments.return', returning.id), {
            onSuccess: () => setShowReturnModal(false),
        });
    };

    const employeeOptions = employees.map((u) => ({
        value: u.nik,
        label: `${u.name} (${u.nik})`,
    }));

    const assetOptions = availableAssets.map((a) => ({
        value: a.id,
        label: `${a.asset_code} — ${a.name}`,
    }));

    const columns = [
        { header: '#', render: (r, i) => `${(assignments.current_page - 1) * assignments.per_page + i + 1}` },
        {
            header: 'Barang',
            render: (r) => (
                <div className="text-left">
                    <div className="font-semibold text-[#1a1a1a]">{r.asset?.name || '-'}</div>
                    <div className="text-xs text-gray-500 font-mono">{r.asset?.asset_code}</div>
                </div>
            ),
        },
        { header: 'Perusahaan', render: (r) => r.asset?.company?.name || '-' },
        {
            header: 'Pemegang',
            render: (r) => (
                <div className="text-left">
                    <div className="font-semibold text-[#1a1a1a]">{r.employee_name || '-'}</div>
                    <div className="text-xs text-gray-500 font-mono">{r.employee_nik}</div>
                </div>
            ),
        },
        { header: 'Tgl Serah', render: (r) => r.assigned_date || '-' },
        { header: 'Tgl Kembali', render: (r) => r.returned_date || '-' },
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
            render: (r) =>
                r.status === 'Aktif' && canReturn ? (
                    <DropdownActions items={[
                        { label: 'Kembalikan', onClick: () => openReturn(r), danger: true },
                    ]} />
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                ),
        },
    ];

    return (
        <DashboardLayout judulHalaman="Penempatan Barang">
            <Head title="Penempatan Barang" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Penempatan Barang</h1>
                    <p className="text-sm text-gray-600 mt-1">Serah-terima barang ke karyawan (via NIK) & riwayat pemegang.</p>
                </div>
                {canAssign && (
                    <AddButton text="Serahkan Barang" onClick={openAssign} />
                )}
            </div>

            {/* Filter */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SearchableSelect value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="w-full" placeholder="-- Semua Perusahaan --">
                    <option value="">-- Semua Perusahaan --</option>
                    {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </SearchableSelect>
                <SearchableSelect value={status} onChange={(e) => setStatus(e.target.value)} className="w-full" placeholder="-- Semua Status --">
                    <option value="">-- Semua Status --</option>
                    <option value="Aktif">Aktif (sedang dipegang)</option>
                    <option value="Dikembalikan">Dikembalikan</option>
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
                <form onSubmit={(e) => { e.preventDefault(); applyFilters(); }} className="flex w-full sm:w-1/3 gap-2">
                    <TextInput type="text" value={searchQuery} placeholder="Cari barang / NIK / nama..." className="w-full text-sm text-black" onChange={(e) => setSearchQuery(e.target.value)} />
                    <button type="submit" className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors">Cari</button>
                </form>
            </div>

            <Table columns={columns} data={assignments.data} />
            <Pagination links={assignments.links} />

            {/* Modal Serahkan Barang */}
            <Modal show={showAssignModal} onClose={() => setShowAssignModal(false)} maxWidth="lg">
                <form onSubmit={submitAssign} className="p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Serahkan Barang</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Barang" required />
                            <SearchableSelect
                                value={assignForm.data.asset_id}
                                onChange={(e) => assignForm.setData('asset_id', e.target.value)}
                                className="w-full mt-1"
                                options={assetOptions}
                                placeholder="-- Pilih Barang --"
                                searchPlaceholder="Cari kode / nama barang..."
                            />
                            <InputError message={assignForm.errors.asset_id} className="mt-1" />
                            {availableAssets.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">Semua barang sedang dipegang / tidak tersedia.</p>
                            )}
                        </div>
                        <div>
                            <InputLabel value="Penerima (Karyawan)" required />
                            <SearchableSelect
                                value={assignForm.data.employee_nik}
                                onChange={(e) => assignForm.setData('employee_nik', e.target.value)}
                                className="w-full mt-1"
                                options={employeeOptions}
                                placeholder="-- Pilih Karyawan --"
                                searchPlaceholder="Cari nama / NIK..."
                            />
                            <InputError message={assignForm.errors.employee_nik} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Tanggal Serah" required />
                                <TextInput
                                    type="date"
                                    value={assignForm.data.assigned_date}
                                    onChange={(e) => assignForm.setData('assigned_date', e.target.value)}
                                    className="w-full mt-1"
                                />
                                <InputError message={assignForm.errors.assigned_date} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Kondisi Saat Serah" />
                                <SearchableSelect
                                    value={assignForm.data.condition_on_assign}
                                    onChange={(e) => assignForm.setData('condition_on_assign', e.target.value)}
                                    className="w-full mt-1"
                                >
                                    <option value="Baik">Baik</option>
                                    <option value="Rusak Ringan">Rusak Ringan</option>
                                    <option value="Rusak Berat">Rusak Berat</option>
                                </SearchableSelect>
                                <InputError message={assignForm.errors.condition_on_assign} className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Catatan" />
                            <textarea
                                value={assignForm.data.notes}
                                onChange={(e) => assignForm.setData('notes', e.target.value)}
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                                rows={2}
                            />
                            <InputError message={assignForm.errors.notes} className="mt-1" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <SecondaryButton onClick={() => setShowAssignModal(false)} type="button">Batal</SecondaryButton>
                        <SubmitOutlineButton text="Serahkan" disabled={assignForm.processing} />
                    </div>
                </form>
            </Modal>

            {/* Modal Kembalikan */}
            <Modal show={showReturnModal} onClose={() => setShowReturnModal(false)} maxWidth="lg">
                <form onSubmit={submitReturn} className="p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Kembalikan Barang</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {returning?.asset?.name} ({returning?.asset?.asset_code}) — dari {returning?.employee_name}
                    </p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Tanggal Kembali" required />
                                <TextInput
                                    type="date"
                                    value={returnForm.data.returned_date}
                                    onChange={(e) => returnForm.setData('returned_date', e.target.value)}
                                    className="w-full mt-1"
                                />
                                <InputError message={returnForm.errors.returned_date} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Kondisi Saat Kembali" required />
                                <SearchableSelect
                                    value={returnForm.data.condition_on_return}
                                    onChange={(e) => returnForm.setData('condition_on_return', e.target.value)}
                                    className="w-full mt-1"
                                >
                                    <option value="Baik">Baik</option>
                                    <option value="Rusak Ringan">Rusak Ringan</option>
                                    <option value="Rusak Berat">Rusak Berat</option>
                                </SearchableSelect>
                                <InputError message={returnForm.errors.condition_on_return} className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Catatan" />
                            <textarea
                                value={returnForm.data.notes}
                                onChange={(e) => returnForm.setData('notes', e.target.value)}
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                                rows={2}
                            />
                            <InputError message={returnForm.errors.notes} className="mt-1" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <SecondaryButton onClick={() => setShowReturnModal(false)} type="button">Batal</SecondaryButton>
                        <SubmitOutlineButton text="Kembalikan" disabled={returnForm.processing} />
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
