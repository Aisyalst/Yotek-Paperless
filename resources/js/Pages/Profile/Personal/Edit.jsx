import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Edit({ auth, personalInformation, employeeInformation }) {
    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        nik: personalInformation?.nik || employeeInformation?.nik || '',
        full_name: personalInformation?.full_name || '',
        nickname: personalInformation?.nickname || '',
        nik_ktp: personalInformation?.nik_ktp || '',
        birth_place: personalInformation?.birth_place || '',
        birth_date: personalInformation?.birth_date || '',
        gender: personalInformation?.gender || '',
        marital_status: personalInformation?.marital_status || '',
        ktp_address: personalInformation?.ktp_address || '',
        residential_address: personalInformation?.residential_address || '',
        email: personalInformation?.email || '',
        phone: personalInformation?.phone || '',
        emergency_contact: personalInformation?.emergency_contact || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.personal.update'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-[#1a1a1a] leading-tight">Data Personal</h2>}
        >
            <Head title="Data Personal" />

            <div className="py-12 bg-[#f8f8f8] min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    <div className="bg-white/80 backdrop-blur-lg overflow-hidden shadow-xl sm:rounded-2xl border border-gray-100/50">
                        <div className="p-8">
                            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-[#f8f8f8] rounded-xl text-[#eaae36]">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1a1a1a]">Edit Data Personal</h3>
                                    <p className="text-sm text-gray-500">Perbarui informasi personal Anda di bawah ini.</p>
                                </div>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <InputLabel htmlFor="nik" value="NIK" />
                                        <TextInput
                                            id="nik"
                                            className="mt-1 block w-full bg-gray-50"
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value)}
                                            readOnly={!!employeeInformation?.nik}
                                        />
                                        <InputError className="mt-2" message={errors.nik} />
                                        {employeeInformation?.nik && (
                                            <p className="text-xs text-gray-500 mt-1">NIK diambil dari data karyawan.</p>
                                        )}
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="full_name" value="Nama Lengkap" />
                                        <TextInput
                                            id="full_name"
                                            className="mt-1 block w-full"
                                            value={data.full_name}
                                            onChange={(e) => setData('full_name', e.target.value)}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.full_name} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="nickname" value="Nama Panggilan" />
                                        <TextInput
                                            id="nickname"
                                            className="mt-1 block w-full"
                                            value={data.nickname}
                                            onChange={(e) => setData('nickname', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.nickname} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="nik_ktp" value="NIK KTP" />
                                        <TextInput
                                            id="nik_ktp"
                                            className="mt-1 block w-full"
                                            value={data.nik_ktp}
                                            onChange={(e) => setData('nik_ktp', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.nik_ktp} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="birth_place" value="Tempat Lahir" />
                                        <TextInput
                                            id="birth_place"
                                            className="mt-1 block w-full"
                                            value={data.birth_place}
                                            onChange={(e) => setData('birth_place', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.birth_place} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />
                                        <TextInput
                                            id="birth_date"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.birth_date}
                                            onChange={(e) => setData('birth_date', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.birth_date} />
                                    </div>
                                    
                                    <div>
                                        <InputLabel htmlFor="gender" value="Jenis Kelamin" />
                                        <select
                                            id="gender"
                                            className="text-black mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                            value={data.gender}
                                            onChange={(e) => setData('gender', e.target.value)}
                                        >
                                            <option value="">Pilih Jenis Kelamin</option>
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.gender} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="marital_status" value="Status Pernikahan" />
                                        <select
                                            id="marital_status"
                                            className="text-black mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                            value={data.marital_status}
                                            onChange={(e) => setData('marital_status', e.target.value)}
                                        >
                                            <option value="">Pilih Status</option>
                                            <option value="Belum Menikah">Belum Menikah</option>
                                            <option value="Menikah">Menikah</option>
                                            <option value="Cerai">Cerai</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.marital_status} />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="ktp_address" value="Alamat KTP" />
                                        <textarea
                                            id="ktp_address"
                                            className="text-black mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                            rows="3"
                                            value={data.ktp_address}
                                            onChange={(e) => setData('ktp_address', e.target.value)}
                                        ></textarea>
                                        <InputError className="mt-2" message={errors.ktp_address} />
                                    </div>

                                    <div className="md:col-span-2">
                                        <InputLabel htmlFor="residential_address" value="Alamat Domisili" />
                                        <textarea
                                            id="residential_address"
                                            className="text-black mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                            rows="3"
                                            value={data.residential_address}
                                            onChange={(e) => setData('residential_address', e.target.value)}
                                        ></textarea>
                                        <InputError className="mt-2" message={errors.residential_address} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="email" value="Email Pribadi" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="phone" value="No. Telepon / HP" />
                                        <TextInput
                                            id="phone"
                                            className="mt-1 block w-full"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.phone} />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="emergency_contact" value="Kontak Darurat" />
                                        <TextInput
                                            id="emergency_contact"
                                            className="mt-1 block w-full"
                                            value={data.emergency_contact}
                                            onChange={(e) => setData('emergency_contact', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.emergency_contact} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                                    <PrimaryButton disabled={processing} className="bg-[#eaae36] hover:bg-[#d99f2e]">
                                        Simpan
                                    </PrimaryButton>

                                    {recentlySuccessful && (
                                        <p className="text-sm text-green-600 font-medium">Berhasil disimpan.</p>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
