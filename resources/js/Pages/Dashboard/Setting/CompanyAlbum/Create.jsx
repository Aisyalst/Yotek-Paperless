import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        images: []
    });

    const [previews, setPreviews] = useState([]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);
        
        if (files.length > 0) {
            const newPreviews = files.map(file => URL.createObjectURL(file));
            setPreviews(newPreviews);
        } else {
            setPreviews([]);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/company-albums');
    };

    return (
        <DashboardLayout judulHalaman="Tambah Foto Album">
            <Head title="Tambah Foto Album" />

            <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Form Tambah Foto Album</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Foto</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer text-sm text-gray-600"
                        />
                        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                        
                        {previews.length > 0 && (
                            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {previews.map((src, index) => (
                                    <div key={index} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-[4/5]">
                                        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Link
                            href="/company-albums"
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing || data.images.length === 0}
                            className="px-4 py-2 text-sm font-bold text-white bg-[#1a1a1a] border border-transparent rounded-md hover:bg-gray-800 disabled:opacity-50"
                        >
                            Simpan Foto
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
