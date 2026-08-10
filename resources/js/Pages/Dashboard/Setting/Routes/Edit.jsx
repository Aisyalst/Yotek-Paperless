import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import DynamicForm from '@/Components/DynamicForm';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ route }) {
    const { data, setData, put, processing, errors } = useForm({
        name: route.name || '',
        route_name: route.route_name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/routes/${route.id}`);
    };

    const formFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', required: true },
        { name: 'route_name', label: 'Route Name', type: 'text', placeholder: 'Route Name', required: true },
    ];

    return (
        <DashboardLayout judulHalaman="Edit Route">
            <Head title="Edit Route" />
            <DynamicForm
                title="Edit Route"
                description="Update route information."
                fields={formFields}
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={handleSubmit}
                processing={processing}
                submitText="Update"
                cancelHref="/routes"
            />
        </DashboardLayout>
    );
}