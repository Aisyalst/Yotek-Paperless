import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, router } from '@inertiajs/react';

export default function Index({ roles = [], routes = [], rolePermissions = [] }) {
    const [processingCell, setProcessingCell] = useState(null); // { roleId, routeId }

    const handleToggle = (roleId, routeId, existingRp) => {
        setProcessingCell({ roleId, routeId });

        if (existingRp) {
            // Delete permission (uncheck)
            router.delete(`/role-permissions/${existingRp.id}`, {
                preserveScroll: true,
                onFinish: () => setProcessingCell(null),
            });
        } else {
            // Create permission (check)
            router.post('/role-permissions', {
                role_id: roleId,
                route_id: routeId
            }, {
                preserveScroll: true,
                onFinish: () => setProcessingCell(null),
            });
        }
    };

    return (
        <DashboardLayout judulHalaman="Permissions Matrix">
            <Head title="Permissions Matrix" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-200">Role Permissions Matrix</h1>
                    <p className="text-sm text-gray-400  mt-1">
                        Manage permissions directly by toggling the checkpoints for each role and route name.
                    </p>
                </div>
            </div>

            <div className="w-full bg-blue-500/10 border border-blue-500 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto dark-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-blue-500/1 border-b border-blue-500">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-200 w-[200px] sticky left-0 bg-blue-500/1 z-10 border-r border-blue-500">
                                    Roles / Routes
                                </th>
                                {routes.map((route) => (
                                    <th
                                        key={route.id}
                                        className="px-6 py-4 text-xs font-semibold text-gray-200 uppercase tracking-wider text-center min-w-[150px]"
                                    >
                                        <span className="block font-bold">{route.name}</span>
                                        <span className="block text-blue-300 font-normal mt-0.5 lowercase">{route.route_name}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-blue-500/50">
                            {roles.map((role) => (
                                <tr key={role.id} className="hover:bg-blue-500/1 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-200 sticky left-0 bg-[#252a36] z-10 border-r border-blue-500">
                                        {role.name}
                                    </td>
                                    {routes.map((route) => {
                                        const existingRp = rolePermissions.find(
                                            (rp) => rp.role_id === role.id && rp.route_id === route.id
                                        );
                                        const isChecked = !!existingRp;
                                        const isProcessing = processingCell &&
                                            processingCell.roleId === role.id &&
                                            processingCell.routeId === route.id;

                                        return (
                                            <td key={route.id} className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center h-6">
                                                    {isProcessing ? (
                                                        <div className="w-5 h-5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin"></div>
                                                    ) : (
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => handleToggle(role.id, route.id, existingRp)}
                                                            className="w-5 h-5 rounded border-blue-500 bg-blue-500/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}