import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create({ roles }) {
    const { data, setData, post, processing, errors } = useForm({
        workflow_type: '',
        title: '',
        role_id: [],
    });

    const workflowTypes = ['Cuti', 'Pengajuan Barang'];

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('approval-workflows.store'));
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        if (checked) {
            setData('role_id', [...data.role_id, value]);
        } else {
            setData('role_id', data.role_id.filter((id) => id !== value));
        }
    };

    return (
        <DashboardLayout judulHalaman="Tambah Approval Workflow">
            <Head title="Tambah Approval Workflow" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-[#1a1a1a]">Tambah Approval Workflow</h1>
                <p className="text-sm text-gray-600 mt-1">Isi form di bawah ini untuk menambahkan workflow baru.</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="workflow_type" value="Tipe Workflow" required={true} />
                        <select
                            id="workflow_type"
                            name="workflow_type"
                            value={data.workflow_type}
                            className="mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm text-sm text-black"
                            onChange={(e) => setData('workflow_type', e.target.value)}
                        >
                            <option value="">-- Pilih Tipe Workflow --</option>
                            {workflowTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.workflow_type} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="title" value="Judul" required={true} />
                        <TextInput
                            id="title"
                            type="text"
                            name="title"
                            value={data.title}
                            className="mt-1 block w-full text-sm"
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="Judul Workflow"
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel value="Role yang menggunakan (Pilih satu atau lebih)" required={true} />
                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {roles.map((role) => (
                                <label key={role.id} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-[#eaae36] shadow-sm focus:ring-[#eaae36]"
                                        value={role.id}
                                        onChange={handleRoleChange}
                                        checked={data.role_id.includes(String(role.id))}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">{role.name}</span>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.role_id} className="mt-2" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md font-semibold text-xs uppercase tracking-widest hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#eaae36] focus:ring-offset-2 transition ease-in-out duration-150"
                        >
                            Batal
                        </button>
                        <PrimaryButton disabled={processing}>
                            Simpan Workflow
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
