import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ quickAccess, appRoutes = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        title: quickAccess.title || '',
        logo: quickAccess.logo || '',
        url: quickAccess.url || ''
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/quick-accesses/${quickAccess.id}`);
    };

    return (
        <DashboardLayout judulHalaman="Edit Akses Cepat">
            <Head title="Edit Akses Cepat" />

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Form Edit Akses Cepat</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Akses Cepat</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Icon (React Icons / Heroicons)</label>
                        <input
                            type="text"
                            value={data.logo}
                            onChange={e => setData('logo', e.target.value)}
                            className="w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                        />
                        {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL (Pilih Route)</label>
                        <select
                            value={data.url}
                            onChange={e => setData('url', e.target.value)}
                            className="w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                        >
                            <option value="">-- Pilih Route --</option>
                            {!appRoutes.find(r => r.route_name === quickAccess.url) && quickAccess.url && (
                                <option value={quickAccess.url}>{quickAccess.url} (URL Saat Ini)</option>
                            )}
                            {appRoutes.map(route => (
                                <option key={route.id} value={route.route_name}>
                                    {route.name} ({route.route_name})
                                </option>
                            ))}
                        </select>
                        {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url}</p>}
                        <p className="text-xs text-gray-500 mt-1">Disclaimer: Memilih route yang salah dapat membuat tombol rusak atau mengarah ke halaman yang salah. URL saat ini: <strong>{quickAccess.url}</strong>.</p>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Link
                            href="/quick-accesses"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#1a1a1a] border border-transparent rounded-md hover:bg-gray-800 disabled:opacity-50"
                        >
                            Perbarui
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
