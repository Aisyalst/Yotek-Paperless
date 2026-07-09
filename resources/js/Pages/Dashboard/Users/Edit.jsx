import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ user, roles }) {
    // Inisialisasi useForm bawaan Inertia
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        role_id: user.role_id || '',
        password: '',
    });

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim request PUT ke route update user
        put(`/users/${user.id}`);
    };

    return (
        <DashboardLayout judulHalaman="Edit User">
            <Head title="Edit User" />

            <div className="w-full bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-zinc-700">Edit User</h1>
                            <p className="text-sm text-gray-500 mt-1">Update user information.</p>
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

                    {/* Input Email */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Email Address <span className="text-xs text-red-600">*</span>
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="example@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Input Role */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Role <span className="text-xs text-red-600">*</span>
                        </label>
                        <select
                            value={data.role_id}
                            onChange={(e) => setData('role_id', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        {errors.role_id && <p className="text-red-500 text-sm mt-1">{errors.role_id}</p>}
                    </div>

                    {/* Input Password */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Password (optional)
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Minimum 8 Caracters"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-200">
                        <RedirectOutlineButton text="Cancel" href="/users" className="me-auto" />
                        
                        <SubmitOutlineButton text="Update" disabled={processing} />
                        
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}