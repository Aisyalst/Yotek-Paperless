import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link } from '@inertiajs/react';

export default function Show({ leaveRequest }) {
    return (
        <DashboardLayout judulHalaman="Detail Pengajuan Cuti">
            <Head title={`Detail Pengajuan Cuti #${leaveRequest.id}`} />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Detail Pengajuan Cuti #{leaveRequest.id}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Informasi lengkap mengenai pengajuan cuti dan status persetujuan.
                    </p>
                </div>
                <Link
                    href={route('leave-requests.index')}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                    Kembali
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 pb-2 border-b">
                            Informasi Pengajuan
                        </h2>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <p className="text-gray-500 mb-1">Karyawan</p>
                                <p className="font-medium text-[#1a1a1a]">
                                    {leaveRequest.employee?.user?.name || '-'} 
                                    <span className="text-gray-400 font-normal ml-2">
                                        ({leaveRequest.employee_nik})
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Status Pengajuan</p>
                                <span className={`px-2 py-1 inline-flex rounded text-xs font-semibold ${
                                    leaveRequest.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                    leaveRequest.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {leaveRequest.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Jenis Pengajuan</p>
                                <p className="font-medium text-[#1a1a1a]">{leaveRequest.request_type}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tanggal Request</p>
                                <p className="font-medium text-[#1a1a1a]">{leaveRequest.request_date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tanggal Mulai</p>
                                <p className="font-medium text-[#1a1a1a]">{leaveRequest.start_date}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tanggal Selesai</p>
                                <p className="font-medium text-[#1a1a1a]">{leaveRequest.end_date || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Durasi</p>
                                <p className="font-medium text-[#1a1a1a]">
                                    {leaveRequest.duration_days ? `${leaveRequest.duration_days} Hari` : '-'}
                                </p>
                            </div>
                            {leaveRequest.request_type === 'Izin' && (
                                <>
                                    <div>
                                        <p className="text-gray-500 mb-1">Jenis Izin</p>
                                        <p className="font-medium text-[#1a1a1a]">{leaveRequest.permission_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 mb-1">Waktu Izin</p>
                                        <p className="font-medium text-[#1a1a1a]">
                                            {leaveRequest.permission_start_time} - {leaveRequest.permission_end_time}
                                        </p>
                                    </div>
                                </>
                            )}
                            <div className="col-span-2">
                                <p className="text-gray-500 mb-1">Alasan</p>
                                <p className="font-medium text-[#1a1a1a] whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-100">
                                    {leaveRequest.reason || 'Tidak ada alasan yang diberikan.'}
                                </p>
                            </div>
                            {leaveRequest.work_delegation && (
                                <div className="col-span-2">
                                    <p className="text-gray-500 mb-1">Delegasi Pekerjaan Ke</p>
                                    <p className="font-medium text-[#1a1a1a]">{leaveRequest.work_delegation}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4 pb-2 border-b">
                            Alur Persetujuan
                        </h2>
                        
                        {!leaveRequest.approvals || leaveRequest.approvals.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Belum ada alur persetujuan.</p>
                        ) : (
                            <div className="space-y-6">
                                {leaveRequest.approvals.map((approval, index) => (
                                    <div key={approval.id} className="relative">
                                        {/* Timeline Line */}
                                        {index !== leaveRequest.approvals.length - 1 && (
                                            <div className="absolute left-4 top-10 bottom-[-24px] w-0.5 bg-gray-200"></div>
                                        )}
                                        
                                        <div className="flex items-start">
                                            {/* Status Icon Indicator */}
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                                approval.status === 'Approved' ? 'bg-green-100 text-green-600 border border-green-200' :
                                                approval.status === 'Rejected' ? 'bg-red-100 text-red-600 border border-red-200' :
                                                'bg-yellow-100 text-yellow-600 border border-yellow-200'
                                            }`}>
                                                {approval.status === 'Approved' && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                )}
                                                {approval.status === 'Rejected' && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                )}
                                                {approval.status === 'Pending' && (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                )}
                                            </div>
                                            
                                            <div className="ml-4 flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#1a1a1a]">
                                                            {approval.approver?.name || `NIK: ${approval.approver_nik}`}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {approval.approver_role || `Level ${approval.approver_level}`}
                                                        </p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                                        approval.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                        approval.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {approval.status}
                                                    </span>
                                                </div>

                                                {/* Display Signature if available */}
                                                {approval.signature && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <p className="text-xs text-gray-500 mb-1">Tanda Tangan:</p>
                                                        <div className="bg-white border border-gray-200 rounded p-1 inline-block">
                                                            <img 
                                                                src={approval.signature} 
                                                                alt="Signature" 
                                                                className="h-16 object-contain select-none"
                                                                onContextMenu={(e) => e.preventDefault()}
                                                                draggable="false"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                                {!approval.signature && approval.status !== 'Pending' && (
                                                    <div className="mt-2 text-xs text-gray-400 italic">
                                                        (Tidak ada tanda tangan)
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
