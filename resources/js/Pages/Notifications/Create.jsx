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
            <div className="p-6 max-w-3xl mx-auto space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a]">Buat Notifikasi Baru</h2>
                    <p className="text-sm text-zinc-500 mt-1">Kirim pemberitahuan sistem ke seluruh pengguna atau target spesifik.</p>
                </div>

                <div className="bg-[#ffffff] rounded-2xl border border-zinc-200 overflow-hidden shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                                Judul Notifikasi <span style={{color: '#e53e3e'}}>*</span>
                            </label>
                            <input
                                type="text"
                                className={`w-full rounded-xl border-zinc-200 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-20 transition-all ${errors.title ? 'border-[#e53e3e] focus:border-[#e53e3e] focus:ring-[#e53e3e]' : ''}`}
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Contoh: Maintenance Server"
                            />
                            {errors.title && <p className="mt-1.5 text-sm font-medium text-[#e53e3e]">{errors.title}</p>}
                        </div>

                        {/* Body */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                                Isi Pesan <span style={{color: '#e53e3e'}}>*</span>
                            </label>
                            <textarea
                                rows="4"
                                className={`w-full rounded-xl border-zinc-200 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-20 transition-all ${errors.body ? 'border-[#e53e3e] focus:border-[#e53e3e] focus:ring-[#e53e3e]' : ''}`}
                                value={data.body}
                                onChange={e => setData('body', e.target.value)}
                                placeholder="Tuliskan pesan notifikasi secara detail..."
                            ></textarea>
                            {errors.body && <p className="mt-1.5 text-sm font-medium text-[#e53e3e]">{errors.body}</p>}
                        </div>
                        {/* URL / Link (Optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Tautan / Link (Opsional)</label>
                            <input
                                type="text"
                                className={`w-full rounded-xl border-zinc-200 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-20 transition-all ${errors.url ? 'border-[#e53e3e] focus:border-[#e53e3e] focus:ring-[#e53e3e]' : ''}`}
                                value={data.url || ''}
                                onChange={e => setData('url', e.target.value)}
                                placeholder="Contoh: /dashboard/settings atau https://google.com"
                            />
                            {errors.url && <p className="mt-1.5 text-sm font-medium text-[#e53e3e]">{errors.url}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#f8f8f8] rounded-xl border border-zinc-100">
                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                                    Tipe Notifikasi <span style={{color: '#e53e3e'}}>*</span>
                                </label>
                                <select
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-20 transition-all bg-white"
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                >
                                    <option value="info">Info (Biru)</option>
                                    <option value="success">Success (Hijau)</option>
                                    <option value="warning">Warning (Kuning)</option>
                                    <option value="error">Error (Merah)</option>
                                </select>
                                {errors.type && <p className="mt-1.5 text-sm font-medium text-[#e53e3e]">{errors.type}</p>}
                            </div>

                            {/* Target Type */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                                    Target Penerima <span style={{color: '#e53e3e'}}>*</span>
                                </label>
                                <select
                                    className="w-full rounded-xl border-zinc-200 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-20 transition-all bg-white"
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
                                {errors.target_type && <p className="mt-1.5 text-sm font-medium text-[#e53e3e]">{errors.target_type}</p>}
                            </div>
                        </div>

                        {/* Target Value (Dynamic) */}
                        {data.target_type === 'role' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                                    Pilih Role <span style={{color: '#e53e3e'}}>*</span>
                                </label>
                                <select
                                    className={`w-full rounded-xl border-zinc-200 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-20 transition-all ${errors.target_value ? 'border-[#e53e3e] focus:border-[#e53e3e] focus:ring-[#e53e3e]' : ''}`}
                                    value={data.target_value}
                                    onChange={e => setData('target_value', e.target.value)}
                                >
                                    <option value="" disabled>-- Pilih Role --</option>
                                    {roles.map(role => (
                                        <option key={role.name} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                                {errors.target_value && <p className="mt-1.5 text-sm font-medium text-[#e53e3e]">{errors.target_value}</p>}
                            </div>
                        )}

                        {data.target_type === 'user' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">
                                    Pilih Pengguna <span style={{color: '#e53e3e'}}>*</span>
                                </label>
                                <select
                                    className={`w-full rounded-xl border-zinc-200 shadow-sm focus:border-[#eaae36] focus:ring focus:ring-[#eaae36] focus:ring-opacity-20 transition-all ${errors.target_value ? 'border-[#e53e3e] focus:border-[#e53e3e] focus:ring-[#e53e3e]' : ''}`}
                                    value={data.target_value}
                                    onChange={e => setData('target_value', e.target.value)}
                                >
                                    <option value="" disabled>-- Pilih Pengguna --</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                                {errors.target_value && <p className="mt-1.5 text-sm font-medium text-[#e53e3e]">{errors.target_value}</p>}
                            </div>
                        )}

                        <div className="flex justify-end pt-6 border-t border-zinc-100">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-[#1a1a1a] text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengirim...
                                    </>
                                ) : (
                                    <>
                                        Kirim Notifikasi
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
