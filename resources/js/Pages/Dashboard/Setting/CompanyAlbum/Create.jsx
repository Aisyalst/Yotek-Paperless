import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        image: null
    });

    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        } else {
            setPreview(null);
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
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100 cursor-pointer text-sm text-gray-600"
                        />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                        
                        {preview && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm max-w-sm mx-auto aspect-[4/5]">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
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
                            disabled={processing || !data.image}
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
