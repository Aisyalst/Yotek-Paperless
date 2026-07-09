import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, router, usePage } from '@inertiajs/react';
import * as HiIcons from 'react-icons/hi';

// DynamicIcon renders a react-icons/hi component by string name
const DynamicIcon = ({ iconName }) => {
  const IconComponent = HiIcons[iconName];
  if (!IconComponent) {
    return <HiIcons.HiFolder className="text-gray-500 w-5 h-5" />; 
  }
  return <IconComponent className="text-gray-500 w-5 h-5" />;
};

export default function Index({ dashboardMenus = [] }) {
    const { auth } = usePage().props;
    const permissions = auth?.permissions || [];

    const hasReorderPermission = permissions.includes('dashboard-menus.reorder');
    const hasEditPermission = permissions.includes('dashboard-menus.edit');
    const hasDeletePermission = permissions.includes('dashboard-menus.destroy');

    // Helper function to group dashboardMenus by section
    const groupMenus = (menus) => {
        const grouped = { Tables: [], Settings: [] };
        menus.forEach(menu => {
            const sec = menu.section || 'Tables';
            if (!grouped[sec]) grouped[sec] = [];
            grouped[sec].push(menu);
        });
        return grouped;
    };

    const [menuTree, setMenuTree] = useState(() => groupMenus(dashboardMenus));
    const [draggedItem, setDraggedItem] = useState(null); // { id, parentId, section }

    useEffect(() => {
        setMenuTree(groupMenus(dashboardMenus));
    }, [dashboardMenus]);

    const handleDragStart = (e, item, parentId, section) => {
        setDraggedItem({ id: item.id, parentId, section });
        e.dataTransfer.effectAllowed = 'move';
        e.currentTarget.classList.add('opacity-40');
    };

    const handleDragEnd = (e) => {
        e.currentTarget.classList.remove('opacity-40');
        setDraggedItem(null);
    };

    const handleDragOver = (e, targetItem, parentId, section) => {
        e.preventDefault();
        if (!draggedItem) return;

        // Only allow dropping on items at the same level (same parent and section)
        if (draggedItem.parentId !== parentId || draggedItem.section !== section) {
            e.dataTransfer.dropEffect = 'none';
            return;
        }

        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetItem, parentId, section) => {
        e.preventDefault();
        if (!draggedItem) return;

        if (draggedItem.parentId !== parentId || draggedItem.section !== section) {
            return;
        }

        if (draggedItem.id === targetItem.id) return;

        const updatedTree = { ...menuTree };

        if (parentId === null) {
            const list = [...updatedTree[section]];
            const draggedIndex = list.findIndex(i => i.id === draggedItem.id);
            const targetIndex = list.findIndex(i => i.id === targetItem.id);

            const [removed] = list.splice(draggedIndex, 1);
            list.splice(targetIndex, 0, removed);

            updatedTree[section] = list;
            setMenuTree(updatedTree);

            const ids = list.map(item => item.id);
            router.post('/dashboard-menus/reorder', { ids }, { preserveScroll: true });
        } else {
            const sectionList = [...updatedTree[section]];
            const parentIndex = sectionList.findIndex(i => i.id === parentId);
            if (parentIndex !== -1) {
                const childList = [...sectionList[parentIndex].children];
                const draggedIndex = childList.findIndex(i => i.id === draggedItem.id);
                const targetIndex = childList.findIndex(i => i.id === targetItem.id);

                const [removed] = childList.splice(draggedIndex, 1);
                childList.splice(targetIndex, 0, removed);

                sectionList[parentIndex].children = childList;
                updatedTree[section] = sectionList;
                setMenuTree(updatedTree);

                const ids = childList.map(item => item.id);
                router.post('/dashboard-menus/reorder', { ids }, { preserveScroll: true });
            }
        }
    };

    const handleDelete = (menu) => {
        if (confirm(`Are you sure you want to delete menu "${menu.name}"?`)) {
            router.delete(`/dashboard-menus/${menu.id}`);
        }
    };

    const renderRow = (menu, parentId = null, sectionName) => {
        const IconComponent = HiIcons[menu.icon] || HiIcons.HiFolder;
        const DragIcon = HiIcons.HiSelector;

        return (
            <li key={menu.id} className="list-none">
                {/* Menu Item Card */}
                <div
                    draggable={hasReorderPermission}
                    onDragStart={hasReorderPermission ? (e) => handleDragStart(e, menu, parentId, sectionName) : undefined}
                    onDragEnd={hasReorderPermission ? handleDragEnd : undefined}
                    onDragOver={hasReorderPermission ? (e) => handleDragOver(e, menu, parentId, sectionName) : undefined}
                    onDrop={hasReorderPermission ? (e) => handleDrop(e, menu, parentId, sectionName) : undefined}
                    className={`flex items-center justify-between bg-blue-500/10 border border-blue-500 rounded-md p-4 transition-all duration-200 hover:border-blue-400 hover:bg-blue-500/20 group ${
                        parentId !== null ? 'ml-8 relative border-dashed' : ''
                    }`}
                >
                    {/* Visual dashed connector for child items */}
                    {parentId !== null && (
                        <div className="absolute left-[-2rem] top-0 bottom-1/2 w-8 border-l border-b border-gray-800 border-dashed rounded-bl-lg"></div>
                    )}

                    <div className="flex items-center gap-3">
                        {/* Drag Handle */}
                        {hasReorderPermission && (
                            <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 p-1">
                                <DragIcon className="w-5 h-5" />
                            </div>
                        )}

                        {/* Menu Icon */}
                        <div className="p-2 bg-blue-500/20 border border-blue-500 rounded-md text-blue-300">
                            <DynamicIcon iconName={menu.icon} />
                        </div>

                        {/* Details */}
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-200 text-sm">{menu.name}</span>
                                <span className="text-xs text-gray-500 font-mono">Pos: {menu.position}</span>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                                    menu.type === 'Dropdown' 
                                        ? 'text-yellow-700 border-yellow-800 bg-yellow-950/5' 
                                        : 'text-purple-700 border-purple-800 bg-purple-950/5'
                                }`}>
                                    {menu.type}
                                </span>
                                {menu.type === 'Single' && (
                                    <span>• Route: {menu.route?.name || '-'}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {hasEditPermission && (
                            <Link
                                href={`/dashboard-menus/${menu.id}/edit`}
                                className="px-3 py-1.5 text-xs font-semibold text-blue-400 border border-blue-800/80 rounded hover:bg-blue-950/30 transition-colors"
                            >
                                Edit
                            </Link>
                        )}
                        {hasDeletePermission && (
                            <button
                                onClick={() => handleDelete(menu)}
                                className="px-3 py-1.5 text-xs font-semibold text-red-400 border border-red-800/80 rounded hover:bg-red-950/30 transition-colors"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>

                {/* Render children if Dropdown parent */}
                {menu.type === 'Dropdown' && menu.children && menu.children.length > 0 && (
                    <ul className="space-y-3 mt-3 relative pl-0">
                        {menu.children.map(child => renderRow(child, menu.id, sectionName))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <DashboardLayout judulHalaman="Dashboard Menus management">
            <Head title="Dashboard Menus management" />

            {/* Bagian Atas: Judul & Tombol Tambah */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-200">List Dashboard Menus</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage and drag-and-drop to reorder all dashboard menus.</p>
                </div>

                <RedirectOutlineButton
                    text="Add Dashboard Menu"
                    href="/dashboard-menus/create"
                    routeName="dashboard-menus.create"
                />
            </div>

            {/* Bagian Bawah: Menu Tree Lists */}
            <div className="space-y-8">
                {Object.entries(menuTree).map(([sectionName, items]) => (
                    <div key={sectionName} className="bg-blue-500/10 border border-blue-500 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center justify-between border-b border-blue-500/50 pb-3 mb-4">
                            <h2 className="text-md font-bold text-blue-300 uppercase tracking-wider">
                                {sectionName} Section
                            </h2>
                            <span className="text-xs text-gray-500 font-normal">
                                Drag handles to reorder menus inside this section
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <p className="text-sm text-gray-500 py-4 text-center">No menus in this section.</p>
                        ) : (
                            <ul className="space-y-3 pl-0">
                                {items.map((menu) => renderRow(menu, null, sectionName))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}