import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head } from '@inertiajs/react';

export default function Index({ stats }) {
    return (
        <DashboardLayout judulHalaman="Dashboard">
            <Head title="Dashboard" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-[#1a1a1a]">Dashboard Overview</h1>
                <p className="text-sm text-gray-600 mt-1">Summary of user statistics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Users */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-[#1a1a1a]">{stats.total}</p>
                </div>

                {/* Users Today */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Joined Today</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
                </div>

                {/* Users This Week */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Joined This Week</h3>
                    <p className="text-3xl font-bold text-indigo-600">{stats.this_week}</p>
                </div>

                {/* Users This Month */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col justify-center items-center hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Joined This Month</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.this_month}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Active vs Inactive */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">User Status</h3>
                    <div className="flex gap-4">
                        <div className="flex-1 bg-green-50 rounded-md p-4 border border-green-100 flex flex-col items-center">
                            <span className="text-xs font-semibold text-green-600 uppercase mb-1">Active</span>
                            <span className="text-2xl font-bold text-green-700">{stats.active}</span>
                        </div>
                        <div className="flex-1 bg-red-50 rounded-md p-4 border border-red-100 flex flex-col items-center">
                            <span className="text-xs font-semibold text-red-600 uppercase mb-1">Inactive</span>
                            <span className="text-2xl font-bold text-red-700">{stats.inactive}</span>
                        </div>
                    </div>
                </div>

                {/* Users By Role */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Users By Role</h3>
                    <div className="space-y-3">
                        {stats.by_role.map((role, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-md p-3 border border-gray-100">
                                <span className="text-sm font-semibold text-gray-700">{role.name}</span>
                                <span className="text-sm font-bold bg-[#eaae36] text-white px-3 py-1 rounded-full">
                                    {role.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
