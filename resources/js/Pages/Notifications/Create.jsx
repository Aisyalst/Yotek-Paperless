import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ users, roles }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        type: 'info',
        url: '',
        target_type: 'all',
        target_value: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('notifications.store'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <DashboardLayout>
            <Head title="Buat Notifikasi" />
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-[#1a1a1a]">Buat Notifikasi Baru</h2>
                </div>

                <div className="bg-[#ffffff] rounded-xl border border-zinc-200 overflow-hidden shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Judul Notifikasi</label>
                            <input
                                type="text"
                                className={`w-full rounded-md border-zinc-300 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-50 ${errors.title ? 'border-red-500' : ''}`}
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Contoh: Maintenance Server"
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Isi Pesan</label>
                            <textarea
                                rows="4"
                                className={`w-full rounded-md border-zinc-300 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-50 ${errors.body ? 'border-red-500' : ''}`}
                                value={data.body}
                                onChange={e => setData('body', e.target.value)}
                                placeholder="Tuliskan pesan notifikasi secara detail..."
                            ></textarea>
                            {errors.body && <p className="mt-1 text-sm text-red-600">{errors.body}</p>}
                        </div>
                        {/* URL / Link (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-1">Tautan / Link (Opsional)</label>
                            <input
                                type="text"
                                className={`w-full rounded-md border-zinc-300 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-50 ${errors.url ? 'border-red-500' : ''}`}
                                value={data.url || ''}
                                onChange={e => setData('url', e.target.value)}
                                placeholder="Contoh: /dashboard/settings atau https://google.com"
                            />
                            {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Tipe Notifikasi</label>
                                <select
                                    className="w-full rounded-md border-zinc-300 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-50"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                >
                                    <option value="info">Info (Biru)</option>
                                    <option value="success">Success (Hijau)</option>
                                    <option value="warning">Warning (Kuning)</option>
                                    <option value="error">Error (Merah)</option>
                                </select>
                                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                            </div>

                            {/* Target Type */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Target Penerima</label>
                                <select
                                    className="w-full rounded-md border-zinc-300 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-50"
                                    value={data.target_type}
                                    onChange={e => {
                                        setData('target_type', e.target.value);
                                        setData('target_value', ''); // Reset target value when type changes
                                    }}
                                >
                                    <option value="all">Semua Pengguna</option>
                                    <option value="role">Berdasarkan Role</option>
                                    <option value="user">Pengguna Spesifik</option>
                                </select>
                                {errors.target_type && <p className="mt-1 text-sm text-red-600">{errors.target_type}</p>}
                            </div>
                        </div>

                        {/* Target Value (Dynamic) */}
                        {data.target_type === 'role' && (
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Pilih Role</label>
                                <select
                                    className={`w-full rounded-md border-zinc-300 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-50 ${errors.target_value ? 'border-red-500' : ''}`}
                                    value={data.target_value}
                                    onChange={e => setData('target_value', e.target.value)}
                                >
                                    <option value="" disabled>-- Pilih Role --</option>
                                    {roles.map(role => (
                                        <option key={role.name} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                                {errors.target_value && <p className="mt-1 text-sm text-red-600">{errors.target_value}</p>}
                            </div>
                        )}

                        {data.target_type === 'user' && (
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Pilih Pengguna</label>
                                <select
                                    className={`w-full rounded-md border-zinc-300 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-50 ${errors.target_value ? 'border-red-500' : ''}`}
                                    value={data.target_value}
                                    onChange={e => setData('target_value', e.target.value)}
                                >
                                    <option value="" disabled>-- Pilih Pengguna --</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                                {errors.target_value && <p className="mt-1 text-sm text-red-600">{errors.target_value}</p>}
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-zinc-200">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-[#1a1a1a] text-white font-semibold rounded-lg shadow hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Notifikasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
