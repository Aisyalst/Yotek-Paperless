import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';
import { HiArrowLeft, HiSave } from 'react-icons/hi';
import { Link } from '@inertiajs/react';

export default function Edit({ employeePosition }) {
    const { data, setData, put, processing, errors } = useForm({
        name: employeePosition.name || '',
        order: employeePosition.order || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('employee-positions.update', employeePosition.id));
    };

    return (
        <DashboardLayout judulHalaman="Edit Jabatan">
            <Head title="Edit Jabatan" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Jabatan Karyawan</h1>
                    <p className="text-sm text-gray-600 mt-1">Perbarui detail jabatan karyawan ini.</p>
                </div>
                
                <Link
                    href={route('employee-positions.index')}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <HiArrowLeft className="w-4 h-4" />
                    Kembali
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={submit} className="space-y-6 max-w-2xl">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Nama Jabatan <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#eaae36] focus:border-transparent transition-all outline-none text-sm"
                            placeholder="Contoh: Manager, Staff, dll"
                            required
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="order" className="block text-sm font-semibold text-[#1a1a1a] mb-2">
                            Urutan <span style={{ color: '#e53e3e' }}>*</span>
                        </label>
                        <input
                            type="number"
                            id="order"
                            value={data.order}
                            onChange={e => setData('order', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#eaae36] focus:border-transparent transition-all outline-none text-sm"
                            min="1"
                            required
                        />
                        {errors.order && <p className="text-sm text-red-500 mt-1">{errors.order}</p>}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#eaae36] text-white text-sm font-semibold rounded-lg hover:bg-[#d99f2e] transition-colors shadow-sm disabled:opacity-50"
                        >
                            <HiSave className="w-4 h-4" />
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
