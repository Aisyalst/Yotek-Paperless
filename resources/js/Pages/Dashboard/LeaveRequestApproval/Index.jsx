import React, { useState, useRef } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, router } from '@inertiajs/react';
import SignatureCanvas from 'react-signature-canvas';

export default function Index({ approvals }) {
    const sigCanvas = useRef({});
    
    // UI State
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(''); // 'Approved' or 'Rejected'
    const [selectedApprovalId, setSelectedApprovalId] = useState(null);
    const [signatureError, setSignatureError] = useState('');
    const [processing, setProcessing] = useState(false);

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Filter approvals
    const pendingApprovals = approvals.filter(a => a.status === 'Pending' && a.is_my_turn);
    const historyApprovals = approvals.filter(a => a.status !== 'Pending');

    const displayedApprovals = activeTab === 'pending' ? pendingApprovals : historyApprovals;

    const openDetailModal = (request) => {
        setSelectedRequest(request);
        setDetailModalOpen(true);
    };

    const closeDetailModal = () => {
        setDetailModalOpen(false);
        setSelectedRequest(null);
    };

    const openModal = (id, action) => {
        setSelectedApprovalId(id);
        setModalAction(action);
        setIsModalOpen(true);
        setSignatureError('');
        if (sigCanvas.current && sigCanvas.current.clear) {
            setTimeout(() => sigCanvas.current.clear(), 100);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApprovalId(null);
        setModalAction('');
        setSignatureError('');
    };

    const clearSignature = () => {
        if (sigCanvas.current && sigCanvas.current.clear) {
            sigCanvas.current.clear();
        }
        setSignatureError('');
    };

    const handleSubmit = () => {
        if (sigCanvas.current.isEmpty()) {
            setSignatureError('Tanda tangan wajib diisi.');
            return;
        }

        const signatureData = sigCanvas.current.getCanvas().toDataURL('image/png');
        setProcessing(true);

        router.put(route('leave-request-approvals.update', selectedApprovalId), {
            status: modalAction,
            signature: signatureData
        }, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
            onFinish: () => setProcessing(false)
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                        Menunggu
                    </span>
                );
            case 'Approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                        Disetujui
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Ditolak
                    </span>
                );
            case 'Auto Reject':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-gray-50 text-gray-500 border border-gray-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                        Otomatis Ditolak
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <DashboardLayout judulHalaman="Approval Cuti & Izin">
            <Head title="Approval Cuti" />

            <div className="py-8 bg-[#f8f8f8] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Premium Header Card */}
                    <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-white/50 p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#eaae36]/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-extrabold text-[#1a1a1a] tracking-tight">Persetujuan Pengajuan</h2>
                            <p className="text-gray-500 text-sm mt-2 max-w-xl">
                                Kelola permintaan cuti, izin, atau sakit karyawan yang membutuhkan validasi Anda.
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 p-1 bg-gray-200/50 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                                activeTab === 'pending'
                                    ? 'bg-white text-[#1a1a1a] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                        >
                            Menunggu Persetujuan
                            {pendingApprovals.length > 0 && (
                                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                                    {pendingApprovals.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                                activeTab === 'history'
                                    ? 'bg-white text-[#1a1a1a] shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                        >
                            Riwayat Persetujuan
                        </button>
                    </div>

                    {/* Content List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {displayedApprovals.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {displayedApprovals.map((item) => (
                                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                        <div className="flex gap-4 items-start md:items-center w-full md:w-auto">
                                            <div className="hidden md:flex h-12 w-12 rounded-xl bg-gray-100 items-center justify-center text-gray-500 group-hover:bg-[#eaae36]/10 group-hover:text-[#eaae36] transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="font-bold text-lg text-[#1a1a1a]">
                                                        {item.leave_request?.employee?.user?.name || 'Karyawan'}
                                                    </h3>
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                        {item.leave_request?.request_type || '-'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    {item.leave_request?.employee?.department || '-'}
                                                </p>
                                                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        {item.leave_request?.start_date ? new Date(item.leave_request.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        {item.leave_request?.duration_days} Hari
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                                            <div className="md:text-right">
                                                {getStatusBadge(item.status)}
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Role: {item.approver_role}</p>
                                            </div>
                                            
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => openDetailModal(item)} 
                                                    className="p-2 text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                                    title="Lihat Detail"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </button>
                                                
                                                {item.status === 'Pending' && item.is_my_turn && (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => openModal(item.id, 'Rejected')}
                                                            className="flex items-center justify-center p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-200 hover:border-red-500"
                                                            title="Tolak"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                        </button>
                                                        <button 
                                                            onClick={() => openModal(item.id, 'Approved')}
                                                            className="flex items-center gap-1.5 px-4 py-2 bg-[#1a1a1a] hover:bg-[#eaae36] text-white hover:text-[#1a1a1a] font-bold rounded-lg transition-all duration-300 shadow-sm"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                            Setujui
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-16 flex flex-col items-center justify-center text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {activeTab === 'pending' ? 'Tidak Ada Antrean' : 'Belum Ada Riwayat'}
                                </h3>
                                <p className="text-gray-500 max-w-sm">
                                    {activeTab === 'pending' 
                                        ? 'Semua pengajuan cuti dan izin sudah ditangani. Anda bisa bersantai sekarang!'
                                        : 'Belum ada riwayat persetujuan atau penolakan pengajuan yang dilakukan.'}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Signature Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>

                        <div className="relative bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-lg w-full border border-gray-100">
                            <div className="bg-white px-6 pt-6 pb-6">
                                <div>
                                    <h3 className={`text-xl font-bold ${modalAction === 'Approved' ? 'text-emerald-600' : 'text-red-600'}`} id="modal-title">
                                        {modalAction === 'Approved' ? 'Setujui Pengajuan' : 'Tolak Pengajuan'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-2 mb-6">
                                        Silakan bubuhkan tanda tangan Anda di kotak bawah ini sebagai bukti persetujuan/penolakan.
                                    </p>
                                    
                                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-[#f8f8f8] overflow-hidden group">
                                        <div className="w-full overflow-hidden flex justify-center">
                                            <SignatureCanvas 
                                                penColor="#1a1a1a"
                                                canvasProps={{width: 450, height: 200, className: 'sigCanvas cursor-crosshair touch-none'}}
                                                ref={sigCanvas}
                                            />
                                        </div>
                                        <button 
                                            onClick={clearSignature}
                                            className="absolute top-3 right-3 text-xs bg-white/80 backdrop-blur border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-semibold shadow-sm transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        >
                                            Hapus Tanda Tangan
                                        </button>
                                    </div>
                                    {signatureError && (
                                        <p className="text-red-500 text-xs font-semibold mt-2 flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                            {signatureError}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    disabled={processing}
                                    className="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 px-5 py-2.5 bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className={`w-full sm:w-auto inline-flex justify-center items-center gap-2 rounded-lg border border-transparent shadow-sm px-6 py-2.5 text-sm font-bold text-white focus:outline-none transition-all ${
                                        modalAction === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'
                                    } ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Menyimpan...
                                        </>
                                    ) : 'Konfirmasi & Simpan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="detail-modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
                        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={closeDetailModal}></div>

                        <div className="relative inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:max-w-2xl w-full border border-gray-100">
                            <div className="bg-white px-6 pt-6 pb-6">
                                <h3 className="text-xl font-bold text-[#1a1a1a] border-b border-gray-100 pb-4 mb-6 flex justify-between items-center" id="detail-modal-title">
                                    <span>Detail Pengajuan <span className="text-gray-400 font-normal">#{selectedRequest.leave_request?.id}</span></span>
                                    <button onClick={closeDetailModal} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-1">Nama Karyawan</p>
                                        <p className="font-bold text-[#1a1a1a] text-base">{selectedRequest.leave_request?.employee?.user?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-1">Departemen</p>
                                        <p className="font-semibold text-gray-800">{selectedRequest.leave_request?.employee?.department || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-1">Jenis Pengajuan</p>
                                        <span className="inline-block px-2.5 py-1 bg-gray-100 text-[#1a1a1a] rounded font-bold">{selectedRequest.leave_request?.request_type}</span>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-1">Tanggal Pengajuan</p>
                                        <p className="font-semibold text-gray-800">{selectedRequest.leave_request?.request_date ? new Date(selectedRequest.leave_request.request_date).toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'}) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-1">Pelaksanaan</p>
                                        <p className="font-bold text-[#eaae36]">
                                            {selectedRequest.leave_request?.start_date ? new Date(selectedRequest.leave_request.start_date).toLocaleDateString('id-ID') : '-'}
                                            {selectedRequest.leave_request?.end_date && selectedRequest.leave_request.end_date !== selectedRequest.leave_request.start_date ? ` s/d ${new Date(selectedRequest.leave_request.end_date).toLocaleDateString('id-ID')}` : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-1">Durasi</p>
                                        <p className="font-semibold text-gray-800">{selectedRequest.leave_request?.duration_days} Hari</p>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2 mt-2">
                                        <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-2">Alasan / Keterangan</p>
                                        <div className="bg-[#f8f8f8] p-4 rounded-xl border border-gray-200">
                                            <p className="font-medium text-[#1a1a1a]">{selectedRequest.leave_request?.reason || '-'}</p>
                                        </div>
                                    </div>
                                    
                                    {selectedRequest.leave_request?.request_type === 'Sakit' && selectedRequest.leave_request?.has_doctor_note && (
                                        <div className="col-span-1 sm:col-span-2 mt-2">
                                            <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-2">Surat Dokter</p>
                                            <a href={selectedRequest.leave_request.has_doctor_note} target="_blank" rel="noreferrer" className="inline-block p-2 border border-gray-200 rounded-lg hover:border-[#eaae36] transition-colors bg-white">
                                                <img src={selectedRequest.leave_request.has_doctor_note} className="h-24 rounded object-cover" alt="Surat Dokter" />
                                            </a>
                                        </div>
                                    )}

                                    {selectedRequest.signature && (
                                        <div className="col-span-1 sm:col-span-2 mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-gray-500 text-[11px] uppercase tracking-wider font-bold mb-3">Tanda Tangan {selectedRequest.approver_role}</p>
                                            <div className="bg-white p-2 rounded-xl border border-gray-200 inline-block">
                                                <img 
                                                    src={selectedRequest.signature} 
                                                    alt="Signature" 
                                                    className="h-20 object-contain select-none opacity-80" 
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    draggable="false"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
