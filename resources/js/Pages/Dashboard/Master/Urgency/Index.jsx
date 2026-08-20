import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ urgencies = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasEditPermission = permissions.includes('urgencies.edit');
    const hasDeletePermission = permissions.includes('urgencies.destroy');

    const handleDelete = (urgency) => {
        if (confirm(`Apakah Anda yakin ingin menghapus urgensi "${urgency.title}"?`)) {
            router.delete(`/urgencies/${urgency.id}`);
        }
    };

    return (
        <DashboardLayout judulHalaman="Data Urgensi">
            <Head title="Data Urgensi" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Data Urgensi</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola data urgensi.</p>
                </div>

                <RedirectOutlineButton
                    text="Tambah Urgensi"
                    href="/urgencies/create"
                    routeName="urgencies.create"
                />
            </div>

            <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8f8f8] border-b border-gray-200 text-sm text-[#1a1a1a]">
                            <th className="p-4 font-semibold w-16 text-center">Level</th>
                            <th className="p-4 font-semibold">Judul</th>
                            <th className="p-4 font-semibold w-32 text-center">Warna</th>
                            <th className="p-4 font-semibold w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urgencies.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    Tidak ada data urgensi.
                                </td>
                            </tr>
                        ) : (
                            urgencies.map((urgency) => (
                                <tr key={urgency.id} className="border-b border-gray-100 hover:bg-[#f8f8f8] transition-colors">
                                    <td className="p-4 text-gray-600 font-mono text-sm text-center">{urgency.level}</td>
                                    <td className="p-4 text-[#1a1a1a] font-medium">{urgency.title}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            {urgency.color ? (
                                                <>
                                                    <span className="w-4 h-4 rounded-full border border-gray-300 block" style={{ backgroundColor: urgency.color }}></span>
                                                    <span className="text-xs text-gray-500 uppercase">{urgency.color}</span>
                                                </>
                                            ) : (
                                                <span className="text-xs text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {hasEditPermission && (
                                                <Link
                                                    href={`/urgencies/${urgency.id}/edit`}
                                                    className="px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {hasDeletePermission && (
                                                <button
                                                    onClick={() => handleDelete(urgency)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-800/80 rounded hover:bg-red-950/30 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
