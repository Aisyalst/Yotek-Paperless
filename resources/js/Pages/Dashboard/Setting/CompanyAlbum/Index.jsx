import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, router, usePage } from '@inertiajs/react';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';

export default function Index({ albums = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasCreatePermission = permissions.includes('company-albums.create');
    const hasDeletePermission = permissions.includes('company-albums.destroy');

    const handleDelete = (album) => {
        if (confirm('Apakah Anda yakin ingin menghapus foto album ini?')) {
            router.delete(`/company-albums/${album.id}`, {
                preserveScroll: true
            });
        }
    };

    return (
        <DashboardLayout judulHalaman="Album Perusahaan">
            <Head title="Album Perusahaan" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Album Perusahaan</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola galeri foto perusahaan yang tampil di beranda.</p>
                </div>

                {hasCreatePermission && (
                    <RedirectOutlineButton
                        text="Tambah Foto"
                        href="/company-albums/create"
                        routeName="company-albums.create"
                    />
                )}
            </div>
            <div className="bg-[#ffffff] border border-gray-200 rounded-lg p-6 shadow-sm">
                {albums.length === 0 ? (
                    <p className="text-sm text-gray-500 py-10 text-center">Belum ada foto di album.</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {albums.map((album) => (
                            <div key={album.id} className="relative group aspect-[4/5] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <img 
                                    src={`/storage/${album.image}`} 
                                    alt="Company Album" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                />
                                
                                {/* Overlay Actions */}
                                {hasDeletePermission && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button
                                            onClick={() => handleDelete(album)}
                                            className="px-3 py-1.5 text-xs font-bold bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-lg"
                                        >
                                            Hapus Foto
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
