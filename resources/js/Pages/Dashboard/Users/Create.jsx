import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create({ roles }) {
    // Inisialisasi useForm bawaan Inertia
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        role_id: '',
        password: '',
    });

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        // Mengirim request POST ke route '/users'
        post('/users');
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
            name: 'role_id',
            label: 'Role',
            type: 'select',
            options: roles.map(role => ({ value: role.id, label: role.name })),
            placeholder: 'Select Role',
            required: true,
        },
        {
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: 'Minimum 8 Characters',
            required: true,
        },
    ];

    return (
        <DashboardLayout judulHalaman="Add User">
            <Head title="Add User" />
                <DynamicForm
                    title="Add New User"
                    description="Create a new user account."
                    fields={formFields}
                    data={data}
                    setData={setData}
                    errors={errors}
                    onSubmit={handleSubmit}
                    processing={processing}
                    submitText="Create"
                    cancelHref="/users"
                />
        </DashboardLayout>
    );
}
