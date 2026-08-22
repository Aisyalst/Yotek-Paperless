import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ employee, users, allUsers }) {
    const { data, setData, put, processing, errors } = useForm({
        nik: employee.nik || '',
        company: employee.company || '',
        branch: employee.branch || '',
        department: employee.department || '',
        level: employee.level || '',
        direct_supervisor: employee.direct_supervisor || '',
        employment_status: employee.employment_status || '',
        join_date: employee.join_date || '',
        effective_date: employee.effective_date || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/employee-registrations/${employee.id}`);
    };

    const formFields = [
        {
            name: 'nik',
            label: 'NIK Karyawan',
            type: 'text',
            required: true,
            disabled: true, // Tidak bisa ubah NIK saat edit
        },
        {
            name: 'company',
            label: 'Perusahaan',
            type: 'text',
            placeholder: 'Nama Perusahaan',
        },
        {
            name: 'branch',
            label: 'Cabang',
            type: 'text',
            placeholder: 'Cabang',
        },
        {
            name: 'department',
            label: 'Departemen',
            type: 'text',
            placeholder: 'Departemen',
        },
        {
            name: 'level',
            label: 'Jabatan / Level',
            type: 'text',
            placeholder: 'Jabatan / Level',
        },
        {
            name: 'direct_supervisor',
            label: 'Atasan Langsung',
            type: 'select',
            options: [{ value: '', label: 'Pilih Atasan Langsung' }, ...allUsers.map(u => ({ value: u.nik, label: `${u.name} (${u.nik})` }))],
            placeholder: 'Pilih Atasan Langsung (Opsional)',
        },
        {
            name: 'employment_status',
            label: 'Status Kepegawaian',
            type: 'select',
            options: [
                { value: '', label: 'Pilih Status Kepegawaian' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Resigned', label: 'Resigned' },
                { value: 'Terminated', label: 'Terminated' }
            ],
            placeholder: 'Pilih Status',
        },
        {
            name: 'join_date',
            label: 'Tanggal Bergabung',
            type: 'date',
        },
        {
            name: 'effective_date',
            label: 'Tanggal Efektif',
            type: 'date',
        }
    ];

    return (
        <DashboardLayout judulHalaman="Edit Karyawan">
            <Head title="Edit Karyawan" />
            <DynamicForm
                title="Edit Registrasi Karyawan"
                description="Ubah informasi karyawan."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Perbarui"
                cancelHref="/employee-registrations"
            />
        </DashboardLayout>
    );
}
