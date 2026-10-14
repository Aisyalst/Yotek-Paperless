import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import AddButton from '@/Components/AddButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SearchableSelect from '@/Components/SearchableSelect';
import SecondaryButton from '@/Components/SecondaryButton';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { HiArrowLeft, HiTrash } from 'react-icons/hi';

const emptyItem = () => ({
    asset_category_id: '',
    item_name: '',
    qty: 1,
    unit: '',
    estimated_price: '',
    notes: '',
});

export default function Create({ categories, companies, defaults }) {
    const today = new Date().toISOString().slice(0, 10);

    const { data, setData, post, processing, errors } = useForm({
        request_date: today,
        needed_date: '',
        company_id: '',
        department: defaults?.department || '',
        purpose: '',
        priority: 'Normal',
        notes: '',
        items: [emptyItem()],
    });

    const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

    const updateItem = (index, field, value) => {
        const items = data.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setData('items', items);
    };

    const addItem = () => setData('items', [...data.items, emptyItem()]);

    const removeItem = (index) => {
        if (data.items.length === 1) return;
        setData('items', data.items.filter((_, i) => i !== index));
    };

    const totalEstimate = data.items.reduce(
        (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.estimated_price) || 0),
        0
    );

    const submit = (e) => {
        e.preventDefault();
        post(route('asset-requests.store'));
    };

    return (
        <DashboardLayout judulHalaman="Buat Pengajuan Barang">
            <Head title="Buat Pengajuan Barang" />

            <div className="flex items-center gap-3 mb-6">
                <Link href={route('asset-requests.index')} className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                    <HiArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Buat Pengajuan Barang</h1>
                    <p className="text-sm text-gray-600 mt-1">Ajukan satu atau beberapa barang sekaligus.</p>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Informasi Pengajuan */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Informasi Pengajuan</h2>

                    <div className="mb-4 p-4 bg-[#f8f8f8] rounded-md border border-gray-200 text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div><span className="text-gray-500">Pemohon:</span> <span className="font-semibold text-[#1a1a1a]">{defaults?.employee_name || '-'}</span></div>
                            <div><span className="text-gray-500">NIK:</span> <span className="font-mono text-[#1a1a1a]">{defaults?.employee_nik || '-'}</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <InputLabel value="Tanggal Pengajuan" required />
                            <TextInput type="date" value={data.request_date} onChange={(e) => setData('request_date', e.target.value)} className="w-full mt-1" />
                            <InputError message={errors.request_date} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Tanggal Dibutuhkan" />
                            <TextInput type="date" value={data.needed_date} onChange={(e) => setData('needed_date', e.target.value)} className="w-full mt-1" />
                            <InputError message={errors.needed_date} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Prioritas" required />
                            <SearchableSelect value={data.priority} onChange={(e) => setData('priority', e.target.value)} className="w-full mt-1">
                                <option value="Rendah">Rendah</option>
                                <option value="Normal">Normal</option>
                                <option value="Tinggi">Tinggi</option>
                                <option value="Urgent">Urgent</option>
                            </SearchableSelect>
                            <InputError message={errors.priority} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Perusahaan" />
                            <SearchableSelect
                                value={data.company_id}
                                onChange={(e) => setData('company_id', e.target.value)}
                                className="w-full mt-1"
                                options={companies.map((c) => ({ value: c.id, label: c.name }))}
                                placeholder="-- Pilih Perusahaan --"
                            />
                            <InputError message={errors.company_id} className="mt-1" />
                        </div>
                        <div>
                            <InputLabel value="Departemen" />
                            <TextInput type="text" value={data.department} onChange={(e) => setData('department', e.target.value)} className="w-full mt-1" />
                            <InputError message={errors.department} className="mt-1" />
                        </div>
                    </div>

                    <div className="mt-4">
                        <InputLabel value="Tujuan / Keperluan" />
                        <textarea
                            value={data.purpose}
                            onChange={(e) => setData('purpose', e.target.value)}
                            className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                            rows={2}
                        />
                        <InputError message={errors.purpose} className="mt-1" />
                    </div>
                </div>

                {/* Item Barang */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-[#1a1a1a]">Item Barang</h2>
                        <AddButton text="Tambah Item" onClick={addItem} />
                    </div>
                    <InputError message={errors.items} className="mb-2" />

                    <div className="space-y-4">
                        {data.items.map((item, index) => (
                            <div key={index} className="border border-gray-200 rounded-md p-4 bg-[#fafafa]">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold text-[#1a1a1a]">Item #{index + 1}</span>
                                    {data.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="flex items-center gap-1 px-2 py-1 border border-red-300 text-red-500 rounded-md text-xs font-medium hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <HiTrash className="w-3.5 h-3.5" /> Hapus
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    <div className="lg:col-span-2">
                                        <InputLabel value="Nama Item" required />
                                        <TextInput type="text" value={item.item_name} onChange={(e) => updateItem(index, 'item_name', e.target.value)} className="w-full mt-1" placeholder="cth: Kertas A4" />
                                        <InputError message={errors[`items.${index}.item_name`]} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel value="Kategori" />
                                        <SearchableSelect
                                            value={item.asset_category_id}
                                            onChange={(e) => updateItem(index, 'asset_category_id', e.target.value)}
                                            className="w-full mt-1"
                                            options={categoryOptions}
                                            placeholder="-- Kategori --"
                                        />
                                        <InputError message={errors[`items.${index}.asset_category_id`]} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel value="Satuan" />
                                        <TextInput type="text" value={item.unit} onChange={(e) => updateItem(index, 'unit', e.target.value)} className="w-full mt-1" placeholder="cth: Rim" />
                                        <InputError message={errors[`items.${index}.unit`]} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel value="Jumlah" required />
                                        <TextInput type="number" min="1" value={item.qty} onChange={(e) => updateItem(index, 'qty', e.target.value)} className="w-full mt-1" />
                                        <InputError message={errors[`items.${index}.qty`]} className="mt-1" />
                                    </div>
                                    <div>
                                        <InputLabel value="Estimasi Harga (Rp)" />
                                        <TextInput type="number" min="0" value={item.estimated_price} onChange={(e) => updateItem(index, 'estimated_price', e.target.value)} className="w-full mt-1" />
                                        <InputError message={errors[`items.${index}.estimated_price`]} className="mt-1" />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <InputLabel value="Keterangan" />
                                        <TextInput type="text" value={item.notes} onChange={(e) => updateItem(index, 'notes', e.target.value)} className="w-full mt-1" />
                                        <InputError message={errors[`items.${index}.notes`]} className="mt-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <div className="text-sm text-gray-600">
                            Total Estimasi: <span className="font-bold text-[#1a1a1a]">Rp {totalEstimate.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                {/* Catatan */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <InputLabel value="Catatan Tambahan" />
                    <textarea
                        value={data.notes}
                        onChange={(e) => setData('notes', e.target.value)}
                        className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                        rows={2}
                    />
                    <InputError message={errors.notes} className="mt-1" />
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Link href={route('asset-requests.index')}>
                        <SecondaryButton type="button">Batal</SecondaryButton>
                    </Link>
                    <SubmitOutlineButton text="Kirim Pengajuan" disabled={processing} />
                </div>
            </form>
        </DashboardLayout>
    );
}
