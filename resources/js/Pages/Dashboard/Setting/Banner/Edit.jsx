import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, Link, router } from '@inertiajs/react';

export default function Edit({ banner }) {
    const { data, setData, errors, processing } = useForm({
        title: banner.title || '',
        banner: null,
        _method: 'put' // Required for sending files via PUT in Inertia
    });

    const [preview, setPreview] = useState(banner.banner ? `/storage/${banner.banner}` : null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('banner', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        router.post(`/banners/${banner.id}`, data, {
            forceFormData: true,
            preserveScroll: true
        });
    };

    return (
        <DashboardLayout judulHalaman="Edit Banner">
            <Head title="Edit Banner" />

            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Form Edit Banner</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Banner</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            className="w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gambar Banner Baru (Opsional)</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer text-sm text-gray-600"
                        />
                        {errors.banner && <p className="text-red-500 text-xs mt-1">{errors.banner}</p>}
                        <p className="text-xs text-gray-500 mt-1">Gunakan gambar dengan rasio 3:1 untuk hasil terbaik.</p>
                        
                        {preview && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-lg aspect-[3/1]">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Link
                            href="/banners"
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
