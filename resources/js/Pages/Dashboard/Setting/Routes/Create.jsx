import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        route_name: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/routes');
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'e.g. Users List', required: true },
        { name: 'route_name', label: 'Route Name', type: 'text', placeholder: 'e.g. users.index', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Add Route">
            <Head title="Add Route" />
            <DynamicForm
                title="Add New Route"
                description="Create a new route."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Create"
                cancelHref="/routes"
            />
        </DashboardLayout>
    );
}