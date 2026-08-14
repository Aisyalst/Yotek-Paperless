import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ user, roles }) {
    // Inisialisasi useForm bawaan Inertia
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role_id: user.role_id || '',
        is_active: user.is_active !== undefined ? user.is_active : 1,
        password: '',
    });

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim request PUT ke route update user
        put(`/users/${user.id}`);
    };

    // Configuration array for form fields
    const formFields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            placeholder: 'Name',
            required: true,
        },
        {
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'example@email.com',
            required: true,
        },
        {
            name: 'phone',
            label: 'Phone',
            type: 'text',
            placeholder: '0812xxxxxx',
            required: true,
        },
        {
            name: 'role_id',
            label: 'Role',
            type: 'select',
            options: roles.map(role => ({ value: role.id, label: role.name })),
            placeholder: 'Select Role',
            required: true,
        },
        {
            name: 'is_active',
            label: 'Status',
            type: 'select',
            options: [
                { value: 1, label: 'Active' },
                { value: 0, label: 'Inactive' }
            ],
            placeholder: 'Select Status',
            required: true,
        },
        {
            name: 'password',
            label: 'Password (optional)',
            type: 'password',
            placeholder: 'Minimum 8 Characters',
            required: false,
        },
    ];

    return (
        <DashboardLayout judulHalaman="Edit User">
            <Head title="Edit User" />
            <DynamicForm
                title="Edit User"
                description="Update user information."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Update"
                cancelHref="/users"
            />
        </DashboardLayout>
    );
}
