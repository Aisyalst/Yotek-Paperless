import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import AssetForm from './AssetForm';

export default function Edit({ asset, companies, categories }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put', // Wajib: kirim file via multipart + method spoof PUT (PHP tidak parse body multipart pada PUT asli)
        name: asset.name,
        asset_category_id: asset.asset_category_id ? String(asset.asset_category_id) : '',
        company_id: asset.company_id ? String(asset.company_id) : '',
        brand: asset.brand || '',
        model: asset.model || '',
        serial_number: asset.serial_number || '',
        purchase_date: asset.purchase_date || '',
        purchase_price: asset.purchase_price || '',
        supplier: asset.supplier || '',
        condition: asset.condition,
        status: asset.status,
        location: asset.location || '',
        photo: null,
        notes: asset.notes || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('assets.update', asset.id));
    };

    return (
        <DashboardLayout judulHalaman="Edit Barang">
            <Head title={`Edit: ${asset.name}`} />

            <div className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Barang</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Kode aset: <span className="font-mono font-semibold">{asset.asset_code}</span>
                        </p>
                    </div>

                    <AssetForm data={data} setData={setData} errors={errors} companies={companies} categories={categories} />

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                        <RedirectOutlineButton text="Batal" href={`/assets/${asset.id}`} className="me-auto" />
                        <SubmitOutlineButton text="Perbarui" disabled={processing} />
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
