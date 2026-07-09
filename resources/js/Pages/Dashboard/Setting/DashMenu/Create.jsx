import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ routes = [], parentMenus = [] }) {
    // Inisialisasi useForm bawaan Inertia
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        icon: '',
        type: 'Single',
        section: 'Tables',
        parent_id: '',
        route_id: '',
        position: '1',
    });

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim request POST ke route '/dashboard-menus'
        post('/dashboard-menus')
    };

    return (
        <DashboardLayout judulHalaman="Add Dashboard Menu">
            <Head title="Add Dashboard Menu" />

            <div className="w-full bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-zinc-700">Add New Dashboard Menu</h1>
                            <p className="text-sm text-gray-500 mt-1">Create a new dashboard menu.</p>
                        </div>
                    </div>
                    
                    {/* Input Nama */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Name <span className="text-xs text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Name"
                        />
                        {/* Menampilkan pesan error validasi dari Laravel jika ada */}
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Input Icon */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Icon <span className="text-xs text-gray-500">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            value={data.icon}
                            onChange={(e) => setData('icon', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Icon name (e.g. HiCog, HiUser)"
                        />
                        {/* Menampilkan pesan error validasi dari Laravel jika ada */}
                        {errors.icon && <p className="text-red-500 text-sm mt-1">{errors.icon}</p>}
                    </div>

                    {/* Input Type & Section in Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Input Type */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Type <span className="text-xs text-red-600">*</span>
                            </label>
                            <select
                                value={data.type}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'Dropdown') {
                                        setData(prev => ({
                                            ...prev,
                                            type: val,
                                            route_id: '',
                                            parent_id: ''
                                        }));
                                    } else {
                                        setData('type', val);
                                    }
                                }}
                                className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Single">Single Link</option>
                                <option value="Dropdown">Collapsible Dropdown Parent</option>
                            </select>
                            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                        </div>

                        {/* Input Section */}
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 mb-2">
                                Section <span className="text-xs text-red-600">*</span>
                            </label>
                            <select
                                value={data.section}
                                onChange={(e) => setData('section', e.target.value)}
                                className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Tables">Tables</option>
                                <option value="Settings">Settings</option>
                            </select>
                            {errors.section && <p className="text-red-500 text-sm mt-1">{errors.section}</p>}
                        </div>
                    </div>

                    {/* Conditional Route & Parent selection */}
                    {data.type === 'Single' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Input Route ID */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    Route <span className="text-xs text-red-600">*</span>
                                </label>
                                <select
                                    value={data.route_id}
                                    onChange={(e) => setData('route_id', e.target.value)}
                                    className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Route</option>
                                    {routes.map((route) => (
                                        <option key={route.id} value={route.id}>
                                            {route.name} ({route.route_name})
                                        </option>
                                    ))}
                                </select>
                                {errors.route_id && <p className="text-red-500 text-sm mt-1">{errors.route_id}</p>}
                            </div>

                            {/* Input Parent ID */}
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                    Parent Menu <span className="text-xs text-gray-500">(Optional)</span>
                                </label>
                                <select
                                    value={data.parent_id}
                                    onChange={(e) => setData('parent_id', e.target.value)}
                                    className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">No Parent (Top Level)</option>
                                    {parentMenus.map((parent) => (
                                        <option key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.parent_id && <p className="text-red-500 text-sm mt-1">{errors.parent_id}</p>}
                            </div>
                        </div>
                    )}

                    {/* Input Position */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Position <span className="text-xs text-red-600">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={data.position}
                            onChange={(e) => setData('position', e.target.value)}
                            className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Menu order position (e.g. 1, 2, 3)"
                        />
                        {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
                        <p className="text-xs text-gray-500 mt-1">
                            Note: If there is an existing menu at this position, it (and all menus below it) will be shifted down by 1.
                        </p>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-200">
                        <RedirectOutlineButton text="Cancel" href="/dashboard-menus" className="me-auto" />
                        
                        <SubmitOutlineButton text="Create" disabled={processing} />
                        
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}