import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';

export default function BulkCreate() {
    const { data, setData, post, processing, errors } = useForm({
        routes: [
            { name: '', route_name: '' }
        ]
    });

    const handleAddRow = () => {
        setData('routes', [...data.routes, { name: '', route_name: '' }]);
    };

    const handleRemoveRow = (index) => {
        const newRoutes = [...data.routes];
        newRoutes.splice(index, 1);
        setData('routes', newRoutes);
    };

    const handleChange = (index, field, value) => {
        const newRoutes = [...data.routes];
        newRoutes[index][field] = value;
        setData('routes', newRoutes);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/routes');
    };

    return (
        <DashboardLayout judulHalaman="Bulk Add Routes">
            <Head title="Bulk Add Routes" />
            
            <div className="w-full bg-[#252526] border border-zinc-700 text-gray-200 rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-gray-200">Bulk Add Routes</h1>
                            <p className="text-sm text-gray-500 mt-1">Create multiple routes at once.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {data.routes.map((route, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Name <span className="text-xs text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#252526] border border-zinc-700 text-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                                        value={route.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        placeholder="e.g. Users List"
                                        required
                                    />
                                    {errors[`routes.${index}.name`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`routes.${index}.name`]}</p>
                                    )}
                                </div>
                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        Route Name (System) <span className="text-xs text-red-600">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#252526] border border-zinc-700 text-gray-200 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent"
                                        value={route.route_name}
                                        onChange={(e) => handleChange(index, 'route_name', e.target.value)}
                                        placeholder="e.g. users.index"
                                        required
                                    />
                                    {errors[`routes.${index}.route_name`] && (
                                        <p className="text-red-500 text-sm mt-1">{errors[`routes.${index}.route_name`]}</p>
                                    )}
                                </div>
                                <div className="mb-0 sm:mb-1">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(index)}
                                        disabled={data.routes.length === 1}
                                        className="bg-[#252526] border border-zinc-700 text-red-500 hover:bg-zinc-800 px-4 py-2 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed h-[42px]"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            type="button"
                            onClick={handleAddRow}
                            className="bg-[#252526] border border-zinc-700 text-gray-200 hover:bg-zinc-800 px-4 py-2 rounded-md transition"
                        >
                            + Add Row
                        </button>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-zinc-700">
                        <RedirectOutlineButton text="Cancel" href="/routes" className="me-auto" />
                        <SubmitOutlineButton text={processing ? 'Creating...' : 'Create Routes'} disabled={processing} />
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
