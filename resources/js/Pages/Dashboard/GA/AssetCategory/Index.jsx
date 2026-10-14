import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import AddButton from '@/Components/AddButton';
import Table from '@/Components/Table';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import Pagination from '@/Components/Pagination';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DropdownActions from '@/Components/DropdownActions';
import { Head, router, useForm, usePage } from '@inertiajs/react';

export default function Index({ categories, filters }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];
    const canUpdate = permissions.includes('asset-categories.update');
    const canDelete = permissions.includes('asset-categories.destroy');
    const canCreate = permissions.includes('asset-categories.store');

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [perPage, setPerPage] = useState(filters?.per_page || 10);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        description: '',
        order: 0,
        is_active: true,
    });

    const openCreate = () => {
        clearErrors();
        reset();
        setEditing(null);
        setShowModal(true);
    };

    const openEdit = (category) => {
        clearErrors();
        setEditing(category);
        setData({
            name: category.name,
            description: category.description || '',
            order: category.order || 0,
            is_active: !!category.is_active,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('asset-categories.update', editing.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('asset-categories.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (category) => {
        if (confirm(`Hapus kategori "${category.name}"?`)) {
            router.delete(route('asset-categories.destroy', category.id));
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('asset-categories.index'), { search: searchQuery, per_page: perPage }, { preserveState: true, replace: true });
    };

    const handlePerPageChange = (e) => {
        const val = e.target.value;
        setPerPage(val);
        router.get(route('asset-categories.index'), { search: searchQuery, per_page: val }, { preserveState: true, replace: true });
    };

    const columns = [
        {
            header: '#',
            render: (c, i) => `${(categories.current_page - 1) * categories.per_page + i + 1}`,
        },
        { header: 'Nama Kategori', render: (c) => <span className="font-semibold">{c.name}</span> },
        { header: 'Deskripsi', render: (c) => c.description || '-' },
        { header: 'Jumlah Barang', render: (c) => <span className="font-semibold">{c.assets_count}</span> },
        {
            header: 'Status',
            render: (c) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.is_active ? 'Aktif' : 'Nonaktif'}
                </span>
            ),
        },
        {
            header: 'Aksi',
            render: (c) => (
                <DropdownActions items={[
                    { label: 'Edit', onClick: () => openEdit(c), permission: 'asset-categories.update' },
                    { label: 'Hapus', onClick: () => handleDelete(c), permission: 'asset-categories.destroy', danger: true },
                ]} />
            ),
        },
    ];

    return (
        <DashboardLayout judulHalaman="Kategori Barang">
            <Head title="Kategori Barang" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Kategori Barang</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola kategori barang/aset GA.</p>
                </div>
                {canCreate && (
                    <AddButton text="Tambah Kategori" onClick={openCreate} />
                )}
            </div>

            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Tampilkan</span>
                    <select value={perPage} onChange={handlePerPageChange} className="border-gray-300 rounded-md shadow-sm text-sm text-black">
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
                        value={searchQuery}
                        placeholder="Cari kategori..."
                        className="w-full text-sm text-black"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors">
                        Cari
                    </button>
                </form>
            </div>

            <Table columns={columns} data={categories.data} />
            <Pagination links={categories.links} />

            <Modal show={showModal} onClose={closeModal} maxWidth="lg">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">
                        {editing ? 'Edit Kategori' : 'Tambah Kategori'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Nama Kategori" required />
                            <TextInput
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full mt-1"
                                placeholder="mis. Elektronik"
                            />
                            <InputError message={errors.name} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Deskripsi" />
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                                rows={3}
                                placeholder="Deskripsi singkat kategori"
                            />
                            <InputError message={errors.description} className="mt-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Urutan" />
                                <TextInput
                                    type="number"
                                    value={data.order}
                                    onChange={(e) => setData('order', e.target.value)}
                                    className="w-full mt-1"
                                />
                                <InputError message={errors.order} className="mt-1" />
                            </div>
                            <div className="flex items-center mt-6">
                                <label className="flex items-center gap-2 text-sm text-[#1a1a1a]">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300 text-[#eaae36] focus:ring-[#eaae36]"
                                    />
                                    Aktif
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                        <SecondaryButton onClick={closeModal} type="button">Batal</SecondaryButton>
                        <SubmitOutlineButton text={editing ? 'Perbarui' : 'Simpan'} disabled={processing} />
                    </div>
                </form>
            </Modal>
        </DashboardLayout>
    );
}
