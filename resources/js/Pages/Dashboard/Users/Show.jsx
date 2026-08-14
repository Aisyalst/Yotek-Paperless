import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link } from '@inertiajs/react';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';

export default function Show({ user }) {
    return (
        <DashboardLayout judulHalaman="User Detail">
            <Head title={`Detail - ${user.name}`} />

            {/* Top Section: Title & Back Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">User Detail</h1>
                    <p className="text-sm text-gray-500 mt-1">Complete information about this user.</p>
                </div>

                <RedirectOutlineButton
                    text="Back"
                    href="/users"
                />
            </div>

            {/* User Detail Content */}
            <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
                {/* Header with Avatar (optional) */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-6">
                    <h2 className="text-2xl font-bold text-white">
                        {user.name}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">{user.email}</p>
                </div>

                {/* Body with Information */}
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-800 rounded-full">
                                {user.role.name}
                            </span>
                            {Number(user.is_active) === 1 ? (
                                <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                                    Active
                                </span>
                            ) : (
                                <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full">
                                    Inactive
                                </span>
                            )}
                        </div>

                        {/* Left Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase">ID</label>
                                <p className="text-zinc-800 mt-1">{user.id}</p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Full Name</label>
                                <p className="text-zinc-800 mt-1">{user.name}</p>
                            </div>
                            
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Phone</label>
                                <p className="text-zinc-800 mt-1">{user.phone || '-'}</p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Email</label>
                                <p className="text-zinc-800 mt-1">{user.email}</p>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-500 uppercase">Registration Date</label>
                                <p className="text-zinc-800 mt-1">
                                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer with Action Buttons */}
                <div className="bg-zinc-50 border-t border-zinc-200 p-6 flex gap-3 justify-end">
                    <Link
                        href={`/users/${user.id}/edit`}
                        className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded transition-colors font-medium"
                    >
                        Edit
                    </Link>

                    <button
                        onClick={() => {
                            if (confirm(`Delete user ${user.name}?`)) {
                                // Delete implementation later
                                console.log('Delete user:', user.id);
                            }
                        }}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

