import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ devisions = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasEditPermission = permissions.includes('devisions.edit');
    const hasDeletePermission = permissions.includes('devisions.destroy');

    const handleDelete = (devision) => {
        if (confirm(`Apakah Anda yakin ingin menghapus divisi "${devision.name}"?`)) {
            router.delete(`/devisions/${devision.id}`);
        }
    };

    return (
        <DashboardLayout judulHalaman="Data Divisi">
            <Head title="Data Divisi" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Data Divisi</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola data divisi.</p>
                </div>

                <RedirectOutlineButton
                    text="Tambah Divisi"
                    href="/devisions/create"
                    routeName="devisions.create"
                />
            </div>

            <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8f8f8] border-b border-gray-200 text-sm text-[#1a1a1a]">
                            <th className="p-4 font-semibold">Nama Divisi</th>
                            <th className="p-4 font-semibold w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devisions.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="p-4 text-center text-gray-500">
                                    Tidak ada data divisi.
                                </td>
                            </tr>
                        ) : (
                            devisions.map((devision) => (
                                <tr key={devision.id} className="border-b border-gray-100 hover:bg-[#f8f8f8] transition-colors">
                                    <td className="p-4 text-[#1a1a1a] font-medium">{devision.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {hasEditPermission && (
                                                <Link
                                                    href={`/devisions/${devision.id}/edit`}
                                                    className="px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {hasDeletePermission && (
                                                <button
                                                    onClick={() => handleDelete(devision)}
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
