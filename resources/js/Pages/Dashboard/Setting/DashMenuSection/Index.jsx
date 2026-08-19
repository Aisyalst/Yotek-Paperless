import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import * as HiIcons from 'react-icons/hi';

export default function Index({ sections = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasEditPermission = permissions.includes('dashboard-menu-sections.edit');
    const hasDeletePermission = permissions.includes('dashboard-menu-sections.destroy');
    const hasReorderPermission = true; // Assuming any user who can view this can also reorder, or add specific permission check if needed.

    const [sectionList, setSectionList] = useState(sections);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        setSectionList(sections);
    }, [sections]);

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

        const list = [...sectionList];
        const draggedIndex = list.findIndex(i => i.id === draggedItem.id);
        const targetIndex = list.findIndex(i => i.id === targetItem.id);

        const [removed] = list.splice(draggedIndex, 1);
        list.splice(targetIndex, 0, removed);

        setSectionList(list);

        const ids = list.map(item => item.id);
        router.post('/dashboard-menu-sections/reorder', { ids }, { preserveScroll: true });
    };

    const handleDelete = (section) => {
        if (confirm(`Are you sure you want to delete section "${section.name}"?`)) {
            router.delete(`/dashboard-menu-sections/${section.id}`);
        }
    };

    const DragIcon = HiIcons.HiSelector;

    return (
        <DashboardLayout judulHalaman="Dashboard Menu Sections">
            <Head title="Dashboard Menu Sections" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Dashboard Menu Sections</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage and drag-and-drop to reorder menu sections.</p>
                </div>

                <RedirectOutlineButton
                    text="Add Section"
                    href="/dashboard-menu-sections/create"
                    routeName="dashboard-menu-sections.create"
                />
            </div>

            <div className="space-y-3">
                {sectionList.length === 0 ? (
                    <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">
                        No sections found.
                    </div>
                ) : (
                    sectionList.map((section) => (
                        <div
                            key={section.id}
                            draggable={hasReorderPermission}
                            onDragStart={hasReorderPermission ? (e) => handleDragStart(e, section) : undefined}
                            onDragEnd={hasReorderPermission ? handleDragEnd : undefined}
                            onDragOver={hasReorderPermission ? handleDragOver : undefined}
                            onDrop={hasReorderPermission ? (e) => handleDrop(e, section) : undefined}
                            className="flex items-center justify-between bg-[#ffffff] border border-gray-200 rounded-md p-4 transition-all duration-200 hover:border-gray-300 hover:bg-[#f8f8f8]"
                        >
                            <div className="flex items-center gap-3">
                                {hasReorderPermission && (
                                    <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-600 p-1">
                                        <DragIcon className="w-5 h-5" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-[#1a1a1a] text-sm">{section.name}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 font-mono">
                                        Order: {section.order}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {hasEditPermission && (
                                    <Link
                                        href={`/dashboard-menu-sections/${section.id}/edit`}
                                        className="px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {hasDeletePermission && (
                                    <button
                                        onClick={() => handleDelete(section)}
                                        className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-800/80 rounded hover:bg-red-950/30 transition-colors"
                                    >
                                        Delete
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
