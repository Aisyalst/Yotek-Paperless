import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React from 'react';

export default function Index({ auth, userData }) {
    const { personal_information, employee_information, contract_information } = userData;

    const renderCard = (title, data, icon) => (
        <div className="bg-white/80 backdrop-blur-lg overflow-hidden shadow-xl sm:rounded-2xl transition-all duration-300 hover:shadow-2xl border border-gray-100/50 hover:border-[#eaae36]/30 group">
            <div className="p-6 text-gray-900">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="p-2 bg-[#f8f8f8] rounded-xl text-[#eaae36] group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#1a1a1a]">{title}</h3>
                </div>

                {data ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        {Object.entries(data).map(([key, value]) => {
                            if (['id', 'nik', 'created_at', 'updated_at'].includes(key) || typeof value === 'object') return null;
                            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            return (
                                <div key={key} className="flex flex-col space-y-1 p-3 rounded-lg hover:bg-[#f8f8f8] transition-colors duration-200">
                                    <span className="text-sm font-semibold text-gray-500">{label}</span>
                                    <span className="text-base text-[#1a1a1a] break-words">{value || '-'}</span>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-8 text-gray-400 italic bg-gray-50/50 rounded-xl">
                        Data belum tersedia.
                    </div>
                )}
            </div>
        </div>
    );

    const personalIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
    );

    const employeeIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
    );

    const contractIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-[#1a1a1a] leading-tight">Profil Saya</h2>}
        >
            <Head title="Profil" />

            <div className="py-12 bg-[#f8f8f8] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* User Summary Card */}
                    <div className="bg-gradient-to-r from-[#1a1a1a] to-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-white/5">
                            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                        </div>
                        <div className="relative z-10 flex items-center space-x-6">
                            <div className="h-24 w-24 rounded-full bg-[#eaae36] flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-white/20">
                                {userData.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{userData.name}</h1>
                                <div className="flex space-x-4 text-gray-300">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                        {userData.email}
                                    </span>
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                                        NIK: {userData.nik || '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {renderCard('Informasi Pribadi', personal_information, personalIcon)}
                        {renderCard('Informasi Karyawan', employee_information, employeeIcon)}

                        <div className="lg:col-span-2">
                            {renderCard('Informasi Kontrak (Terbaru)', contract_information && contract_information.length > 0 ? contract_information[contract_information.length - 1] : null, contractIcon)}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
