import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import AddButton from '@/Components/AddButton';
import { Head, router, usePage } from '@inertiajs/react';
import DropdownActions from '@/Components/DropdownActions';

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

                <AddButton
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
                            <th className="p-4 font-semibold">Ketua Divisi</th>
                            <th className="p-4 font-semibold w-32">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devisions.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="p-4 text-center text-gray-500">
                                    Tidak ada data divisi.
                                </td>
                            </tr>
                        ) : (
                            devisions.map((devision) => (
                                <tr key={devision.id} className="border-b border-gray-100 hover:bg-[#f8f8f8] transition-colors">
                                    <td className="p-4 text-[#1a1a1a] font-medium">{devision.name}</td>
                                    <td className="p-4 text-[#1a1a1a]">{devision.head_employee?.user?.name || '-'}</td>
                                    <td className="p-4">
                                        <DropdownActions items={[
                                            { label: 'Edit', href: `/devisions/${devision.id}/edit`, permission: 'devisions.edit' },
                                            { label: 'Hapus', onClick: () => handleDelete(devision), permission: 'devisions.destroy', danger: true },
                                        ]} />
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
