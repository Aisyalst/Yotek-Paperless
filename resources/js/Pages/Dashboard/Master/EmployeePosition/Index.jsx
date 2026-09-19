import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import * as HiIcons from 'react-icons/hi';

export default function Index({ employeePositions = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasEditPermission = permissions.includes('employee-positions.edit') || true;
    const hasDeletePermission = permissions.includes('employee-positions.destroy') || true;
    const hasReorderPermission = true; 

    const [positionList, setPositionList] = useState(employeePositions);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        setPositionList(employeePositions);
    }, [employeePositions]);

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('opacity-40');
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('opacity-40');
        setDraggedItem(null);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetItem) => {
        e.preventDefault();
        if (!draggedItem) return;
        if (draggedItem.id === targetItem.id) return;

        const list = [...positionList];
        const draggedIndex = list.findIndex(i => i.id === draggedItem.id);
        const targetIndex = list.findIndex(i => i.id === targetItem.id);

        const [removed] = list.splice(draggedIndex, 1);
        list.splice(targetIndex, 0, removed);

        setPositionList(list);

        const ids = list.map(item => item.id);
        router.post(route('employee-positions.reorder'), { ids }, { preserveScroll: true });
    };

    const handleDelete = (position) => {
        if (confirm(`Apakah Anda yakin ingin menghapus jabatan "${position.name}"?`)) {
            router.delete(route('employee-positions.destroy', position.id));
        }
    };

    const DragIcon = HiIcons.HiSelector;

    return (
        <DashboardLayout judulHalaman="Jabatan Karyawan">
            <Head title="Jabatan Karyawan" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Jabatan Karyawan</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola dan seret untuk mengurutkan jabatan karyawan.</p>
                </div>

                <RedirectOutlineButton
                    text="Tambah Jabatan"
                    href={route('employee-positions.create')}
                    routeName="employee-positions.create"
                />
            </div>

            <div className="space-y-3">
                {positionList.length === 0 ? (
                    <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">
                        Tidak ada jabatan karyawan ditemukan.
                    </div>
                ) : (
                    positionList.map((position) => (
                        <div
                            key={position.id}
                            draggable={hasReorderPermission}
                            onDragStart={hasReorderPermission ? (e) => handleDragStart(e, position) : undefined}
                            onDragEnd={hasReorderPermission ? handleDragEnd : undefined}
                            onDragOver={hasReorderPermission ? handleDragOver : undefined}
                            onDrop={hasReorderPermission ? (e) => handleDrop(e, position) : undefined}
                            className="flex items-center justify-between bg-[#ffffff] border border-gray-200 rounded-md p-4 transition-all duration-200 hover:border-[#eaae36] hover:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                {hasReorderPermission && (
                                    <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-[#eaae36] p-1 transition-colors">
                                        <DragIcon className="w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1a1a1a] text-sm">{position.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 font-mono">
                                        Urutan: {position.order}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {hasEditPermission && (
                                    <Link
                                        href={route('employee-positions.edit', position.id)}
                                        className="px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {hasDeletePermission && (
                                    <button
                                        onClick={() => handleDelete(position)}
                                        className="px-3 py-1.5 text-xs font-semibold text-red-500 border border-gray-200 rounded hover:bg-red-50 hover:border-red-200 transition-colors"
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
