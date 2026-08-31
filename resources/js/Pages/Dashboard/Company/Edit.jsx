import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';
import RedirectOutlineButton from '@/Components/RedirectOutlineButton';
import SubmitOutlineButton from '@/Components/SubmitOutlineButton';
import { HiPlus, HiTrash } from 'react-icons/hi';

export default function Edit({ company }) {
    const { data, setData, put, processing, errors } = useForm({
        name: company.name || '',
        branches: company.branch && company.branch.length > 0 ? company.branch : [{ region: '', province: '', city: '' }],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('companies.update', company.id));
    };

    const addBranch = () => {
        setData('branches', [...data.branches, { region: '', province: '', city: '' }]);
    };

    const removeBranch = (index) => {
        const newBranches = [...data.branches];
        newBranches.splice(index, 1);
        setData('branches', newBranches);
    };

    const handleBranchChange = (index, field, value) => {
        const newBranches = [...data.branches];
        newBranches[index][field] = value;
        setData('branches', newBranches);
    };

    return (
        <DashboardLayout judulHalaman="Edit Perusahaan">
            <Head title="Edit Perusahaan" />
            
            <div className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Data Perusahaan</h1>
                            <p className="text-sm text-gray-600 mt-1">Ubah informasi detail perusahaan beserta cabangnya.</p>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                            Nama Perusahaan <span className="text-xs text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-[#ffffff] border border-gray-200 text-[#1a1a1a] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                            placeholder="Masukkan Nama Perusahaan"
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[#1a1a1a]">Daftar Cabang</h3>
                            <button
                                type="button"
                                onClick={addBranch}
                                className="flex items-center text-sm bg-[#eaae36] hover:bg-[#d99f2e] text-white px-3 py-1.5 rounded-md transition-colors"
                            >
                                <HiPlus className="w-4 h-4 mr-1" /> Tambah Cabang
                            </button>
                        </div>

                        {data.branches.map((branch, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700">Cabang #{index + 1}</h4>
                                    {data.branches.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBranch(index)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="Hapus Cabang"
                                        >
                                            <HiTrash className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Region *</label>
                                        <input
                                            type="text"
                                            value={branch.region}
                                            onChange={(e) => handleBranchChange(index, 'region', e.target.value)}
                                            className="w-full bg-white border border-gray-300 text-[#1a1a1a] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                            required
                                        />
                                        {errors[`branches.${index}.region`] && <p className="text-red-500 text-xs mt-1">{errors[`branches.${index}.region`]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Provinsi *</label>
                                        <input
                                            type="text"
                                            value={branch.province}
                                            onChange={(e) => handleBranchChange(index, 'province', e.target.value)}
                                            className="w-full bg-white border border-gray-300 text-[#1a1a1a] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                            required
                                        />
                                        {errors[`branches.${index}.province`] && <p className="text-red-500 text-xs mt-1">{errors[`branches.${index}.province`]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Kota *</label>
                                        <input
                                            type="text"
                                            value={branch.city}
                                            onChange={(e) => handleBranchChange(index, 'city', e.target.value)}
                                            className="w-full bg-white border border-gray-300 text-[#1a1a1a] rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:border-transparent"
                                            required
                                        />
                                        {errors[`branches.${index}.city`] && <p className="text-red-500 text-xs mt-1">{errors[`branches.${index}.city`]}</p>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                        <RedirectOutlineButton text="Batal" href="/companies" className="me-auto" />
                        <SubmitOutlineButton text="Simpan Perubahan" disabled={processing} />
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
