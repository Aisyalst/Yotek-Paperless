import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/roles');
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Add Role">
            <Head title="Add Role" />
            <DynamicForm
                title="Add New Role"
                description="Create a new role."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Create"
                cancelHref="/roles"
            />
        </DashboardLayout>
    );
}