import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import { Head, useForm } from '@inertiajs/react';
import { HiPlus, HiTrash } from 'react-icons/hi';

export default function Create() {
    // Inisialisasi useForm bawaan Inertia dengan array
    const { data, setData, post, processing, errors } = useForm({
        routes: [
            { name: '', route_name: '' }
        ]
    });

    const addRow = () => {
        setData('routes', [...data.routes, { name: '', route_name: '' }]);
    };

    const removeRow = (index) => {
        if (data.routes.length === 1) return;
        const newRoutes = data.routes.filter((_, i) => i !== index);
        setData('routes', newRoutes);
    };

    const handleChange = (index, field, value) => {
        const newRoutes = [...data.routes];
        newRoutes[index][field] = value;
        setData('routes', newRoutes);
    };

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/routes');
    };

    return (
        <DashboardLayout judulHalaman="Add Routes (Bulk)">
            <Head title="Add Routes (Bulk)" />

            <div className="w-full bg-white border border-zinc-200 rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-zinc-700">Add New Routes</h1>
                            <p className="text-sm text-gray-500 mt-1">Create multiple routes at once.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addRow}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors duration-200"
                        >
                            <HiPlus className="w-4 h-4" />
                            Add Row
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.routes.map((routeRow, index) => (
                            <div 
                                key={index} 
                                className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-md relative group transition-all duration-300"
                            >
                                <div className="text-xs font-bold text-zinc-500 bg-white w-6 h-6 flex items-center justify-center rounded-full border border-zinc-200 md:self-center">
                                    {index + 1}
                                </div>

                                {/* Input Nama */}
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 md:hidden">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={routeRow.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="e.g. Users List"
                                    />
                                    {errors[`routes.${index}.name`] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors[`routes.${index}.name`]}
                                        </p>
                                    )}
                                </div>

                                {/* Input Route Name */}
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 md:hidden">
                                        Route Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={routeRow.route_name}
                                        onChange={(e) => handleChange(index, 'route_name', e.target.value)}
                                        className="w-full bg-white border border-zinc-300 text-zinc-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="e.g. users.index"
                                    />
                                    {errors[`routes.${index}.route_name`] && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors[`routes.${index}.route_name`]}
                                        </p>
                                    )}
                                </div>

                                {/* Tombol Hapus Row */}
                                <button
                                    type="button"
                                    onClick={() => removeRow(index)}
                                    disabled={data.routes.length === 1}
                                    className="p-2 text-zinc-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-100 rounded transition-colors self-end md:self-center"
                                    title="Delete row"
                                >
                                    <HiTrash className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {errors.routes && (
                        <p className="text-red-500 text-sm">{errors.routes}</p>
                    )}

                    {/* Tombol Aksi */}
                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-200">
                        <RedirectOutlineButton text="Cancel" href="/routes" className="me-auto" />
                        
                        <SubmitOutlineButton text="Save All Routes" disabled={processing} />
                        
                    </div>

                </form>
            </div>
        </DashboardLayout>
    );
}