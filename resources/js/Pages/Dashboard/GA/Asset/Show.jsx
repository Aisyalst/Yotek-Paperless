import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head } from '@inertiajs/react';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';

const statusColor = {
    Tersedia: 'bg-green-100 text-green-700',
    Dipegang: 'bg-blue-100 text-blue-700',
    Service: 'bg-yellow-100 text-yellow-700',
    Rusak: 'bg-red-100 text-red-700',
    Dihapuskan: 'bg-gray-100 text-gray-500',
};

function InfoRow({ label, value }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-500 sm:w-48">{label}</span>
            <span className="text-sm font-medium text-[#1a1a1a]">{value || '-'}</span>
        </div>
    );
}

export default function Show({ asset, qr_svg }) {
    const current = asset.current_assignment;

    // Unduh QR (SVG) — dibuat client-side dari string SVG, tanpa dependency tambahan.
    const downloadQr = () => {
        const blob = new Blob([qr_svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `QR-${asset.asset_code}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout judulHalaman={`Detail Barang: ${asset.name}`}>
            <Head title={`Detail Barang: ${asset.name}`} />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">{asset.name}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        Kode: <span className="font-mono font-semibold">{asset.asset_code}</span>
                    </p>
                </div>
                <div className="flex gap-2">
                    <RedirectOutlineButton text="Edit Barang" href={`/assets/${asset.id}/edit`} routeName="assets.edit" />
                    <RedirectOutlineButton text="Kembali" href="/assets" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom kiri: info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Informasi Barang</h2>
                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="shrink-0">
                                {asset.photo ? (
                                    <img src={`/storage/${asset.photo}`} alt={asset.name} className="w-40 h-40 object-cover rounded-lg border border-gray-200" />
                                ) : (
                                    <div className="w-40 h-40 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-3xl font-bold">
                                        {asset.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <InfoRow label="Kategori" value={asset.category?.name} />
                                <InfoRow label="Perusahaan" value={asset.company?.name} />
                                <InfoRow label="Merek / Model" value={[asset.brand, asset.model].filter(Boolean).join(' / ')} />
                                <InfoRow label="Nomor Seri" value={asset.serial_number} />
                                <InfoRow label="Supplier" value={asset.supplier} />
                                <InfoRow label="Lokasi" value={asset.location} />
                                <InfoRow label="Tanggal Pembelian" value={asset.purchase_date} />
                                <InfoRow label="Harga Pembelian" value={asset.purchase_price ? `Rp ${Number(asset.purchase_price).toLocaleString('id-ID')}` : '-'} />
                                <InfoRow
                                    label="Kondisi"
                                    value={<span className="font-semibold">{asset.condition}</span>}
                                />
                                <InfoRow
                                    label="Status"
                                    value={<span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[asset.status] || ''}`}>{asset.status}</span>}
                                />
                                <InfoRow
                                    label="Dipegang Oleh"
                                    value={current ? `${current.employee_name} (sejak ${current.assigned_date})` : 'Tidak ada'}
                                />
                                <InfoRow label="Catatan" value={asset.notes} />
                            </div>
                        </div>
                    </div>

                    {/* Riwayat pemegang */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Riwayat Pemegang</h2>
                        {asset.assignments?.length ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                                            <th className="py-2 px-3">Pemegang</th>
                                            <th className="py-2 px-3">Tgl Serah</th>
                                            <th className="py-2 px-3">Tgl Kembali</th>
                                            <th className="py-2 px-3">Kondisi Serah</th>
                                            <th className="py-2 px-3">Kondisi Kembali</th>
                                            <th className="py-2 px-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asset.assignments.map((a) => (
                                            <tr key={a.id} className="border-b border-gray-100">
                                                <td className="py-2 px-3 font-medium">{a.employee_name || a.employee_nik}</td>
                                                <td className="py-2 px-3">{a.assigned_date}</td>
                                                <td className="py-2 px-3">{a.returned_date || '-'}</td>
                                                <td className="py-2 px-3">{a.condition_on_assign || '-'}</td>
                                                <td className="py-2 px-3">{a.condition_on_return || '-'}</td>
                                                <td className="py-2 px-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${a.status === 'Aktif' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {a.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Belum ada riwayat pemegang.</p>
                        )}
                    </div>

                    {/* Riwayat service */}
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Riwayat Service</h2>
                        {asset.services?.length ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase">
                                            <th className="py-2 px-3">No. Service</th>
                                            <th className="py-2 px-3">Jenis</th>
                                            <th className="py-2 px-3">Tanggal</th>
                                            <th className="py-2 px-3">Vendor</th>
                                            <th className="py-2 px-3">Biaya</th>
                                            <th className="py-2 px-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asset.services.map((s) => (
                                            <tr key={s.id} className="border-b border-gray-100">
                                                <td className="py-2 px-3 font-mono text-xs">{s.service_number}</td>
                                                <td className="py-2 px-3">{s.service_type}</td>
                                                <td className="py-2 px-3">{s.service_date}</td>
                                                <td className="py-2 px-3">{s.vendor || '-'}</td>
                                                <td className="py-2 px-3">{s.cost ? `Rp ${Number(s.cost).toLocaleString('id-ID')}` : '-'}</td>
                                                <td className="py-2 px-3">{s.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">Belum ada riwayat service.</p>
                        )}
                    </div>
                </div>

                {/* Kolom kanan: QR */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
                        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">QR Code Barang</h2>
                        <div className="inline-block p-4 bg-white border border-gray-200 rounded-lg [&>svg]:w-[180px] [&>svg]:h-[180px]"
                            dangerouslySetInnerHTML={{ __html: qr_svg }}
                        />
                        <p className="text-sm text-gray-500 mt-4">
                            Scan untuk identifikasi barang. Kode: <span className="font-mono font-semibold">{asset.asset_code}</span>
                        </p>
                        <button
                            type="button"
                            onClick={downloadQr}
                            className="mt-4 px-3 py-1 border border-blue-500 bg-blue-500/10 text-blue-600 rounded-md text-xs font-medium hover:bg-blue-600 hover:text-white transition-colors"
                        >
                            Unduh QR (SVG)
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
