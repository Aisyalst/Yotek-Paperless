import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, Link } from '@inertiajs/react';
import { HiArrowLeft } from 'react-icons/hi';

const statusColor = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Fulfilled: 'bg-blue-100 text-blue-700',
    Dibatalkan: 'bg-gray-100 text-gray-600',
};

const priorityColor = {
    Rendah: 'bg-gray-100 text-gray-600',
    Normal: 'bg-blue-100 text-blue-700',
    Tinggi: 'bg-orange-100 text-orange-700',
    Urgent: 'bg-red-100 text-red-700',
};

const approvalStatusColor = {
    Pending: 'bg-yellow-100 text-yellow-700',
    Approved: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    'Auto Reject': 'bg-gray-100 text-gray-600',
};

export default function Show({ assetRequest }) {
    const items = assetRequest.items || [];
    const approvals = assetRequest.approvals || [];

    const totalEstimate = items.reduce(
        (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.estimated_price) || 0),
        0
    );

    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

    return (
        <DashboardLayout judulHalaman="Detail Pengajuan Barang">
            <Head title={`Pengajuan ${assetRequest.request_number}`} />

            <div className="flex items-center gap-3 mb-6">
                <Link href={route('asset-requests.index')} className="p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                    <HiArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-3">
                        Pengajuan <span className="font-mono">{assetRequest.request_number}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[assetRequest.status] || 'bg-gray-100 text-gray-500'}`}>
                            {assetRequest.status}
                        </span>
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">Diajukan {formatDate(assetRequest.request_date)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Informasi + Item */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Informasi Pengajuan */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Informasi Pengajuan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Pemohon</p>
                                <p className="font-semibold text-[#1a1a1a]">{assetRequest.employee_name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">NIK</p>
                                <p className="font-mono text-[#1a1a1a]">{assetRequest.employee_nik}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Perusahaan</p>
                                <p className="font-semibold text-[#1a1a1a]">{assetRequest.company?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Departemen</p>
                                <p className="font-semibold text-[#1a1a1a]">{assetRequest.department || '-'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Prioritas</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${priorityColor[assetRequest.priority] || 'bg-gray-100 text-gray-500'}`}>
                                    {assetRequest.priority}
                                </span>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Dibutuhkan</p>
                                <p className="font-semibold text-[#1a1a1a]">{formatDate(assetRequest.needed_date)}</p>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Tujuan / Keperluan</p>
                                <p className="text-[#1a1a1a]">{assetRequest.purpose || '-'}</p>
                            </div>
                            {assetRequest.notes && (
                                <div className="sm:col-span-2">
                                    <p className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-1">Catatan</p>
                                    <p className="text-[#1a1a1a]">{assetRequest.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Item Barang */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Item Barang ({items.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-[#f8f8f8]">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#1a1a1a] uppercase">#</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#1a1a1a] uppercase">Nama Item</th>
                                        <th className="px-4 py-2 text-left text-xs font-semibold text-[#1a1a1a] uppercase">Kategori</th>
                                        <th className="px-4 py-2 text-center text-xs font-semibold text-[#1a1a1a] uppercase">Jumlah</th>
                                        <th className="px-4 py-2 text-right text-xs font-semibold text-[#1a1a1a] uppercase">Estimasi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-[#1a1a1a]">
                                                {item.item_name}
                                                {item.notes && <div className="text-xs text-gray-400 font-normal">{item.notes}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{item.category?.name || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-center text-[#1a1a1a]">{item.qty} {item.unit || ''}</td>
                                            <td className="px-4 py-3 text-sm text-right text-[#1a1a1a]">
                                                {item.estimated_price ? `Rp ${Number(item.estimated_price).toLocaleString('id-ID')}` : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-[#f8f8f8]">
                                        <td colSpan={4} className="px-4 py-3 text-sm font-bold text-right text-[#1a1a1a]">Total Estimasi</td>
                                        <td className="px-4 py-3 text-sm font-bold text-right text-[#1a1a1a]">Rp {totalEstimate.toLocaleString('id-ID')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Timeline Approval */}
                <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                        <h2 className="text-base font-bold text-[#1a1a1a] mb-4">Alur Persetujuan</h2>

                        {approvals.length > 0 ? (
                            <div className="space-y-4">
                                {approvals.map((approval, index) => (
                                    <div key={approval.id} className="relative pl-6">
                                        {index < approvals.length - 1 && (
                                            <span className="absolute left-[7px] top-6 bottom-[-16px] w-0.5 bg-gray-200" />
                                        )}
                                        <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                                            approval.status === 'Approved' ? 'bg-green-500 border-green-500'
                                            : approval.status === 'Rejected' ? 'bg-red-500 border-red-500'
                                            : 'bg-white border-gray-300'
                                        }`} />
                                        <div className="pb-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Level {approval.approver_level}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${approvalStatusColor[approval.status] || 'bg-gray-100 text-gray-500'}`}>
                                                    {approval.status}
                                                </span>
                                            </div>
                                            <p className="font-semibold text-[#1a1a1a] text-sm mt-1">{approval.approver_name || approval.approver_nik}</p>
                                            <p className="text-xs text-gray-500">{approval.approver_role || '-'}</p>
                                            {approval.notes && <p className="text-xs text-gray-500 mt-1 italic">"{approval.notes}"</p>}
                                            {approval.acted_at && (
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(approval.acted_at)}</p>
                                            )}
                                            {approval.signature && (
                                                <div className="mt-2 p-1 bg-white border border-gray-200 rounded-md inline-block">
                                                    <img src={approval.signature} alt="Tanda tangan" className="h-14 object-contain" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Belum ada alur persetujuan.</p>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
