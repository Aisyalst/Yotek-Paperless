import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function LeaveHistory({ auth, usages }) {
    const renderUsageRow = (usage, index) => {
        const dateStr = new Date(usage.created_at).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        const entitlementPeriod = `${new Date(usage.leave_entitlement.start_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})} - ${new Date(usage.leave_entitlement.end_date).toLocaleDateString('id-ID', {day: '2-digit', month: 'short', year: 'numeric'})}`;

        return (
            <div key={usage.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                    <div className="bg-red-50 text-red-600 rounded-lg p-3 flex-shrink-0 flex flex-col items-center justify-center min-w-[4rem]">
                        <span className="text-xl font-extrabold">-{usage.deducted_days}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider">Hari</span>
                    </div>
                    <div>
                        <h4 className="font-bold text-[#1a1a1a] text-lg">Potong Cuti</h4>
                        <p className="text-sm text-gray-500 font-medium">{dateStr}</p>
                        <div className="mt-2 space-y-1">
                            <p className="text-xs text-gray-500">
                                <span className="font-semibold text-gray-700">Periode Cuti:</span> {entitlementPeriod}
                            </p>
                            <p className="text-xs text-gray-500">
                                <span className="font-semibold text-gray-700">Ref. Pengajuan:</span> #{String(usage.leave_request_id).padStart(5, '0')}
                            </p>
                            {usage.reason && (
                                <p className="text-xs text-gray-500">
                                    <span className="font-semibold text-gray-700">Alasan:</span> {usage.reason}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-[#1a1a1a] leading-tight">Riwayat Potong Cuti</h2>}
        >
            <Head title="Riwayat Potong Cuti" />

            <div className="py-12 bg-[#f8f8f8] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Card */}
                    <div className="bg-gradient-to-r from-[#1a1a1a] to-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8">
                        <div className="absolute top-0 right-0 -mt-16 -mr-16 text-white/5">
                            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold text-white mb-2">Riwayat Penggunaan Cuti</h1>
                            <p className="text-gray-300">
                                Transparansi penuh. Lihat kapan dan berapa hari saldo cuti Anda dipotong.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-lg overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100/50 p-6 lg:p-8">
                        <h3 className="text-xl font-bold text-[#1a1a1a] mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-[#eaae36]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            Log Pemotongan
                        </h3>

                        {usages && usages.length > 0 ? (
                            <div className="space-y-4">
                                {usages.map((usage, idx) => renderUsageRow(usage, idx))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                <h3 className="text-lg font-bold text-gray-600 mb-1">Belum Ada Riwayat</h3>
                                <p className="text-sm text-gray-400">Saldo cuti Anda belum pernah dipotong melalui sistem persetujuan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
