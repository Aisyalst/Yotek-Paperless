import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, router } from '@inertiajs/react';
import { HiShieldCheck, HiOutlineCollection } from 'react-icons/hi';

export default function Index({ roles = [], routes = [], rolePermissions = [] }) {
    const [selectedRole, setSelectedRole] = useState(roles[0] || null);
    const [processingCell, setProcessingCell] = useState(null); // { routeId }
    const [searchQuery, setSearchQuery] = useState('');

    // Group routes by module name (first part before dot)
    const groupedRoutes = useMemo(() => {
        const filteredRoutes = routes.filter(route => 
            route.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            route.route_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return filteredRoutes.reduce((acc, route) => {
            const moduleName = route.route_name.split('.')[0] || route.route_name;
            if (!acc[moduleName]) {
                acc[moduleName] = [];
            }
            acc[moduleName].push(route);
            return acc;
        }, {});
    }, [routes, searchQuery]);

    const handleToggle = (routeId, existingRp) => {
        if (!selectedRole) return;
        
        setProcessingCell({ routeId });

        if (existingRp) {
            router.delete(`/role-permissions/${existingRp.id}`, {
                preserveScroll: true,
                onFinish: () => setProcessingCell(null),
            });
        } else {
            router.post('/role-permissions', {
                role_id: selectedRole.id,
                route_id: routeId
            }, {
                preserveScroll: true,
                onFinish: () => setProcessingCell(null),
            });
        }
    };

    return (
        <DashboardLayout judulHalaman="Permissions Setting">
            <Head title="Permissions Setting" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-[#1a1a1a]">Role Permissions</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Pilih Role di sebelah kiri untuk melihat dan mengatur permissions-nya.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar: Roles List */}
                <div className="lg:w-1/4 flex-shrink-0">
                    <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm overflow-hidden sticky top-6">
                        <div className="p-4 border-b border-gray-200 bg-[#f8f8f8]">
                            <h2 className="font-semibold text-[#1a1a1a] flex items-center gap-2">
                                <HiShieldCheck className="w-5 h-5 text-[#eaae36]" />
                                Daftar Role
                            </h2>
                        </div>
                        <ul className="divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
                            {roles.map(role => (
                                <li key={role.id}>
                                    <button
                                        onClick={() => setSelectedRole(role)}
                                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${selectedRole?.id === role.id ? 'bg-[#f8f8f8] border-l-4 border-[#eaae36]' : 'border-l-4 border-transparent'}`}
                                    >
                                        <span className={`font-medium ${selectedRole?.id === role.id ? 'text-[#eaae36]' : 'text-[#1a1a1a]'}`}>
                                            {role.name}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right Content: Permissions by Module */}
                <div className="lg:w-3/4 flex-grow">
                    {selectedRole ? (
                        <div className="space-y-6">
                            <div className="bg-[#ffffff] p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <h3 className="text-lg font-bold text-[#1a1a1a]">
                                    Permissions untuk <span className="text-[#eaae36]">{selectedRole.name}</span>
                                </h3>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Cari module atau route..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-[#eaae36] focus:border-[#eaae36] w-full sm:w-64"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(groupedRoutes).map(([moduleName, moduleRoutes]) => (
                                    <div key={moduleName} className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                        <div className="px-4 py-3 bg-[#f8f8f8] border-b border-gray-200 flex justify-between items-center">
                                            <h4 className="font-semibold text-[#1a1a1a] capitalize flex items-center gap-2">
                                                <HiOutlineCollection className="w-4 h-4 text-gray-500" />
                                                {moduleName.replace('-', ' ')}
                                            </h4>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            {moduleRoutes.map(route => {
                                                const existingRp = rolePermissions.find(
                                                    rp => rp.role_id === selectedRole.id && rp.route_id === route.id
                                                );
                                                const isChecked = !!existingRp;
                                                const isProcessing = processingCell && processingCell.routeId === route.id;
                                                
                                                return (
                                                    <div key={route.id} className="flex items-center justify-between group py-1 border-b border-gray-100 last:border-0">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-[#1a1a1a]">{route.name}</span>
                                                            <span className="text-xs text-gray-500 lowercase">{route.route_name}</span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            {isProcessing ? (
                                                                <div className="w-5 h-5 border-2 border-[#eaae36] border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <label className="relative inline-flex items-center cursor-pointer">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="sr-only peer"
                                                                        checked={isChecked}
                                                                        onChange={() => handleToggle(route.id, existingRp)}
                                                                    />
                                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#eaae36]"></div>
                                                                </label>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-[#ffffff] border border-gray-200 rounded-lg shadow-sm p-12 text-center">
                            <p className="text-gray-500">Silakan pilih role dari sidebar untuk melihat permissions.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}


