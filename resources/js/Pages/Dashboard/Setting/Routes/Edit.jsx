import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ route }) {
    // Inisialisasi useForm bawaan Inertia
    const { data, setData, put, processing, errors } = useForm({
        name: route.name || '',
        route_name: route.route_name || '',
    });

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim request PUT ke route update route
        put(`/routes/${route.id}`);
    };

    return (
        <DashboardLayout judulHalaman="Edit Route">
            <Head title="Edit Route" />

            <div className="w-full bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-zinc-700">Edit Route</h1>
                            <p className="text-sm text-gray-500 mt-1">Update route information.</p>
                        </div>
                    </div>
                    
                    {/* Input Nama */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Name <span className="text-xs text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Name"
                        />
                        {/* Menampilkan pesan error validasi dari Laravel jika ada */}
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    {/* Input Route Name */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Route Name <span className="text-xs text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.route_name}
                            onChange={(e) => setData('route_name', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Route Name"
                        />
                        {/* Menampilkan pesan error validasi dari Laravel jika ada */}
                        {errors.route_name && <p className="text-red-500 text-sm mt-1">{errors.route_name}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-200">
                        <RedirectOutlineButton text="Cancel" href="/routes" className="me-auto" />
                        
                        <SubmitOutlineButton text="Update" disabled={processing} />
                        
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}