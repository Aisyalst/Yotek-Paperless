import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, router } from '@inertiajs/react';
import AddButton from '@/Components/AddButton';

export default function Detail({ employee, documents }) {
    const personal = employee.personal_information || employee.personalInformation || {};
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const handleUpload = (e) => {
        e.preventDefault();
        post(route('employee-documents.store', employee.nik), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsUploadModalOpen(false);
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus dokumen ini?')) {
            router.delete(route('employee-documents.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return (
        <DashboardLayout>
            <Head title={`Detail Karyawan — ${employee.name}`} />

            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header & Back Button */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Detail Karyawan</h1>
                        <p className="text-sm text-gray-600">Informasi lengkap dan arsip dokumen karyawan.</p>
                    </div>
                    <a
                        href={route('employee-registrations.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                        Kembali
                    </a>
                </div>

                {/* 2-Column Grid for Personal & Employment Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Informasi Pribadi */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Informasi Pribadi</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Nama Lengkap (KTP)</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.full_name || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Nama Panggilan</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.nickname || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">NIK KTP</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.nik_ktp || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Tempat, Tanggal Lahir</span>
                                <span className="font-semibold text-gray-900 text-right">
                                    {personal.birth_place ? `${personal.birth_place}, ` : ''}{personal.birth_date || '-'}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Jenis Kelamin</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.gender || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Agama</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.religion || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Status Pernikahan</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.marital_status || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">No. Telepon / WA</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.phone || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Email Pribadi</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.email || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Kontak Darurat</span>
                                <span className="font-semibold text-gray-900 text-right">{personal.emergency_contact || '-'}</span>
                            </div>
                            <div className="flex flex-col pt-1 space-y-1">
                                <span className="text-gray-500 font-medium">Alamat KTP</span>
                                <span className="font-semibold text-gray-900">{personal.ktp_address || '-'}</span>
                            </div>
                            <div className="flex flex-col pt-1 space-y-1">
                                <span className="text-gray-500 font-medium">Alamat Domisili</span>
                                <span className="font-semibold text-gray-900">{personal.residential_address || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Informasi Kepegawaian */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Informasi Kepegawaian</h2>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Nama Karyawan</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.employee_name || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">NIK Karyawan</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.nik || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Email Akun</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.user ? employee.user.email : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Perusahaan</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.company || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Cabang / Branch</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.branch || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Departemen</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.department || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Jabatan</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.employee_position ? employee.employee_position.name : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Level / Rank</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.employee_rank ? employee.employee_rank.title : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Status Kepegawaian</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.employment_status || '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Atasan Langsung</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.supervisor ? employee.supervisor.name : '-'}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-gray-500 font-medium">Tanggal Bergabung</span>
                                <span className="font-semibold text-gray-900 text-right">{employee.join_date || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Documents Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Dokumen Karyawan</h2>
                            <p className="text-sm text-gray-600">Arsip gambar, sertifikat, atau dokumen pendukung.</p>
                        </div>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="px-4 py-2 bg-[#eaae36] text-white rounded-xl text-sm font-semibold hover:bg-[#d89d25] transition"
                        >
                            + Unggah Dokumen
                        </button>
                    </div>

                    {documents.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            Belum ada dokumen yang diunggah untuk karyawan ini.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Nama File</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Ukuran</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Diunggah Oleh</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-600">Tanggal</th>
                                        <th className="px-6 py-3 text-right font-semibold text-gray-600">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {doc.original_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{formatBytes(doc.size)}</td>
                                            <td className="px-6 py-4 text-gray-600">{doc.uploader ? doc.uploader.name : '-'}</td>
                                            <td className="px-6 py-4 text-gray-600">{new Date(doc.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <a
                                                    href={route('employee-documents.show', doc.id)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    Buka/Unduh
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Upload Modal */}
                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Unggah Dokumen Karyawan</h3>
                            <form onSubmit={handleUpload}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih File (PDF / Gambar, Maks 10MB)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setData('file', e.target.files[0])}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                                        required
                                    />
                                    {errors.file && <div className="text-red-500 text-xs mt-1">{errors.file}</div>}
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(false)}
                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-300"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-[#eaae36] text-white rounded-xl text-sm font-semibold hover:bg-[#d89d25] disabled:opacity-50"
                                    >
                                        {processing ? 'Mengunggah...' : 'Unggah'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
