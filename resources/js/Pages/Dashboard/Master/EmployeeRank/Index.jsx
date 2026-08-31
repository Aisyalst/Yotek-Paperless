import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import * as HiIcons from 'react-icons/hi';

export default function Index({ employeeRanks = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasEditPermission = permissions.includes('employee-ranks.edit');
    const hasDeletePermission = permissions.includes('employee-ranks.destroy');
    const hasReorderPermission = true; 

    const [rankList, setRankList] = useState(employeeRanks);
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
        setRankList(employeeRanks);
    }, [employeeRanks]);

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

        const list = [...rankList];
        const draggedIndex = list.findIndex(i => i.id === draggedItem.id);
        const targetIndex = list.findIndex(i => i.id === targetItem.id);

        const [removed] = list.splice(draggedIndex, 1);
        list.splice(targetIndex, 0, removed);

        setRankList(list);

        const ids = list.map(item => item.id);
        router.post(route('employee-ranks.reorder'), { ids }, { preserveScroll: true });
    };

    const handleDelete = (rank) => {
        if (confirm(`Are you sure you want to delete rank "${rank.title}"?`)) {
            router.delete(route('employee-ranks.destroy', rank.id));
        }
    };

    const DragIcon = HiIcons.HiSelector;

    return (
        <DashboardLayout judulHalaman="Employee Ranks">
            <Head title="Employee Ranks" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Employee Ranks</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage and drag-and-drop to reorder employee ranks.</p>
                </div>

                <RedirectOutlineButton
                    text="Add Rank"
                    href={route('employee-ranks.create')}
                    routeName="employee-ranks.create"
                />
            </div>

            <div className="space-y-3">
                {rankList.length === 0 ? (
                    <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm p-8 text-center text-gray-500">
                        No ranks found.
                    </div>
                ) : (
                    rankList.map((rank) => (
                        <div
                            key={rank.id}
                            draggable={hasReorderPermission}
                            onDragStart={hasReorderPermission ? (e) => handleDragStart(e, rank) : undefined}
                            onDragEnd={hasReorderPermission ? handleDragEnd : undefined}
                            onDragOver={hasReorderPermission ? handleDragOver : undefined}
                            onDrop={hasReorderPermission ? (e) => handleDrop(e, rank) : undefined}
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
                                        <span className="font-bold text-[#1a1a1a] text-sm">{rank.title}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5 font-mono">
                                        Order: {rank.order}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {hasEditPermission && (
                                    <Link
                                        href={route('employee-ranks.edit', rank.id)}
                                        className="px-3 py-1.5 text-xs font-semibold text-[#1a1a1a] border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                                    >
                                        Edit
                                    </Link>
                                )}
                                {hasDeletePermission && (
                                    <button
                                        onClick={() => handleDelete(rank)}
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
