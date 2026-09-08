import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import * as HiIcons from 'react-icons/hi';

export default function Index({ banners = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasReorderPermission = permissions.includes('banners.reorder');
    const hasEditPermission = permissions.includes('banners.edit');
    const hasDeletePermission = permissions.includes('banners.destroy');

    const [items, setItems] = useState(banners);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        setItems(banners);
    }, [banners]);

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

        const list = [...items];
        const draggedIndex = list.findIndex(i => i.id === draggedItem.id);
        const targetIndex = list.findIndex(i => i.id === targetItem.id);

        const [removed] = list.splice(draggedIndex, 1);
        list.splice(targetIndex, 0, removed);

        setItems(list);

        const ids = list.map(item => item.id);
        router.post('/banners/reorder', { ids }, { preserveScroll: true });
    };

    const handleDelete = (item) => {
        if (confirm(`Are you sure you want to delete banner "${item.title}"?`)) {
            router.delete(`/banners/${item.id}`);
        }
    };

    return (
        <DashboardLayout judulHalaman="Manajemen Banner">
            <Head title="Manajemen Banner" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Daftar Banner Beranda</h1>
                    <p className="text-sm text-gray-600 mt-1">Kelola dan urutkan banner yang tampil di beranda.</p>
                </div>

                <RedirectOutlineButton
                    text="Tambah Banner"
                    href="/banners/create"
                    routeName="banners.create"
                />
            </div>

            <div className="bg-[#ffffff] border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="space-y-3">
                    {items.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">Belum ada banner.</p>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                draggable={hasReorderPermission}
                                onDragStart={hasReorderPermission ? (e) => handleDragStart(e, item) : undefined}
                                onDragEnd={hasReorderPermission ? handleDragEnd : undefined}
                                onDragOver={hasReorderPermission ? handleDragOver : undefined}
                                onDrop={hasReorderPermission ? (e) => handleDrop(e, item) : undefined}
                                className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#ffffff] border border-gray-200 rounded-md p-4 transition-all duration-200 hover:border-gray-300 hover:bg-[#f8f8f8] group gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    {hasReorderPermission && (
                                        <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 hidden sm:block">
                                            <HiIcons.HiSelector className="w-5 h-5" />
                                        </div>
                                    )}

                                    <div className="h-16 w-32 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex-shrink-0">
                                        <img src={`/storage/${item.banner}`} alt={item.title} className="w-full h-full object-cover" />
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[#1a1a1a] text-sm">{item.title}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 self-end sm:self-center">
                                    {hasEditPermission && (
                                        <Link
                                            href={`/banners/${item.id}/edit`}
                                            className="px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            Edit
                                        </Link>
                                    )}
                                    {hasDeletePermission && (
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-800/80 rounded hover:bg-red-950/30 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
