import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, Link } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SelectInput from '@/Components/SelectInput';

export default function Edit({ leaveEntitlement, users = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        nik: leaveEntitlement.nik || '',
        total: leaveEntitlement.total || '',
        duration: leaveEntitlement.duration || '',
        start_date: leaveEntitlement.start_date || '',
        status: leaveEntitlement.status || 'Aktif',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('leave-entitlements.update', leaveEntitlement.id));
    };

    const durationOptions = [
        { id: '1 Month', name: '1 Bulan' },
        { id: '3 Months', name: '3 Bulan' },
        { id: '6 Months', name: '6 Bulan' },
        { id: '1 Year', name: '1 Tahun' },
        { id: '1 Year, 3 Months', name: '1 Tahun, 3 Bulan' }
    ];

    const statusOptions = [
        { id: 'Aktif', name: 'Aktif' },
        { id: 'Hangus', name: 'Hangus' },
        { id: 'Habis', name: 'Habis' }
    ];

    const userOptions = users.map(user => ({
        id: user.nik,
        name: `${user.nik} - ${user.personal_information?.full_name || user.name}`
    }));

    return (
        <DashboardLayout judulHalaman="Edit Hak Cuti">
            <Head title="Edit Hak Cuti" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Hak Cuti</h1>
                    <p className="text-sm text-gray-600 mt-1">Perbarui data hak cuti untuk karyawan.</p>
                </div>
            </div>

            <div className="bg-[#ffffff] border border-gray-200 rounded-lg p-6 shadow-sm max-w-3xl">
                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="nik" value="Karyawan" />
                        <SelectInput
                            id="nik"
                            name="nik"
                            value={data.nik}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('nik', e.target.value)}
                            options={userOptions}
                        />
                        <InputError message={errors.nik} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="total" value="Total Cuti (Hari)" />
                        <TextInput
                            id="total"
                            type="number"
                            name="total"
                            value={data.total}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('total', e.target.value)}
                            min="1"
                        />
                        <InputError message={errors.total} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="duration" value="Durasi" />
                        <SelectInput
                            id="duration"
                            name="duration"
                            value={data.duration}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('duration', e.target.value)}
                            options={durationOptions}
                        />
                        <InputError message={errors.duration} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="start_date" value="Tanggal Mulai" />
                        <TextInput
                            id="start_date"
                            type="date"
                            name="start_date"
                            value={data.start_date}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                        <InputError message={errors.start_date} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status" />
                        <SelectInput
                            id="status"
                            name="status"
                            value={data.status}
                            className="mt-1 block w-full"
                            onChange={(e) => setData('status', e.target.value)}
                            options={statusOptions}
                        />
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            type="submit" 
                            disabled={processing}
                            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-md text-sm font-semibold hover:bg-[#eaae36] transition-colors disabled:opacity-50"
                        >
                            Perbarui
                        </button>
                        <Link 
                            href={route('leave-entitlements.index')}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
