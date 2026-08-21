import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth, userData }) {
    const { flash } = usePage().props;
    const [jenisPengajuan, setJenisPengajuan] = useState('');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        request_type: '',
        start_date: '',
        end_date: '',
        duration_days: '',
        has_doctor_note: false,
        permission_type: '',
        permission_start_time: '',
        permission_end_time: '',
        deduction_type: '',
        special_leave_type: '',
        reason: '',
        work_delegation: '',
    });

    useEffect(() => {
        if (data.start_date) {
            if (data.end_date) {
                const start = new Date(data.start_date);
                const end = new Date(data.end_date);
                
                start.setHours(0, 0, 0, 0);
                end.setHours(0, 0, 0, 0);

                if (end >= start) {
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    setData('duration_days', diffDays);
                } else {
                    setData('duration_days', 0);
                }
            } else {
                setData('duration_days', 1);
            }
        } else {
            setData('duration_days', '');
        }
    }, [data.start_date, data.end_date]);

    const handleJenisChange = (e) => {
        const val = e.target.value;
        setJenisPengajuan(val);
        setData('request_type', val);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('leave-requests.store'), {
            onSuccess: () => {
                reset();
                setJenisPengajuan('');
            },
        });
    };

    const getEmployeeData = () => userData?.employee_information || {};

    const inputClasses = "mt-1 block w-full border-gray-300 text-[#1a1a1a] focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm";

    return (
        <DashboardLayout
            judulHalaman="Form Pengajuan Izin, Sakit & Cuti"
        >
            <Head title="Pengajuan Izin/Cuti" />

            <div className="py-12 bg-[#f8f8f8] min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {flash?.success && (
                        <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                            <span className="font-medium">Berhasil!</span> {flash.success}
                        </div>
                    )}

                    {/* Header Info */}
                    <div className="bg-white/80 backdrop-blur-lg overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100/50 p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Tanggal Pengajuan</p>
                            <p className="font-bold text-[#1a1a1a]">{new Date().toLocaleDateString('id-ID')}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Nomor Induk Karyawan</p>
                            <p className="font-bold text-[#1a1a1a]">{userData.nik || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Nama Karyawan</p>
                            <p className="font-bold text-[#1a1a1a]">{userData.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Posisi / Jabatan</p>
                            <p className="font-bold text-[#1a1a1a]">{userData.role?.name || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-semibold">Divisi / Department</p>
                            <p className="font-bold text-[#1a1a1a]">{userData.role?.devision?.name || '-'}</p>
                        </div>
                    </div>

                    <form onSubmit={submit} className="bg-white/80 backdrop-blur-lg overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100/50 p-8 space-y-6">
                        
                        {/* Jenis Pengajuan */}
                        <div>
                            <InputLabel htmlFor="request_type" value="Jenis Pengajuan" className="text-lg font-bold text-[#eaae36]" />
                            <select
                                id="request_type"
                                className={inputClasses}
                                value={data.request_type}
                                onChange={handleJenisChange}
                                required
                            >
                                <option value="" disabled>Pilih Jenis Pengajuan</option>
                                <option value="Sakit">Sakit</option>
                                <option value="Izin">Izin</option>
                                <option value="Cuti">Cuti</option>
                                <option value="Cuti Khusus">Cuti Khusus</option>
                            </select>
                            <InputError message={errors.request_type} className="mt-2" />
                        </div>

                        {/* Tanggal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#f8f8f8] rounded-xl">
                            <div>
                                <InputLabel htmlFor="start_date" value="Tanggal Mulai" />
                                <TextInput
                                    id="start_date"
                                    type="date"
                                    className={inputClasses}
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.start_date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="end_date" value="Tanggal Selesai (s.d)" />
                                <TextInput
                                    id="end_date"
                                    type="date"
                                    className={inputClasses}
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                />
                                <InputError message={errors.end_date} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="duration_days" value="Lama (Hari)" />
                                <TextInput
                                    id="duration_days"
                                    type="number"
                                    className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                                    value={data.duration_days}
                                    readOnly
                                    onChange={(e) => setData('duration_days', e.target.value)}
                                />
                                <InputError message={errors.duration_days} className="mt-2" />
                            </div>
                        </div>

                        {/* Dynamic Fields */}
                        {jenisPengajuan === 'Sakit' && (
                            <div className="p-4 border-l-4 border-[#eaae36] bg-[#f8f8f8] rounded-r-xl">
                                <label className="flex items-center space-x-3">
                                    <input type="checkbox" className="rounded border-gray-300 text-[#eaae36] focus:ring-[#eaae36]" 
                                        checked={data.has_doctor_note} 
                                        onChange={(e) => setData('has_doctor_note', e.target.checked)} />
                                    <span className="text-gray-700 font-medium">Melampirkan Surat Dokter (Ada/Tidak Ada)</span>
                                </label>
                            </div>
                        )}

                        {jenisPengajuan === 'Izin' && (
                            <div className="p-4 border-l-4 border-[#eaae36] bg-[#f8f8f8] rounded-r-xl space-y-4">
                                <div>
                                    <InputLabel htmlFor="permission_type" value="Kategori Izin" />
                                    <select
                                        id="permission_type"
                                        className={inputClasses}
                                        value={data.permission_type}
                                        onChange={(e) => setData('permission_type', e.target.value)}
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="Datang Terlambat">Datang Terlambat</option>
                                        <option value="Pulang Cepat">Pulang Cepat</option>
                                        <option value="Meninggalkan Pekerjaan">Meninggalkan Pekerjaan</option>
                                        <option value="Tidak Masuk Kerja">Tidak Masuk Kerja</option>
                                        <option value="Tugas Kantor">Tugas Kantor</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="permission_start_time" value="Jam Mulai" />
                                        <TextInput type="time" id="permission_start_time" className={inputClasses} value={data.permission_start_time} onChange={(e) => setData('permission_start_time', e.target.value)} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="permission_end_time" value="Jam Selesai" />
                                        <TextInput type="time" id="permission_end_time" className={inputClasses} value={data.permission_end_time} onChange={(e) => setData('permission_end_time', e.target.value)} />
                                    </div>
                                </div>
                                <div>
                                    <InputLabel htmlFor="deduction_type" value="Sanksi (Bila Ada)" />
                                    <select id="deduction_type" className={inputClasses} value={data.deduction_type} onChange={(e) => setData('deduction_type', e.target.value)}>
                                        <option value="">Tidak Ada</option>
                                        <option value="Potong Gaji">Potong Gaji</option>
                                        <option value="Potong Cuti">Potong Cuti</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {jenisPengajuan === 'Cuti Khusus' && (
                            <div className="p-4 border-l-4 border-[#eaae36] bg-[#f8f8f8] rounded-r-xl">
                                <InputLabel htmlFor="special_leave_type" value="Pilih Jenis Cuti Khusus" />
                                <select
                                    id="special_leave_type"
                                    className={inputClasses}
                                    value={data.special_leave_type}
                                    onChange={(e) => setData('special_leave_type', e.target.value)}
                                >
                                    <option value="">Pilih</option>
                                    <option value="Kematian Suami/Istri/Anak">Kematian Suami/Istri, Orangtua/Mertua atau Anak/Menantu (2 Hari)</option>
                                    <option value="Kematian Anggota Keluarga Sekitar">Kematian anggota keluarga dalam satu rumah (1 Hari)</option>
                                    <option value="Pernikahan Karyawan">Pernikahan Karyawan (3 Hari)</option>
                                    <option value="Pernikahan Anak Karyawan">Pernikahan anak karyawan (2 Hari)</option>
                                    <option value="Khitanan/Pembaptisan">Khitanan/Pembaptisan anak (2 Hari)</option>
                                    <option value="Istri Melahirkan/Keguguran">Istri melahirkan/keguguran kandungan (2 Hari)</option>
                                </select>
                            </div>
                        )}

                        {/* Text Areas */}
                        <div className="space-y-4">
                            <div>
                                <InputLabel htmlFor="reason" value="Alasan / Keterangan" />
                                <textarea
                                    id="reason"
                                    rows="3"
                                    className={inputClasses}
                                    value={data.reason}
                                    onChange={(e) => setData('reason', e.target.value)}
                                />
                                <InputError message={errors.reason} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="work_delegation" value="Pekerjaan yang ditinggalkan (Tugas / Orang Pengganti)" />
                                <textarea
                                    id="work_delegation"
                                    rows="3"
                                    className={inputClasses}
                                    value={data.work_delegation}
                                    onChange={(e) => setData('work_delegation', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div className="mt-4 p-4 text-sm text-gray-600 border border-gray-200 rounded-lg bg-gray-50">
                            <strong>Note:</strong>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Cuti melahirkan diajukan minimal 1 (satu) bulan sebelum cuti.</li>
                                <li>Untuk pengajuan cuti/izin yang bukan dalam kategori keadaan mendesak wajib diajukan minimal 14 hari sebelum hari H.</li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end mt-4 pt-6 border-t border-gray-100">
                            <PrimaryButton className="ml-4 bg-[#eaae36] hover:bg-[#d49929] text-[#1a1a1a] font-bold" disabled={processing}>
                                Ajukan Permohonan
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
