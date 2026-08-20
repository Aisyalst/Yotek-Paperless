import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ role, devisions = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        name: role.name || '',
        devision_id: role.devision_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/roles/${role.id}`);
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', required: true },
        { 
            name: 'devision_id', 
            label: 'Divisi', 
            type: 'select', 
            options: [
                { value: '', label: 'Pilih Divisi (Opsional)' },
                ...devisions.map(d => ({ value: d.id, label: d.name }))
            ], 
            required: false 
        },
    ];

    return (
        <DashboardLayout judulHalaman="Edit Role">
            <Head title="Edit Role" />
            <DynamicForm
                title="Edit Role"
                description="Update role information."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Update"
                cancelHref="/roles"
            />
        </DashboardLayout>
    );
}
