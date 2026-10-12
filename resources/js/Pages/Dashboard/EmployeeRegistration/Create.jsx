import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ users, allUsers, companies, ranks, positions }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        nik: '',
        employments: [
            {
                company: '',
                branch: '',
                department: '',
                employee_position_id: '',
                employee_rank_id: '',
                direct_supervisor: '',
                employment_status: '',
                join_date: '',
            },
        ],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/employee-registrations');
    };

    const formFields = [
        {
            name: 'user_id',
            label: 'Pengguna',
            type: 'select',
            options: users.map(user => ({ value: user.id, label: user.name })),
            placeholder: 'Pilih Pengguna',
            required: true,
        },
        {
            name: 'nik',
            label: 'NIK',
            type: 'text',
            placeholder: 'Masukkan NIK Karyawan',
            required: true,
        },
        {
            name: 'employments',
            label: 'Penempatan Karyawan',
            type: 'repeater',
            companies: companies,
            ranks: ranks,
            positions: positions,
            allUsers: allUsers,
        },
    ];

    return (
        <DashboardLayout judulHalaman="Tambah Karyawan">
            <Head title="Tambah Karyawan" />
            <DynamicForm
                title="Tambah Registrasi Karyawan"
                description="Daftarkan informasi karyawan untuk pengguna yang sudah ada."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Simpan"
                cancelHref="/employee-registrations"
            />
        </DashboardLayout>
    );
}
