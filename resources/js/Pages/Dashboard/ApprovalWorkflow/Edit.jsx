import React, { useState } from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ approvalWorkflow, roles, users }) {
    const { data, setData, put, processing, errors } = useForm({
        workflow_type: approvalWorkflow.workflow_type || '',
        title: approvalWorkflow.title || '',
        role_id: approvalWorkflow.role_id || [],
    });

    const [stepData, setStepData] = useState({
        approval_level: '',
        approver_type: 'specific_user',
        approver_nik: '',
    });

    const workflowTypes = ['Cuti', 'Pengajuan Barang'];

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('approval-workflows.update', approvalWorkflow.id));
    };

    const handleRoleChange = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        let newRoles = [...data.role_id];
        if (checked) {
            newRoles.push(value);
        } else {
            newRoles = newRoles.filter((id) => id !== value);
        }
        setData('role_id', newRoles);
    };

    const handleAddStep = (e) => {
        e.preventDefault();
        router.post(route('approval-workflow-steps.store'), {
            approval_workflow_id: approvalWorkflow.id,
            ...stepData,
        }, {
            preserveScroll: true,
            onSuccess: () => setStepData({ approval_level: '', approver_type: 'specific_user', approver_nik: '' }),
        });
    };

    const handleDeleteStep = (stepId) => {
        if(confirm('Yakin ingin menghapus tahap approval ini?')) {
            router.delete(route('approval-workflow-steps.destroy', stepId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <DashboardLayout judulHalaman="Edit Approval Workflow">
            <Head title="Edit Approval Workflow" />

            <div className="mb-6">
                <h1 className="text-xl font-bold text-[#1a1a1a]">Edit Approval Workflow</h1>
                <p className="text-sm text-gray-600 mt-1">Ubah detail workflow atau kelola langkah approval.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Workflow Detail Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Informasi Utama</h2>
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
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Role yang menggunakan (Pilih satu atau lebih)" required={true} />
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded">
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

                        <div className="flex justify-end pt-4 border-t border-gray-100">
                            <PrimaryButton disabled={processing}>
                                Update Workflow
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                {/* Approval Steps Management */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col">
                    <h2 className="text-lg font-semibold text-[#1a1a1a] mb-4">Langkah Approval</h2>
                    
                    <div className="flex-1 overflow-y-auto mb-6 border border-gray-100 rounded-md p-4 bg-gray-50">
                        {approvalWorkflow.steps && approvalWorkflow.steps.length > 0 ? (
                            <ul className="space-y-3">
                                {approvalWorkflow.steps.map((step) => (
                                    <li key={step.id} className="bg-white p-3 rounded shadow-sm border border-gray-200 flex justify-between items-center">
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase">Level {step.approval_level}</div>
                                            {step.approver_type === 'division_head' ? (
                                                <div className="text-sm font-semibold text-[#eaae36]">Dinamis: Kepala Divisi</div>
                                            ) : (
                                                <>
                                                    <div className="text-sm font-semibold text-[#1a1a1a]">NIK: {step.approver_nik}</div>
                                                    <div className="text-xs text-gray-600">Role: {step.employee_role}</div>
                                                </>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteStep(step.id)}
                                            className="text-red-500 hover:text-red-700 p-2"
                                        >
                                            Hapus
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-gray-500 text-center py-4">Belum ada langkah approval.</div>
                        )}
                    </div>

                    <form onSubmit={handleAddStep} className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="approval_level" value="Level Approval" required={true} />
                                <TextInput
                                    id="approval_level"
                                    type="number"
                                    min="1"
                                    value={stepData.approval_level}
                                    className="mt-1 block w-full text-sm"
                                    onChange={(e) => setStepData({...stepData, approval_level: e.target.value})}
                                    placeholder="Cth: 1"
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="approver_type" value="Tipe Approver" required={true} />
                                <select 
                                    id="approver_type"
                                    value={stepData.approver_type}
                                    onChange={(e) => setStepData({...stepData, approver_type: e.target.value})}
                                    className="mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm text-sm text-black"
                                    required
                                >
                                    <option value="specific_user">User Spesifik</option>
                                    <option value="division_head">Kepala Divisi (Dinamis)</option>
                                </select>
                            </div>
                        </div>

                        {stepData.approver_type === 'specific_user' && (
                            <div>
                                <InputLabel htmlFor="approver_nik" value="Pilih Approver" required={true} />
                                <select 
                                    id="approver_nik"
                                    value={stepData.approver_nik}
                                    onChange={(e) => setStepData({...stepData, approver_nik: e.target.value})}
                                    className="mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm text-sm text-black"
                                    required
                                >
                                    <option value="">-- Pilih Approver --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.nik}>{u.name} ({u.nik})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-[#1a1a1a] text-white border border-transparent rounded-md font-semibold text-xs uppercase hover:bg-[#eaae36] transition"
                        >
                            Tambah Langkah
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
