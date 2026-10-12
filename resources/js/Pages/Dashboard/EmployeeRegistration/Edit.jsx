import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ employee, users, allUsers, companies, ranks, positions }) {
    // Bangun baris penempatan dari data employments (multi-perusahaan / multi-jabatan).
    // Fallback ke kolom tunggal employee.* kalau belum ada baris employment.
    const initialEmployments = Array.isArray(employee.employments) && employee.employments.length
        ? employee.employments.map((emp) => ({
            company: emp.company || '',
            branch: emp.branch || '',
            department: emp.department || '',
            employee_position_id: emp.employee_position_id || '',
            employee_rank_id: emp.employee_rank_id || '',
            direct_supervisor: emp.direct_supervisor || '',
            employment_status: emp.employment_status || '',
            join_date: emp.join_date || '',
        }))
        : [
            {
                company: employee.company || '',
                branch: employee.branch || '',
                department: employee.department || '',
                employee_position_id: employee.employee_position_id || '',
                employee_rank_id: employee.employee_rank_id || '',
                direct_supervisor: employee.direct_supervisor || '',
                employment_status: employee.employment_status || '',
                join_date: employee.join_date || '',
            },
        ];

    const { data, setData, put, processing, errors } = useForm({
        employee_name: employee.employee_name || employee.user?.name || '',
        nik: employee.nik || '',
        employments: initialEmployments,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/employee-registrations/${employee.id}`);
    };

    const formFields = [
        {
            name: 'employee_name',
            label: 'Nama Karyawan',
            type: 'text',
            placeholder: 'Nama karyawan',
            readOnly: true,
            disabled: true,
        },
        {
            name: 'nik',
            label: 'NIK Karyawan',
            type: 'text',
            required: true,
            disabled: true, // Tidak bisa ubah NIK saat edit
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
