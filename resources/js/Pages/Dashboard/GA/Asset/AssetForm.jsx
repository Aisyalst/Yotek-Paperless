import React from 'react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import SearchableSelect from '@/Components/SearchableSelect';

/**
 * Form bersama untuk Create & Edit barang.
 * props: data, setData, errors, companies, categories
 */
export default function AssetForm({ data, setData, errors, companies, categories }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <InputLabel value="Nama Barang" required />
                    <TextInput
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full mt-1"
                        placeholder="mis. Laptop Lenovo ThinkPad"
                    />
                    <InputError message={errors.name} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Kategori" />
                    <SearchableSelect
                        value={data.asset_category_id}
                        onChange={(e) => setData('asset_category_id', e.target.value)}
                        className="w-full mt-1"
                        placeholder="-- Pilih Kategori --"
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </SearchableSelect>
                    <InputError message={errors.asset_category_id} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Perusahaan Pemilik" />
                    <SearchableSelect
                        value={data.company_id}
                        onChange={(e) => setData('company_id', e.target.value)}
                        className="w-full mt-1"
                        placeholder="-- Pilih Perusahaan --"
                    >
                        <option value="">-- Pilih Perusahaan --</option>
                        {companies.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </SearchableSelect>
                    <InputError message={errors.company_id} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Lokasi / Penempatan" />
                    <TextInput
                        type="text"
                        value={data.location}
                        onChange={(e) => setData('location', e.target.value)}
                        className="w-full mt-1"
                        placeholder="mis. Ruang GA Lantai 2"
                    />
                    <InputError message={errors.location} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Merek" />
                    <TextInput type="text" value={data.brand} onChange={(e) => setData('brand', e.target.value)} className="w-full mt-1" />
                    <InputError message={errors.brand} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Model" />
                    <TextInput type="text" value={data.model} onChange={(e) => setData('model', e.target.value)} className="w-full mt-1" />
                    <InputError message={errors.model} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Nomor Seri" />
                    <TextInput type="text" value={data.serial_number} onChange={(e) => setData('serial_number', e.target.value)} className="w-full mt-1" />
                    <InputError message={errors.serial_number} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Supplier" />
                    <TextInput type="text" value={data.supplier} onChange={(e) => setData('supplier', e.target.value)} className="w-full mt-1" />
                    <InputError message={errors.supplier} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Tanggal Pembelian" />
                    <TextInput type="date" value={data.purchase_date} onChange={(e) => setData('purchase_date', e.target.value)} className="w-full mt-1" />
                    <InputError message={errors.purchase_date} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Harga Pembelian (Rp)" />
                    <TextInput type="number" value={data.purchase_price} onChange={(e) => setData('purchase_price', e.target.value)} className="w-full mt-1" />
                    <InputError message={errors.purchase_price} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Kondisi" required />
                    <SearchableSelect
                        value={data.condition}
                        onChange={(e) => setData('condition', e.target.value)}
                        className="w-full mt-1"
                    >
                        <option value="Baik">Baik</option>
                        <option value="Rusak Ringan">Rusak Ringan</option>
                        <option value="Rusak Berat">Rusak Berat</option>
                    </SearchableSelect>
                    <InputError message={errors.condition} className="mt-1" />
                </div>
                <div>
                    <InputLabel value="Status" required />
                    <SearchableSelect
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className="w-full mt-1"
                    >
                        <option value="Tersedia">Tersedia</option>
                        <option value="Dipegang">Dipegang</option>
                        <option value="Service">Service</option>
                        <option value="Rusak">Rusak</option>
                        <option value="Dihapuskan">Dihapuskan</option>
                    </SearchableSelect>
                    <InputError message={errors.status} className="mt-1" />
                </div>
            </div>

            <div>
                <InputLabel value="Foto Barang" />
                <input
                    type="file"
                    onChange={(e) => setData('photo', e.target.files[0])}
                    className="w-full mt-1 bg-white border border-gray-300 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36]"
                    accept="image/*"
                />
                <InputError message={errors.photo} className="mt-1" />
            </div>

            <div>
                <InputLabel value="Catatan" />
                <textarea
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-[#eaae36] focus:ring-[#eaae36] text-sm text-[#1a1a1a]"
                    rows={3}
                />
                <InputError message={errors.notes} className="mt-1" />
            </div>
        </div>
    );
}
