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
    Diajukan: 'bg-gray-100 text-gray-600',
    Proses: 'bg-yellow-100 text-yellow-700',
    Selesai: 'bg-green-100 text-green-700',
    Batal: 'bg-red-100 text-red-700',
};

export default function Index({ services, availableAssets, filters }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];
    const canCreate = permissions.includes('asset-services.store');
    const canUpdate = permissions.includes('asset-services.update');

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [status, setStatus] = useState(filters?.status || '');

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const today = new Date().toISOString().slice(0, 10);

    const createForm = useForm({
        asset_id: '',
        service_type: 'Perbaikan',
        service_date: today,
        vendor: '',
        complaint: '',
        start_date: '',
        cost: '',
    });

    const updateForm = useForm({
        status: 'Proses',
        action_taken: '',
        completed_date: '',
        cost: '',
        result: '',
    });

    const applyFilters = (overrides = {}) => {
        router.get(
            route('asset-services.index'),
            { search: searchQuery, per_page: perPage, status, ...overrides },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearchQuery('');
        setStatus('');
        router.get(route('asset-services.index'), { per_page: perPage }, { preserveState: true, replace: true });
    };

    const openCreate = () => {
        createForm.clearErrors();
        createForm.setData({
            asset_id: '',
            service_type: 'Perbaikan',
            service_date: today,
            vendor: '',
            complaint: '',
            start_date: '',
            cost: '',
        });
        setShowCreateModal(true);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('asset-services.store'), {
            onSuccess: () => setShowCreateModal(false),
        });
    };

    const openUpdate = (row) => {
        updateForm.clearErrors();
        updateForm.setData({
            status: row.status === 'Diajukan' ? 'Proses' : row.status,
            action_taken: row.action_taken || '',
            completed_date: row.completed_date || '',
            cost: row.cost || '',
            result: row.result || '',
        });
        setEditing(row);
        setShowUpdateModal(true);
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        updateForm.patch(route('asset-services.update', editing.id), {
            onSuccess: () => setShowUpdateModal(false),
        });
    };

    const assetOptions = availableAssets.map((a) => ({
        value: a.id,
        label: `${a.asset_code} — ${a.name}${a.status ? ` (${a.status})` : ''}`,
    }));

    const columns = [
        { header: '#', render: (r, i) => `${(services.current_page - 1) * services.per_page + i + 1}` },
        { header: 'No. Service', render: (r) => <span className="font-mono text-xs">{r.service_number}</span> },
        {
            header: 'Barang',
            render: (r) => (
                <div className="text-left">
                    <div className="font-semibold text-[#1a1a1a]">{r.asset?.name || '-'}</div>
                    <div className="text-xs text-gray-500 font-mono">{r.asset?.asset_code}</div>
                </div>
            ),
        },
        { header: 'Jenis', render: (r) => r.service_type },
        { header: 'Tgl Service', render: (r) => r.service_date || '-' },
        { header: 'Vendor', render: (r) => r.vendor || '-' },
        { header: 'Biaya', render: (r) => (r.cost ? `Rp ${Number(r.cost).toLocaleString('id-ID')}` : '-') },
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
                canUpdate && ['Diajukan', 'Proses'].includes(r.status) ? (
                    <DropdownActions items={[
                        { label: 'Update', onClick: () => openUpdate(r) },
                    ]} />
                ) : (
                    <span className="text-xs text-gray-400">-</span>
                ),
        },
    ];

    return (
        <DashboardLayout judulHalaman="Service Barang">
            <Head title="Service Barang" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Service Barang</h1>
                    <p className="text-sm text-gray-600 mt-1">Track barang yang sedang diservice/perbaikan.</p>
                </div>
                {canCreate && (
                    <AddButton text="Buat Tiket Service" onClick={openCreate} />
                )}
            </div>

            {/* Filter */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <SearchableSelect value={status} onChange={(e) => setStatus(e.target.value)} className="w-full" placeholder="-- Semua Status --">
                    <option value="">-- Semua Status --</option>
                    <option value="Diajukan">Diajukan</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Batal">Batal</option>
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
                    <TextInput type="text" value={searchQuery} placeholder="Cari no. service / barang / vendor..." className="w-full text-sm text-black" onChange={(e) => setSearchQuery(e.target.value)} />
                    <button type="submit" className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors">Cari</button>
                </form>
            </div>

            <Table columns={columns} data={services.data} />
            <Pagination links={services.links} />

            {/* Modal Buat Tiket */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="lg">
                <form onSubmit={submitCreate} className="p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Buat Tiket Service</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Barang" required />
                            <SearchableSelect
                                value={createForm.data.asset_id}
                                onChange={(e) => createForm.setData('asset_id', e.target.value)}
                                className="w-full mt-1"
                                options={assetOptions}
                                placeholder="-- Pilih Barang --"
                                searchPlaceholder="Cari kode / nama barang..."
                            />
                            <InputError message={createForm.errors.asset_id} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Jenis Service" required />
                                <SearchableSelect
                                    value={createForm.data.service_type}
                                    onChange={(e) => createForm.setData('service_type', e.target.value)}
                                    className="w-full mt-1"
                                >
                                    <option value="Preventive">Preventive</option>
                                    <option value="Corrective">Corrective</option>
                                    <option value="Perbaikan">Perbaikan</option>
                                </SearchableSelect>
                                <InputError message={createForm.errors.service_type} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Tanggal Service" required />
                                <TextInput type="date" value={createForm.data.service_date} onChange={(e) => createForm.setData('service_date', e.target.value)} className="w-full mt-1" />
                                <InputError message={createForm.errors.service_date} className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Vendor / Bengkel" />
                                <TextInput type="text" value={createForm.data.vendor} onChange={(e) => createForm.setData('vendor', e.target.value)} className="w-full mt-1" />
                                <InputError message={createForm.errors.vendor} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Estimasi Biaya (Rp)" />
                                <TextInput type="number" value={createForm.data.cost} onChange={(e) => createForm.setData('cost', e.target.value)} className="w-full mt-1" />
                                <InputError message={createForm.errors.cost} className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Keluhan / Kerusakan" />
                            <textarea
                                value={createForm.data.complaint}
                                onChange={(e) => createForm.setData('complaint', e.target.value)}
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                                rows={3}
                            />
                            <InputError message={createForm.errors.complaint} className="mt-1" />
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <SecondaryButton onClick={() => setShowCreateModal(false)} type="button">Batal</SecondaryButton>
                        <SubmitOutlineButton text="Simpan" disabled={createForm.processing} />
                    </div>
                </form>
            </Modal>

            {/* Modal Update Status */}
            <Modal show={showUpdateModal} onClose={() => setShowUpdateModal(false)} maxWidth="lg">
                <form onSubmit={submitUpdate} className="p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-1">Update Status Service</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {editing?.asset?.name} ({editing?.asset?.asset_code}) — {editing?.service_number}
                    </p>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Status" required />
                                <SearchableSelect
                                    value={updateForm.data.status}
                                    onChange={(e) => updateForm.setData('status', e.target.value)}
                                    className="w-full mt-1"
                                >
                                    <option value="Proses">Proses</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Batal">Batal</option>
                                </SearchableSelect>
                                <InputError message={updateForm.errors.status} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Tanggal Selesai" />
                                <TextInput type="date" value={updateForm.data.completed_date} onChange={(e) => updateForm.setData('completed_date', e.target.value)} className="w-full mt-1" />
                                <InputError message={updateForm.errors.completed_date} className="mt-1" />
                            </div>
                        </div>
                        <div>
                            <InputLabel value="Tindakan yang Dilakukan" />
                            <textarea
                                value={updateForm.data.action_taken}
                                onChange={(e) => updateForm.setData('action_taken', e.target.value)}
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                                rows={2}
                            />
                            <InputError message={updateForm.errors.action_taken} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Biaya Aktual (Rp)" />
                                <TextInput type="number" value={updateForm.data.cost} onChange={(e) => updateForm.setData('cost', e.target.value)} className="w-full mt-1" />
                                <InputError message={updateForm.errors.cost} className="mt-1" />
                            </div>
                            <div>
                                <InputLabel value="Hasil" />
                                <TextInput type="text" value={updateForm.data.result} onChange={(e) => updateForm.setData('result', e.target.value)} className="w-full mt-1" />
                                <InputError message={updateForm.errors.result} className="mt-1" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <SecondaryButton onClick={() => setShowUpdateModal(false)} type="button">Batal</SecondaryButton>
                        <SubmitOutlineButton text="Simpan" disabled={updateForm.processing} />
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
