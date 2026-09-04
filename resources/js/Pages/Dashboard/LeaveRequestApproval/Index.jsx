import React, { useState, useRef } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link, router } from '@inertiajs/react';
import PremiumTable from '@/Components/PremiumTable';
import SignatureCanvas from 'react-signature-canvas';

export default function Index({ approvals }) {
    const sigCanvas = useRef({});
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAction, setModalAction] = useState(''); // 'Approved' or 'Rejected'
    const [selectedApprovalId, setSelectedApprovalId] = useState(null);
    const [signatureError, setSignatureError] = useState('');
    const [processing, setProcessing] = useState(false);

    // Detail Modal State
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

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
            sigCanvas.current.clear();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedApprovalId(null);
        setModalAction('');
        setSignatureError('');
    };

    const clearSignature = () => {
        sigCanvas.current.clear();
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

    // Columns are now directly implemented in the table

    return (
        <DashboardLayout judulHalaman="Approval Cuti">
            <Head title="Approval Cuti" />

            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Approval Cuti</h1>
                    <p className="text-sm text-gray-600 mt-1">Daftar permintaan cuti yang membutuhkan persetujuan Anda.</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-center">Leave Request</th>
                                <th scope="col" className="px-6 py-3 text-center">Role</th>
                                <th scope="col" className="px-6 py-3 text-center">Status</th>
                                <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {approvals && approvals.length > 0 ? (
                                approvals.map((item) => (
                                    <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                            {item.leave_request ? `Request #${item.leave_request.id}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-center">{item.approver_role}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                                                item.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                                                item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                {item.leave_request && (
                                                    <button 
                                                        onClick={() => openDetailModal(item)} 
                                                        className="text-blue-600 hover:text-blue-900 font-medium text-sm px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                                                    >
                                                        Detail
                                                    </button>
                                                )}
                                                {item.status === 'Pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => openModal(item.id, 'Approved')}
                                                            className="text-green-600 hover:text-green-900 font-medium text-sm px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded transition-colors"
                                                        >
                                                            Setujui
                                                        </button>
                                                        <button 
                                                            onClick={() => openModal(item.id, 'Rejected')}
                                                            className="text-red-600 hover:text-red-900 font-medium text-sm px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                                        >
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada request cuti yang perlu di-approve saat ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Signature Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            {modalAction === 'Approved' ? 'Setujui Pengajuan' : 'Tolak Pengajuan'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 mb-4">
                                                Silakan bubuhkan tanda tangan Anda di bawah ini sebagai persetujuan validasi.
                                            </p>
                                            
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex justify-center relative">
                                                <SignatureCanvas 
                                                    penColor="black"
                                                    canvasProps={{width: 400, height: 200, className: 'sigCanvas'}}
                                                    ref={sigCanvas}
                                                />
                                                <button 
                                                    onClick={clearSignature}
                                                    className="absolute top-2 right-2 text-xs bg-white border border-gray-300 rounded px-2 py-1 text-gray-600 hover:bg-gray-100"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                            {signatureError && (
                                                <p className="text-red-500 text-xs mt-1">{signatureError}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button 
                                    type="button" 
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                                        modalAction === 'Approved' ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Persetujuan'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={closeModal}
                                    disabled={processing}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Detail Modal */}
            {detailModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="detail-modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeDetailModal}></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-3 mb-4" id="detail-modal-title">
                                    Detail Pengajuan #{selectedRequest.leave_request?.id}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Nama Karyawan</p>
                                        <p className="font-semibold text-gray-900 mt-1">{selectedRequest.leave_request?.employee?.user?.name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Departemen</p>
                                        <p className="font-semibold text-gray-900 mt-1">{selectedRequest.leave_request?.employee?.department || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Jenis Pengajuan</p>
                                        <p className="font-semibold text-gray-900 mt-1">{selectedRequest.leave_request?.request_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Tanggal Pengajuan</p>
                                        <p className="font-semibold text-gray-900 mt-1">{selectedRequest.leave_request?.request_date ? new Date(selectedRequest.leave_request.request_date).toLocaleDateString('id-ID', {day:'2-digit', month:'long', year:'numeric'}) : '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Pelaksanaan</p>
                                        <p className="font-semibold text-gray-900 mt-1">
                                            {selectedRequest.leave_request?.start_date ? new Date(selectedRequest.leave_request.start_date).toLocaleDateString('id-ID') : '-'}
                                            {selectedRequest.leave_request?.end_date && selectedRequest.leave_request.end_date !== selectedRequest.leave_request.start_date ? ` s/d ${new Date(selectedRequest.leave_request.end_date).toLocaleDateString('id-ID')}` : ''}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Durasi</p>
                                        <p className="font-semibold text-gray-900 mt-1">{selectedRequest.leave_request?.duration_days} Hari</p>
                                    </div>
                                    <div className="col-span-1 sm:col-span-2 mt-2 border-b pb-4">
                                        <p className="text-gray-500 text-xs uppercase tracking-wider">Alasan</p>
                                        <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-md mt-1 border border-gray-100">{selectedRequest.leave_request?.reason || '-'}</p>
                                    </div>
                                    
                                    {selectedRequest.signature && (
                                        <div className="col-span-1 sm:col-span-2 mt-2">
                                            <p className="text-gray-500 text-xs uppercase tracking-wider">Tanda Tangan Approval</p>
                                            <div className="mt-2 bg-gray-50 p-4 rounded-md border border-gray-100 inline-block">
                                                <img 
                                                    src={selectedRequest.signature} 
                                                    alt="Signature" 
                                                    className="h-16 object-contain select-none" 
                                                    onContextMenu={(e) => e.preventDefault()}
                                                    draggable="false"
                                                />
                                                <p className="text-[10px] text-gray-400 mt-2 text-center">Tertanda: {selectedRequest.approver_role}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button 
                                    type="button" 
                                    onClick={closeDetailModal}
                                    className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#eaae36] sm:w-auto sm:text-sm"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
