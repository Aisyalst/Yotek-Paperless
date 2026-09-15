import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ meetingRooms = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasEditPermission = permissions.includes('meeting-rooms.edit') || true;
    const hasDeletePermission = permissions.includes('meeting-rooms.destroy') || true;

    const handleDelete = (meetingRoom) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ruangan "${meetingRoom.name}"?`)) {
            router.delete(`/meeting-rooms/${meetingRoom.id}`);
        }
    };

    return (
        <DashboardLayout judulHalaman="Data Ruangan Rapat">
            <Head title="Data Ruangan Rapat" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Data Ruangan Rapat</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola data ruangan rapat.</p>
                </div>

                <RedirectOutlineButton
                    text="Tambah Ruangan"
                    href="/meeting-rooms/create"
                    routeName="meeting-rooms.create"
                />
            </div>

            <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#f8f8f8] border-b border-gray-200 text-sm text-[#1a1a1a]">
                            <th className="p-4 font-semibold">Nama Ruangan</th>
                            <th className="p-4 font-semibold">Lokasi</th>
                            <th className="p-4 font-semibold">Kapasitas</th>
                            <th className="p-4 font-semibold">Status Aktif</th>
                            <th className="p-4 font-semibold w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetingRooms.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-4 text-center text-gray-500">
                                    Tidak ada data ruangan rapat.
                                </td>
                            </tr>
                        ) : (
                            meetingRooms.map((room) => (
                                <tr key={room.id} className="border-b border-gray-100 hover:bg-[#f8f8f8] transition-colors">
                                    <td className="p-4 text-[#1a1a1a] font-medium">{room.name}</td>
                                    <td className="p-4 text-[#1a1a1a]">{room.location}</td>
                                    <td className="p-4 text-[#1a1a1a]">{room.capacity} Orang</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${room.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {room.is_active ? 'Aktif' : 'Tidak Aktif'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {hasEditPermission && (
                                                <Link
                                                    href={`/meeting-rooms/${room.id}/edit`}
                                                    className="px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                                >
                                                    Edit
                                                </Link>
                                            )}
                                            {hasDeletePermission && (
                                                <button
                                                    onClick={() => handleDelete(room)}
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
