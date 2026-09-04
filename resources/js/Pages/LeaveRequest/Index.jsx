import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';
import PremiumTable from '@/Components/PremiumTable';

export default function Index({ leaveRequests }) {
    
    // Helper for Status Badge
    const getStatusBadge = (status) => {
        let colors = '';
        let dotColor = '';
        
        switch (status) {
            case 'Pending':
                colors = 'bg-yellow-50 text-yellow-700 border border-yellow-200/60';
                dotColor = 'bg-yellow-400';
                break;
            case 'Disetujui Dept Head':
                colors = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
                dotColor = 'bg-emerald-400';
                break;
            case 'Ditolak':
                colors = 'bg-red-50 text-red-700 border border-red-200/60';
                dotColor = 'bg-red-400';
                break;
            default:
                colors = 'bg-gray-50 text-gray-700 border border-gray-200/60';
                dotColor = 'bg-gray-400';
        }

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors} shadow-sm`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`}></span>
                {status}
            </span>
        );
    };

    const tableColumns = [
        {
            header: "Informasi Pengajuan",
            render: (request) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#f8f8f8] rounded-lg text-gray-400 group-hover:text-[#eaae36] group-hover:bg-[#eaae36]/10 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bold text-[#1a1a1a] group-hover:text-[#eaae36] transition-colors">
                            {new Date(request.request_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">#{String(request.id).padStart(5, '0')}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Karyawan",
            render: (request) => (
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 flex items-center justify-center text-[#1a1a1a] font-bold shadow-inner">
                        {request.employee?.user?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                        <p className="font-bold text-[#1a1a1a]">{request.employee?.user?.name}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{request.employee?.department || 'Tidak ada departemen'}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Jenis",
            render: (request) => (
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-[#f8f8f8] text-[#1a1a1a] border border-gray-100 group-hover:border-[#eaae36]/30 transition-colors">
                    {request.request_type}
                </span>
            )
        },
        {
            header: "Pelaksanaan",
            render: (request) => (
                <div className="text-sm">
                    <p className="font-semibold text-gray-700">{new Date(request.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    {request.end_date && request.end_date !== request.start_date && (
                        <p className="text-xs text-gray-400 mt-0.5">s/d {new Date(request.end_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    )}
                    {request.duration_days && (
                        <span className="inline-block mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            ({request.duration_days} Hari)
                        </span>
                    )}
                </div>
            )
        },
        {
            header: "Status",
            render: (request) => getStatusBadge(request.status)
        },
        {
            header: "Aksi",
            className: "text-right",
            cellClassName: "text-right",
            render: (request) => (
                <Link href={route('leave-requests.show', request.id)} className="inline-block p-2 text-gray-400 hover:text-[#eaae36] hover:bg-[#eaae36]/10 rounded-lg transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </Link>
            )
        }
    ];

    return (
        <DashboardLayout
            judulHalaman="Daftar Pengajuan Izin, Sakit & Cuti"
        >
            <Head title="Daftar Pengajuan Izin" />

            <div className="py-10 bg-[#f8f8f8] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {usePage().props.flash?.success && (
                        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                            <span className="font-medium">Berhasil!</span> {usePage().props.flash.success}
                        </div>
                    )}
                    {usePage().props.flash?.error && (
                        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                            <span className="font-medium">Gagal!</span> {usePage().props.flash.error}
                        </div>
                    )}
                    
                    {/* Premium Header Card */}
                    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-white/50 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {/* Decorative Background Element */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#eaae36]/10 rounded-full blur-3xl pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">Riwayat Pengajuan</h2>
                            <p className="text-gray-500 text-sm mt-2 max-w-xl">
                                Pantau dan kelola semua pengajuan izin, sakit, dan cuti karyawan di satu tempat.
                            </p>
                        </div>
                        
                        <Link
                            href={route('leave-requests.create')}
                            className="relative z-10 group flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#eaae36] text-white hover:text-[#1a1a1a] font-bold py-3 px-6 rounded-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(234,174,54,0.23)] transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Buat Pengajuan Baru
                        </Link>
                    </div>

                    <PremiumTable 
                        columns={tableColumns} 
                        data={leaveRequests} 
                        emptyStateTitle="Belum Ada Pengajuan"
                        emptyStateMessage="Belum ada data pengajuan izin, sakit, atau cuti yang ditemukan dalam sistem."
                        emptyStateActionText="Buat Pengajuan Sekarang"
                        emptyStateActionRoute="leave-requests.create"
                    />

                </div>
            </div>
        </DashboardLayout>
    );
}
