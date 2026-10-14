import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import AssetForm from './AssetForm';

export default function Create({ companies, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        asset_category_id: '',
        company_id: '',
        brand: '',
        model: '',
        serial_number: '',
        purchase_date: '',
        purchase_price: '',
        supplier: '',
        condition: 'Baik',
        status: 'Tersedia',
        location: '',
        photo: null,
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assets.store'));
    };

    return (
        <DashboardLayout judulHalaman="Tambah Barang">
            <Head title="Tambah Barang" />

            <div className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h1 className="text-xl font-bold text-[#1a1a1a]">Tambah Barang / Aset</h1>
                        <p className="text-sm text-gray-600 mt-1">Kode aset (AST-xxxx) dan QR code akan dibuat otomatis setelah disimpan.</p>
                    </div>

                    <AssetForm data={data} setData={setData} errors={errors} companies={companies} categories={categories} />

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                        <RedirectOutlineButton text="Batal" href="/assets" className="me-auto" />
                        <SubmitOutlineButton text="Simpan" disabled={processing} />
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
